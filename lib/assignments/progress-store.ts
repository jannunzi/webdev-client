import type { AssignmentCheckResult } from "./check-types";
import { autoPassedCriterionIds } from "./grade";
import type {
  AssignmentHubItem,
  AssignmentId,
  AssignmentProgressDoc,
} from "./types";
import { listRubricCriteria } from "./catalog";

export type ProgressStore = {
  list(
    clerkUserId: string,
    assignmentId: AssignmentId,
  ): Promise<AssignmentProgressDoc[]>;
  upsert(input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    criterionId: string;
    completed: boolean;
  }): Promise<void>;
};

export async function loadCompletedCriterionIds(
  store: ProgressStore,
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<string[]> {
  const docs = await store.list(clerkUserId, assignmentId);
  return docs
    .filter((doc) => doc.completed)
    .map((doc) => doc.criterionId)
    .sort();
}

export async function upsertCriterionProgress(
  store: ProgressStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    criterionId: string;
    completed: boolean;
  },
): Promise<void> {
  await store.upsert(input);
}

/**
 * `assignment_progress` is unused. Checklist checkmarks are not stored.
 * The collection is left in place so existing rows are not dropped here.
 * Staff grades live on `assignment_submissions.staffGrade`.
 */
export const ASSIGNMENT_PROGRESS_COLLECTION = "assignment_progress";

export function applyCriterionToggle(
  completedIds: readonly string[],
  criterionId: string,
  completed: boolean,
): string[] {
  const next = new Set(completedIds);
  if (completed) {
    next.add(criterionId);
  } else {
    next.delete(criterionId);
  }
  return [...next].sort();
}

export function mergeCompletedIds(
  ...groups: readonly (readonly string[])[]
): string[] {
  const next = new Set<string>();
  for (const group of groups) {
    for (const id of group) {
      if (id) next.add(id);
    }
  }
  return [...next].sort();
}

/**
 * Run Checks forgets remembered checklist progress and keeps only items that
 * auto-pass on this run. Previous completed IDs — stale auto-passes and
 * manual toggles — are dropped. A missing or failing result unchecks the row.
 */
export function completedIdsAfterAutoCheckRun(
  _previousCompletedIds: readonly string[],
  autoResults: readonly AssignmentCheckResult[],
): string[] {
  return autoPassedCriterionIds(autoResults);
}

export async function replaceCompletedCriterionIds(
  store: ProgressStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    allCriterionIds: readonly string[];
    completedIds: readonly string[];
  },
): Promise<string[]> {
  const valid = new Set(input.allCriterionIds.filter((id) => id));
  const want = new Set(
    input.completedIds.filter((id) => valid.has(id)),
  );
  const existing = new Set(
    await loadCompletedCriterionIds(
      store,
      input.clerkUserId,
      input.assignmentId,
    ),
  );
  for (const criterionId of valid) {
    const completed = want.has(criterionId);
    if (completed === existing.has(criterionId)) continue;
    await store.upsert({
      clerkUserId: input.clerkUserId,
      assignmentId: input.assignmentId,
      criterionId,
      completed,
    });
  }
  return loadCompletedCriterionIds(
    store,
    input.clerkUserId,
    input.assignmentId,
  );
}

export type ProgressTotals = {
  completedCount: number;
  totalCount: number;
  earnedPoints: number;
  totalPoints: number;
};

export function summarizeProgress(
  assignment: AssignmentHubItem,
  completedIds: readonly string[],
): ProgressTotals {
  const criteria = assignment.rubric
    ? listRubricCriteria(assignment.rubric)
    : [];
  const completed = new Set(completedIds);
  let earnedPoints = 0;
  let completedCount = 0;
  for (const row of criteria) {
    if (completed.has(row.id)) {
      completedCount += 1;
      earnedPoints += row.points;
    }
  }
  return {
    completedCount,
    totalCount: criteria.length,
    earnedPoints,
    totalPoints: criteria.reduce((sum, row) => sum + row.points, 0),
  };
}
