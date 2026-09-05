import "server-only";

import { getCollection } from "../mongo";
import type { AssignmentId } from "./types";
import {
  ASSIGNMENT_SUBMISSIONS_COLLECTION,
  loadAssignmentSubmission,
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

export type { AssignmentSubmissionDoc, SubmissionStore };

export async function getAssignmentSubmissionsCollection() {
  return getCollection<AssignmentSubmissionDoc>(
    ASSIGNMENT_SUBMISSIONS_COLLECTION,
  );
}

export function mongoSubmissionStore(
  collection: Awaited<ReturnType<typeof getAssignmentSubmissionsCollection>>,
): SubmissionStore {
  return {
    async find(clerkUserId, assignmentId) {
      return collection.findOne({ clerkUserId, assignmentId });
    },
    async upsert(doc) {
      await collection.updateOne(
        { clerkUserId: doc.clerkUserId, assignmentId: doc.assignmentId },
        { $set: doc },
        { upsert: true },
      );
    },
  };
}

let submissionIndexesPromise: Promise<void> | null = null;

export async function ensureAssignmentSubmissionIndexes(): Promise<void> {
  const collection = await getAssignmentSubmissionsCollection();
  await collection.createIndex(
    { clerkUserId: 1, assignmentId: 1 },
    { unique: true },
  );
}

async function readyStore(): Promise<SubmissionStore> {
  const collection = await getAssignmentSubmissionsCollection();
  submissionIndexesPromise ??= ensureAssignmentSubmissionIndexes().catch(
    (error) => {
      submissionIndexesPromise = null;
      console.error("assignment submission index ensure failed", error);
    },
  );
  await submissionIndexesPromise;
  return mongoSubmissionStore(collection);
}

export async function readAssignmentSubmission(
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc | null> {
  const collection = await getAssignmentSubmissionsCollection();
  return loadAssignmentSubmission(
    mongoSubmissionStore(collection),
    clerkUserId,
    assignmentId,
  );
}

export async function writeAssignmentSubmission(input: {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  checkResults?: AssignmentSubmissionDoc["checkResults"];
  checked?: boolean;
}): Promise<AssignmentSubmissionDoc> {
  const store = await readyStore();
  return upsertAssignmentSubmission(store, input);
}
