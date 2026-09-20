import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK, CHAPTER1_REVIEW_BANK } from "./q1/index";
import { validateCodingPool } from "./validate";
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

  it("asks how three body-copy blocks are separated without naming p in the stem", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g03-paragraphs");
    assert.ok(group);
    assert.equal(group.type, "multiple_choice");
    assert.doesNotMatch(group.name, /paragraph/i);
    for (const question of group.questions) {
      assert.equal(question.type, "multiple_choice");
      assert.ok(question.code);
      assert.equal(question.code.split("\n\n").length, 3);
      assert.doesNotMatch(question.prompt, /paragraph/i);
      assert.doesNotMatch(question.code, /<p>/i);
      assert.match(question.prompt, /vertical separation/);
      const correct = question.choices.find((choice) => choice.id === question.correctChoiceId);
      assert.ok(correct);
      assert.match(correct.text, /`<p>`/);
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

  it("keeps student-facing stems independent of the book, labs, and Kambaz", () => {
    const parts: string[] = [];
    for (const group of CHAPTER1_BANK.groups) {
      for (const question of group.questions) {
        parts.push(question.prompt, question.explanation ?? "", question.code ?? "");
        if (question.type === "multiple_choice") {
          for (const choice of question.choices) {
            parts.push(choice.text);
          }
        }
      }
    }
    const blob = parts.join("\n");
    assert.equal(/\bLab [0-9]/i.test(blob), false);
    assert.equal(/\bLabs\b/.test(blob), false);
    assert.equal(/Kambaz/i.test(blob), false);
    assert.equal(/\bwd-/.test(blob), false);
    assert.equal(/this chapter/i.test(blob), false);
    assert.equal(/the chapter/i.test(blob), false);
    assert.equal(/§\d/.test(blob), false);
    assert.equal(/\/labs\b/.test(blob), false);
    assert.equal(/the book/i.test(blob), false);
  });

  it("drops Jose 2026-09-20 traditional stems from the Q1 bank", () => {
    const questions = CHAPTER1_BANK.groups.flatMap((group) => group.questions);
    const blob = questions
      .map((question) => [question.id, question.prompt, question.explanation ?? "", question.code ?? ""].join("\n"))
      .join("\n");
    assert.equal(questions.some((question) => question.id === "q1-g01-02"), false);
    assert.equal(questions.some((question) => question.id === "q1-g13-02"), false);
    assert.doesNotMatch(blob, /XML stands for/);
    assert.doesNotMatch(blob, /Wrap each block of ordinary body text in the HTML/);
    assert.doesNotMatch(blob, /Office hours policy/);
    assert.doesNotMatch(blob, /A div heading/);
    assert.doesNotMatch(blob, /the list of choices/);
    assert.doesNotMatch(blob, /Which type should a Save control use/);
    assert.doesNotMatch(blob, /arrives as the _____ prop/);
    assert.match(blob, /a list of choices/);
  });

  it("asks for defaultValue from a snippet that starts with QWE, without prop/children wording", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g09-text-fields");
    assert.ok(group);
    for (const question of group.questions) {
      assert.equal(question.type, "fill_in_blank");
      const fib = question as FillInBlankQuestion;
      assert.ok(fib.code);
      assert.match(fib.prompt, /QWE/);
      assert.match(fib.prompt, /attribute/);
      assert.doesNotMatch(fib.prompt, /\bprop\b/i);
      assert.doesNotMatch(fib.prompt, /children/i);
      assert.doesNotMatch(fib.prompt, /placeholder/i);
      assert.doesNotMatch(fib.prompt, /uncontrolled/i);
      assert.deepEqual(fib.acceptedCombinations[0], ["defaultValue"]);
    }
  });

  it("keeps the props group on snippets and drops children-prop FIBs", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g14-props-children");
    assert.ok(group);
    assert.equal(group.questions.length, 10);
    for (const question of group.questions) {
      assert.equal(question.type, "fill_in_blank");
      const fib = question as FillInBlankQuestion;
      assert.ok(fib.code);
      assert.match(fib.code, /<Callout /);
      assert.match(fib.prompt, /_____/);
      assert.doesNotMatch(fib.prompt, /arrives as the/);
      assert.doesNotMatch(fib.prompt, /children/);
      assert.deepEqual(fib.acceptedCombinations[0], ["props"]);
    }
  });

  it("adds the two website coding styles only on the review bank", () => {
    assert.equal(
      CHAPTER1_BANK.groups.some((group) => group.type === "coding"),
      false,
    );
    const coding = CHAPTER1_REVIEW_BANK.groups.filter((group) => group.type === "coding");
    assert.equal(coding.length, 2);
    assert.deepEqual(
      validateCodingPool({
        ...CHAPTER1_REVIEW_BANK,
        id: "q1-html-coding",
        groups: coding,
      }),
      [],
    );
  });
});
