"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isMongoConfigured } from "@/lib/config";
import {
  findLatestQuizAttemptForStaff,
  listAttemptsDrawingQuestion,
  updateQuizAttemptGrade,
  type QuizAttemptStored,
} from "@/lib/quiz-exam/attempts";
import {
  deleteQuizGradeOverride,
  listQuizGradeOverrides,
  upsertQuizGradeOverride,
} from "@/lib/quiz-exam/grade-overrides";
import {
  isOverrideKind,
  nextStudentOverrides,
  parseOverridePoints,
  scoreFromGraded,
} from "@/lib/quiz-exam/grade-override";
import { getExamBank } from "@/lib/quiz-exam/banks";
import { buildAttemptReview } from "@/lib/quiz-exam/review";
import { canPersistQuizGradeOverride, parseQuizStaffStudentKey } from "@/lib/quiz-exam/staff";
import { findQuizQuestion } from "@/lib/quiz-exam/website-draw";
import { collectClerkEmails, normalizeEmail } from "@/lib/roster/emails";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";
import type { QuizClassQuestionOverride } from "@/lib/quiz-exam/types";

export type StaffQuizOverrideResult =
  | {
      ok: true;
      persisted: boolean;
      score: number;
      maxScore: number;
      updatedCount: number;
    }
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "not_found" | "invalid";
      message: string;
    };

async function authorizeStaffWriter(): Promise<
  | { ok: true; email?: string }
  | { ok: false; result: Extract<StaffQuizOverrideResult, { ok: false }> }
> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "not_configured",
        message: "MongoDB is not configured, so overrides cannot be saved.",
      },
    };
  }

  const { isAuthenticated } = await auth();
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (
    !isAuthenticated ||
    !canPersistQuizGradeOverride(staff, impersonating)
  ) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "forbidden",
        message: "Only course staff can override quiz grades.",
      },
    };
  }

  const user = await currentUser();
  return { ok: true, email: collectClerkEmails(user)[0] };
}

function revalidateQuizPaths(quizId: string) {
  revalidatePath(`/quizzes/staff/${quizId}/attempts`);
  revalidatePath(`/quizzes/staff/${quizId}`);
  revalidatePath(`/quizzes/take/${quizId}`);
}

async function persistAttemptScore(
  attempt: QuizAttemptStored,
  classOverrides: readonly QuizClassQuestionOverride[],
) {
  const review = buildAttemptReview(attempt, true, classOverrides);
  if (!review) {
    throw new Error("The drawn questions could not be rebuilt from the bank.");
  }
  const totals = scoreFromGraded(review.graded);
  await updateQuizAttemptGrade({
    attempt,
    score: totals.score,
    maxScore: totals.maxScore,
    overrides: attempt.overrides ?? {},
  });
  return totals;
}

export async function saveQuizQuestionOverride(input: {
  quizId: string;
  questionId: string;
  studentKey: string;
  scope: "student" | "all_students";
  kind: string;
  points?: number | string;
}): Promise<StaffQuizOverrideResult> {
  const authz = await authorizeStaffWriter();
  if (!authz.ok) return authz.result;

  const quizId = input.quizId.trim().toLowerCase();
  const questionId = input.questionId.trim();
  const kind = input.kind.trim();
  if (!getExamBank(quizId) || !findQuizQuestion(quizId, questionId)) {
    return {
      ok: false,
      code: "invalid",
      message: "Unknown quiz or question.",
    };
  }
  if (kind !== "clear" && !isOverrideKind(kind)) {
    return { ok: false, code: "invalid", message: "Unknown override." };
  }
  if (input.scope === "all_students" && kind === "points") {
    return {
      ok: false,
      code: "invalid",
      message: "Custom points can be set for one student at a time.",
    };
  }

  const points = parseOverridePoints(input.points);
  if (kind === "points" && points == null) {
    return {
      ok: false,
      code: "invalid",
      message: "Enter a point value for this question.",
    };
  }

  const updatedBy = authz.email ? normalizeEmail(authz.email) : undefined;

  try {
    if (input.scope === "all_students") {
      if (kind === "clear") {
        await deleteQuizGradeOverride(quizId, questionId);
      } else if (kind === "correct" || kind === "wrong") {
        await upsertQuizGradeOverride({
          quizId,
          questionId,
          kind,
          updatedBy,
        });
      }
      const classOverrides = await listQuizGradeOverrides(quizId);
      const attempts = await listAttemptsDrawingQuestion(quizId, questionId);
      let updatedCount = 0;
      for (const attempt of attempts) {
        await persistAttemptScore(attempt, classOverrides);
        updatedCount += 1;
      }
      revalidateQuizPaths(quizId);
      return {
        ok: true,
        persisted: true,
        score: 0,
        maxScore: 0,
        updatedCount,
      };
    }

    const parsed = parseQuizStaffStudentKey(input.studentKey);
    const attempt = await findLatestQuizAttemptForStaff({
      quizId,
      clerkUserId: parsed.clerkUserId,
      email: parsed.email,
    });
    if (!attempt) {
      return {
        ok: false,
        code: "not_found",
        message: "No submitted attempt was found for that student.",
      };
    }
    const drawn = attempt.meta.drawnQuestionIds ?? [];
    if (
      !drawn.includes(questionId) &&
      !attempt.answers.some((item) => item.questionId === questionId)
    ) {
      return {
        ok: false,
        code: "invalid",
        message: "That question was not on this student’s attempt.",
      };
    }

    attempt.overrides = nextStudentOverrides(
      attempt.overrides,
      questionId,
      kind === "clear" ? "clear" : kind,
      points,
      updatedBy,
    );
    const classOverrides = await listQuizGradeOverrides(quizId);
    const totals = await persistAttemptScore(attempt, classOverrides);
    revalidateQuizPaths(quizId);
    return {
      ok: true,
      persisted: true,
      score: totals.score,
      maxScore: totals.maxScore,
      updatedCount: 1,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the override.";
    console.error("quiz grade override persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}
