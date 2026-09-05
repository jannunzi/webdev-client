"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  assignmentSubmitAccess,
  canPersistAssignmentSubmission,
  supportsUrlSubmission,
} from "@/lib/assignments/access";
import { runA1Checks, type AssignmentCheckResult } from "@/lib/assignments/checks";
import { fetchDeployHtml, probeGithubRepo } from "@/lib/assignments/fetch-deploy";
import { resolveNameQuery, type NameSource } from "@/lib/assignments/names";
import {
  readAssignmentSubmission,
  writeAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import { isAssignmentId } from "@/lib/assignments/catalog";
import type { AssignmentId } from "@/lib/assignments/types";
import { isAssignmentProgressConfigured } from "@/lib/config";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type SubmissionActionResult =
  | {
      ok: true;
      persisted: boolean;
      impersonation?: boolean;
      submission: AssignmentSubmissionView;
    }
  | {
      ok: false;
      code:
        | "unauthenticated"
        | "not_configured"
        | "not_on_roster"
        | "roster_empty"
        | "invalid"
        | "persist_failed";
      message: string;
    };

function gateMessage(
  code: Exclude<SubmissionActionResult, { ok: true }>["code"],
): string {
  switch (code) {
    case "unauthenticated":
      return ASSIGNMENT_STUDENT_COPY.signInToSubmit;
    case "not_configured":
      return ASSIGNMENT_STUDENT_COPY.notConfigured;
    case "not_on_roster":
      return ASSIGNMENT_STUDENT_COPY.notOnRoster;
    case "roster_empty":
      return ASSIGNMENT_STUDENT_COPY.rosterEmpty;
    case "invalid":
      return ASSIGNMENT_STUDENT_COPY.unknownAssignment;
    default:
      return "Could not save the submission.";
  }
}

function nameSourceFromActor(
  user: Awaited<ReturnType<typeof currentUser>>,
  roster: Awaited<ReturnType<typeof lookupCanvasRoster>>,
): NameSource {
  if (roster.status === "matched" && roster.entry.source === "impersonation") {
    return {};
  }
  return {
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    rosterName: roster.status === "matched" ? roster.entry.name : undefined,
  };
}

async function authorizeSubmission(assignmentId: string): Promise<
  | {
      ok: true;
      userId: string;
      impersonating: boolean;
      nameSource: NameSource;
    }
  | { ok: false; result: Extract<SubmissionActionResult, { ok: false }> }
> {
  if (!supportsUrlSubmission(assignmentId) || !isAssignmentId(assignmentId)) {
    return {
      ok: false,
      result: { ok: false, code: "invalid", message: gateMessage("invalid") },
    };
  }

  const configured = isAssignmentProgressConfigured();
  const { userId, isAuthenticated } = await auth();
  const signedIn = Boolean(isAuthenticated && userId);
  if (!configured || !signedIn || !userId) {
    const code = !configured ? "not_configured" : "unauthenticated";
    return { ok: false, result: { ok: false, code, message: gateMessage(code) } };
  }

  const user = await currentUser();
  const emails = collectClerkEmails(user);
  const canvasUserId = canvasUserIdFromMetadata(user);
  const impersonating = await isImpersonatingStudent();
  const staff = await isActualStaff();
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
    impersonating,
  });
  const access = assignmentSubmitAccess({
    signedIn: true,
    configured: true,
    isActualStaff: staff,
    roster,
  });
  if (!access.ok) {
    return {
      ok: false,
      result: {
        ok: false,
        code: access.code,
        message: gateMessage(access.code),
      },
    };
  }

  return {
    ok: true,
    userId,
    impersonating,
    nameSource: nameSourceFromActor(user, roster),
  };
}

async function runChecksForA1(input: {
  githubUrl: string;
  vercelUrl: string;
  nameSource: NameSource;
}): Promise<AssignmentCheckResult[]> {
  return runA1Checks({
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    nameQuery: resolveNameQuery(input.nameSource),
    probes: {
      getHtml: fetchDeployHtml,
      probeUrl: probeGithubRepo,
    },
  });
}

function viewFromInputs(input: {
  githubUrl: string;
  vercelUrl: string;
  checkResults: AssignmentCheckResult[];
  now?: Date;
}): AssignmentSubmissionView {
  const now = (input.now ?? new Date()).toISOString();
  return {
    githubUrl: input.githubUrl,
    vercelUrl: input.vercelUrl,
    updatedAt: now,
    lastCheckedAt: now,
    checkResults: input.checkResults,
  };
}

export async function saveAssignmentSubmission(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}): Promise<SubmissionActionResult> {
  const authz = await authorizeSubmission(input.assignmentId);
  if (!authz.ok) return authz.result;

  const githubUrl = input.githubUrl.trim();
  const vercelUrl = input.vercelUrl.trim();
  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const checkResults = await runChecksForA1({
    githubUrl,
    vercelUrl,
    nameSource: authz.nameSource,
  });
  const persist = canPersistAssignmentSubmission(authz.impersonating);

  if (!persist) {
    return {
      ok: true,
      persisted: false,
      impersonation: true,
      submission: viewFromInputs({ githubUrl, vercelUrl, checkResults }),
    };
  }

  try {
    const doc = await writeAssignmentSubmission({
      clerkUserId: authz.userId,
      assignmentId: input.assignmentId as AssignmentId,
      githubUrl,
      vercelUrl,
      checkResults,
      checked: true,
    });
    return {
      ok: true,
      persisted: true,
      submission: toSubmissionView(doc),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the submission.";
    console.error("assignment submission persist failed", message);
    return { ok: false, code: "persist_failed", message };
  }
}

export async function runAssignmentChecks(input: {
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
}): Promise<SubmissionActionResult> {
  const authz = await authorizeSubmission(input.assignmentId);
  if (!authz.ok) return authz.result;

  let githubUrl = input.githubUrl.trim();
  let vercelUrl = input.vercelUrl.trim();

  if (!vercelUrl && canPersistAssignmentSubmission(authz.impersonating)) {
    try {
      const existing = await readAssignmentSubmission(
        authz.userId,
        input.assignmentId as AssignmentId,
      );
      githubUrl = githubUrl || existing?.githubUrl || "";
      vercelUrl = vercelUrl || existing?.vercelUrl || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load the submission.";
      console.error("assignment submission load failed", message);
    }
  }

  if (!vercelUrl) {
    return {
      ok: false,
      code: "invalid",
      message: ASSIGNMENT_STUDENT_COPY.vercelRequired,
    };
  }

  const checkResults = await runChecksForA1({
    githubUrl,
    vercelUrl,
    nameSource: authz.nameSource,
  });
  const persist = canPersistAssignmentSubmission(authz.impersonating);

  if (persist) {
    try {
      const existing = await readAssignmentSubmission(
        authz.userId,
        input.assignmentId as AssignmentId,
      );
      if (existing) {
        const doc = await writeAssignmentSubmission({
          clerkUserId: authz.userId,
          assignmentId: input.assignmentId as AssignmentId,
          githubUrl: existing.githubUrl,
          vercelUrl: existing.vercelUrl,
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
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not store check results.";
      console.error("assignment check persist failed", message);
    }
  }

  return {
    ok: true,
    persisted: false,
    impersonation: authz.impersonating || undefined,
    submission: viewFromInputs({ githubUrl, vercelUrl, checkResults }),
  };
}
