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
});
