"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { canViewStaffGrader, supportsUrlSubmission } from "@/lib/assignments/access";
import { runConfiguredChecks } from "@/lib/assignments/checks";
import { fetchDeployHtml, probeGithubRepo } from "@/lib/assignments/fetch-deploy";
import type { AssignmentCheckResult } from "@/lib/assignments/check-types";
import {
  gradeViewFromStaffGrade,
  normalizeGradeRows,
  sanitizeCheckResults,
  staffGradeRecordFromRows,
  type AssignmentGradeView,
  type CriterionGradeRow,
} from "@/lib/assignments/grade-rows";
import { getAssignment, isAssignmentId, listRubricCriteria } from "@/lib/assignments/catalog";
import {
  assignmentGradeSaveAccess,
  canPersistStaffGrade,
  parseStaffStudentKey,
} from "@/lib/assignments/staff";
import { resolveNameQuery } from "@/lib/assignments/names";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import {
  assignmentSubmissionStore,
  findSubmissionForStaffStudent,
  listSubmissionsForAssignment,
  writeStaffGrade,
} from "@/lib/assignments/submissions";
import { getChecker } from "@/lib/assignments/checkers";
import { checkerVersionLabel } from "@/lib/assignments/checker-version";
import {
  clampBatch,
  rerunCheckBatch,
  type RerunBatchResult,
} from "@/lib/assignments/rerun";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import type { AssignmentId } from "@/lib/assignments/types";
import { isAssignmentFixupsEnabled, isAssignmentProgressConfigured } from "@/lib/config";
import {
  clearFixupWindow,
  setFixupApproval,
  setFixupOverride,
  setFixupWindow,
} from "@/lib/assignments/fixup-store";
import { collectClerkEmails, normalizeEmail } from "@/lib/roster/emails";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type StaffActionResult =
  | {
      ok: true;
      persisted: boolean;
      impersonation?: boolean;
      submission: AssignmentSubmissionView;
    }
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "not_found" | "invalid";
      message: string;
    };

async function authorizeStaffGrader(): Promise<
  | { ok: true; persist: boolean; staffEmail?: string }
  | { ok: false; result: Extract<StaffActionResult, { ok: false }> }
> {
  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "not_configured",
        message: ASSIGNMENT_STUDENT_COPY.notConfigured,
      },
    };
  }
  const { isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !canViewStaffGrader(staff, impersonating)) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "forbidden",
        message: "This grading view is for course staff only.",
      },
    };
  }
  const user = await currentUser();
  return {
    ok: true,
    persist: canPersistStaffGrade(staff, impersonating),
    staffEmail: collectClerkEmails(user)[0],
  };
}

async function loadStaffTarget(input: {
  assignmentId: string;
  studentKey: string;
}) {
  if (!isAssignmentId(input.assignmentId) || !supportsUrlSubmission(input.assignmentId)) {
    return { ok: false as const, message: ASSIGNMENT_STUDENT_COPY.unknownAssignment };
  }
  const parsed = parseStaffStudentKey(input.studentKey);
  const doc = await findSubmissionForStaffStudent({
    assignmentId: input.assignmentId,
    clerkUserId: parsed.clerkUserId,
    email: parsed.email,
  });
  if (!doc) {
    return { ok: false as const, message: ASSIGNMENT_STUDENT_COPY.noSubmission };
  }
  return { ok: true as const, assignmentId: input.assignmentId as AssignmentId, doc };
}

