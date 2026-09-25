import "server-only";

import { getCollection } from "../mongo";
import type { AssignmentCheckResult } from "./check-types";
import type { AssignmentGradeView, CriterionGradeRow } from "./grade-rows";
import { gradePoints } from "./grade-rows";
import type { AssignmentId } from "./types";

/**
 * Graded snapshots. Append-only history; the page reads the latest save.
 * Checklist checkmarks are not stored here or in `assignment_progress`.
 * A later Run does not write this collection. Only staff Save inserts a row.
 */
export const ASSIGNMENT_GRADES_COLLECTION = "assignment_grades";

export type AssignmentGradeDoc = {
  studentClerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  rows: CriterionGradeRow[];
  checkResults: AssignmentCheckResult[];
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  gradedByClerkUserId: string;
  gradedByEmail?: string;
  savedAt: Date;
};

export function toAssignmentGradeView(doc: AssignmentGradeDoc): AssignmentGradeView {
  return {
    ...doc,
    savedAt: doc.savedAt instanceof Date ? doc.savedAt.toISOString() : new Date(doc.savedAt).toISOString(),
  };
}

export async function getAssignmentGradesCollection() {
  return getCollection<AssignmentGradeDoc>(ASSIGNMENT_GRADES_COLLECTION);
}

let gradeIndexesPromise: Promise<void> | null = null;

export async function ensureAssignmentGradeIndexes(): Promise<void> {
  const collection = await getAssignmentGradesCollection();
  await collection.createIndex({
    studentClerkUserId: 1,
    assignmentId: 1,
    savedAt: -1,
  });
}

async function readyCollection() {
  const collection = await getAssignmentGradesCollection();
  gradeIndexesPromise ??= ensureAssignmentGradeIndexes().catch((error) => {
    gradeIndexesPromise = null;
    console.error("assignment grade index ensure failed", error);
  });
  await gradeIndexesPromise;
  return collection;
}

export async function readLatestAssignmentGrade(
  studentClerkUserId: string,
  assignmentId: AssignmentId,
): Promise<AssignmentGradeView | null> {
  const collection = await readyCollection();
  const doc = await collection.findOne(
    { studentClerkUserId, assignmentId },
    { sort: { savedAt: -1 } },
  );
  return doc ? toAssignmentGradeView(doc) : null;
}

export async function insertAssignmentGrade(input: {
  studentClerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  rows: CriterionGradeRow[];
  checkResults: AssignmentCheckResult[];
  gradedByClerkUserId: string;
  gradedByEmail?: string;
  savedAt?: Date;
}): Promise<AssignmentGradeView> {
  const collection = await readyCollection();
  const totals = gradePoints(input.rows);
  const doc: AssignmentGradeDoc = {
    studentClerkUserId: input.studentClerkUserId,
    assignmentId: input.assignmentId,
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    rows: input.rows,
    checkResults: input.checkResults,
    earnedPoints: totals.earnedPoints,
    totalPoints: totals.totalPoints,
    percent: totals.percent,
    gradedByClerkUserId: input.gradedByClerkUserId,
    gradedByEmail: input.gradedByEmail,
    savedAt: input.savedAt ?? new Date(),
  };
  await collection.insertOne(doc);
  return toAssignmentGradeView(doc);
}
