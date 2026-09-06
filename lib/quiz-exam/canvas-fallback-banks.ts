/**
 * Assemble Canvas fallback banks.
 *
 * Q1 uses the graded website bank (sampled to `QUIZ_DRAW_COUNTS.q1`
 * groups). Q2–Q6 map practice chapter banks (ch2 CSS … ch6 Mongo) into
 * topic groups until graded banks exist, then sample the same count.
 * X1/X2 take `EXAM_SOURCE_GROUP_TAKE` groups from each of three source
 * chapters (36 total).
 */

import { PRACTICE_QUIZZES, type PracticeQuiz } from "@/app/book/quizzes/registry";
import type { QuizQuestion } from "@/app/book/quizzes/types";
import { CHAPTER1_BANK } from "../question-bank/q1";
import type {
  BankQuestion,
  QuestionBank,
  QuestionGroup,
  QuestionType,
} from "../question-bank/types";
import type { CanvasFallbackQuizId } from "./canvas-copy";
import {
  EXAM_SOURCE_GROUP_TAKE,
  QUIZ_DRAW_COUNTS,
} from "./draw-counts";
import { sampleGroups, sizeBankToDrawCount } from "./sample";

export { sampleGroups } from "./sample";

const PRACTICE_BY_CHAPTER: Record<number, string> = {
  2: "2.1",
  3: "3.lab",
  4: "4.lab",
  5: "5.lab",
  6: "6.lab",
};

export const CANVAS_FALLBACK_BANK_TITLES: Record<CanvasFallbackQuizId, string> = {
  q1: "Q1 — HTML",
  q2: "Q2 — CSS",
  q3: "Q3 — JavaScript",
  q4: "Q4 — Client state",
  q5: "Q5 — REST",
  q6: "Q6 — MongoDB",
  x1: "X1 — Midterm",
  x2: "X2 — Final",
};

function practiceQuiz(chapter: number): PracticeQuiz {
  const quizId = PRACTICE_BY_CHAPTER[chapter];
  const quiz = PRACTICE_QUIZZES.find((item) => item.quizId === quizId);
  if (!quiz) {
    throw new Error(`Missing practice quiz for chapter ${chapter}`);
  }
  return quiz;
}

function kebabSection(section: string): string {
  return section.replaceAll(".", "-");
}

export function practiceQuestionToBank(question: QuizQuestion): BankQuestion | null {
  if (question.choices && question.choices.length >= 2) {
    const correct = question.choices.find((choice) => choice.id === question.answer);
    if (!correct) return null;
    return {
      id: question.id,
      type: "multiple_choice",
      prompt: question.prompt,
      code: question.code,
      explanation: question.explanation,
      choices: question.choices,
      correctChoiceId: question.answer,
    };
  }
  const accepted = [question.answer, ...(question.accept ?? [])].filter(
    (value) => value.trim().length > 0,
  );
  if (accepted.length === 0) return null;
  return {
    id: question.id,
    type: "fill_in_blank",
    prompt: question.prompt,
    code: question.code,
    explanation: question.explanation,
    blankCount: 1,
    acceptedCombinations: accepted.map((value) => [value]),
  };
}

function majorityType(questions: BankQuestion[]): QuestionType {
  const counts: Record<QuestionType, number> = {
    multiple_choice: 0,
    true_false: 0,
    fill_in_blank: 0,
  };
  for (const question of questions) {
    counts[question.type] += 1;
  }
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "multiple_choice") as QuestionType;
}

