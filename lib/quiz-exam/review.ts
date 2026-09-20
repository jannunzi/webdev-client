import type { CodingGradeResult } from "./coding-grade";
import { applyQuestionOverrides, scoreFromGraded } from "./grade-override";
import { gradeDrawnQuestions } from "./grade";
import { stripCorrectReveals, toStudentQuestion } from "./sanitize";
import { findQuizQuestion } from "./website-draw";
import type {
  GradedAnswer,
  QuizAttemptDoc,
  QuizClassQuestionOverride,
  StudentAnswer,
  StudentQuestion,
} from "./types";

export type AttemptReview = {
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  score: number;
  maxScore: number;
  submittedAt: Date;
};

function asStudentAnswer(value: unknown): StudentAnswer | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as { type?: string };
  if (record.type === "multiple_choice" && "choiceId" in record) {
    return {
      type: "multiple_choice",
      choiceId: String((record as { choiceId: unknown }).choiceId),
    };
  }
  if (record.type === "true_false" && "value" in record) {
    return {
      type: "true_false",
      value: Boolean((record as { value: unknown }).value),
    };
  }
  if (record.type === "fill_in_blank" && "blanks" in record) {
    const blanks = (record as { blanks: unknown }).blanks;
    if (!Array.isArray(blanks)) return undefined;
    return { type: "fill_in_blank", blanks: blanks.map((blank) => String(blank)) };
  }
  if (record.type === "coding" && "code" in record) {
    const blanks = (record as { blanks?: unknown }).blanks;
    return {
      type: "coding",
      code: String((record as { code: unknown }).code),
      blanks: Array.isArray(blanks) ? blanks.map((blank) => String(blank)) : undefined,
    };
  }
  return undefined;
}

function codingResultFromAttempt(
  item: QuizAttemptDoc["answers"][number],
): CodingGradeResult | undefined {
  if (item.type !== "coding") return undefined;
  return {
    score:
      typeof item.scoreRatio === "number" ? item.scoreRatio : item.correct ? 1 : 0,
    feedback: item.feedback ?? "",
    error: item.gradingError,
  };
}

/**
 * Rebuild the drawn attempt from the bank. Correct answers are attached
 * only when `revealAnswers` is true — never trust the client for that flag.
 */
export function buildAttemptReview(
  attempt: QuizAttemptDoc,
  revealAnswers: boolean,
  classOverrides: readonly QuizClassQuestionOverride[] = [],
): AttemptReview | null {
  const drawn = [];
  for (const questionId of attempt.meta.drawnQuestionIds) {
    const found = findQuizQuestion(attempt.quizId, questionId);
    if (!found) return null;
    drawn.push(found);
  }

  const answers: Record<string, StudentAnswer> = {};
  const codingResults: Record<string, CodingGradeResult> = {};
  for (const item of attempt.answers) {
    const response = asStudentAnswer(item.response);
    if (response) answers[item.questionId] = response;
    const coding = codingResultFromAttempt(item);
    if (coding) codingResults[item.questionId] = coding;
  }

  const auto = gradeDrawnQuestions(drawn, answers, codingResults);
  const graded = applyQuestionOverrides(auto, attempt.overrides, classOverrides);
  const totals = scoreFromGraded(graded);
  return {
    questions: drawn.map(toStudentQuestion),
    graded: revealAnswers ? graded : stripCorrectReveals(graded),
    score: totals.score,
    maxScore: totals.maxScore || attempt.maxScore,
    submittedAt: attempt.submittedAt,
  };
}

export function formatStudentResponse(
  question: StudentQuestion,
  response: StudentAnswer | null | undefined,
): string {
  if (!response) return "No answer";
  if (response.type === "multiple_choice") {
    const choice = question.choices?.find((item) => item.id === response.choiceId);
    return choice ? `${choice.id}. ${choice.text}` : response.choiceId;
  }
  if (response.type === "true_false") {
    return response.value ? "True" : "False";
  }
  if (response.type === "coding") {
    if (response.blanks?.some((blank) => blank.trim())) {
      return response.blanks.map((blank) => (blank === "" ? "(blank)" : blank)).join(" · ");
    }
    return response.code.trim() ? response.code : "No answer";
  }
  return response.blanks.map((blank) => (blank === "" ? "(blank)" : blank)).join(" · ");
}