export async function runStaffAssignmentChecks(input: {
  assignmentId: string;
  studentKey: string;
  githubUrl?: string;
  vercelUrl?: string;
}): Promise<StaffActionResult> {
  const authz = await authorizeStaffGrader();
  if (!authz.ok) return authz.result;

  let target;
  try {
    target = await loadStaffTarget(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the submission.";
    return { ok: false, code: "not_found", message };
  }
  if (!target.ok) {
    return { ok: false, code: "not_found", message: target.message };
  }

  const githubUrl = (target.doc.githubUrl ?? "").trim();
  const vercelUrl = (target.doc.vercelUrl ?? "").trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const checkResults = await runConfiguredChecks(target.assignmentId, {
    githubUrl,
    vercelUrl,
    nameQuery: resolveNameQuery({ rosterName: target.doc.name }),
    previousResults: target.doc.checkResults,
    probes: {
      getHtml: fetchDeployHtml,
      probeUrl: probeGithubRepo,
    },
  });

  // On-screen only. Run never writes staffGrade or checklist progress.
  return {
    ok: true,
    persisted: false,
    impersonation: authz.persist ? undefined : true,
    submission: {
      ...toSubmissionView(target.doc),
      githubUrl,
      vercelUrl,
      checkResults,
    },
  };
}

export type GradeSaveActionResult =
  | { ok: true; grade: AssignmentGradeView }
  | {
      ok: false;
      code: "forbidden" | "unauthenticated" | "not_configured" | "not_found" | "invalid";
      message: string;
    };

export async function saveAssignmentGrade(input: {
  assignmentId: string;
  studentKey: string;
  rows: CriterionGradeRow[];
  checkResults?: AssignmentCheckResult[];
  /**
   * The submission time on the grader's screen. Stored with the grade so a
   * resubmission that lands while staff grade still reads as out of date.
   */
  submittedAt?: string;
}): Promise<GradeSaveActionResult> {
  const { userId, isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: ASSIGNMENT_STUDENT_COPY.syncProgress,
    };
  }
  const access = assignmentGradeSaveAccess({
    isAuthenticated: true,
    isActualStaff: staff,
    impersonating,
  });
  if (!access.ok) {
    return {
      ok: false,
      code: access.code,
      message:
        access.code === "unauthenticated"
          ? ASSIGNMENT_STUDENT_COPY.syncProgress
          : "Only course staff can save a grade.",
    };
  }

  if (!isAssignmentProgressConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message: ASSIGNMENT_STUDENT_COPY.notConfigured,
    };
  }

  const assignment = getAssignment(input.assignmentId);
  if (!assignment?.rubric || !isAssignmentId(input.assignmentId)) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.unknownAssignment,
    };
  }

  let target;
  try {
    target = await loadStaffTarget(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the submission.";
    return { ok: false, code: "not_found", message };
  }
  if (!target.ok) {
    return { ok: false, code: "not_found", message: target.message };
  }

  const vercelUrl = (target.doc.vercelUrl ?? "").trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const rows = normalizeGradeRows(
    listRubricCriteria(assignment.rubric).map((row) => ({
      id: row.id,
      points: row.points,
    })),
    input.rows ?? [],
  );
  if (!input.rows?.length) {
    return {
      ok: false,
      code: "invalid",
      message: "Run checks before saving a grade.",
    };
  }

  const user = await currentUser();
  const gradedByEmail = collectClerkEmails(user)[0];

  const checkResults = sanitizeCheckResults(input.checkResults);
  const staffGrade = staffGradeRecordFromRows({
    rows,
    checkResults,
    comments: target.doc.staffGrade?.comments,
    gradedByEmail: gradedByEmail ? normalizeEmail(gradedByEmail) : undefined,
    gradedByClerkUserId: userId,
  });

  try {
    // A staff Save is not a submission: the student's submission time and
    // URLs stay as they are (only the grade and its check run are written).
    const doc = await writeStaffGrade({
      clerkUserId: target.doc.clerkUserId,
      assignmentId: target.assignmentId,
      staffGrade,
      checkResults,
      seenSubmittedAt: input.submittedAt ?? null,
    });
    if (!doc) {
      return { ok: false, code: "not_found", message: ASSIGNMENT_STUDENT_COPY.noSubmission };
    }
    const grade = gradeViewFromStaffGrade({
      studentClerkUserId: doc.clerkUserId,
      assignmentId: doc.assignmentId,
      githubUrl: doc.githubUrl,
      vercelUrl: doc.vercelUrl,
      criteria: listRubricCriteria(assignment.rubric).map((row) => ({
        id: row.id,
        points: row.points,
      })),
      staffGrade: doc.staffGrade,
      checkResults: doc.checkResults,
    });
    if (!grade) {
      return { ok: false, code: "invalid", message: "Could not save the grade." };
    }
    return { ok: true, grade };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the grade.";
    console.error("assignment grade save failed", message);
    return { ok: false, code: "invalid", message };
  }
}

export type RerunAllActionResult =
  | ({ ok: true } & RerunBatchResult)
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "invalid";
      message: string;
    };

/**
 * Staff "Re-run all and save", one batch per call. The client calls again
 * with `nextOffset` until it is null. Each submission's check results are
 * replaced and stamped with the checker version; the submission time, URLs,
 * and any staff grade are not changed. View as student cannot run it.
 */
