"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  isOverridableQuizId,
  toOverrideView,
  type QuizAccessOverrideView,
} from "@/lib/quiz-exam/access-override";
import { upsertQuizAccessOverride } from "@/lib/quiz-exam/access-overrides";
import type { QuizTakeOverrideMode } from "@/lib/quiz-exam/schedule";
import { isMongoConfigured } from "@/lib/config";
import { collectClerkEmails, normalizeEmail } from "@/lib/roster/emails";
import { isCourseSectionId } from "@/lib/roster/sections";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export type SetQuizAccessOverrideResult =
  | { ok: true; override: QuizAccessOverrideView }
  | {
      ok: false;
      code: "forbidden" | "not_configured" | "invalid";
      message: string;
    };

const MODES: readonly QuizTakeOverrideMode[] = ["open", "closed", "schedule"];

function isOverrideMode(value: string): value is QuizTakeOverrideMode {
  return (MODES as readonly string[]).includes(value);
}

async function authorizeStaffWriter(): Promise<
  | { ok: true; email?: string }
  | { ok: false; result: Extract<SetQuizAccessOverrideResult, { ok: false }> }
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
  if (!isAuthenticated || !staff || impersonating) {
    return {
      ok: false,
      result: {
        ok: false,
        code: "forbidden",
        message: "Only course staff can change quiz take overrides.",
      },
    };
  }

  const user = await currentUser();
  return { ok: true, email: collectClerkEmails(user)[0] };
}

export async function setQuizAccessOverride(input: {
  quizId: string;
  sectionId: string;
  mode: string;
}): Promise<SetQuizAccessOverrideResult> {
  const authz = await authorizeStaffWriter();
  if (!authz.ok) return authz.result;

  const quizId = input.quizId.trim().toLowerCase();
  const sectionId = input.sectionId.trim();
  const mode = input.mode.trim();
  if (!isOverridableQuizId(quizId) || !isCourseSectionId(sectionId) || !isOverrideMode(mode)) {
    return {
      ok: false,
      code: "invalid",
      message: "Unknown quiz, section, or override mode.",
    };
  }

  try {
    const doc = await upsertQuizAccessOverride({
      quizId,
      sectionId,
      mode,
      updatedBy: authz.email ? normalizeEmail(authz.email) : undefined,
    });
    revalidatePath("/quizzes/take");
    revalidatePath(`/quizzes/take/${quizId}`);
    return { ok: true, override: toOverrideView(doc) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the override.";
    console.error("quiz access override persist failed", message);
    return { ok: false, code: "invalid", message };
  }
}
