"use server";

import { auth } from "@clerk/nextjs/server";
import { isAssignmentProgressConfigured } from "@/lib/config";
import {
  findCriterion,
  getAssignment,
  isAssignmentId,
} from "@/lib/assignments/catalog";
import {
  readAssignmentProgress,
  writeCriterionProgress,
} from "@/lib/assignments/progress";
import type { AssignmentId } from "@/lib/assignments/types";

export type ProgressWriteResult =
  | { ok: true; completedCriterionIds: string[]; persisted: "mongo" }
  | {
      ok: false;
      code: "unauthenticated" | "not_configured" | "invalid" | "persist_failed";
      message: string;
    };

export async function setCriterionCompleted(input: {
  assignmentId: string;
  criterionId: string;
  completed: boolean;
}): Promise<ProgressWriteResult> {
  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message: "Progress sync is not configured yet.",
    };
  }

  if (!isAssignmentId(input.assignmentId)) {
    return { ok: false, code: "invalid", message: "Unknown assignment." };
  }

  const assignment = getAssignment(input.assignmentId);
  if (!assignment?.rubric || !findCriterion(assignment.rubric, input.criterionId)) {
    return { ok: false, code: "invalid", message: "Unknown checklist item." };
  }

  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "Sign in with your school email to sync progress.",
    };
  }

  try {
    await writeCriterionProgress({
      clerkUserId: userId,
      assignmentId: input.assignmentId as AssignmentId,
      criterionId: input.criterionId,
      completed: input.completed,
    });
    const completedCriterionIds = await readAssignmentProgress(
      userId,
      input.assignmentId as AssignmentId,
    );
    return { ok: true, completedCriterionIds, persisted: "mongo" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save progress.";
    console.error("assignment progress persist failed", message);
    return { ok: false, code: "persist_failed", message };
  }
}

export async function mergeLocalProgress(input: {
  assignmentId: string;
  completedCriterionIds: string[];
}): Promise<ProgressWriteResult> {
  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message: "Progress sync is not configured yet.",
    };
  }

  if (!isAssignmentId(input.assignmentId)) {
    return { ok: false, code: "invalid", message: "Unknown assignment." };
  }

  const assignment = getAssignment(input.assignmentId);
  if (!assignment?.rubric) {
    return { ok: false, code: "invalid", message: "Unknown assignment." };
  }

  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "Sign in with your school email to sync progress.",
    };
  }

  const validIds = new Set(
    assignment.rubric.groups.flatMap((group) =>
      group.criteria.map((row) => row.id),
    ),
  );

  try {
    const existing = await readAssignmentProgress(
      userId,
      input.assignmentId as AssignmentId,
    );
    const existingSet = new Set(existing);
    for (const criterionId of input.completedCriterionIds) {
      if (!validIds.has(criterionId) || existingSet.has(criterionId)) continue;
      await writeCriterionProgress({
        clerkUserId: userId,
        assignmentId: input.assignmentId as AssignmentId,
        criterionId,
        completed: true,
      });
    }
    const completedCriterionIds = await readAssignmentProgress(
      userId,
      input.assignmentId as AssignmentId,
    );
    return { ok: true, completedCriterionIds, persisted: "mongo" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not merge progress.";
    console.error("assignment progress merge failed", message);
    return { ok: false, code: "persist_failed", message };
  }
}
