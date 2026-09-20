import type {
  CodingCheck,
  CodingLanguage,
  CodingPreview,
  CodingQuestion,
  CodingStyle,
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from "./types";

export function mc(
  id: string,
  prompt: string,
  choices: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation?: string,
  code?: string,
): MultipleChoiceQuestion {
  const letters = ["a", "b", "c", "d"] as const;
  return {
    id,
    type: "multiple_choice",
    prompt,
    code,
    explanation,
    choices: choices.map((text, index) => ({
      id: letters[index],
      text,
    })),
    correctChoiceId: letters[correctIndex],
  };
}

export function tf(
  id: string,
  prompt: string,
  answer: boolean,
  explanation?: string,
  code?: string,
): TrueFalseQuestion {
  return {
    id,
    type: "true_false",
    prompt,
    answer,
    explanation,
    code,
  };
}

/** Single-blank FIB. `answers` are accepted strings for that blank. */
export function fib(
  id: string,
  prompt: string,
  answers: string[],
  explanation?: string,
  code?: string,
): FillInBlankQuestion {
  return {
    id,
    type: "fill_in_blank",
    prompt,
    code,
    blankCount: 1,
    acceptedCombinations: answers.map((answer) => [answer]),
    explanation,
  };
}

/** Multi-blank FIB. Each combination is one accepted tuple. */
export function fibMulti(
  id: string,
  prompt: string,
  blankCount: number,
  acceptedCombinations: string[][],
  explanation?: string,
): FillInBlankQuestion {
  return {
    id,
    type: "fill_in_blank",
    prompt,
    blankCount,
    acceptedCombinations,
    explanation,
  };
}

/**
 * Acronym FIB: one blank per letter, words in letter order.
 * The stem tells students to fill each blank with the word for that letter
 * (CSS uses HTML as the example so the prompt does not give away Sheets).
 */
export function acronymFib(
  id: string,
  acronym: string,
  words: string[],
  explanation: string,
  options?: {
    extraCombinations?: string[][];
    prefix?: string;
  },
): FillInBlankQuestion {
  const letters = Array.from(acronym);
  if (words.length !== letters.length) {
    throw new Error(
      `acronymFib(${id}): "${acronym}" has ${letters.length} letters but ${words.length} words`,
    );
  }
  for (const combo of options?.extraCombinations ?? []) {
    if (combo.length !== letters.length) {
      throw new Error(
        `acronymFib(${id}): extra combination length ${combo.length} !== ${letters.length}`,
      );
    }
  }
  const blanks = letters.map(() => "_____").join(" ");
  const example =
    acronym.toUpperCase() === "CSS"
      ? "HTML → Hyper / Text / Markup / Language"
      : "CSS → Cascading / Style / Sheets";
  const prefix = options?.prefix ?? "";
  return fibMulti(
    id,
    `${prefix}${acronym} stands for ${blanks}. Fill each blank with the word that corresponds to each letter, in letter order (for example, ${example}).`,
    letters.length,
    [words, ...(options?.extraCombinations ?? [])],
    explanation,
  );
}

/** Short coding item. Reference solution + rubric stay server-side. */
export function codingQuestion(input: {
  id: string;
  prompt: string;
  language: CodingLanguage;
  style: CodingStyle;
  referenceSolution: string;
  rubric: string;
  explanation?: string;
  placeholder?: string;
  /** FIB template; shown to students as the `code` snippet. */
  code?: string;
  blankCount?: number;
  acceptedBlanks?: string[][];
  preview?: CodingPreview;
  checks?: CodingCheck;
}): CodingQuestion {
  return {
    id: input.id,
    type: "coding",
    language: input.language,
    style: input.style,
    prompt: input.prompt,
    code: input.code,
    referenceSolution: input.referenceSolution,
    rubric: input.rubric,
    explanation: input.explanation,
    placeholder: input.placeholder,
    blankCount: input.blankCount,
    acceptedBlanks: input.acceptedBlanks,
    preview: input.preview,
    checks: input.checks,
  };
}

/** Tightly parallel single-blank stems that swap a domain noun. */
export function parallelFib(
  idPrefix: string,
  domains: string[],
  promptFor: (domain: string) => string,
  answers: string[],
  explanation: string,
): FillInBlankQuestion[] {
  return domains.map((domain, index) =>
    fib(
      `${idPrefix}-${String(index + 1).padStart(2, "0")}`,
      promptFor(domain),
      answers,
      explanation,
    ),
  );
}
