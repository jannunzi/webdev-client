import type { AssignmentId } from "./types";
import type { AssignmentCheckResult } from "./checks";
import type { CriterionPassMap } from "./grade";

export const ASSIGNMENT_SUBMISSIONS_COLLECTION = "assignment_submissions";

export type AssignmentStaffGrade = {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  acceptedProposed: boolean;
  criterionOverrides?: CriterionPassMap;
  comments?: Record<string, string>;
  gradedByEmail?: string;
  gradedAt: Date | string;
};

export type AssignmentSubmissionIdentity = {
  email?: string;
  rosterEmail?: string;
  name?: string;
  canvasUserId?: string;
  section?: string;
};

export type AssignmentSubmissionDoc = AssignmentSubmissionIdentity & {
  clerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt?: Date;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
};

export type AssignmentSubmissionView = AssignmentSubmissionIdentity & {
  githubUrl: string;
  vercelUrl: string;
  updatedAt: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
};

export type SubmissionStore = {
  find(
    clerkUserId: string,
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc | null>;
  upsert(doc: AssignmentSubmissionDoc): Promise<void>;
  listByAssignment?(
    assignmentId: AssignmentId,
  ): Promise<AssignmentSubmissionDoc[]>;
};

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toStaffGradeView(
  grade: AssignmentStaffGrade | undefined,
): AssignmentStaffGrade | undefined {
  if (!grade) return undefined;
  return {
    ...grade,
    gradedAt: toIso(grade.gradedAt),
  };
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
    email: doc.email,
    rosterEmail: doc.rosterEmail,
    name: doc.name,
    canvasUserId: doc.canvasUserId,
    section: doc.section,
    staffGrade: toStaffGradeView(doc.staffGrade),
  };
}

export async function loadAssignmentSubmission(
  store: SubmissionStore,
  clerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc | null> {
  return store.find(clerkUserId, assignmentId);
}

export async function listAssignmentSubmissions(
  store: SubmissionStore,
  assignmentId: AssignmentId,
): Promise<AssignmentSubmissionDoc[]> {
  if (!store.listByAssignment) return [];
  return store.listByAssignment(assignmentId);
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
    identity?: AssignmentSubmissionIdentity;
    staffGrade?: AssignmentStaffGrade | null;
  },
  now: Date = new Date(),
): Promise<AssignmentSubmissionDoc> {
  const existing = await store.find(input.clerkUserId, input.assignmentId);
  const identity = input.identity ?? {};
  const staffGrade =
    input.staffGrade === null
      ? undefined
      : (input.staffGrade ?? existing?.staffGrade);
  const doc: AssignmentSubmissionDoc = {
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastCheckedAt: input.checked ? now : existing?.lastCheckedAt,
    checkResults: input.checkResults ?? existing?.checkResults,
    email: identity.email ?? existing?.email,
    rosterEmail: identity.rosterEmail ?? existing?.rosterEmail,
    name: identity.name ?? existing?.name,
    canvasUserId: identity.canvasUserId ?? existing?.canvasUserId,
    section: identity.section ?? existing?.section,
    staffGrade,
  };
  await store.upsert(doc);
  return doc;
}
