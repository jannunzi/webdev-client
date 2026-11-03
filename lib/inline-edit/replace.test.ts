import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { uniqueEditable } from "./locate.ts";
import { replaceEditableSource } from "./replace.ts";

const FILE = "app/book/ch2/sections/Intro.tsx";

const SOURCE = `export function Intro() {
  return (
    <section>
      <p className="lead">
        Hello <ChapterLink to={1} />{" "}and <code>CSS</code> today.
      </p>
      <p>Hello {name}</p>
      <p>Same words</p>
      <p>Same words</p>
    </section>
  );
}
`;

function hashOf(source: string, includes: string): string {
  const matches = uniqueEditable(source, FILE).filter(
    (node) => node.kind === "jsx" && source.slice(node.start, node.end).includes(includes),
  );
  assert.equal(matches.length, 1);
  return matches[0]!.hash;
}

describe("source replacement", () => {
  it("replaces only the paragraph children and keeps the opening tag and slots", () => {
    const hash = hashOf(SOURCE, "ChapterLink");
    const result = replaceEditableSource(
      SOURCE,
      FILE,
      hash,
      'Hi <strong>there</strong> <slot data-i="0"></slot> plus <slot data-i="1"></slot> now',
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /<p className="lead">/);
    assert.match(result.source, /\{"Hi "\}/);
    assert.match(result.source, /<strong>\{"there"\}<\/strong>/);
    assert.match(result.source, /<ChapterLink to=\{1\} \/>/);
    assert.match(result.source, /<code>CSS<\/code>/);
    assert.match(result.source, /<p>Hello \{name\}<\/p>/);
    assert.match(result.source, /<p>Same words<\/p>/);
    assert.doesNotMatch(result.source, /today/);
  });

  it("does not locate a paragraph built from a variable or a repeated slice", () => {
    const nodes = uniqueEditable(SOURCE, FILE);
    const slices = nodes.map((node) => SOURCE.slice(node.start, node.end));
    assert.equal(slices.some((slice) => slice.includes("{name}")), false);
    assert.equal(slices.some((slice) => slice.includes("Same words")), false);
    const repeated = replaceEditableSource(SOURCE, FILE, "a".repeat(24), "Hi");
    assert.equal(repeated.ok, false);
  });

  it("replaces one slide string and leaves code samples alone", () => {
    const deck = "lib/lectures/decks/sample.ts";
    const source = `export const SLIDES = [
  {
    title: "Headings",
    bullets: ["Use **titles** here", "Use **titles** here"],
    code: "const title = \\"Headings\\";",
  },
];
`;
    const titles = uniqueEditable(source, deck).filter((node) => node.kind === "text");
    assert.equal(titles.length, 1);
    const result = replaceEditableSource(
      source,
      deck,
      titles[0]!.hash,
      "Heading <em>scale</em>",
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /title: "Heading <em>scale<\/em>"/);
    assert.match(result.source, /Use \*\*titles\*\* here/);
    assert.match(result.source, /const title = \\"Headings\\"/);
  });

  it("keeps a heading id and a section id when the visible text changes", () => {
    const source = `export function Page() {
  return (
    <Section id="sec-1-5" title="1.5 Old title">
      <h2 id="intro" className="keep">Introduction <code>HTML</code></h2>
      <li className="item">Use <code>npm</code> today</li>
    </Section>
  );
}
`;
    const nodes = uniqueEditable(source, FILE);
    const heading = nodes.find(
      (node) => node.kind === "jsx" && source.slice(node.start, node.end).startsWith("<h2"),
    );
    const item = nodes.find(
      (node) => node.kind === "jsx" && source.slice(node.start, node.end).includes("npm"),
    );
    const sectionTitle = nodes.find(
      (node) => node.kind === "text" && source.slice(node.start, node.end).includes("1.5"),
    );
    assert.ok(heading && item && sectionTitle);

    const renamed = replaceEditableSource(
      source,
      FILE,
      heading.hash,
      'Hello <strong>web</strong> <slot data-i="0"></slot>',
    );
    assert.equal(renamed.ok, true);
    if (!renamed.ok) return;
    assert.match(renamed.source, /<h2 id="intro" className="keep">/);
    assert.match(renamed.source, /<strong>\{"web"\}<\/strong>/);
    assert.match(renamed.source, /<code>HTML<\/code>/);
    assert.match(renamed.source, /id="sec-1-5"/);
    assert.doesNotMatch(renamed.source, /id="hello-web"/);

    const retitled = replaceEditableSource(
      renamed.source,
      FILE,
      sectionTitle.hash,
      "1.5 New title",
    );
    assert.equal(retitled.ok, true);
    if (!retitled.ok) return;
    assert.match(retitled.source, /id="sec-1-5"/);
    assert.match(retitled.source, /title="1\.5 New title"/);
    assert.doesNotMatch(retitled.source, /title="1\.5 Old title"/);

    const reworded = replaceEditableSource(
      retitled.source,
      FILE,
      item.hash,
      'Run <slot data-i="0"></slot> first',
    );
    assert.equal(reworded.ok, true);
    if (!reworded.ok) return;
    assert.match(reworded.source, /<li className="item">/);
    assert.match(reworded.source, /<code>npm<\/code>/);
    assert.match(reworded.source, /\{"Run "\}/);
    assert.match(reworded.source, /id="sec-1-5"/);
    assert.match(reworded.source, /id="intro"/);
  });

  it("replaces one slide title and one bullet without touching a repeated bullet", () => {
    const deck = "lib/lectures/decks/headings-and-paragraphs.ts";
    const source = `export const SLIDES = [
  {
    title: "Headings",
    bullets: ["Unique point", "Same", "Same"],
  },
];
`;
    const texts = uniqueEditable(source, deck).filter((node) => node.kind === "text");
    assert.equal(texts.length, 2);
    const bullet = texts.find((node) => source.slice(node.start, node.end).includes("Unique"));
    assert.ok(bullet);
    const result = replaceEditableSource(source, deck, bullet.hash, "Edited <strong>point</strong>");
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /title: "Headings"/);
    assert.match(result.source, /"Edited \*\*point\*\*"/);
    assert.match(result.source, /"Same", "Same"/);
  });
});
