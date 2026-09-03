import { isFibCombinationCorrect, type BankQuestion } from "../question-bank";
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
  return false;
}

export function gradeDrawnQuestions(
  drawn: DrawnQuestion[],
  answers: Record<string, StudentAnswer>,
): GradedAnswer[] {
  return drawn.map(({ group, question }) => {
    const response = answers[question.id] ?? null;
    const correct = isAnswerCorrect(question, response ?? undefined);
    return {
      questionId: question.id,
      groupId: group.id,
      type: question.type,
      response,
      correct,
      points: correct ? 1 : 0,
      maxPoints: 1,
      correctReveal: revealCorrectAnswer(question),
    };
  });
}
