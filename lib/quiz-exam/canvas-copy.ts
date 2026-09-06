import { COURSE_SITE_ORIGIN } from "../assignments/catalog";

/**
 * Canvas quiz / exam student copy for Fall 2026 fallback packages.
 *
 * Website take remains primary. Canvas Q1–Q6 and X1/X2 are a staff-gated
 * backup if the site is down — never the default path.
 */

export const CANVAS_FALLBACK_PERMISSION_BLURB =
  "If the website quiz is unavailable, ask your instructor or TA for permission to take this Canvas quiz instead.";

export type CanvasFallbackQuizId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "x1" | "x2";

export type CanvasFallbackQuizMeta = {
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  /** Civil America/New_York times for Canvas `unlock_at` / `due_at` / `lock_at`. */
  unlockAt: string;
  dueAt: string;
  lockAt: string;
  takePath: string;
};

/** Stable QTI / IMSCC identifiers. Shakespeare can remap these to package -20 GUIDs. */
export function canvasFallbackIdent(quizId: CanvasFallbackQuizId): string {
  return `gwebdev_${quizId}_fallback`;
}

export function canvasQuizTakeUrl(quizId: CanvasFallbackQuizId): string {
  return `${COURSE_SITE_ORIGIN}/quizzes/take/${quizId}`;
}

export const CANVAS_FALLBACK_QUIZZES: CanvasFallbackQuizMeta[] = [
  {
    quizId: "q1",
    canvasTitle: "Q1 — HTML",
    unlockAt: "2026-09-28T00:00:00",
    dueAt: "2026-10-04T23:59:00",
    lockAt: "2026-10-04T23:59:00",
    takePath: "/quizzes/take/q1",
  },
  {
    quizId: "q2",
    canvasTitle: "Q2 — CSS",
    unlockAt: "2026-10-12T00:00:00",
    dueAt: "2026-10-18T23:59:00",
    lockAt: "2026-10-18T23:59:00",
    takePath: "/quizzes/take/q2",
  },
  {
    quizId: "q3",
    canvasTitle: "Q3 — JavaScript",
    unlockAt: "2026-10-26T00:00:00",
    dueAt: "2026-11-01T23:59:00",
    lockAt: "2026-11-01T23:59:00",
    takePath: "/quizzes/take/q3",
  },
  {
    quizId: "q4",
    canvasTitle: "Q4 — Client state",
    unlockAt: "2026-11-09T00:00:00",
    dueAt: "2026-11-15T23:59:00",
    lockAt: "2026-11-15T23:59:00",
    takePath: "/quizzes/take/q4",
  },
  {
    quizId: "q5",
    canvasTitle: "Q5 — REST",
    unlockAt: "2026-11-23T00:00:00",
    dueAt: "2026-11-29T23:59:00",
    lockAt: "2026-11-29T23:59:00",
    takePath: "/quizzes/take/q5",
  },
  {
    quizId: "q6",
    canvasTitle: "Q6 — MongoDB",
    unlockAt: "2026-12-07T00:00:00",
    dueAt: "2026-12-13T23:59:00",
    lockAt: "2026-12-13T23:59:00",
    takePath: "/quizzes/take/q6",
  },
  {
    quizId: "x1",
    canvasTitle: "X1 — Midterm",
    unlockAt: "2026-10-26T00:00:00",
    dueAt: "2026-11-01T23:59:00",
    lockAt: "2026-11-01T23:59:00",
    takePath: "/quizzes/take/x1",
  },
  {
    quizId: "x2",
    canvasTitle: "X2 — Final",
    unlockAt: "2026-11-30T00:00:00",
    dueAt: "2026-12-03T23:59:00",
    lockAt: "2026-12-03T23:59:00",
    takePath: "/quizzes/take/x2",
  },
];

export function getCanvasFallbackQuiz(
  quizId: string,
): CanvasFallbackQuizMeta | undefined {
  return CANVAS_FALLBACK_QUIZZES.find((quiz) => quiz.quizId === quizId);
}

/**
 * Canvas quiz instructions / description. Keep the website URL first; Canvas
 * is only with staff permission.
 */
export function canvasQuizDescriptionHtml(quiz: CanvasFallbackQuizMeta): string {
  const url = canvasQuizTakeUrl(quiz.quizId);
  return [
    `<p>Take ${quiz.canvasTitle} on the course site:</p>`,
    `<p><a href="${url}">${url}</a></p>`,
    `<p>${CANVAS_FALLBACK_PERMISSION_BLURB}</p>`,
  ].join("");
}

export function listCanvasQuizFollowupCopy(): Array<{
  quizId: CanvasFallbackQuizId;
  canvasTitle: string;
  publicUrl: string;
  html: string;
  ident: string;
}> {
  return CANVAS_FALLBACK_QUIZZES.map((quiz) => ({
    quizId: quiz.quizId,
    canvasTitle: quiz.canvasTitle,
    publicUrl: canvasQuizTakeUrl(quiz.quizId),
    html: canvasQuizDescriptionHtml(quiz),
    ident: canvasFallbackIdent(quiz.quizId),
  }));
}

export { COURSE_SITE_ORIGIN };
