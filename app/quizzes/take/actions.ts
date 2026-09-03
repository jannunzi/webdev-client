"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { isQuizTakingConfigured } from "@/lib/config";
import { insertQuizAttempt } from "@/lib/quiz-exam/attempts";
import { runExamSubmit } from "@/lib/quiz-exam/submit";
import type { SubmitExamInput, SubmitExamResult } from "@/lib/quiz-exam/types";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
  preferredRosterEmail,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";

export async function submitExamAttempt(
  input: SubmitExamInput,
): Promise<SubmitExamResult> {
  if (!isQuizTakingConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      message:
        "Graded quizzes are not configured yet (Clerk and MongoDB Atlas env vars are required).",
    };
  }

  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "Sign in to submit a graded quiz.",
    };
  }

  const user = await currentUser();
  const emails = collectClerkEmails(user);
  const canvasUserId = canvasUserIdFromMetadata(user);
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
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

  try {
    return await runExamSubmit({
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
      persist: insertQuizAttempt,
    });
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
