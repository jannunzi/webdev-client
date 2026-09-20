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
  /** Live / visual example shown with the prompt (safe for students). */
  preview?: CodingPreview;
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

export const CODING_LANGUAGES = ["html", "css", "javascript", "tsx"] as const;
export type CodingLanguage = (typeof CODING_LANGUAGES)[number];

export const CODING_STYLES = ["fib", "implement"] as const;
export type CodingStyle = (typeof CODING_STYLES)[number];

export type FormInputPreview = {
  kind: "form-input";
  label: string;
  inputId: string;
  defaultValue: string;
  placeholder: string;
  title: string;
};

export type BulletListPreview = {
  kind: "bullet-list";
  items: string[];
};

export type StyledBoxPreview = {
  kind: "styled-box";
  text: string;
  style: Record<string, string>;
};

export type NotePreview = {
  kind: "note";
  text: string;
};

export type ParagraphsPreview = {
  kind: "paragraphs";
  blocks: string[];
};

export type CodingPreview =
  | FormInputPreview
  | BulletListPreview
  | StyledBoxPreview
  | NotePreview
  | ParagraphsPreview;

export type CodingCheck = {
  requiredTags?: string[];
  requiredAttrs?: Array<{ tag?: string; name: string; value?: string }>;
  requiredText?: string[];
  requiredTokens?: string[];
};

/**
 * Short snippet graded on the server. `referenceSolution`, `rubric`,
 * `acceptedBlanks`, and `checks` stay server-side — never send them in
 * the student take payload.
 *
 * Two styles (Jose, 2026-09-20):
 * - `fib`: complete a template (`___1___` blanks), often with a live preview
 * - `implement`: write the markup or code that produces a shown result
 */
export type CodingQuestion = BaseQuestion & {
  type: "coding";
  language: CodingLanguage;
  style: CodingStyle;
  referenceSolution: string;
  rubric: string;
  /** Textarea hint for implement items; safe to show students. */
  placeholder?: string;
  blankCount?: number;
  acceptedBlanks?: string[][];
  checks?: CodingCheck;
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
  coding: "Coding",
};

/** Reserved QTI-ish item type names for a future exporter. */
export const QTI_ITEM_TYPE: Record<QuestionType, string> = {
  multiple_choice: "multiple_choice_question",
  true_false: "true_false_question",
  fill_in_blank: "fill_in_multiple_blanks_question",
  /** Website-only; Canvas fallback does not export coding groups. */
  coding: "essay_question",
};
