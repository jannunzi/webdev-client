import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import type { AssignmentRubric } from "./types";

export type GradeBreakdown = {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  passedCount: number;
  totalCount: number;
  passedIds: string[];
};

export type CriterionPassMap = Record<string, boolean>;

/**
 * Canvas assignment shells stay at 100 points. Website checklists (A1 is
 * 125 pts) still use raw criterion math; the posted Canvas value is the
 * percentage so 100/125 becomes 80, not 100.
 */
export const CANVAS_GRADE_SHELL_POINTS = 100;

export function pointsPercent(
  earnedPoints: number,
  totalPoints: number,
): number {
  return totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
}

export function formatGradePercent(
  grade: Pick<GradeBreakdown, "percent">,
): string {
  return `${grade.percent}%`;
}

export function formatGradePoints(
  grade: Pick<GradeBreakdown, "earnedPoints" | "totalPoints">,
): string {
  return `${grade.earnedPoints} / ${grade.totalPoints} pts`;
}

/**
 * Percent first so students and staff see the Canvas-recorded value.
 * Checklist points stay visible as the secondary detail.
 */
export function formatGradeSummary(grade: GradeBreakdown): string {
  return `${formatGradePercent(grade)} (${formatGradePoints(grade)})`;
}

/** Value posted to a 100-point Canvas assignment shell. */
export function canvasPostedScore(
  grade: Pick<GradeBreakdown, "percent">,
): number {
  return grade.percent;
}

/**
 * Website grades are all-or-nothing per criterion: full points if the
 * criterion is treated as passed, otherwise 0.
 */
export function computeAllOrNothingGrade(
  rubric: AssignmentRubric,
  passedCriterionIds: Iterable<string>,
): GradeBreakdown {
  const passed = new Set(
    [...passedCriterionIds].filter((id) => typeof id === "string" && id),
  );
  const criteria = listRubricCriteria(rubric);
  const passedIds: string[] = [];
  let earnedPoints = 0;
  for (const row of criteria) {
    if (passed.has(row.id)) {
      passedIds.push(row.id);
      earnedPoints += row.points;
    }
  }
  const totalPoints = rubricPointTotal(rubric);
  const percent = pointsPercent(earnedPoints, totalPoints);
  return {
    earnedPoints,
    totalPoints,
    percent,
    passedCount: passedIds.length,
    totalCount: criteria.length,
    passedIds,
  };
}

/** Auto-pass only. Skipped / missing results do not earn points. */
export function proposedPassedIdsFromResults(
  results: readonly AssignmentCheckResult[],
): string[] {
  const passedIds: string[] = [];
  for (const row of latestResultByCriterion(results).values()) {
    if (row.skipped || !row.passed || !row.criterionId) continue;
    passedIds.push(row.criterionId);
  }
  return passedIds.sort();
}

export function proposedGradeFromResults(
  rubric: AssignmentRubric,
  results: readonly AssignmentCheckResult[],
): GradeBreakdown {
  return computeAllOrNothingGrade(rubric, proposedPassedIdsFromResults(results));
}

/**
 * Staff overrides win when present. Otherwise use auto-pass. Manual / skipped
 * criteria stay failed unless overridden.
 */
export function effectivePassedIds(input: {
  results?: readonly AssignmentCheckResult[];
  overrides?: CriterionPassMap | null;
}): string[] {
  const auto = new Set(proposedPassedIdsFromResults(input.results ?? []));
  const overrides = input.overrides ?? {};
  const ids = new Set<string>(auto);
  for (const [criterionId, passed] of Object.entries(overrides)) {
    if (!criterionId) continue;
    if (passed) ids.add(criterionId);
    else ids.delete(criterionId);
  }
  return [...ids].sort();
}

export function gradeFromResultsAndOverrides(
  rubric: AssignmentRubric,
  results: readonly AssignmentCheckResult[] | undefined,
  overrides?: CriterionPassMap | null,
): GradeBreakdown {
  return computeAllOrNothingGrade(
    rubric,
    effectivePassedIds({ results, overrides }),
  );
}

export function autoPassedCriterionIds(
  results: readonly AssignmentCheckResult[],
): string[] {
  return proposedPassedIdsFromResults(results);
}
