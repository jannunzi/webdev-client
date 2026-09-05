import type { AssignmentId } from "./types";
import type { AssignmentCheckResult } from "./checks";

export const ASSIGNMENT_SUBMISSIONS_COLLECTION = "assignment_submissions";

export type AssignmentSubmissionDoc = {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt?: Date;
  checkResults?: AssignmentCheckResult[];
};

export type AssignmentSubmissionView = {
  githubUrl: string;
  vercelUrl: string;
  updatedAt: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
};

export type SubmissionStore = {
  find(
    clerkUserId: string,
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc | null>;
  upsert(doc: AssignmentSubmissionDoc): Promise<void>;
};

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toSubmissionView(
  doc: AssignmentSubmissionDoc,
): AssignmentSubmissionView {
  return {
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    updatedAt: toIso(doc.updatedAt),
    lastCheckedAt: doc.lastCheckedAt ? toIso(doc.lastCheckedAt) : undefined,
    checkResults: doc.checkResults,
  };
}

export async function loadAssignmentSubmission(
  store: SubmissionStore,
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc | null> {
  return store.find(clerkUserId, assignmentId);
}

export async function upsertAssignmentSubmission(
  store: SubmissionStore,
  input: {
    clerkUserId: string;
    assignmentId: AssignmentId;
    githubUrl: string;
    vercelUrl: string;
    checkResults?: AssignmentCheckResult[];
    checked?: boolean;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc> {
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  const doc: AssignmentSubmissionDoc = {
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastCheckedAt: input.checked
      ? now
      : existing?.lastCheckedAt,
    checkResults: input.checkResults ?? existing?.checkResults,
  };
  await store.upsert(doc);
  return doc;
}