export function practiceToQuestionGroups(
  questions: QuizQuestion[],
  options: { idPrefix: string; chapter: number },
): QuestionGroup[] {
  const bySection = new Map<string, QuizQuestion[]>();
  for (const question of questions) {
    const list = bySection.get(question.section) ?? [];
    list.push(question);
    bySection.set(question.section, list);
  }
  const groups: QuestionGroup[] = [];
  let order = 1;
  for (const [section, items] of bySection) {
    const converted = items
      .map(practiceQuestionToBank)
      .filter((item): item is BankQuestion => item !== null);
    if (converted.length === 0) continue;
    groups.push({
      id: `${options.idPrefix}-sec-${kebabSection(section)}`,
      order: order++,
      name: `Section ${section}`,
      type: majorityType(converted),
      chapter: options.chapter,
      section,
      skill: `Practice items from section ${section}.`,
      questions: converted,
    });
  }
  return groups;
}

export function practiceChapterBank(chapter: number, quizId: CanvasFallbackQuizId): QuestionBank {
  const practice = practiceQuiz(chapter);
  return {
    id: `${quizId}-practice`,
    title: CANVAS_FALLBACK_BANK_TITLES[quizId],
    chapter,
    status: "review_draft",
    groups: practiceToQuestionGroups(practice.bank, {
      idPrefix: quizId,
      chapter,
    }),
  };
}

function relabelSampledGroups(
  groups: QuestionGroup[],
  prefix: string,
  chapterLabel: string,
): QuestionGroup[] {
  return groups.map((group, index) => ({
    ...group,
    id: `${prefix}-${group.id}`,
    order: index + 1,
    name: `${chapterLabel} · ${group.name}`,
  }));
}

export function buildExamFallbackBank(
  quizId: "x1" | "x2",
  sources: Array<{ bank: QuestionBank; take: number; label: string }>,
): QuestionBank {
  const groups: QuestionGroup[] = [];
  for (const source of sources) {
    groups.push(
      ...relabelSampledGroups(
        sampleGroups(source.bank.groups, source.take),
        quizId,
        source.label,
      ),
    );
  }
  return {
    id: `${quizId}-fallback`,
    title: CANVAS_FALLBACK_BANK_TITLES[quizId],
    chapter: quizId === "x1" ? 3 : 6,
    status: "review_draft",
    groups: groups.map((group, index) => ({ ...group, order: index + 1 })),
  };
}

export function buildCanvasFallbackBanks(): Record<CanvasFallbackQuizId, QuestionBank> {
  const q1Source = {
    ...CHAPTER1_BANK,
    title: CANVAS_FALLBACK_BANK_TITLES.q1,
  };
  const q2Source = practiceChapterBank(2, "q2");
  const q3Source = practiceChapterBank(3, "q3");
  const q4Source = practiceChapterBank(4, "q4");
  const q5Source = practiceChapterBank(5, "q5");
  const q6Source = practiceChapterBank(6, "q6");
  const q1 = sizeBankToDrawCount(q1Source, QUIZ_DRAW_COUNTS.q1);
  const q2 = sizeBankToDrawCount(q2Source, QUIZ_DRAW_COUNTS.q2);
  const q3 = sizeBankToDrawCount(q3Source, QUIZ_DRAW_COUNTS.q3);
  const q4 = sizeBankToDrawCount(q4Source, QUIZ_DRAW_COUNTS.q4);
  const q5 = sizeBankToDrawCount(q5Source, QUIZ_DRAW_COUNTS.q5);
  const q6 = sizeBankToDrawCount(q6Source, QUIZ_DRAW_COUNTS.q6);
  const x1 = sizeBankToDrawCount(
    buildExamFallbackBank("x1", [
      { bank: q1Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q1" },
      { bank: q2Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q2" },
      { bank: q3Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q3" },
    ]),
    QUIZ_DRAW_COUNTS.x1,
  );
  const x2 = sizeBankToDrawCount(
    buildExamFallbackBank("x2", [
      { bank: q4Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q4" },
      { bank: q5Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q5" },
      { bank: q6Source, take: EXAM_SOURCE_GROUP_TAKE, label: "Q6" },
    ]),
    QUIZ_DRAW_COUNTS.x2,
  );
  return { q1, q2, q3, q4, q5, q6, x1, x2 };
}
