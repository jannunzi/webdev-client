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

export const ASSIGNMENT_PROGRESS_COLLECTION = "assignment_progress";

export const LOCAL_PROGRESS_KEY_PREFIX = "webdev.assignmentProgress.";

export function localProgressKey(assignmentId: AssignmentId): string {
  return `${LOCAL_PROGRESS_KEY_PREFIX}${assignmentId}`;
}

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

export function parseLocalProgress(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { completed?: unknown }).completed)
    ) {
      return (parsed as { completed: unknown[] }).completed.filter(
        (id): id is string => typeof id === "string",
      );
    }
  } catch {
    return [];
  }
  return [];
}

export function serializeLocalProgress(completedIds: readonly string[]): string {
  return JSON.stringify({ completed: [...completedIds] });
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
