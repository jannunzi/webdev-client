import { normalizeEmail } from "../roster/emails";
import {
  compareSectionLabels,
  compareStudents,
  studentDisplayName,
  UNSECTIONED_LABEL,
} from "../roster/sections";
import type { CanvasRosterEntry } from "../roster/types";
import type { AssignmentCheckResult } from "./check-types";
import type { AssignmentStaffGrade, AssignmentSubmissionDoc } from "./submissions-store";

/** Same fallback as `/people` when `canvas_roster.section` is blank. */
export { UNSECTIONED_LABEL };

export type StaffGraderAccess = {
  canView: boolean;
  canPersist: boolean;
};

/**
 * Same allowlist as People (`INSTRUCTOR_EMAILS` / `TA_EMAILS`) via
 * `isActualStaff`. Impersonation hides the navigator and blocks writes.
 */
export function staffGraderAccess(input: {
  isActualStaff: boolean;
  impersonating: boolean;
}): StaffGraderAccess {
  const canView = input.isActualStaff && !input.impersonating;
  return {
    canView,
    canPersist: canView,
  };
}

export function canViewStaffGrader(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return staffGraderAccess({ isActualStaff, impersonating }).canView;
}

export function canPersistStaffGrade(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return staffGraderAccess({ isActualStaff, impersonating }).canPersist;
}

export type StaffStudentRow = {
  key: string;
  email: string;
  name: string;
  section?: string;
  clerkUserId?: string;
  canvasUserId?: string;
  hasSubmission: boolean;
  githubUrl?: string;
  vercelUrl?: string;
  lastCheckedAt?: string;
  checkResults?: AssignmentCheckResult[];
  staffGrade?: AssignmentStaffGrade;
};

function submissionEmails(doc: AssignmentSubmissionDoc): string[] {
  return [doc.rosterEmail, doc.email]
    .filter((value): value is string => Boolean(value))
    .map(normalizeEmail);
}

function matchSubmission(
  entry: CanvasRosterEntry,
  submissions: AssignmentSubmissionDoc[],
): AssignmentSubmissionDoc | undefined {
  const email = normalizeEmail(entry.email);
  const canvasId = entry.canvasUserId?.trim();
  return submissions.find((doc) => {
    if (submissionEmails(doc).includes(email)) return true;
    if (canvasId && doc.canvasUserId && doc.canvasUserId.trim() === canvasId) {
      return true;
    }
    return false;
  });
}

function rowFromSubmission(
  doc: AssignmentSubmissionDoc,
  fallback?: CanvasRosterEntry,
): StaffStudentRow {
  const email =
    (fallback?.email && normalizeEmail(fallback.email)) ||
    (doc.rosterEmail && normalizeEmail(doc.rosterEmail)) ||
    (doc.email && normalizeEmail(doc.email)) ||
    "";
  const name =
    fallback?.name?.trim() ||
    doc.name?.trim() ||
    email ||
    doc.clerkUserId;
  return {
    key: email || `clerk:${doc.clerkUserId}`,
    email,
    name,
    section: fallback?.section ?? doc.section,
    clerkUserId: doc.clerkUserId,
    canvasUserId: fallback?.canvasUserId ?? doc.canvasUserId,
    hasSubmission: true,
    githubUrl: doc.githubUrl,
    vercelUrl: doc.vercelUrl,
    lastCheckedAt: doc.lastCheckedAt
      ? doc.lastCheckedAt instanceof Date
        ? doc.lastCheckedAt.toISOString()
        : new Date(doc.lastCheckedAt).toISOString()
      : undefined,
    checkResults: doc.checkResults,
    staffGrade: doc.staffGrade,
  };
}

/**
 * Roster students first (with or without a submission), then leftover
 * submissions that did not match the roster.
 */
