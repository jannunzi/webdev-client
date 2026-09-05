"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { canPersistStaffGrade, canViewStaffGrader } from "@/lib/assignments/access";
import { runA1Checks } from "@/lib/assignments/checks";
import { fetchDeployHtml, probeGithubRepo } from "@/lib/assignments/fetch-deploy";
import {
  gradeFromResultsAndOverrides,
  proposedGradeFromResults,
  type CriterionPassMap,
} from "@/lib/assignments/grade";
import { getAssignment, isAssignmentId } from "@/lib/assignments/catalog";
import { resolveNameQuery } from "@/lib/assignments/names";
import { parseStaffStudentKey } from "@/lib/assignments/staff";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import {
  findSubmissionForStaffStudent,
  writeAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentStaffGrade,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import type { AssignmentId } from "@/lib/assignments/types";
import { isAssignmentProgressConfigured } from "@/lib/config";
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
  if (!isAssignmentId(input.assignmentId) || input.assignmentId !== "a1") {
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

  const githubUrl = (input.githubUrl ?? target.doc.githubUrl ?? "").trim();
  const vercelUrl = (input.vercelUrl ?? target.doc.vercelUrl ?? "").trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const checkResults = await runA1Checks({
    githubUrl,
    vercelUrl,
    nameQuery: resolveNameQuery({ rosterName: target.doc.name }),
    probes: {
      getHtml: fetchDeployHtml,
      probeUrl: probeGithubRepo,
    },
  });

  if (!authz.persist) {
    return {
      ok: true,
      persisted: false,
      impersonation: true,
      submission: {
        ...toSubmissionView(target.doc),
        githubUrl,
        vercelUrl,
        checkResults,
        lastCheckedAt: new Date().toISOString(),
      },
    };
  }

  try {
    const doc = await writeAssignmentSubmission({
      clerkUserId: target.doc.clerkUserId,
      assignmentId: target.assignmentId,
      githubUrl: target.doc.githubUrl,
      vercelUrl: target.doc.vercelUrl,
      checkResults,
      checked: true,
    });
    return {
      ok: true,
      persisted: true,
      submission: {
        ...toSubmissionView(doc),
        githubUrl,
        vercelUrl,
        checkResults,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not store check results.";
    console.error("staff assignment check persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}

export async function saveStaffAssignmentGrade(input: {
  assignmentId: string;
  studentKey: string;
  acceptProposed?: boolean;
  overrides?: CriterionPassMap;
  comments?: Record<string, string>;
  earnedPoints?: number;
}): Promise<StaffActionResult> {
  const authz = await authorizeStaffGrader();
  if (!authz.ok) return authz.result;

  const assignment = getAssignment(input.assignmentId);
  if (!assignment?.rubric) {
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

  const results = target.doc.checkResults ?? [];
  const computed = input.acceptProposed
    ? proposedGradeFromResults(assignment.rubric, results)
    : gradeFromResultsAndOverrides(assignment.rubric, results, input.overrides);
  const totalPoints = computed.totalPoints;
  const earnedPoints =
    input.acceptProposed || input.earnedPoints == null
      ? computed.earnedPoints
      : Math.max(0, Math.min(totalPoints, Math.round(input.earnedPoints)));
  const percent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  const staffGrade: AssignmentStaffGrade = {
    earnedPoints,
    totalPoints,
    percent,
    acceptedProposed: Boolean(input.acceptProposed) && input.earnedPoints == null,
    criterionOverrides: input.acceptProposed ? undefined : input.overrides,
    comments: input.comments ?? target.doc.staffGrade?.comments,
    gradedByEmail: authz.staffEmail ? normalizeEmail(authz.staffEmail) : undefined,
    gradedAt: new Date(),
  };

  if (!authz.persist) {
    return {
      ok: true,
      persisted: false,
      impersonation: true,
      submission: {
        ...toSubmissionView(target.doc),
        staffGrade,
      },
    };
  }

  try {
    const doc = await writeAssignmentSubmission({
      clerkUserId: target.doc.clerkUserId,
      assignmentId: target.assignmentId,
      githubUrl: target.doc.githubUrl,
      vercelUrl: target.doc.vercelUrl,
      checkResults: target.doc.checkResults,
      staffGrade,
    });
    return { ok: true, persisted: true, submission: toSubmissionView(doc) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the staff grade.";
    console.error("staff assignment grade persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}
