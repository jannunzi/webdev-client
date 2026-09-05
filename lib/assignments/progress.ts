import "server-only";

import { getCollection } from "../mongo";
import type { AssignmentId, AssignmentProgressDoc } from "./types";
import {
  ASSIGNMENT_PROGRESS_COLLECTION,
  loadCompletedCriterionIds,
  upsertCriterionProgress,
  type ProgressStore,
} from "./progress-store";

export type { ProgressStore };

export async function getAssignmentProgressCollection() {
  return getCollection<AssignmentProgressDoc>(ASSIGNMENT_PROGRESS_COLLECTION);
}

export function mongoProgressStore(
  collection: Awaited<ReturnType<typeof getAssignmentProgressCollection>>,
): ProgressStore {
  return {
    async list(clerkUserId, assignmentId) {
      return collection.find({ clerkUserId, assignmentId }).toArray();
    },
    async upsert(input) {
      await collection.updateOne(
        {
          clerkUserId: input.clerkUserId,
          assignmentId: input.assignmentId,
          criterionId: input.criterionId,
        },
        {
          $set: {
            completed: input.completed,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    },
  };
}

export async function readAssignmentProgress(
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<string[]> {
  const collection = await getAssignmentProgressCollection();
  return loadCompletedCriterionIds(
    mongoProgressStore(collection),
    clerkUserId,
    assignmentId,
  );
}

let progressIndexesPromise: Promise<void> | null = null;

export async function writeCriterionProgress(input: {
  clerkUserId: string;
  assignmentId: AssignmentId;
  criterionId: string;
  completed: boolean;
}): Promise<void> {
  const collection = await getAssignmentProgressCollection();
  progressIndexesPromise ??= ensureAssignmentProgressIndexes().catch(
    (error) => {
      progressIndexesPromise = null;
      console.error("assignment progress index ensure failed", error);
    },
  );
  await progressIndexesPromise;
  await upsertCriterionProgress(mongoProgressStore(collection), input);
}

export async function ensureAssignmentProgressIndexes(): Promise<void> {
  const collection = await getAssignmentProgressCollection();
  await collection.createIndex(
    { clerkUserId: 1, assignmentId: 1, criterionId: 1 },
    { unique: true },
  );
}
