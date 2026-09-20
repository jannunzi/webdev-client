import {
  CHAPTER1_BANK,
  getWebsiteCodingBank,
  isWebsiteCodingQuizId,
} from "../question-bank";
import { getExamBank } from "./banks";
import { practiceChapterBank } from "./canvas-fallback-banks";
import {
  WEBSITE_CODING_DRAW_COUNT,
  WEBSITE_TRADITIONAL_DRAW_COUNT,
  quizDrawCount,
} from "./draw-counts";
import {
  drawExamAttempt,
  drawOnePerGroup,
  findBankQuestion,
  type DrawnQuestion,
} from "./sample";
import type { QuestionBank } from "../question-bank";

const PRACTICE_CHAPTER: Record<string, number> = {
  q2: 2,
  q3: 3,
  q4: 4,
  q5: 5,
  q6: 6,
};

export function getWebsiteTraditionalBank(quizId: string): QuestionBank | undefined {
  if (quizId === "q1") return CHAPTER1_BANK;
  const chapter = PRACTICE_CHAPTER[quizId];
  if (!chapter || !isWebsiteCodingQuizId(quizId)) return undefined;
  return practiceChapterBank(chapter, quizId);
}

/**
 * Website Q1–Q6: 8 traditional groups plus 2 coding items (one FIB-style,
 * one implement-style). X1/X2 still draw one item from each Canvas-sized
 * exam-bank group.
 */
export function drawWebsiteAttempt(quizId: string, seed: string): DrawnQuestion[] {
  if (isWebsiteCodingQuizId(quizId)) {
    return drawWebsiteCodingQuiz(quizId, seed);
  }
  const bank = getExamBank(quizId);
  if (!bank) return [];
  return drawOnePerGroup(bank, seed);
}

export function drawWebsiteCodingQuiz(quizId: string, seed: string): DrawnQuestion[] {
  const traditionalBank = getWebsiteTraditionalBank(quizId);
  const codingBank = getWebsiteCodingBank(quizId);
  if (!traditionalBank || !codingBank) return [];
  const traditional = drawExamAttempt(
    traditionalBank,
    seed,
    WEBSITE_TRADITIONAL_DRAW_COUNT,
  );
  const coding = drawOnePerGroup(codingBank, `${seed}:coding`);
  return [...traditional, ...coding].map((item, index) => ({
    group: { ...item.group, order: index + 1 },
    question: item.question,
  }));
}

export function findQuizQuestion(
  quizId: string,
  questionId: string,
): DrawnQuestion | undefined {
  const traditional = getWebsiteTraditionalBank(quizId);
  const coding = getWebsiteCodingBank(quizId);
  if (traditional || coding) {
    return (
      (traditional && findBankQuestion(traditional, questionId)) ??
      (coding && findBankQuestion(coding, questionId))
    );
  }
  const bank = getExamBank(quizId);
  if (!bank) return undefined;
  return findBankQuestion(bank, questionId);
}

/** Null when the submitted draw is valid for this quiz. */
export function invalidWebsiteDrawReason(
  quizId: string,
  drawn: DrawnQuestion[],
): string | null {
  const expectedCount = quizDrawCount(quizId);
  if (!expectedCount) return "Unknown exam.";
  if (drawn.length !== expectedCount) {
    return "The submitted draw does not match the expected question count.";
  }
  const seenQuestions = new Set(drawn.map((item) => item.question.id));
  if (seenQuestions.size !== drawn.length) {
    return "The submitted draw contains duplicate questions.";
  }

  if (isWebsiteCodingQuizId(quizId)) {
    const traditional = drawn.filter((item) => item.question.type !== "coding");
    const coding = drawn.filter((item) => item.question.type === "coding");
    if (
      traditional.length !== WEBSITE_TRADITIONAL_DRAW_COUNT ||
      coding.length !== WEBSITE_CODING_DRAW_COUNT
    ) {
      return `${quizId.toUpperCase()} must include 8 traditional items and 2 coding items.`;
    }
    const traditionalGroups = new Set(traditional.map((item) => item.group.id));
    const codingGroups = new Set(coding.map((item) => item.group.id));
    if (traditionalGroups.size !== WEBSITE_TRADITIONAL_DRAW_COUNT) {
      return "Traditional items must come from distinct topic groups.";
    }
    if (codingGroups.size !== WEBSITE_CODING_DRAW_COUNT) {
      return "Coding items must come from two different topic pools.";
    }
    const styles = new Set(
      coding
        .map((item) => (item.question.type === "coding" ? item.question.style : ""))
        .filter(Boolean),
    );
    if (!styles.has("fib") || !styles.has("implement")) {
      return "Coding items must include one form/FIB-style item and one implement-style item.";
    }
    const knownTraditional = new Set(
      (getWebsiteTraditionalBank(quizId)?.groups ?? []).map((group) => group.id),
    );
    const knownCoding = new Set(
      (getWebsiteCodingBank(quizId)?.groups ?? []).map((group) => group.id),
    );
    if ([...traditionalGroups].some((id) => !knownTraditional.has(id))) {
      return "A traditional item is not part of this quiz bank.";
    }
    if ([...codingGroups].some((id) => !knownCoding.has(id))) {
      return "A coding item is not part of this quiz coding pool.";
    }
    return null;
  }

  const bank = getExamBank(quizId);
  if (!bank) return "Unknown exam.";
  const expectedGroupIds = new Set(bank.groups.map((group) => group.id));
  const seenGroups = new Set(drawn.map((item) => item.group.id));
  if (seenGroups.size !== expectedCount || seenGroups.size !== expectedGroupIds.size) {
    return "The submitted draw does not include one question per group.";
  }
  return null;
}
