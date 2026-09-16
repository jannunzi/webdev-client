import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import {
  CANVAS_GRADE_SHELL_POINTS,
  canvasPostedScore,
  computeAllOrNothingGrade,
  effectivePassedIds,
  formatGradePercent,
  formatGradePoints,
  formatGradeSummary,
  gradeFromResultsAndOverrides,
  pointsPercent,
  proposedGradeFromResults,
  proposedPassedIdsFromResults,
} from "./grade";

function result(
  criterionId: string,
  passed: boolean,
  extra: Partial<AssignmentCheckResult> = {},
): AssignmentCheckResult {
  return {
    id: criterionId,
    label: criterionId,
    passed,
    message: passed ? "ok" : "missing",
    criterionId,
    ...extra,
  };
}

describe("all-or-nothing grade calculation", () => {
  it("awards full points for a pass and 0 for a fail", () => {
    const vercel = listRubricCriteria(A1_RUBRIC).find(
      (row) => row.id === "a1-delivery-vercel",
    );
    assert.ok(vercel);
    const passed = computeAllOrNothingGrade(A1_RUBRIC, ["a1-delivery-vercel"]);
    assert.equal(passed.earnedPoints, vercel.points);
    assert.equal(passed.passedCount, 1);
    assert.equal(passed.totalPoints, rubricPointTotal(A1_RUBRIC));
    assert.equal(
      passed.percent,
      Math.round((vercel.points / passed.totalPoints) * 100),
    );

    const failed = computeAllOrNothingGrade(A1_RUBRIC, []);
    assert.equal(failed.earnedPoints, 0);
    assert.equal(failed.percent, 0);
    assert.equal(failed.passedCount, 0);
  });

  it("sums only passed criteria and formats percent first", () => {
    const ids = ["a1-delivery-vercel", "a1-kambaz-dashboard"];
    const grade = computeAllOrNothingGrade(A1_RUBRIC, ids);
    assert.equal(grade.earnedPoints, 3 + 5);
    assert.equal(grade.totalPoints, 125);
    assert.equal(grade.percent, Math.round((8 / 125) * 100));
    assert.equal(grade.passedIds.join(","), ids.join(","));
    assert.equal(formatGradePercent(grade), `${grade.percent}%`);
    assert.equal(formatGradePoints(grade), `8 / ${grade.totalPoints} pts`);
    assert.equal(
      formatGradeSummary(grade),
      `${grade.percent}% (8 / ${grade.totalPoints} pts)`,
    );
    assert.equal(canvasPostedScore(grade), grade.percent);
    assert.notEqual(canvasPostedScore(grade), grade.earnedPoints);
    assert.equal(CANVAS_GRADE_SHELL_POINTS, 100);
  });

  it("posts 80 to Canvas for 100 / 125, not the raw point total", () => {
    assert.equal(pointsPercent(100, 125), 80);
    assert.equal(canvasPostedScore({ percent: 80 }), 80);
    assert.notEqual(canvasPostedScore({ percent: 80 }), 100);
    assert.notEqual(canvasPostedScore({ percent: 80 }), 125);
  });

  it("builds a proposed grade from auto-pass results only", () => {
    const results = [
      result("a1-delivery-vercel", true),
      result("a1-delivery-github", false),
      result("a1-lab-highlighted-paragraph-oyo", false, { skipped: true }),
    ];
    assert.deepEqual(proposedPassedIdsFromResults(results), [
      "a1-delivery-vercel",
    ]);
    const proposed = proposedGradeFromResults(A1_RUBRIC, results);
    assert.equal(proposed.earnedPoints, 3);
    assert.equal(proposed.passedCount, 1);
  });

  it("lets staff overrides flip auto pass/fail without partial credit", () => {
    const results = [
      result("a1-delivery-vercel", true),
      result("a1-delivery-github", false),
    ];
    assert.deepEqual(
      effectivePassedIds({
        results,
        overrides: {
          "a1-delivery-vercel": false,
          "a1-delivery-github": true,
        },
      }),
      ["a1-delivery-github"],
    );
    const grade = gradeFromResultsAndOverrides(A1_RUBRIC, results, {
      "a1-delivery-github": true,
      "a1-lab-highlighted-paragraph-oyo": true,
    });
    assert.equal(grade.earnedPoints, 3 + 3 + 2);
    assert.ok(grade.passedIds.includes("a1-lab-highlighted-paragraph-oyo"));
  });
});
