import type {
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
): FillInBlankQuestion {
  return {
    id,
    type: "fill_in_blank",
    prompt,
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
