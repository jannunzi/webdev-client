import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK } from "./q1/index";
import { isFibCombinationCorrect } from "./normalize";
import { bankStats, validateBank } from "./validate";
import type { FillInBlankQuestion } from "./types";

describe("Chapter 1 question bank", () => {
  it("has unique ids, 16 groups, and valid answers", () => {
    const issues = validateBank(CHAPTER1_BANK);
    assert.deepEqual(issues, []);
  });

  it("keeps roughly ten variants per group", () => {
    for (const group of CHAPTER1_BANK.groups) {
      assert.ok(
        group.questions.length >= 8 && group.questions.length <= 12,
        `${group.id} has ${group.questions.length} questions`,
      );
    }
  });

  it("reports expected type mix", () => {
    const stats = bankStats(CHAPTER1_BANK);
    assert.equal(stats.groups, 16);
    assert.ok(stats.questions >= 150);
    assert.ok(stats.byType.fill_in_blank.groups >= 4);
    assert.ok(stats.byType.multiple_choice.groups >= 8);
    assert.ok(stats.byType.true_false.groups >= 2);
  });

  it("accepts both JSX blank combinations", () => {
    const jsx = CHAPTER1_BANK.groups[0].questions.find((q) => q.id === "q1-g01-03");
    assert.ok(jsx && jsx.type === "fill_in_blank");
    const question = jsx as FillInBlankQuestion;
    assert.equal(question.blankCount, 3);
    assert.equal(isFibCombinationCorrect(question.acceptedCombinations, ["Java", "Script", "XML"]), true);
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["JavaScript", "XML", ""]),
      true,
    );
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["javascript", "xml", ""]),
      true,
    );
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["Java", "XML", ""]),
      false,
    );
  });

  it("does not mention lab-specific stems", () => {
    const blob = JSON.stringify(CHAPTER1_BANK);
    assert.equal(/Lab 1/i.test(blob), false);
    assert.equal(/Kambaz/i.test(blob), false);
    assert.equal(/\bwd-/.test(blob), false);
    assert.equal(/preventDefault/.test(blob), false);
  });
});
