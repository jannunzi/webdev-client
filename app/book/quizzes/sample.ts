import type { QuestionKind, QuizQuestion } from "./types";

const DEFAULT_QUOTA: Partial<Record<QuestionKind, number>> = {
  concept: 2,
  syntax: 3,
  acronym: 1,
  snippet: 2,
  blank: 1,
  puzzle: 1,
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function withShuffledChoices(question: QuizQuestion): QuizQuestion {
  if (!question.choices?.length) return question;
  return { ...question, choices: shuffle(question.choices) };
}

/** Draw `count` items, mixing kinds, then shuffle order and choice order. */
export function drawQuestions(
  bank: QuizQuestion[],
  count = 10,
): QuizQuestion[] {
  const byKind = new Map<QuestionKind, QuizQuestion[]>();
  for (const question of bank) {
    const list = byKind.get(question.kind) ?? [];
    list.push(question);
    byKind.set(question.kind, list);
  }

  const used = new Set<string>();
  const picked: QuizQuestion[] = [];

  for (const [kind, quota] of Object.entries(DEFAULT_QUOTA) as [
    QuestionKind,
    number,
  ][]) {
    const pool = shuffle(byKind.get(kind) ?? []);
    for (const question of pool.slice(0, quota)) {
      used.add(question.id);
      picked.push(question);
    }
  }

  if (picked.length < count) {
    const leftover = shuffle(bank.filter((q) => !used.has(q.id)));
    for (const question of leftover) {
      if (picked.length >= count) break;
      picked.push(question);
    }
  }

  return shuffle(picked)
    .slice(0, Math.min(count, bank.length))
    .map(withShuffledChoices);
}

export function normalizeBlank(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/['"]/g, "");
}

export function isBlankCorrect(question: QuizQuestion, value: string): boolean {
  const got = normalizeBlank(value);
  const accepted = [
    question.answer,
    ...(question.accept ?? []),
  ].map(normalizeBlank);
  return accepted.includes(got);
}
