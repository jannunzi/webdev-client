import { getExamBank } from "./banks";
import { gradeDrawnQuestions } from "./grade";
import { findBankQuestion } from "./sample";
import { stripCorrectReveals, toStudentQuestion } from "./sanitize";
import type {
  GradedAnswer,
  QuizAttemptDoc,
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
  return undefined;
}

/**
 * Rebuild the drawn attempt from the bank. Correct answers are attached
 * only when `revealAnswers` is true — never trust the client for that flag.
 */
export function buildAttemptReview(
  attempt: QuizAttemptDoc,
  revealAnswers: boolean,
): AttemptReview | null {
  const bank = getExamBank(attempt.quizId);
  if (!bank) return null;

  const drawn = [];
  for (const questionId of attempt.meta.drawnQuestionIds) {
    const found = findBankQuestion(bank, questionId);
    if (!found) return null;
    drawn.push(found);
  }

  const answers: Record<string, StudentAnswer> = {};
  for (const item of attempt.answers) {
    const response = asStudentAnswer(item.response);
    if (response) answers[item.questionId] = response;
  }

  const graded = gradeDrawnQuestions(drawn, answers);
  return {
    questions: drawn.map(toStudentQuestion),
    graded: revealAnswers ? graded : stripCorrectReveals(graded),
    score: attempt.score,
    maxScore: attempt.maxScore,
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
  return response.blanks.map((blank) => (blank === "" ? "(blank)" : blank)).join(" · ");
}
