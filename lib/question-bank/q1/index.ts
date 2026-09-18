import type { QuestionBank } from "../types";
import { CHAPTER1_CODING_GROUPS } from "./coding";
import { q1Group01, q1Group02, q1Group03, q1Group04 } from "./groups-01-04";
import { q1Group05, q1Group06, q1Group07, q1Group08 } from "./groups-05-08";
import { q1Group09, q1Group10, q1Group11, q1Group12 } from "./groups-09-12";
import { q1Group13, q1Group14, q1Group15, q1Group16 } from "./groups-13-16";

export const CHAPTER1_BANK: QuestionBank = {
  id: "q1-html",
  title: "Q1 — HTML",
  chapter: 1,
  status: "review_draft",
  groups: [
    q1Group01,
    q1Group02,
    q1Group03,
    q1Group04,
    q1Group05,
    q1Group06,
    q1Group07,
    q1Group08,
    q1Group09,
    q1Group10,
    q1Group11,
    q1Group12,
    q1Group13,
    q1Group14,
    q1Group15,
    q1Group16,
  ],
};

/** Author-review surface: traditional 16 groups plus coding topic pools. */
export const CHAPTER1_REVIEW_BANK: QuestionBank = {
  ...CHAPTER1_BANK,
  groups: [
    ...CHAPTER1_BANK.groups,
    ...CHAPTER1_CODING_GROUPS.map((group, index) => ({
      ...group,
      order: CHAPTER1_BANK.groups.length + index + 1,
    })),
  ],
};
