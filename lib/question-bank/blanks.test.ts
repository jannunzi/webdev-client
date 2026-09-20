import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countBlanks,
  fillTemplate,
  numberedBlank,
  numberedBlankSequence,
  replaceBlankMarkers,
} from "./blanks";

describe("numbered FIB blanks", () => {
  it("uses ___N___ tokens so a 3-blank acronym can sit inline in the stem", () => {
    assert.equal(numberedBlank(0), "___1___");
    assert.equal(numberedBlank(2), "___3___");
    assert.equal(numberedBlankSequence(3), "___1___ ___2___ ___3___");
    assert.equal(countBlanks("SPA stands for ___1___ ___2___ ___3___."), 3);
  });

  it("counts and fills both numbered and unlabeled markers", () => {
    assert.equal(countBlanks("_____ _____ _____"), 3);
    assert.equal(countBlanks('a="____1____" b="____2____"'), 2);
    assert.equal(
      fillTemplate("SPA stands for ___1___ ___2___ ___3___.", [
        "Single",
        "Page",
        "Application",
      ]),
      "SPA stands for Single Page Application.",
    );
    assert.equal(
      fillTemplate('a="____1____" b="____2____"', ["for", "id"]),
      'a="for" b="id"',
    );
  });

  it("replaces each numbered token once (not the underscores around the digit)", () => {
    const replaced = replaceBlankMarkers(
      "SPA stands for ___1___ ___2___ ___3___.",
      (index) => `[blank${index + 1}]`,
    );
    assert.equal(replaced, "SPA stands for [blank1] [blank2] [blank3].");
    assert.equal(countBlanks(replaced), 0);
  });
});
