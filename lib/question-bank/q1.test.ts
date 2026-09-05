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

  it("gives every acronym FIB one blank per letter", () => {
    const group = CHAPTER1_BANK.groups[0];
    const expected: Record<string, { letters: number; words: string[] }> = {
      "q1-g01-01": { letters: 4, words: ["Hyper", "Text", "Markup", "Language"] },
      "q1-g01-02": { letters: 3, words: ["eXtensible", "Markup", "Language"] },
      "q1-g01-03": { letters: 3, words: ["Java", "Script", "XML"] },
      "q1-g01-04": { letters: 3, words: ["Document", "Object", "Model"] },
      "q1-g01-05": { letters: 3, words: ["Uniform", "Resource", "Locator"] },
      "q1-g01-06": { letters: 4, words: ["Hyper", "Text", "Transfer", "Protocol"] },
      "q1-g01-07": { letters: 3, words: ["Single", "Page", "Application"] },
      "q1-g01-08": { letters: 3, words: ["Application", "Programming", "Interface"] },
      "q1-g01-09": { letters: 3, words: ["Cascading", "Style", "Sheets"] },
      "q1-g01-10": { letters: 3, words: ["Integrated", "Development", "Environment"] },
      "q1-g01-11": { letters: 3, words: ["Node", "Package", "Manager"] },
    };
    assert.equal(group.questions.length, Object.keys(expected).length);
    for (const question of group.questions) {
      assert.equal(question.type, "fill_in_blank");
      const fib = question as FillInBlankQuestion;
      const spec = expected[question.id];
      assert.ok(spec, question.id);
      assert.equal(fib.blankCount, spec.letters);
      assert.deepEqual(fib.acceptedCombinations[0], spec.words);
      assert.match(
        fib.prompt,
        /Fill each blank with the word that corresponds to each letter/,
      );
    }
  });

  it("accepts letter-order JSX blanks and rejects the old two-word form", () => {
    const jsx = CHAPTER1_BANK.groups[0].questions.find((q) => q.id === "q1-g01-03");
    assert.ok(jsx && jsx.type === "fill_in_blank");
    const question = jsx as FillInBlankQuestion;
    assert.equal(question.blankCount, 3);
    assert.equal(isFibCombinationCorrect(question.acceptedCombinations, ["Java", "Script", "XML"]), true);
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["java", "script", "xml"]),
      true,
    );
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["JavaScript", "XML", ""]),
      false,
    );
    assert.equal(
      isFibCombinationCorrect(question.acceptedCombinations, ["Java", "XML", ""]),
      false,
    );
  });

  it("narrows paragraph-whitespace stems to the p element", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g03-paragraphs");
    assert.ok(group);
    for (const question of group.questions) {
      assert.equal(question.type, "fill_in_blank");
      const fib = question as FillInBlankQuestion;
      assert.match(fib.prompt, /paragraph element/);
      assert.match(fib.prompt, /not a heading and not a generic container/);
      assert.equal(fib.blankCount, 1);
      for (const combo of fib.acceptedCombinations) {
        const value = combo[0] ?? "";
        assert.equal(/\b(div|h1|span)\b/i.test(value), false, value);
        assert.match(value, /p|paragraph/i);
      }
    }
  });

  it("marks htmlFor and id as backtick code spans in the label group", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g08-labels");
    assert.ok(group);
    const first = group.questions.find((item) => item.id === "q1-g08-01");
    assert.ok(first);
    assert.match(first.prompt, /`<label>`/);
    assert.match(first.prompt, /`id`/);
    const htmlFor = group.questions.find((item) => item.id === "q1-g08-06");
    assert.ok(htmlFor);
    assert.match(htmlFor.prompt, /`htmlFor`/);
  });

  it("does not mention lab-specific stems", () => {
    const blob = JSON.stringify(CHAPTER1_BANK);
    assert.equal(/Lab 1/i.test(blob), false);
    assert.equal(/Kambaz/i.test(blob), false);
    assert.equal(/\bwd-/.test(blob), false);
    assert.equal(/preventDefault/.test(blob), false);
  });
});
