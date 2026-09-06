/**
 * Shared graded-quiz length + timer. Website take and Canvas fallback
 * builders both read these so group counts cannot drift.
 *
 * Q1–Q6: 10 topic groups × 1 question, 10 points each, ~30 minutes.
 * X1/X2: 36 groups (12 from each of three source chapters), 100 / 36
 * points each, ~90 minutes.
 */
export const GRADED_QUIZ_IDS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "x1",
  "x2",
] as const;

export type GradedQuizId = (typeof GRADED_QUIZ_IDS)[number];

export const QUIZ_TOTAL_POINTS = 100;

export const QUIZ_DRAW_COUNTS = {
  q1: 10,
  q2: 10,
  q3: 10,
  q4: 10,
  q5: 10,
  q6: 10,
  x1: 36,
  x2: 36,
} as const satisfies Record<GradedQuizId, number>;

export const QUIZ_TIME_LIMIT_MINUTES = {
  q1: 30,
  q2: 30,
  q3: 30,
  q4: 30,
  q5: 30,
  q6: 30,
  x1: 90,
  x2: 90,
} as const satisfies Record<GradedQuizId, number>;

/** Groups taken from each source chapter when assembling X1 (Q1–Q3) and X2 (Q4–Q6). */
export const EXAM_SOURCE_GROUP_TAKE = 12;

export function isGradedQuizId(quizId: string): quizId is GradedQuizId {
  return (GRADED_QUIZ_IDS as readonly string[]).includes(quizId);
}

export function quizDrawCount(quizId: string): number | undefined {
  return isGradedQuizId(quizId) ? QUIZ_DRAW_COUNTS[quizId] : undefined;
}

export function quizTimeLimitMinutes(quizId: string): number | undefined {
  return isGradedQuizId(quizId) ? QUIZ_TIME_LIMIT_MINUTES[quizId] : undefined;
}

export function pointsPerDrawnItem(groupCount: number): number {
  if (groupCount <= 0) return 0;
  return QUIZ_TOTAL_POINTS / groupCount;
}
