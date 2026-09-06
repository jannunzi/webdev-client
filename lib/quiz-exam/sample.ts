import type { BankQuestion, QuestionBank, QuestionGroup } from "../question-bank";

export type DrawnQuestion = {
  group: QuestionGroup;
  question: BankQuestion;
};

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic 0..1 PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Evenly spaced unique groups so a draw covers the bank without taking
 * every topic. Used by website take (via a pre-sized bank) and Canvas
 * fallback export. Does not delete variants — only selects groups.
 */
export function sampleGroups(groups: QuestionGroup[], count: number): QuestionGroup[] {
  if (count <= 0 || groups.length === 0) return [];
  if (groups.length <= count) return groups;
  const indexes = new Set<number>();
  for (let index = 0; index < count; index += 1) {
    indexes.add(Math.round((index * (groups.length - 1)) / (count - 1)));
  }
  for (let index = 0; indexes.size < count && index < groups.length; index += 1) {
    indexes.add(index);
  }
  return [...indexes]
    .sort((a, b) => a - b)
    .slice(0, count)
    .map((index) => groups[index]);
}

/** Cap a full topic bank to `groupCount` groups. Throws if the bank is too small. */
export function sizeBankToDrawCount(
  bank: QuestionBank,
  groupCount: number,
): QuestionBank {
  if (groupCount <= 0) {
    throw new Error(`Draw count must be positive, got ${groupCount}`);
  }
  const groups = sampleGroups(bank.groups, groupCount);
  if (groups.length !== groupCount) {
    throw new Error(
      `Bank ${bank.id} has ${bank.groups.length} groups; need ${groupCount} for a graded draw.`,
    );
  }
  return {
    ...bank,
    groups: groups.map((group, index) => ({ ...group, order: index + 1 })),
  };
}

/**
 * Sample `groupCount` topics (default: every group), then draw one
 * question per selected group. Seed is typically
 * `${clerkUserId}:${bank.id}` so a refresh keeps the same exam.
 */
export function drawExamAttempt(
  bank: QuestionBank,
  seed: string,
  groupCount: number = bank.groups.length,
): DrawnQuestion[] {
  return drawOnePerGroup(sizeBankToDrawCount(bank, groupCount), seed);
}

/**
 * Draw one question from each group. Seed is typically
 * `${clerkUserId}:${bank.id}` so a refresh keeps the same exam.
 */
export function drawOnePerGroup(bank: QuestionBank, seed: string): DrawnQuestion[] {
  return bank.groups.map((group) => {
    const random = mulberry32(hashSeed(`${seed}:${group.id}`));
    const index = Math.floor(random() * group.questions.length);
    const question = group.questions[index] ?? group.questions[0];
    return { group, question };
  });
}

export function findBankQuestion(
  bank: QuestionBank,
  questionId: string,
): DrawnQuestion | undefined {
  for (const group of bank.groups) {
    const question = group.questions.find((item) => item.id === questionId);
    if (question) return { group, question };
  }
  return undefined;
}
