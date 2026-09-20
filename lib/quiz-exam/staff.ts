import { normalizeEmail, uniqueEmailMatchKeys } from "../roster/emails";
import {
  compareSectionLabels,
  compareStudents,
  studentDisplayName,
  UNSECTIONED_LABEL,
} from "../roster/sections";
import type { CanvasRosterEntry } from "../roster/types";
import type { QuizAttemptDoc } from "./types";

export { UNSECTIONED_LABEL };

export type QuizStaffAccess = {
  canView: boolean;
  canPersist: boolean;
};

/**
 * Same allowlist as People / author review (`INSTRUCTOR_EMAILS` /
 * `TA_EMAILS`) via `isActualStaff`. Impersonation hides the browser.
 */
export function quizStaffAccess(input: {
  isActualStaff: boolean;
  impersonating: boolean;
}): QuizStaffAccess {
  const canView = input.isActualStaff && !input.impersonating;
  return { canView, canPersist: canView };
}

export function canViewQuizStaffAttempts(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return quizStaffAccess({ isActualStaff, impersonating }).canView;
}

export function canPersistQuizGradeOverride(
  isActualStaff: boolean,
  impersonating: boolean,
): boolean {
  return quizStaffAccess({ isActualStaff, impersonating }).canPersist;
}

export type QuizStaffStudentRow = {
  key: string;
  email: string;
  name: string;
  section?: string;
  clerkUserId?: string;
  canvasUserId?: string;
  hasAttempt: boolean;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
};

function attemptEmails(doc: QuizAttemptDoc): string[] {
  return [doc.email, doc.meta?.rosterEmail]
    .filter((value): value is string => Boolean(value))
    .map(normalizeEmail)
    .filter(Boolean);
}

function attemptEmailKeys(doc: QuizAttemptDoc): Set<string> {
  return new Set(uniqueEmailMatchKeys(attemptEmails(doc)));
}

function entryEmailKeys(entry: CanvasRosterEntry): Set<string> {
  return new Set(uniqueEmailMatchKeys([entry.email].filter(Boolean)));
}

function matchAttempt(
  entry: CanvasRosterEntry,
  attempts: readonly QuizAttemptDoc[],
): QuizAttemptDoc | undefined {
  const emails = entryEmailKeys(entry);
  const canvasId = entry.canvasUserId?.trim();
  return attempts.find((doc) => {
    const keys = attemptEmailKeys(doc);
    for (const key of emails) {
      if (keys.has(key)) return true;
    }
    if (canvasId && doc.canvasUserId && doc.canvasUserId.trim() === canvasId) {
      return true;
    }
    return false;
  });
}

