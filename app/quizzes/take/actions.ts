"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { isQuizTakingConfigured } from "@/lib/config";
import { findLatestQuizAttempt, insertQuizAttempt } from "@/lib/quiz-exam/attempts";
import { STUDENT_COPY } from "@/lib/quiz-exam/student-copy";
import { runExamSubmit } from "@/lib/quiz-exam/submit";
import type { SubmitExamInput, SubmitExamResult } from "@/lib/quiz-exam/types";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
  preferredRosterEmail,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import { isImpersonatingStudent } from "@/lib/roster/staff-access";

export async function submitExamAttempt(
  input: SubmitExamInput,
): Promise<SubmitExamResult> {
  if (!isQuizTakingConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message:
        "Graded quizzes are not available yet.",
    };
  }

  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: STUDENT_COPY.signInToSubmit,
    };
  }

  const user = await currentUser();
  const emails = collectClerkEmails(user);
  const canvasUserId = canvasUserIdFromMetadata(user);
  const impersonating = await isImpersonatingStudent();
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
    impersonating,
  });

  if (roster.status !== "matched") {
    return runExamSubmit({
      quizId: input.quizId,
      drawnQuestionIds: input.drawnQuestionIds,
      answers: input.answers,
      startedAt: input.startedAt,
      actor: { clerkUserId: userId, email: emails[0], canvasUserId },
      roster,
    });
  }

  if (!impersonating) {
    const existing = await findLatestQuizAttempt(userId, input.quizId);
    if (existing) {
      return {
        ok: false,
        code: "already_submitted",
        message:
          "You already submitted this quiz. Return to this page to see your score and, when the class window opens, the answers.",
      };
    }
  }

  try {
    const result = await runExamSubmit({
      quizId: input.quizId,
      drawnQuestionIds: input.drawnQuestionIds,
      answers: input.answers,
      startedAt: input.startedAt,
      actor: {
        clerkUserId: userId,
        email: preferredRosterEmail(user, roster.entry.email),
        canvasUserId: canvasUserId ?? roster.entry.canvasUserId,
      },
      roster,
      persist: impersonating ? undefined : insertQuizAttempt,
    });
    if (result.ok && impersonating) {
      return { ...result, persisted: false, impersonation: true };
    }
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not store the attempt.";
    console.error("quiz attempt persist failed", message);
    const graded = await runExamSubmit({
      quizId: input.quizId,
      drawnQuestionIds: input.drawnQuestionIds,
      answers: input.answers,
      startedAt: input.startedAt,
      actor: {
        clerkUserId: userId,
        email: preferredRosterEmail(user, roster.entry.email),
        canvasUserId: canvasUserId ?? roster.entry.canvasUserId,
      },
      roster,
    });
    if (graded.ok) {
      return {
        ...graded,
        persisted: false,
      };
    }
    return graded;
  }
}
