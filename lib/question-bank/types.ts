/**
 * Canvas-oriented question bank.
 *
 * This is the structured source of truth for author review and, later,
 * QTI export and an authenticated student quiz. It is intentionally
 * separate from `app/book/quizzes/types.ts` (`QuizQuestion`), which
 * remains the self-check draw format (pedagogical kinds, localStorage).
 * Do not fork a third representation — map to/from these types.
 */

export const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "coding",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type BankStatus = "review_draft" | "approved" | "exported";

export type Choice = {
  /** Stable id for QTI / later student mode (not shuffled here). */
  id: string;
  text: string;
};

type BaseQuestion = {
  id: string;
  prompt: string;
  /** Optional snippet shown with the prompt; always treated as text. */
  code?: string;
  /** Author-facing note; useful later as student feedback. */
  explanation?: string;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  choices: Choice[];
  correctChoiceId: string;
};

export type TrueFalseQuestion = BaseQuestion & {
  type: "true_false";
  answer: boolean;
};

/**
 * Fill-in-the-blank with one or more blanks.
 *
 * Acronym items use one blank per letter and list the word for each
 * letter in order (plus normalized case). Alternate spellings are
 * extra combinations of the same length. Independent per-blank accept
 * lists can be encoded as the cartesian product, or as one combination
 * per accepted tuple.
 */
export type FillInBlankQuestion = BaseQuestion & {
  type: "fill_in_blank";
  blankCount: number;
  acceptedCombinations: string[][];
};

/**
 * Short HTML (or similar) snippet graded by a server-side model.
 * `referenceSolution` and `rubric` are author/server only — never send
 * them to the student take payload.
 */
export type CodingQuestion = BaseQuestion & {
  type: "coding";
  language: "html";
  referenceSolution: string;
  rubric: string;
  /** Optional textarea hint; safe to show students. */
  placeholder?: string;
};

export type BankQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion
  | CodingQuestion;

export type QuestionGroup = {
  id: string;
  order: number;
  name: string;
  type: QuestionType;
  chapter: number;
  /** Book section, e.g. "1.3.2" — metadata for later linking / QTI. */
  section: string;
  skill: string;
  notes?: string;
  questions: BankQuestion[];
};

export type QuestionBank = {
  id: string;
  title: string;
  chapter: number;
  status: BankStatus;
  groups: QuestionGroup[];
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: "Multiple choice",
  true_false: "True / false",
  fill_in_blank: "Fill in the blank",
  coding: "Coding (AI-graded)",
};

/** Reserved QTI-ish item type names for a future exporter. */
export const QTI_ITEM_TYPE: Record<QuestionType, string> = {
  multiple_choice: "multiple_choice_question",
  true_false: "true_false_question",
  fill_in_blank: "fill_in_multiple_blanks_question",
  /** Website-only; Canvas fallback does not export coding groups. */
  coding: "essay_question",
};