export function buildStaffStudentQueue(
  roster: readonly CanvasRosterEntry[],
  submissions: readonly AssignmentSubmissionDoc[],
): StaffStudentRow[] {
  const docs = [...submissions];
  const used = new Set<AssignmentSubmissionDoc>();
  const rows: StaffStudentRow[] = [];

  const rosterSorted = [...roster].sort(compareStudents);
  for (const entry of rosterSorted) {
    const matched = matchSubmission(entry, docs);
    if (matched) used.add(matched);
    const email = normalizeEmail(entry.email);
    if (matched) {
      rows.push(rowFromSubmission(matched, entry));
      continue;
    }
    rows.push({
      key: email,
      email,
      name: studentDisplayName(entry),
      section: entry.section,
      canvasUserId: entry.canvasUserId,
      hasSubmission: false,
    });
  }

  const leftovers = docs
    .filter((doc) => !used.has(doc))
    .map((doc) => rowFromSubmission(doc))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  rows.push(...leftovers);
  return rows;
}

export function findStaffStudent(
  queue: readonly StaffStudentRow[],
  key: string | undefined | null,
): StaffStudentRow | undefined {
  if (!key) return undefined;
  const needle = key.startsWith("clerk:") ? key : normalizeEmail(key);
  return queue.find((row) => row.key === needle || row.email === needle);
}

export function parseStaffStudentKey(
  key: string | undefined | null,
): { clerkUserId?: string; email?: string } {
  if (!key) return {};
  if (key.startsWith("clerk:")) {
    return { clerkUserId: key.slice("clerk:".length) };
  }
  return { email: normalizeEmail(key) };
}

export function adjacentStaffStudentKeys(
  queue: readonly StaffStudentRow[],
  key: string | undefined | null,
): { previous: string | null; next: string | null; index: number } {
  if (queue.length === 0) {
    return { previous: null, next: null, index: -1 };
  }
  const current = findStaffStudent(queue, key);
  const index = current ? queue.indexOf(current) : 0;
  const previous = index > 0 ? queue[index - 1].key : null;
  const next = index < queue.length - 1 ? queue[index + 1].key : null;
  return { previous, next, index };
}

/** Raw `canvas_roster.section` (trimmed), or `Unsectioned` — same as People tabs. */
export function staffRowSectionLabel(row: {
  section?: string | null;
}): string {
  return row.section?.trim() || UNSECTIONED_LABEL;
}

export function listStaffQueueSections(
  queue: readonly StaffStudentRow[],
): string[] {
  return [...new Set(queue.map(staffRowSectionLabel))].sort(compareSectionLabels);
}

/**
 * Unknown or empty `?section=` is All (same as `/people`).
 * Valid values are the stored Canvas section labels.
 */
export function resolveStaffSectionFilter(
  section: string | undefined | null,
  available: readonly string[],
): string | undefined {
  const selected = section?.trim();
  if (!selected) return undefined;
  return available.includes(selected) ? selected : undefined;
}

export function filterStaffQueueBySection(
  queue: readonly StaffStudentRow[],
  section: string | undefined | null,
): StaffStudentRow[] {
  const selected = section?.trim();
  if (!selected) return [...queue];
  return queue.filter((row) => staffRowSectionLabel(row) === selected);
}

export function staffQueueForSection(
  queue: readonly StaffStudentRow[],
  section: string | undefined | null,
): StaffStudentRow[] {
  const resolved = resolveStaffSectionFilter(
    section,
    listStaffQueueSections(queue),
  );
  return filterStaffQueueBySection(queue, resolved);
}

export function staffGraderHref(
  assignmentId: string,
  options?: { section?: string | null; student?: string | null },
): string {
  const params = new URLSearchParams();
  const section = options?.section?.trim();
  const student = options?.student?.trim();
  if (section) params.set("section", section);
  if (student) params.set("student", student);
  const query = params.toString();
  return query
    ? `/assignments/${assignmentId}?${query}`
    : `/assignments/${assignmentId}`;
}
