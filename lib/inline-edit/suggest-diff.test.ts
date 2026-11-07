import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  acceptAllChoices,
  applyChoices,
  buildDiff,
  consumeGhost,
  continuationSentence,
  fitGhost,
  maskPreservedHtml,
  placeholdersIntact,
  splitGhostWord,
} from "./suggest-diff.ts";

describe("suggestion placeholders and hunks", () => {
  it("masks code and links and restores them unchanged", () => {
    const html = `Use <code>npm</code> and <a href="https://example.com">docs</a> <slot data-i="2"></slot>.`;
    const masked = maskPreservedHtml(html);
    assert.equal(masked.masks.length, 3);
    assert.equal(placeholdersIntact(masked.prompt, 3), true);
    assert.deepEqual(masked.masks, [
      "<code>npm</code>",
      '<a href="https://example.com">docs</a>',
      '<slot data-i="2"></slot>',
    ]);
    const diff = buildDiff(masked.prompt, masked.prompt, masked.masks);
    assert.equal(diff.ok, true);
    if (!diff.ok) return;
    assert.equal(applyChoices(diff.parts, {}), html);
  });

  it("accepts one hunk and rejects another while keeping the code span", () => {
    const before = "The cat sat ⟦0⟧ today.";
    const after = "The dog sat ⟦0⟧ quietly.";
    const masks = ["<code>npm</code>"];
    const diff = buildDiff(before, after, masks);
    assert.equal(diff.ok, true);
    if (!diff.ok) return;
    const hunks = diff.parts.filter((part) => part.type === "hunk");
    assert.equal(hunks.length, 2);
    const first = hunks[0];
    const second = hunks[1];
    assert.ok(first && second && first.type === "hunk" && second.type === "hunk");
    const mixed = applyChoices(diff.parts, { [first.id]: "accept", [second.id]: "reject" });
    assert.match(mixed, /dog/);
    assert.match(mixed, /today/);
    assert.doesNotMatch(mixed, /quietly/);
    assert.match(mixed, /<code>npm<\/code>/);

    const accepted = applyChoices(diff.parts, acceptAllChoices(diff.parts));
    assert.match(accepted, /quietly/);
    assert.match(accepted, /<code>npm<\/code>/);
    assert.doesNotMatch(accepted, /cat/);

    const rejected = applyChoices(diff.parts, {});
    assert.match(rejected, /cat/);
    assert.match(rejected, /<code>npm<\/code>/);
    assert.doesNotMatch(rejected, /dog/);
  });

  it("refuses a suggestion that drops a placeholder", () => {
    const diff = buildDiff("See ⟦0⟧.", "See the docs.", ["<code>npm</code>"]);
    assert.equal(diff.ok, false);
  });

  it("keeps only the first continuation sentence", () => {
    assert.equal(
      continuationSentence("Next you install Node. Then you create the app."),
      "Next you install Node.",
    );
    assert.equal(continuationSentence("Use ⟦0⟧ <strong>CSS</strong> now."), "Use CSS now.");
    assert.equal(continuationSentence(" finishes the word."), " finishes the word.");
  });

  it("accepts the next ghost word and fits an insertion before the following text", () => {
    assert.equal(consumeGhost(" the page.", "t"), "he page.");
    assert.equal(consumeGhost(" the page.", " the"), " page.");
    assert.equal(consumeGhost(" the page.", "x"), null);
    assert.deepEqual(splitGhostWord(" next sentence."), { take: " next", rest: " sentence." });
    assert.deepEqual(splitGhostWord("word rest"), { take: "word", rest: " rest" });
    assert.equal(splitGhostWord("   "), null);

    assert.equal(
      fitGhost(
        " finishes the idea. paints the page when CSS is ready.",
        "paints the page when CSS is ready.",
      ),
      " finishes the idea.",
    );
    assert.equal(
      fitGhost("paints the page when CSS is ready.", "paints the page when CSS is ready and more."),
      "",
    );
    assert.equal(fitGhost("ser paints the page.", "the page for real users."), "ser paints the page.");
    assert.equal(
      fitGhost(
        " Save the file, then paints the page when CSS is ready.",
        "paints the page when CSS is ready.",
      ),
      " Save the file, then",
    );
  });
});
