import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyQuestionOverrides,
  parseOverridePoints,
  scoreFromGraded,
} from "./grade-override";
import type { GradedAnswer, QuizClassQuestionOverride } from "./types";

function item(partial: Partial<GradedAnswer> & { questionId: string }): GradedAnswer {
  return {
    groupId: "g1",
    type: "true_false",
    response: { type: "true_false", value: false },
    correct: false,
    points: 0,
    maxPoints: 10,
    ...partial,
  };
}

describe("quiz grade overrides", () => {
  it("marks a student question correct or wrong and sums the score", () => {
    const graded = [
      item({ questionId: "q-a", correct: false, points: 0 }),
      item({ questionId: "q-b", correct: true, points: 10 }),
    ];
    const next = applyQuestionOverrides(graded, {
      "q-a": { kind: "correct" },
    });
    assert.equal(next[0]?.correct, true);
    assert.equal(next[0]?.points, 10);
    assert.equal(next[0]?.override?.scope, "student");
    assert.equal(next[0]?.autoCorrect, false);
    assert.equal(next[1]?.correct, true);
    assert.deepEqual(scoreFromGraded(next), { score: 20, maxScore: 20 });

    const wrong = applyQuestionOverrides(graded, {
      "q-b": { kind: "wrong" },
    });
    assert.equal(wrong[1]?.correct, false);
    assert.equal(wrong[1]?.points, 0);
    assert.deepEqual(scoreFromGraded(wrong), { score: 0, maxScore: 20 });
  });

  it("accepts custom points for one student and clamps them", () => {
    const graded = [item({ questionId: "q-a", type: "coding", maxPoints: 10 })];
    const partial = applyQuestionOverrides(graded, {
      "q-a": { kind: "points", points: 7.25 },
    });
    assert.equal(partial[0]?.points, 7.25);
    assert.equal(partial[0]?.correct, false);
    assert.equal(partial[0]?.scoreRatio, 0.725);
    assert.equal(partial[0]?.override?.kind, "points");

    const full = applyQuestionOverrides(graded, {
      "q-a": { kind: "points", points: 10 },
    });
    assert.equal(full[0]?.correct, true);

    const clamped = applyQuestionOverrides(graded, {
      "q-a": { kind: "points", points: 99 },
    });
    assert.equal(clamped[0]?.points, 10);
    const negative = applyQuestionOverrides(graded, {
      "q-a": { kind: "points", points: -4 },
    });
    assert.equal(negative[0]?.points, 0);
  });

  it("applies class-wide marks, then lets the student override win", () => {
    const graded = [
      item({ questionId: "q-a", correct: false, points: 0 }),
      item({ questionId: "q-b", correct: true, points: 10 }),
    ];
    const classWide: QuizClassQuestionOverride[] = [
      {
        quizId: "q1",
        questionId: "q-a",
        scope: "all_students",
        kind: "correct",
        updatedAt: "2026-09-20T00:00:00.000Z",
      },
    ];
    const afterClass = applyQuestionOverrides(graded, undefined, classWide);
    assert.equal(afterClass[0]?.correct, true);
    assert.equal(afterClass[0]?.override?.scope, "all_students");

    const afterStudent = applyQuestionOverrides(
      graded,
      { "q-a": { kind: "wrong" } },
      classWide,
    );
    assert.equal(afterStudent[0]?.correct, false);
    assert.equal(afterStudent[0]?.override?.scope, "student");
    assert.equal(afterStudent[0]?.autoPoints, 0);
  });

  it("parses custom point strings", () => {
    assert.equal(parseOverridePoints("7.5"), 7.5);
    assert.equal(parseOverridePoints(""), undefined);
    assert.equal(parseOverridePoints("nope"), undefined);
  });
});
