import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function stateFib(input: {
  id: string;
  start: number;
}): ReturnType<typeof codingQuestion> {
  const template = `const [n, _____] = _____(${input.start});
return <button _____={() => setN(n + 1)}>{n}</button>;`;
  return codingQuestion({
    id: input.id,
    language: "tsx",
    style: "fib",
    prompt: `A React function component keeps a number that starts at ${input.start}. Clicking the button adds one.

Fill the blanks with the state setter name, the state hook, and the click prop.`,
    code: template,
    blankCount: 3,
    acceptedBlanks: [["setN", "useState", "onClick"]],
    referenceSolution: `const [n, setN] = useState(${input.start});
return <button onClick={() => setN(n + 1)}>{n}</button>;`,
    rubric:
      "Blanks are setN, useState, onClick. Excuse useState() with parens and trivial misspellings. Partial credit per blank.",
    preview: {
      kind: "note",
      text: `Counter starts at ${input.start}. Each click should add one.`,
    },
  });
}

function counterComponent(input: {
  id: string;
  start: number;
}): ReturnType<typeof codingQuestion> {
  return codingQuestion({
    id: input.id,
    language: "tsx",
    style: "implement",
    prompt: `Write a function component \`Counter\` that starts at ${input.start} and adds one each time its button is clicked. Show the current number as the button label.`,
    placeholder: "function Counter() { ... }",
    referenceSolution: `function Counter() {
  const [n, setN] = useState(${input.start});
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`,
    rubric: `Require a Counter function, useState starting at ${input.start}, and a button whose onClick increments. Excuse export default, const Counter =, and setter naming. Partial credit if state or the click handler is missing. Do not require imports.`,
    preview: {
      kind: "note",
      text: `Counter starts at ${input.start} and increments on click.`,
    },
    checks: {
      requiredTokens: ["function", "Counter", "useState", "onClick"],
    },
  });
}

const HOOKS: QuestionGroup = {
  id: "q4-code-hooks",
  order: 1,
  name: "Coding — useState blanks",
  type: "coding",
  chapter: 4,
  section: "state",
  skill: "Fill in the React state hook, setter, and click handler prop.",
  notes: "Website Q4 only. Canvas fallback stays traditional.",
  questions: [
    stateFib({ id: "q4-code-hooks-01", start: 0 }),
    stateFib({ id: "q4-code-hooks-02", start: 1 }),
    stateFib({ id: "q4-code-hooks-03", start: 10 }),
    stateFib({ id: "q4-code-hooks-04", start: 5 }),
  ],
};

const COMPONENTS: QuestionGroup = {
  id: "q4-code-components",
  order: 2,
  name: "Coding — a counter component",
  type: "coding",
  chapter: 4,
  section: "components",
  skill: "Write a tiny React component that holds click state.",
  notes: "Website Q4 only. Canvas fallback stays traditional.",
  questions: [
    counterComponent({ id: "q4-code-components-01", start: 0 }),
    counterComponent({ id: "q4-code-components-02", start: 1 }),
    counterComponent({ id: "q4-code-components-03", start: 3 }),
    counterComponent({ id: "q4-code-components-04", start: 7 }),
  ],
};

export const Q4_CODING_GROUPS: QuestionGroup[] = [HOOKS, COMPONENTS];

export const Q4_CODING_BANK: QuestionBank = {
  id: "q4-state-coding",
  title: "Q4 — client state coding (website)",
  chapter: 4,
  status: "review_draft",
  groups: Q4_CODING_GROUPS,
};
