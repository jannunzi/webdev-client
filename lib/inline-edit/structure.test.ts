import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { uniqueEditable } from "./locate.ts";
import { replaceEditableSource } from "./replace.ts";

const FILE = "app/book/ch1/sections/IntroAndSetup.tsx";

function hashIncluding(source: string, snippet: string): string {
  const matches = uniqueEditable(source, FILE).filter((node) =>
    source.slice(node.start, node.end).includes(snippet),
  );
  assert.equal(matches.length, 1);
  return matches[0]!.hash;
}

describe("paragraph insert and remove", () => {
  const source = `export function Page() {
  return (
    <section id="sec-1-1">
      <h2 id="intro">Learning objectives</h2>
      <p>
        Hello <OfficialLink href="https://www.w3.org/">web</OfficialLink> and <code>HTML</code>.
      </p>
      <p>The next paragraph stays.</p>
    </section>
  );
}
`;

  it("inserts a paragraph and a semantic list below, and strips an instruction", () => {
    const hash = hashIncluding(source, "OfficialLink");
    const result = replaceEditableSource(
      source,
      FILE,
      hash,
      'Hello <slot data-i="0"></slot> and <slot data-i="1"></slot>. <div data-ai-instruction="1">Create a list of terms introduced in this section</div>',
      {
        insertsAfter: [
          {
            kind: "ul",
            items: [
              "<strong>Internet</strong> — a global network of networks.",
              "<code>HTML</code> — the markup language.",
            ],
          },
          { kind: "p", html: "A following note." },
        ],
      },
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /<OfficialLink href="https:\/\/www\.w3\.org\/">/);
    assert.match(result.source, /<code>HTML<\/code>/);
    assert.match(result.source, /<ul>/);
    assert.match(result.source, /<li><strong>\{"Internet"\}<\/strong>/);
    assert.match(result.source, /<li><code>\{"HTML"\}<\/code>/);
    assert.match(result.source, /<p>\{"A following note\."\}<\/p>/);
    assert.match(result.source, /<p>The next paragraph stays\.<\/p>/);
    assert.match(result.source, /id="sec-1-1"/);
    assert.match(result.source, /id="intro"/);
    assert.doesNotMatch(result.source, /Create a list of terms/);
    assert.doesNotMatch(result.source, /data-ai-instruction/);
    assert.doesNotMatch(result.source, /<p>\s*<ul/);
  });

  it("discards a blank inserted paragraph and refuses a nested block", () => {
    const hash = hashIncluding(source, "next paragraph");
    const blank = replaceEditableSource(source, FILE, hash, "The next paragraph stays.", {
      insertsAfter: [
        { kind: "p", html: "" },
        { kind: "p", html: "   " },
        { kind: "p", html: "<br>" },
        { kind: "p", html: "&nbsp;" },
        { kind: "p", html: "Kept sentence." },
      ],
    });
    assert.equal(blank.ok, true);
    if (!blank.ok) return;
    assert.doesNotMatch(blank.source, /<p><\/p>/);
    assert.doesNotMatch(blank.source, /<p>\s*<\/p>/);
    assert.match(blank.source, /Kept sentence/);
    assert.match(blank.source, /The next paragraph stays\./);
    assert.match(blank.source, /OfficialLink/);

    const nested = replaceEditableSource(source, FILE, hash, "The next paragraph stays.", {
      insertsAfter: [{ kind: "p", html: "<ul><li>Term</li></ul>" }],
    });
    assert.equal(nested.ok, false);
    if (nested.ok) return;
    assert.match(nested.error, /nested block/);
  });

  it("removes one paragraph and leaves the heading anchor and the neighbor", () => {
    const hash = hashIncluding(source, "OfficialLink");
    const result = replaceEditableSource(source, FILE, hash, "", { remove: true });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /<h2 id="intro">Learning objectives<\/h2>/);
    assert.match(result.source, /<p>The next paragraph stays\.<\/p>/);
    assert.doesNotMatch(result.source, /OfficialLink/);
    assert.match(result.source, /id="sec-1-1"/);
  });

  it("removes the last paragraph without deleting the heading", () => {
    const only = `export function Page() {
  return (
    <section id="sec-9">
      <h2 id="tail">Tail</h2>
      <p>Only paragraph.</p>
    </section>
  );
}
`;
    const hash = hashIncluding(only, "Only paragraph");
    const result = replaceEditableSource(only, FILE, hash, "", { remove: true });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /<h2 id="tail">Tail<\/h2>/);
    assert.match(result.source, /id="sec-9"/);
    assert.doesNotMatch(result.source, /Only paragraph/);
    assert.doesNotMatch(result.source, /<p>/);
  });

  it("refuses to remove a heading or a list item", () => {
    const hash = hashIncluding(source, "Learning objectives");
    const heading = replaceEditableSource(source, FILE, hash, "", { remove: true });
    assert.equal(heading.ok, false);
    const itemSource = source.replace(
      "<p>The next paragraph stays.</p>",
      "<ul><li>Keep this item.</li></ul>",
    );
    const itemHash = hashIncluding(itemSource, "Keep this item");
    const item = replaceEditableSource(itemSource, FILE, itemHash, "Keep this item.", {
      insertsAfter: [{ kind: "p", html: "Nope" }],
    });
    assert.equal(item.ok, false);
  });

  it("deletes a paragraph whose save is only whitespace and leaves an unrelated empty paragraph", () => {
    const withBlank = source.replace(
      "<p>The next paragraph stays.</p>",
      "<p></p>\n      <p>The next paragraph stays.</p>",
    );
    const hash = hashIncluding(withBlank, "OfficialLink");
    const cleared = replaceEditableSource(withBlank, FILE, hash, " <br> &nbsp; ");
    assert.equal(cleared.ok, true);
    if (!cleared.ok) return;
    assert.doesNotMatch(cleared.source, /OfficialLink/);
    assert.match(cleared.source, /<p><\/p>/);
    assert.match(cleared.source, /The next paragraph stays\./);
    assert.match(cleared.source, /id="intro"/);

    const kept = replaceEditableSource(
      withBlank,
      FILE,
      hash,
      '<slot data-i="0"></slot> <slot data-i="1"></slot>',
    );
    assert.equal(kept.ok, true);
    if (!kept.ok) return;
    assert.match(kept.source, /<OfficialLink href="https:\/\/www\.w3\.org\/">/);
    assert.match(kept.source, /<p><\/p>/);
  });

  it("keeps a new paragraph that is only a link or code span", () => {
    const hash = hashIncluding(source, "next paragraph");
    const result = replaceEditableSource(source, FILE, hash, "The next paragraph stays.", {
      insertsAfter: [
        { kind: "p", html: '<a href="/book/terms/internet">Internet</a>' },
        { kind: "p", html: "<code>HTML</code>" },
        { kind: "p", html: "<br>" },
      ],
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /href=\{"\/book\/terms\/internet"\}/);
    assert.match(result.source, /<code>\{"HTML"\}<\/code>/);
    assert.doesNotMatch(result.source, /<p><\/p>/);
    assert.match(result.source, /OfficialLink/);
  });

  it("does not delete a heading when its text is cleared to spaces", () => {
    const hash = hashIncluding(source, "Learning objectives");
    const result = replaceEditableSource(source, FILE, hash, " <br> ");
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /<h2 id="intro">/);
    assert.match(result.source, /id="intro"/);
    assert.match(result.source, /OfficialLink/);
  });

  it("keeps ordinary prose that happens to look like an instruction", () => {
    const hash = hashIncluding(source, "next paragraph");
    const result = replaceEditableSource(
      source,
      FILE,
      hash,
      "Create a list of terms introduced in this section",
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.source, /Create a list of terms introduced in this section/);
  });
});
