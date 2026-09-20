import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function listenerFib(input: {
  id: string;
  event: string;
}): ReturnType<typeof codingQuestion> {
  const template = `const button = document.querySelector("button");
button.____1____("${input.event}", () => {
  count = count + 1;
  label.____2____ = String(count);
});`;
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "fib",
    prompt: `A button should listen for the “${input.event}” event, add one to \`count\`, and show the new number in \`label\`.

1. the method that registers the listener
2. the property that sets the visible text`,
    code: template,
    blankCount: 2,
    acceptedBlanks: [
      ["addEventListener", "textContent"],
      ["addEventListener", "innerText"],
    ],
    referenceSolution: `const button = document.querySelector("button");
button.addEventListener("${input.event}", () => {
  count = count + 1;
  label.textContent = String(count);
});`,
    rubric:
      "____1____ is addEventListener. ____2____ is textContent (innerText is accepted). Excuse case and trivial misspellings. Partial credit per blank.",
    preview: {
      kind: "note",
      text: `On ${input.event}, increment a counter and write it into the label.`,
    },
  });
}

function sumFn(input: { id: string; sample: string }): ReturnType<typeof codingQuestion> {
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "implement",
    prompt: `Write a function \`sum(numbers)\` that returns the sum of an array of numbers. Example: \`sum(${input.sample})\`.`,
    placeholder: "function sum(numbers) { ... }",
    referenceSolution: `function sum(numbers) {
  let total = 0;
  for (const n of numbers) total = total + n;
  return total;
}`,
    rubric:
      "Require a function named sum that adds the array items and returns the total. Excuse for-of vs reduce vs a C-style loop, let vs const vs var, and extra whitespace. Partial credit if the name or the return is missing. Do not require TypeScript types.",
    preview: {
      kind: "note",
      text: `sum(${input.sample}) should return the total of those numbers.`,
    },
    checks: {
      requiredTokens: ["function", "sum", "return"],
    },
  });
}

const EVENTS: QuestionGroup = {
  id: "q3-code-events",
  order: 1,
  name: "Coding — DOM events",
  type: "coding",
  chapter: 3,
  section: "events",
  skill: "Fill in addEventListener and the property that updates visible text.",
  notes: "Website Q3 only. Canvas fallback stays traditional.",
  questions: [
    listenerFib({ id: "q3-code-events-01", event: "click" }),
    listenerFib({ id: "q3-code-events-02", event: "dblclick" }),
    listenerFib({ id: "q3-code-events-03", event: "mouseenter" }),
    listenerFib({ id: "q3-code-events-04", event: "keydown" }),
  ],
};

const FUNCTIONS: QuestionGroup = {
  id: "q3-code-functions",
  order: 2,
  name: "Coding — a small function",
  type: "coding",
  chapter: 3,
  section: "functions",
  skill: "Write a short JavaScript function that reduces an array.",
  notes: "Website Q3 only. Canvas fallback stays traditional.",
  questions: [
    sumFn({ id: "q3-code-functions-01", sample: "[1, 2, 3]" }),
    sumFn({ id: "q3-code-functions-02", sample: "[10, 5]" }),
    sumFn({ id: "q3-code-functions-03", sample: "[4, 4, 4]" }),
    sumFn({ id: "q3-code-functions-04", sample: "[2, 8, 0]" }),
  ],
};

export const Q3_CODING_GROUPS: QuestionGroup[] = [EVENTS, FUNCTIONS];

export const Q3_CODING_BANK: QuestionBank = {
  id: "q3-js-coding",
  title: "Q3 — JavaScript coding (website)",
  chapter: 3,
  status: "review_draft",
  groups: Q3_CODING_GROUPS,
};
