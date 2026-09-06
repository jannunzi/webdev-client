import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK } from "../question-bank/q1";
import { renderCanvasQtiAssessment } from "../question-bank/qti";
import {
  canvasFallbackIdent,
  canvasQuizDescriptionHtml,
  getCanvasFallbackQuiz,
} from "./canvas-copy";
import {
  buildCanvasFallbackBanks,
  practiceChapterBank,
  practiceQuestionToBank,
  sampleGroups,
} from "./canvas-fallback-banks";

const FORBIDDEN = /\bLab [0-9]|\bLabs\b|Kambaz|\bwd-|this chapter|the chapter|§\d|\/labs\b|the book/i;

describe("Canvas fallback banks", () => {
  it("uses the graded Q1 bank and practice banks for Q2–Q6", () => {
    const banks = buildCanvasFallbackBanks();
    assert.equal(banks.q1.groups.length, CHAPTER1_BANK.groups.length);
    assert.deepEqual(
      banks.q1.groups.map((group) => group.id),
      CHAPTER1_BANK.groups.map((group) => group.id),
    );
    assert.ok(banks.q2.groups.length >= 10);
    assert.ok(banks.q3.groups.length >= 10);
    assert.ok(banks.q4.groups.length >= 8);
    assert.ok(banks.q5.groups.length >= 8);
    assert.ok(banks.q6.groups.length >= 8);
    assert.equal(banks.q2.id, "q2-practice");
    assert.match(banks.q2.groups[0]?.id ?? "", /^q2-sec-/);
  });

  it("samples Q1–Q3 into X1 and Q4–Q6 into X2", () => {
    const banks = buildCanvasFallbackBanks();
    assert.equal(banks.x1.groups.length, 16);
    assert.equal(banks.x2.groups.length, 15);
    assert.ok(banks.x1.groups.some((group) => group.name.startsWith("Q1 ·")));
    assert.ok(banks.x1.groups.some((group) => group.name.startsWith("Q2 ·")));
    assert.ok(banks.x1.groups.some((group) => group.name.startsWith("Q3 ·")));
    assert.ok(banks.x2.groups.some((group) => group.name.startsWith("Q4 ·")));
    assert.ok(banks.x2.groups.some((group) => group.name.startsWith("Q6 ·")));
  });

  it("keeps exported stems standalone", () => {
    const banks = buildCanvasFallbackBanks();
    for (const bank of Object.values(banks)) {
      const xml = renderCanvasQtiAssessment(
        bank,
        canvasFallbackIdent(bank.id.startsWith("x") ? (bank.id.slice(0, 2) as "x1") : "q1"),
      );
      assert.doesNotMatch(xml, FORBIDDEN);
      for (const group of bank.groups) {
        for (const question of group.questions) {
          assert.doesNotMatch(question.prompt, FORBIDDEN, question.id);
        }
      }
    }
  });

  it("converts practice MC and blanks", () => {
    const mc = practiceQuestionToBank({
      id: "demo-mc",
      section: "2.1.1",
      kind: "concept",
      prompt: "Why avoid inline styles?",
      choices: [
        { id: "a", text: "Browsers ignore them" },
        { id: "b", text: "They are hard to maintain" },
        { id: "c", text: "React forbids them" },
        { id: "d", text: "They cannot set color" },
      ],
      answer: "b",
      explanation: "A stylesheet is easier to reuse.",
    });
    assert.equal(mc?.type, "multiple_choice");
    if (mc?.type === "multiple_choice") {
      assert.equal(mc.correctChoiceId, "b");
    }
    const blank = practiceQuestionToBank({
      id: "demo-blank",
      section: "2.1.2",
      kind: "blank",
      prompt: "The part before the curly brace is the _____.",
      answer: "selector",
      accept: ["the selector"],
      explanation: "Selector plus declarations make a rule.",
    });
    assert.equal(blank?.type, "fill_in_blank");
    const q2 = practiceChapterBank(2, "q2");
    assert.ok(q2.groups.every((group) => group.questions.length >= 1));
    assert.equal(sampleGroups(q2.groups, 5).length, 5);
  });

  it("puts website URL + permission blurb in every quiz meta source", () => {
    for (const quizId of ["q1", "q2", "q3", "q4", "q5", "q6", "x1", "x2"] as const) {
      const quiz = getCanvasFallbackQuiz(quizId);
      assert.ok(quiz);
      const html = canvasQuizDescriptionHtml(quiz);
      assert.match(html, new RegExp(`quizzes/take/${quizId}`));
      assert.match(html, /permission to take this Canvas quiz instead/);
    }
  });
});
