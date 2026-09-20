import { isFibCombinationCorrect, type BankQuestion } from "../question-bank";
import {
  gradeCodingQuestion,
  type CodingGradeResult,
  type CodingLlmComplete,
} from "./coding-grade";
import { pointsPerDrawnItem, QUIZ_TOTAL_POINTS } from "./draw-counts";
import { revealCorrectAnswer } from "./sanitize";
import type { DrawnQuestion } from "./sample";
import type { GradedAnswer, StudentAnswer } from "./types";

export function isAnswerCorrect(
  question: BankQuestion,
  answer: StudentAnswer | undefined,
): boolean {
  if (!answer || answer.type !== question.type) return false;

  if (question.type === "multiple_choice" && answer.type === "multiple_choice") {
    return answer.choiceId === question.correctChoiceId;
  }
  if (question.type === "true_false" && answer.type === "true_false") {
    return answer.value === question.answer;
  }
  if (question.type === "fill_in_blank" && answer.type === "fill_in_blank") {
    if (answer.blanks.length !== question.blankCount) return false;
    return isFibCombinationCorrect(question.acceptedCombinations, answer.blanks);
  }
  if (question.type === "coding" && answer.type === "coding") {
    return false;
  }
  return false;
}

export async function gradeCodingItems(
  drawn: DrawnQuestion[],
  answers: Record<string, StudentAnswer>,
  deps?: { complete?: CodingLlmComplete },
): Promise<Record<string, CodingGradeResult>> {
  const results: Record<string, CodingGradeResult> = {};
  await Promise.all(
    drawn.map(async ({ question }) => {
      if (question.type !== "coding") return;
      const answer = answers[question.id];
      results[question.id] = await gradeCodingQuestion(
        question,
        answer?.type === "coding"
          ? { code: answer.code, blanks: answer.blanks }
          : undefined,
        deps,
      );
    }),
  );
  return results;
}

export function gradeDrawnQuestions(
  drawn: DrawnQuestion[],
  answers: Record<string, StudentAnswer>,
  codingResults: Record<string, CodingGradeResult> = {},
): GradedAnswer[] {
  const maxPoints = pointsPerDrawnItem(drawn.length || QUIZ_TOTAL_POINTS);
  return drawn.map(({ group, question }) => {
    const response = answers[question.id] ?? null;
    if (question.type === "coding") {
      const result = codingResults[question.id] ?? {
        score: 0,
        feedback: "No code submitted.",
      };
      const points = Math.round(result.score * maxPoints * 100) / 100;
      return {
        questionId: question.id,
        groupId: group.id,
        type: question.type,
        response,
        correct: result.score >= 0.999,
        points,
        maxPoints,
        scoreRatio: result.score,
        feedback: result.feedback,
        gradingError: result.error,
        correctReveal: revealCorrectAnswer(question),
      };
    }
    const correct = isAnswerCorrect(question, response ?? undefined);
    return {
      questionId: question.id,
      groupId: group.id,
      type: question.type,
      response,
      correct,
      points: correct ? maxPoints : 0,
      maxPoints,
      correctReveal: revealCorrectAnswer(question),
    };
  });
}
