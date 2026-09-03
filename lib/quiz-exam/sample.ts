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