function submittedAtIso(value: Date | string | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function rowFromAttempt(
  doc: QuizAttemptDoc,
  fallback?: CanvasRosterEntry,
): QuizStaffStudentRow {
  const email =
    (fallback?.email && normalizeEmail(fallback.email)) ||
    (doc.meta?.rosterEmail && normalizeEmail(doc.meta.rosterEmail)) ||
    (doc.email && normalizeEmail(doc.email)) ||
    "";
  const name =
    fallback?.name?.trim() ||
    email ||
    doc.clerkUserId;
  return {
    key: email || `clerk:${doc.clerkUserId}`,
    email,
    name,
    section: fallback?.section,
    clerkUserId: doc.clerkUserId,
    canvasUserId: fallback?.canvasUserId ?? doc.canvasUserId,
    hasAttempt: true,
    score: doc.score,
    maxScore: doc.maxScore,
    submittedAt: submittedAtIso(doc.submittedAt),
  };
}

/**
 * Roster students first (with or without an attempt), then leftover
 * attempts that did not match the roster — so `asd@asd.com` still appears.
 */
export function buildQuizStaffQueue(
  roster: readonly CanvasRosterEntry[],
  attempts: readonly QuizAttemptDoc[],
): QuizStaffStudentRow[] {
  const docs = [...attempts];
  const used = new Set<QuizAttemptDoc>();
  const rows: QuizStaffStudentRow[] = [];

  const rosterSorted = [...roster].sort(compareStudents);
  for (const entry of rosterSorted) {
    const matched = matchAttempt(entry, docs);
    if (matched) used.add(matched);
    const email = normalizeEmail(entry.email);
    if (matched) {
      rows.push(rowFromAttempt(matched, entry));
      continue;
    }
    rows.push({
      key: email,
      email,
      name: studentDisplayName(entry),
      section: entry.section,
      canvasUserId: entry.canvasUserId,
      hasAttempt: false,
    });
  }

  const leftovers = docs
    .filter((doc) => !used.has(doc))
    .map((doc) => rowFromAttempt(doc))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  rows.push(...leftovers);
  return rows;
}

export function findQuizStaffStudent(
  queue: readonly QuizStaffStudentRow[],
  key: string | undefined | null,
): QuizStaffStudentRow | undefined {
  if (!key) return undefined;
  const needle = key.startsWith("clerk:") ? key : normalizeEmail(key);
  return queue.find((row) => row.key === needle || row.email === needle);
}

export function parseQuizStaffStudentKey(
  key: string | undefined | null,
): { clerkUserId?: string; email?: string } {
  if (!key) return {};
  if (key.startsWith("clerk:")) {
    return { clerkUserId: key.slice("clerk:".length) };
  }
  return { email: normalizeEmail(key) };
}

export function adjacentQuizStaffKeys(
  queue: readonly QuizStaffStudentRow[],
  key: string | undefined | null,
): { previous: string | null; next: string | null; index: number } {
  if (queue.length === 0) {
    return { previous: null, next: null, index: -1 };
  }
  const current = findQuizStaffStudent(queue, key);
  const index = current ? queue.indexOf(current) : 0;
  const previous = index > 0 ? queue[index - 1].key : null;
  const next = index < queue.length - 1 ? queue[index + 1].key : null;
  return { previous, next, index };
}

export function quizStaffRowSectionLabel(row: {
  section?: string | null;
}): string {
  return row.section?.trim() || UNSECTIONED_LABEL;
}

export function listQuizStaffSections(
  queue: readonly QuizStaffStudentRow[],
): string[] {
  return [...new Set(queue.map(quizStaffRowSectionLabel))].sort(compareSectionLabels);
}

export function resolveQuizStaffSectionFilter(
  section: string | undefined | null,
  available: readonly string[],
): string | undefined {
  const selected = section?.trim();
  if (!selected) return undefined;
  return available.includes(selected) ? selected : undefined;
}

export function filterQuizStaffQueueBySection(
  queue: readonly QuizStaffStudentRow[],
  section: string | undefined | null,
): QuizStaffStudentRow[] {
  const selected = section?.trim();
  if (!selected) return [...queue];
  return queue.filter((row) => quizStaffRowSectionLabel(row) === selected);
}

export function quizStaffQueueForSection(
  queue: readonly QuizStaffStudentRow[],
  section: string | undefined | null,
): QuizStaffStudentRow[] {
  const resolved = resolveQuizStaffSectionFilter(
    section,
    listQuizStaffSections(queue),
  );
  return filterQuizStaffQueueBySection(queue, resolved);
}

export function firstAttemptKey(
  queue: readonly QuizStaffStudentRow[],
): string | undefined {
  return queue.find((row) => row.hasAttempt)?.key;
}

export function staffAttemptsHref(
  quizId: string,
  options?: { section?: string | null; student?: string | null },
): string {
  const params = new URLSearchParams();
  const section = options?.section?.trim();
  const student = options?.student?.trim();
  if (section) params.set("section", section);
  if (student) params.set("student", student);
  const query = params.toString();
  return query
    ? `/quizzes/staff/${quizId}/attempts?${query}`
    : `/quizzes/staff/${quizId}/attempts`;
}