export async function rerunAssignmentChecksBatch(input: {
  assignmentId: string;
  offset: number;
  limit?: number;
}): Promise<RerunAllActionResult> {
  const authz = await authorizeStaffGrader();
  if (!authz.ok) {
    const { code, message } = authz.result;
    return { ok: false, code: code === "not_found" ? "invalid" : code, message };
  }
  if (!authz.persist) {
    return {
      ok: false,
      code: "forbidden",
      message: "Stop viewing as a student to re-run and save checks.",
    };
  }
  if (!isAssignmentId(input.assignmentId) || !supportsUrlSubmission(input.assignmentId)) {
    return { ok: false, code: "invalid", message: ASSIGNMENT_STUDENT_COPY.unknownAssignment };
  }
  const checker = getChecker(input.assignmentId);
  if (!checker) {
    return { ok: false, code: "invalid", message: ASSIGNMENT_STUDENT_COPY.unknownAssignment };
  }
  const assignmentId = input.assignmentId as AssignmentId;
  const { offset, limit } = clampBatch(input.offset, input.limit);
  const [store, docs] = await Promise.all([
    assignmentSubmissionStore(),
    listSubmissionsForAssignment(assignmentId),
  ]);
  const batch = await rerunCheckBatch({
    store,
    docs: docs.filter((doc) => doc.vercelUrl?.trim()),
    offset,
    limit,
    checkerVersion: checkerVersionLabel(checker.rulesVersion),
    runChecks: (doc) =>
      runConfiguredChecks(assignmentId, {
        githubUrl: doc.githubUrl ?? "",
        vercelUrl: doc.vercelUrl,
        nameQuery: resolveNameQuery({ rosterName: doc.name }),
        probes: { getHtml: fetchDeployHtml, probeUrl: probeGithubRepo },
        previousResults: doc.checkResults,
      }),
  });
  return { ok: true, ...batch };
}

/* ------------------------------------------------------------------ */
/* Fix-up rounds: open dates, item approvals, overrides                 */
/* ------------------------------------------------------------------ */

export type StaffFixupResult = { ok: true; message: string } | { ok: false; message: string };

async function authorizeFixupStaff(assignmentId: string) {
  if (!isAssignmentFixupsEnabled()) return { ok: false as const, message: "Fix-ups are turned off." };
  const authz = await authorizeStaffGrader();
  if (!authz.ok) return { ok: false as const, message: authz.result.message };
  if (!authz.persist) return { ok: false as const, message: "Can't save while viewing as a student." };
  const assignment = getAssignment(assignmentId);
  if (!assignment?.rubric || !isAssignmentId(assignmentId)) {
    return { ok: false as const, message: ASSIGNMENT_STUDENT_COPY.unknownAssignment };
  }
  return { ok: true as const, staffEmail: authz.staffEmail, rubric: assignment.rubric };
}

/** Set (or clear, with an empty date) the fix-up open date for a section. */
export async function setFixupWindowAction(input: {
  assignmentId: string;
  section: string;
  opensAt: string;
}): Promise<StaffFixupResult> {
  const ctx = await authorizeFixupStaff(input.assignmentId);
  if (!ctx.ok) return ctx;
  const section = input.section.trim();
  if (!section) return { ok: false, message: "Pick a section first." };
  if (!input.opensAt.trim()) {
    await clearFixupWindow(input.assignmentId, section);
    return { ok: true, message: "Fix-up window cleared." };
  }
  const opens = new Date(input.opensAt);
  if (Number.isNaN(opens.getTime())) return { ok: false, message: "Invalid date." };
  await setFixupWindow({ assignmentId: input.assignmentId, section, opensAt: opens.toISOString() }, ctx.staffEmail);
  return { ok: true, message: "Fix-up window saved." };
}

/** Approve the new raw points (0..max) for one pending fix-up item, or clear it (null). */
export async function approveFixupItemAction(input: {
  assignmentId: string;
  clerkUserId: string;
  criterionId: string;
  points: number | null;
}): Promise<StaffFixupResult> {
  const ctx = await authorizeFixupStaff(input.assignmentId);
  if (!ctx.ok) return ctx;
  const criterion = listRubricCriteria(ctx.rubric).find((c) => c.id === input.criterionId);
  if (!criterion) return { ok: false, message: "Unknown rubric item." };
  const points = input.points == null ? null : Math.min(criterion.points, Math.max(0, Number(input.points)));
  if (points != null && !Number.isFinite(points)) return { ok: false, message: "Invalid points." };
  const ok = await setFixupApproval({
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    criterionId: input.criterionId,
    approval: points == null ? null : { points, approvedBy: ctx.staffEmail, approvedAt: new Date().toISOString() },
  });
  return ok ? { ok: true, message: "Saved." } : { ok: false, message: "No fix-up round for this student." };
}

/** Override the whole fix-up total (wins over the computed result), or clear it (null). */
export async function setFixupOverrideAction(input: {
  assignmentId: string;
  clerkUserId: string;
  points: number | null;
  note?: string;
}): Promise<StaffFixupResult> {
  const ctx = await authorizeFixupStaff(input.assignmentId);
  if (!ctx.ok) return ctx;
  if (input.points != null && !Number.isFinite(Number(input.points))) return { ok: false, message: "Invalid points." };
  const ok = await setFixupOverride({
    clerkUserId: input.clerkUserId,
    assignmentId: input.assignmentId,
    override:
      input.points == null
        ? null
        : { points: Number(input.points), by: ctx.staffEmail, at: new Date().toISOString(), note: input.note?.trim() || undefined },
  });
  return ok ? { ok: true, message: "Saved." } : { ok: false, message: "No fix-up round for this student." };
}
