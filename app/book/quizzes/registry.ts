import type { QuizQuestion } from "./types";
import { CH1_LAB_QUESTIONS } from "./ch1-lab";
import { CH2_SECTION_21_QUESTIONS } from "./ch2-2-1";
import { CH3_LAB_QUESTIONS } from "./ch3-lab";
import { CH4_LAB_QUESTIONS } from "./ch4-lab";
import { CH5_LAB_QUESTIONS } from "./ch5-lab";
import { CH6_LAB_QUESTIONS } from "./ch6-lab";

export type PracticeQuiz = {
  quizId: string;
  title: string;
  chapterId: string;
  chapterLabel: string;
  chapterHref: string;
  sectionId: string;
  sectionLabel: string;
  bank: QuizQuestion[];
  count: number;
};

export const PRACTICE_QUIZZES: PracticeQuiz[] = [
  {
    quizId: "1.lab",
    title: "Chapter 1 lab — HTML",
    chapterId: "ch1",
    chapterLabel: "Chapter 1 — HTML",
    chapterHref: "/book/ch1",
    sectionId: "sec-1-3-13",
    sectionLabel: "1.3.13 Check Your Understanding",
    bank: CH1_LAB_QUESTIONS,
    count: 10,
  },
  {
    quizId: "2.1",
    title: "§2.1 — CSS",
    chapterId: "ch2",
    chapterLabel: "Chapter 2 — CSS & Tailwind",
    chapterHref: "/book/ch2",
    sectionId: "sec-2-1-21",
    sectionLabel: "2.1.21 Check Your Understanding",
    bank: CH2_SECTION_21_QUESTIONS,
    count: 10,
  },
  {
    quizId: "3.lab",
    title: "Chapter 3 lab — JavaScript",
    chapterId: "ch3",
    chapterLabel: "Chapter 3 — JavaScript",
    chapterHref: "/book/ch3",
    sectionId: "sec-3-8",
    sectionLabel: "3.8 Check Your Understanding",
    bank: CH3_LAB_QUESTIONS,
    count: 10,
  },
  {
    quizId: "4.lab",
    title: "Chapter 4 lab — Client state",
    chapterId: "ch4",
    chapterLabel: "Chapter 4 — Client State",
    chapterHref: "/book/ch4",
    sectionId: "sec-4-9",
    sectionLabel: "4.9 Check Your Understanding",
    bank: CH4_LAB_QUESTIONS,
    count: 10,
  },
  {
    quizId: "5.lab",
    title: "Chapter 5 lab — Express REST APIs",
    chapterId: "ch5",
    chapterLabel: "Chapter 5 — Express REST APIs",
    chapterHref: "/book/ch5",
    sectionId: "sec-5-check",
    sectionLabel: "Check Your Understanding",
    bank: CH5_LAB_QUESTIONS,
    count: 10,
  },
  {
    quizId: "6.lab",
    title: "Chapter 6 lab — MongoDB",
    chapterId: "ch6",
    chapterLabel: "Chapter 6 — MongoDB",
    chapterHref: "/book/ch6",
    sectionId: "sec-6-check",
    sectionLabel: "Check Your Understanding",
    bank: CH6_LAB_QUESTIONS,
    count: 10,
  },
];

const BY_ID = new Map(PRACTICE_QUIZZES.map((quiz) => [quiz.quizId, quiz]));

export function getPracticeQuiz(quizId: string): PracticeQuiz | undefined {
  return BY_ID.get(decodeURIComponent(quizId));
}

export function practicePath(quizId: string): string {
  return `/book/practice/${encodeURIComponent(quizId)}`;
}

export function chapterSectionHref(quiz: PracticeQuiz): string {
  return `${quiz.chapterHref}#${quiz.sectionId}`;
}
