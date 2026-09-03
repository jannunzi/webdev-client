import { CHAPTER1_BANK, type QuestionBank } from "../question-bank";

/** Public exam slug → typed question bank. Author review stays on /quizzes/q1. */
export const EXAM_BANKS: Record<string, QuestionBank> = {
  q1: CHAPTER1_BANK,
};

export function getExamBank(quizId: string): QuestionBank | undefined {
  return EXAM_BANKS[quizId];
}

export function listExamBanks(): Array<{ quizId: string; bank: QuestionBank }> {
  return Object.entries(EXAM_BANKS).map(([quizId, bank]) => ({ quizId, bank }));
}
