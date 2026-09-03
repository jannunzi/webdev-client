/**
 * Self-check draw items (pedagogical kinds, localStorage attempts).
 * Canvas / QTI author banks live in `lib/question-bank` — map to that
 * module rather than inventing a third question shape.
 */
export type QuestionKind =
  | "concept"
  | "syntax"
  | "acronym"
  | "snippet"
  | "blank"
  | "puzzle";

export type QuizChoice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  /** Section this item is drawn from, e.g. "2.1.3" */
  section: string;
  kind: QuestionKind;
  prompt: string;
  /** Optional code shown above the choices / blank */
  code?: string;
  choices?: QuizChoice[];
  /** Canonical answer: choice id, or the preferred fill-in string */
  answer: string;
  /** Extra accepted fill-in strings (already normalized by the quiz) */
  accept?: string[];
  explanation: string;
};
