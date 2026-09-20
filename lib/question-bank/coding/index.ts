import type { QuestionBank } from "../types";
import { Q1_CODING_BANK, Q1_CODING_GROUPS } from "./q1";
import { Q2_CODING_BANK } from "./q2";
import { Q3_CODING_BANK } from "./q3";
import { Q4_CODING_BANK } from "./q4";
import { Q5_CODING_BANK } from "./q5";
import { Q6_CODING_BANK } from "./q6";

export const WEBSITE_CODING_QUIZ_IDS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;
export type WebsiteCodingQuizId = (typeof WEBSITE_CODING_QUIZ_IDS)[number];

export const WEBSITE_CODING_BANKS: Record<WebsiteCodingQuizId, QuestionBank> = {
  q1: Q1_CODING_BANK,
  q2: Q2_CODING_BANK,
  q3: Q3_CODING_BANK,
  q4: Q4_CODING_BANK,
  q5: Q5_CODING_BANK,
  q6: Q6_CODING_BANK,
};

export function isWebsiteCodingQuizId(quizId: string): quizId is WebsiteCodingQuizId {
  return (WEBSITE_CODING_QUIZ_IDS as readonly string[]).includes(quizId);
}

export function getWebsiteCodingBank(quizId: string): QuestionBank | undefined {
  return isWebsiteCodingQuizId(quizId) ? WEBSITE_CODING_BANKS[quizId] : undefined;
}

export function listWebsiteCodingBanks(): Array<{
  quizId: WebsiteCodingQuizId;
  bank: QuestionBank;
}> {
  return WEBSITE_CODING_QUIZ_IDS.map((quizId) => ({
    quizId,
    bank: WEBSITE_CODING_BANKS[quizId],
  }));
}

export { Q1_CODING_BANK, Q1_CODING_GROUPS };
