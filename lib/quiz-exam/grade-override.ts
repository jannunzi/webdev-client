import type {
  GradedAnswer,
  QuizClassQuestionOverride,
  QuizQuestionOverride,
  QuizQuestionOverrideKind,
} from "./types";

export const QUIZ_GRADE_OVERRIDES_COLLECTION = "quiz_grade_overrides";

export type OverrideScope = "student" | "all_students";

export type ApplyOverrideInput = {
  kind: QuizQuestionOverrideKind | "clear";
  points?: number;
};

function clampPoints(value: number, maxPoints: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 100) / 100;
  return Math.min(maxPoints, Math.max(0, rounded));
}

function pointsForKind(
  item: GradedAnswer,
  kind: QuizQuestionOverrideKind,
  points?: number,
): number {
  if (kind === "correct") return item.maxPoints;
  if (kind === "wrong") return 0;
  return clampPoints(points ?? item.points, item.maxPoints);
}

function isFullyCorrect(points: number, maxPoints: number): boolean {
  return maxPoints > 0 ? points >= maxPoints - 0.001 : points >= 0;
}

function applyKindToItem(
  item: GradedAnswer,
  kind: QuizQuestionOverrideKind,
  scope: OverrideScope,
  points?: number,
): GradedAnswer {
  const nextPoints = pointsForKind(item, kind, points);
  const correct = isFullyCorrect(nextPoints, item.maxPoints);
  const scoreRatio =
    item.maxPoints > 0 ? Math.round((nextPoints / item.maxPoints) * 1000) / 1000 : 0;
  return {
    ...item,
    autoCorrect: item.autoCorrect ?? item.correct,
    autoPoints: item.autoPoints ?? item.points,
    autoScoreRatio: item.autoScoreRatio ?? item.scoreRatio,
    correct,
    points: nextPoints,
    scoreRatio: item.type === "coding" || item.scoreRatio != null ? scoreRatio : undefined,
    override: { scope, kind, points: kind === "points" ? nextPoints : undefined },
  };
}

export function classOverrideForQuestion(
  classOverrides: readonly QuizClassQuestionOverride[] | null | undefined,
  questionId: string,
): QuizClassQuestionOverride | undefined {
  return classOverrides?.find((item) => item.questionId === questionId);
}

/**
 * Auto-grade first, then class-wide correct/wrong, then per-student
 * (correct / wrong / custom points). Student overrides always win.
 */
export function applyQuestionOverrides(
  graded: readonly GradedAnswer[],
  studentOverrides?: Record<string, QuizQuestionOverride> | null,
  classOverrides?: readonly QuizClassQuestionOverride[] | null,
): GradedAnswer[] {
  return graded.map((item) => {
    const withAuto: GradedAnswer = {
      ...item,
      autoCorrect: item.correct,
      autoPoints: item.points,
      autoScoreRatio: item.scoreRatio,
    };
    const classOverride = classOverrideForQuestion(classOverrides, item.questionId);
    const afterClass = classOverride
      ? applyKindToItem(withAuto, classOverride.kind, "all_students")
      : withAuto;
    const student = studentOverrides?.[item.questionId];
    if (!student) return afterClass;
    return applyKindToItem(afterClass, student.kind, "student", student.points);
  });
}

export function scoreFromGraded(graded: readonly GradedAnswer[]): {
  score: number;
  maxScore: number;
} {
  const score = graded.reduce((sum, item) => sum + item.points, 0);
  const maxScore = graded.reduce((sum, item) => sum + item.maxPoints, 0);
  return {
    score: Math.round(score * 100) / 100,
    maxScore: Math.round(maxScore * 100) / 100,
  };
}

export function parseOverridePoints(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function isOverrideKind(value: string): value is QuizQuestionOverrideKind {
  return value === "correct" || value === "wrong" || value === "points";
}

export function serializeOverride(
  override: QuizQuestionOverride,
): QuizQuestionOverride {
  return {
    kind: override.kind,
    points: override.kind === "points" ? override.points : undefined,
    updatedBy: override.updatedBy,
    updatedAt:
      override.updatedAt instanceof Date
        ? override.updatedAt.toISOString()
        : override.updatedAt,
  };
}

export function nextStudentOverrides(
  current: Record<string, QuizQuestionOverride> | undefined,
  questionId: string,
  kind: QuizQuestionOverrideKind | "clear",
  points: number | undefined,
  updatedBy?: string,
): Record<string, QuizQuestionOverride> {
  const next = { ...(current ?? {}) };
  if (kind === "clear") {
    delete next[questionId];
    return next;
  }
  next[questionId] = {
    kind,
    points: kind === "points" ? points : undefined,
    updatedBy,
    updatedAt: new Date(),
  };
  return next;
}

export function serializeClassOverride(
  override: QuizClassQuestionOverride,
): QuizClassQuestionOverride {
  return {
    ...override,
    updatedAt:
      override.updatedAt instanceof Date
        ? override.updatedAt.toISOString()
        : override.updatedAt,
  };
}
