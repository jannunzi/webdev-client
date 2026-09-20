import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Q1_CODING_BANK } from "../question-bank/coding/q1";
import {
  STUDENT_GRADING_UNAVAILABLE,
  STAFF_MISSING_XAI_KEY,
  buildCodingGradePrompt,
  gradeCodingQuestion,
  parseCodingGradePayload,
} from "./coding-grade";
import { gradeDrawnQuestions } from "./grade";
import type { StudentAnswer } from "./types";

const sample = Q1_CODING_BANK.groups[1]?.questions[0];
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
    assert.match(prompt.system, /missing self-closing slash/);
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

  it("accepts a misspelled list locally and skips the model", async () => {
    let called = 0;
    const result = await gradeCodingQuestion(
      sample,
      "<ul><li>Aple</li><li>Banana</li><li>Cherry</li></ul>",
      {
        complete: async () => {
          called += 1;
          return '{"score":0,"feedback":"should not run"}';
        },
      },
    );
    assert.equal(called, 0);
    assert.equal(result.score, 1);
    assert.equal(result.source, "local");
  });

  it("uses a mocked model response when local credit is only partial", async () => {
    const result = await gradeCodingQuestion(
      sample,
      "<ol><li>Apple</li><li>Banana</li><li>Cherry</li></ol>",
      {
        complete: async () =>
          JSON.stringify({
            score: 0.9,
            feedback: "Ordered list is close enough.",
          }),
      },
    );
    assert.equal(result.score, 0.9);
    assert.match(result.feedback, /Ordered list/);
    assert.equal(result.error, undefined);
  });

  it("keeps the local score when the model scores lower", async () => {
    const result = await gradeCodingQuestion(
      sample,
      "<ol><li>Apple</li><li>Banana</li><li>Cherry</li></ol>",
      {
        complete: async () =>
          JSON.stringify({ score: 0.1, feedback: "Too harsh." }),
      },
    );
    assert.ok(result.score > 0.1);
    assert.equal(result.source, "mixed");
  });

  it("fails gracefully when the key is missing and local score is 0", async () => {
    const previous = process.env.XAI_API_KEY;
    delete process.env.XAI_API_KEY;
    try {
      const result = await gradeCodingQuestion(sample, "<p>nope</p>");
      assert.equal(result.score, 0);
      assert.equal(result.feedback, STUDENT_GRADING_UNAVAILABLE);
      assert.equal(result.error, STAFF_MISSING_XAI_KEY);
    } finally {
      if (previous === undefined) delete process.env.XAI_API_KEY;
      else process.env.XAI_API_KEY = previous;
    }
  });

  it("applies partial credit points onto a drawn coding item", () => {
    const group = Q1_CODING_BANK.groups[1];
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
