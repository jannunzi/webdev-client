import type { QuestionBank } from "../question-bank";
import { buildCanvasFallbackBanks } from "./canvas-fallback-banks";

/**
 * Public exam slug → sized question bank (same groups the Canvas
 * fallback exporter emits). Author review of the full Q1 variant bank
 * stays on /quizzes/q1 (staff).
 */
export const EXAM_BANKS: Record<string, QuestionBank> = buildCanvasFallbackBanks();

export function getExamBank(quizId: string): QuestionBank | undefined {
  return EXAM_BANKS[quizId];
}

export function listExamBanks(): Array<{ quizId: string; bank: QuestionBank }> {
  return Object.entries(EXAM_BANKS).map(([quizId, bank]) => ({ quizId, bank }));
}
