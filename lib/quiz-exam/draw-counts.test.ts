import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EXAM_SOURCE_GROUP_TAKE,
  GRADED_QUIZ_IDS,
  QUIZ_DRAW_COUNTS,
  QUIZ_TIME_LIMIT_MINUTES,
  QUIZ_TOTAL_POINTS,
  pointsPerDrawnItem,
} from "./draw-counts";

describe("shared graded-quiz draw counts", () => {
  it("uses 10 groups / 30 minutes for Q1–Q6 and 36 / 90 for X1/X2", () => {
    assert.deepEqual([...GRADED_QUIZ_IDS], [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
      "x1",
      "x2",
    ]);
    for (const quizId of ["q1", "q2", "q3", "q4", "q5", "q6"] as const) {
      assert.equal(QUIZ_DRAW_COUNTS[quizId], 10);
      assert.equal(QUIZ_TIME_LIMIT_MINUTES[quizId], 30);
      assert.equal(pointsPerDrawnItem(QUIZ_DRAW_COUNTS[quizId]), 10);
    }
    assert.equal(QUIZ_DRAW_COUNTS.x1, 36);
    assert.equal(QUIZ_DRAW_COUNTS.x2, 36);
    assert.equal(EXAM_SOURCE_GROUP_TAKE * 3, QUIZ_DRAW_COUNTS.x1);
    assert.equal(QUIZ_TIME_LIMIT_MINUTES.x1, 90);
    assert.equal(QUIZ_TIME_LIMIT_MINUTES.x2, 90);
    assert.equal(pointsPerDrawnItem(36) * 36, QUIZ_TOTAL_POINTS);
  });
});
