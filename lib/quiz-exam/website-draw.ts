import {
  CHAPTER1_BANK,
  CHAPTER1_CODING_BANK,
  CHAPTER1_CODING_GROUPS,
} from "../question-bank";
import { getExamBank } from "./banks";
import {
  Q1_CODING_DRAW_COUNT,
  Q1_TRADITIONAL_DRAW_COUNT,
  quizDrawCount,
} from "./draw-counts";
import {
  drawExamAttempt,
  drawOneFromGroup,
  drawOnePerGroup,
  findBankQuestion,
  pickDistinctGroups,
  type DrawnQuestion,
} from "./sample";

/**
 * Website Q1: 8 traditional groups (even spread of the 16-topic bank)
 * plus 2 coding items from different topic pools. Other quizzes still
 * draw one item from each Canvas-sized exam-bank group.
 */
export function drawWebsiteAttempt(quizId: string, seed: string): DrawnQuestion[] {
  if (quizId === "q1") {
    return drawQ1WebsiteAttempt(seed);
  }
  const bank = getExamBank(quizId);
  if (!bank) return [];
  return drawOnePerGroup(bank, seed);
}

export function drawQ1WebsiteAttempt(seed: string): DrawnQuestion[] {
  const traditional = drawExamAttempt(
    CHAPTER1_BANK,
    seed,
    Q1_TRADITIONAL_DRAW_COUNT,
  );
  const codingGroups = pickDistinctGroups(
    CHAPTER1_CODING_GROUPS,
    Q1_CODING_DRAW_COUNT,
    `${seed}:coding-groups`,
  );
  const coding = codingGroups.map((group) => drawOneFromGroup(group, seed));
  return [...traditional, ...coding].map((item, index) => ({
    group: { ...item.group, order: index + 1 },
    question: item.question,
  }));
}

export function findQuizQuestion(
  quizId: string,
  questionId: string,
): DrawnQuestion | undefined {
  if (quizId === "q1") {
    return (
      findBankQuestion(CHAPTER1_BANK, questionId) ??
      findBankQuestion(CHAPTER1_CODING_BANK, questionId)
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
  if (!expectedCount) {
    return "Unknown exam.";
  }
  if (drawn.length !== expectedCount) {
    return "The submitted draw does not match the expected question count.";
  }
  const seenQuestions = new Set(drawn.map((item) => item.question.id));
  if (seenQuestions.size !== drawn.length) {
    return "The submitted draw contains duplicate questions.";
  }

  if (quizId === "q1") {
    const traditional = drawn.filter((item) => item.question.type !== "coding");
    const coding = drawn.filter((item) => item.question.type === "coding");
    if (
      traditional.length !== Q1_TRADITIONAL_DRAW_COUNT ||
      coding.length !== Q1_CODING_DRAW_COUNT
    ) {
      return "Q1 must include 8 traditional items and 2 coding items.";
    }
    const traditionalGroups = new Set(traditional.map((item) => item.group.id));
    const codingGroups = new Set(coding.map((item) => item.group.id));
    if (traditionalGroups.size !== Q1_TRADITIONAL_DRAW_COUNT) {
      return "Q1 traditional items must come from distinct topic groups.";
    }
    if (codingGroups.size !== Q1_CODING_DRAW_COUNT) {
      return "Q1 coding items must come from two different topic pools.";
    }
    const knownTraditional = new Set(CHAPTER1_BANK.groups.map((group) => group.id));
    const knownCoding = new Set(CHAPTER1_CODING_GROUPS.map((group) => group.id));
    if ([...traditionalGroups].some((id) => !knownTraditional.has(id))) {
      return "A traditional Q1 item is not part of the Chapter 1 bank.";
    }
    if ([...codingGroups].some((id) => !knownCoding.has(id))) {
      return "A coding Q1 item is not part of the HTML coding pool.";
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
