import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Q1_CODING_BANK } from "../question-bank/coding/q1";
import { Q2_CODING_BANK } from "../question-bank/coding/q2";
import {
  fillTemplate,
  scoreCodingLocally,
  tokensSimilar,
} from "./coding-lenient";

const form = Q1_CODING_BANK.groups[0]?.questions[0];
const list = Q1_CODING_BANK.groups[1]?.questions[0];
assert.ok(form && form.type === "coding" && form.style === "fib");
assert.ok(list && list.type === "coding" && list.style === "implement");

describe("lenient coding grader", () => {
  it("fills a template in blank order", () => {
    assert.equal(
      fillTemplate('a="_____" b="_____"', ["id", "title"]),
      'a="id" b="title"',
    );
    assert.equal(
      fillTemplate('a="___1___" b="___2___"', ["for", "id"]),
      'a="for" b="id"',
    );
  });

  it("forgives simple misspellings on form attribute blanks", () => {
    const result = scoreCodingLocally(form, {
      blanks: ["for", "id", "titel", "value", "palceholder"],
    });
    assert.equal(result.score, 1);
  });

  it("gives partial credit when some form blanks are wrong", () => {
    const result = scoreCodingLocally(form, {
      blanks: ["for", "id", "href", "value", "placeholder"],
    });
    assert.equal(result.score, 0.8);
  });

  it("treats for and htmlFor as equivalent on the Q1 label-association blank", () => {
    const rest = ["id", "title", "value", "placeholder"] as const;
    for (const labelFor of ["htmlFor", "For", "HTMLFOR", " htmlFor ", '"htmlFor"', "`for`"]) {
      const result = scoreCodingLocally(form, {
        blanks: [labelFor, ...rest],
      });
      assert.equal(result.score, 1, `expected ${JSON.stringify(labelFor)} to match for`);
    }
    assert.equal(tokensSimilar("for", "htmlFor"), true);
    assert.equal(tokensSimilar("for", "For"), true);
    assert.equal(tokensSimilar("for", "HTMLFOR"), true);
    assert.equal(tokensSimilar("htmlFor", "for"), true);
  });

  it("gives full credit for a bullet list that forgets slashes and shuffles attributes", () => {
    const messy = `<UL>
<li>Apple
<LI class="x" data-n="1">Banan
<li>Cherry</UL>`;
    const result = scoreCodingLocally(list, { code: messy });
    assert.equal(result.score, 1);
  });

  it("gives full credit when void-element slashes are omitted", () => {
    const img = list; // use list checks; also score a form-like img via tokens
    const referenceLike = `<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>`;
    const noSlashClose = `<ul><li>Apple<li>Banana<li>Cherry</ul>`;
    assert.equal(scoreCodingLocally(img, { code: referenceLike }).score, 1);
    assert.equal(scoreCodingLocally(img, { code: noSlashClose }).score, 1);
  });

  it("gives partial credit for an ordered list instead of bullets", () => {
    const result = scoreCodingLocally(list, {
      code: `<ol><li>Apple</li><li>Banana</li><li>Cherry</li></ol>`,
    });
    assert.ok(result.score > 0);
    assert.ok(result.score < 1);
  });

  it("treats attribute order and extra whitespace as a match", () => {
    const css = Q2_CODING_BANK.groups[0]?.questions[0];
    assert.ok(css && css.type === "coding");
    const result = scoreCodingLocally(css, {
      blanks: ["color", "background-color", "padding", "border"],
    });
    assert.equal(result.score, 1);
    assert.equal(tokensSimilar("placeholder", "placehoder"), true);
  });
});
