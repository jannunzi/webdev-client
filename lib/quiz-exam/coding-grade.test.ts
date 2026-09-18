import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_CODING_BANK } from "../question-bank";
import {
  STUDENT_GRADING_UNAVAILABLE,
  STAFF_MISSING_XAI_KEY,
  buildCodingGradePrompt,
  gradeCodingQuestion,
  parseCodingGradePayload,
} from "./coding-grade";
import { gradeDrawnQuestions } from "./grade";
import type { StudentAnswer } from "./types";

const sample = CHAPTER1_CODING_BANK.groups[0]?.questions[0];
assert.ok(sample && sample.type === "coding");

describe("AI coding grader", () => {
  it("parses a lenient partial-credit payload and clamps the score", () => {
    const parsed = parseCodingGradePayload(
      '```json\n{"score": 0.6, "feedback": "Used ol instead of ul."}\n```',
    );
    assert.equal(parsed.score, 0.6);
    assert.match(parsed.feedback, /ol instead of ul/);
    assert.equal(parseCodingGradePayload('{"score": 1.4, "feedback": "ok"}').score, 1);
    assert.equal(parseCodingGradePayload('{"score": -2, "feedback": "no"}').score, 0);
  });

  it("keeps the model prompt on the server (reference + rubric)", () => {
    const prompt = buildCodingGradePrompt(sample, "<ul><li>Apple</li></ul>");
    assert.match(prompt.system, /Be lenient/);
    assert.match(prompt.system, /partial credit/i);
    assert.match(prompt.user, /Reference solution/);
    assert.ok(prompt.user.includes(sample.referenceSolution));
    assert.ok(prompt.user.includes(sample.rubric));
    assert.doesNotMatch(prompt.system, /Lab |Kambaz|the book/i);
  });

  it("scores empty code as 0 without calling the model", async () => {
    let called = 0;
    const result = await gradeCodingQuestion(sample, "   ", {
      complete: async () => {
        called += 1;
        return '{"score":1,"feedback":"should not run"}';
      },
    });
    assert.equal(called, 0);
    assert.equal(result.score, 0);
    assert.match(result.feedback, /No code submitted/);
  });

  it("uses a mocked model response for partial credit", async () => {
    const result = await gradeCodingQuestion(sample, "<ul><li>Apple</li></ul>", {
      complete: async () =>
        JSON.stringify({
          score: 0.5,
          feedback: "Only one of the three items is present.",
        }),
    });
    assert.equal(result.score, 0.5);
    assert.match(result.feedback, /three items/);
    assert.equal(result.error, undefined);
  });

  it("fails gracefully when the key is missing and no mock is injected", async () => {
    const previous = process.env.XAI_API_KEY;
    delete process.env.XAI_API_KEY;
    try {
      const result = await gradeCodingQuestion(sample, "<ul><li>Apple</li></ul>");
      assert.equal(result.score, 0);
      assert.equal(result.feedback, STUDENT_GRADING_UNAVAILABLE);
      assert.equal(result.error, STAFF_MISSING_XAI_KEY);
    } finally {
      if (previous === undefined) delete process.env.XAI_API_KEY;
      else process.env.XAI_API_KEY = previous;
    }
  });

  it("applies partial credit points onto a drawn coding item", () => {
    const group = CHAPTER1_CODING_BANK.groups[0];
    assert.ok(group);
    const drawn = [{ group, question: sample }];
    const answers: Record<string, StudentAnswer> = {
      [sample.id]: { type: "coding", code: "<ul><li>Apple</li></ul>" },
    };
    const [graded] = gradeDrawnQuestions(drawn, answers, {
      [sample.id]: { score: 0.5, feedback: "Missing two items." },
    });
    assert.ok(graded);
    assert.equal(graded.correct, false);
    assert.equal(graded.points, 50);
    assert.equal(graded.maxPoints, 100);
    assert.equal(graded.scoreRatio, 0.5);
    assert.equal(graded.feedback, "Missing two items.");
  });
});
