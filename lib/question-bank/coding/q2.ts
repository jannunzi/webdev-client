import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function boxFib(input: {
  id: string;
  color: string;
  background: string;
  padding: string;
  border: string;
  text: string;
}): ReturnType<typeof codingQuestion> {
  const template = `.note {
  ____1____: ${input.color};
  ____2____: ${input.background};
  ____3____: ${input.padding};
  ____4____: ${input.border};
}`;
  return codingQuestion({
    id: input.id,
    language: "css",
    style: "fib",
    prompt: `The box below is styled with four CSS declarations. Fill each numbered blank with the property name.

1. text color (${input.color})
2. background (${input.background})
3. inner spacing (${input.padding})
4. border (${input.border})`,
    code: template,
    blankCount: 4,
    acceptedBlanks: [["color", "background-color", "padding", "border"]],
    referenceSolution: `.note {
  color: ${input.color};
  background-color: ${input.background};
  padding: ${input.padding};
  border: ${input.border};
}`,
    rubric:
      "Blanks are color, background-color, padding, border. Excuse background for background-color as partial if the rest is right; trivial misspellings OK. Partial credit per property.",
    preview: {
      kind: "styled-box",
      text: input.text,
      style: {
        color: input.color,
        backgroundColor: input.background,
        padding: input.padding,
        border: input.border,
      },
    },
  });
}

function listCss(input: {
  id: string;
  color: string;
  gap: string;
}): ReturnType<typeof codingQuestion> {
  return codingQuestion({
    id: input.id,
    language: "css",
    style: "implement",
    prompt: `Write a CSS rule for \`.menu\` so the list has no bullets, items sit in a row, and there is a ${input.gap} gap. Color the text ${input.color}.`,
    placeholder: "Write a .menu { ... } rule.",
    referenceSolution: `.menu {
  list-style: none;
  display: flex;
  gap: ${input.gap};
  color: ${input.color};
}`,
    rubric: `Require a .menu rule with no bullets (list-style: none or list-style-type: none), a horizontal layout (flex or inline items), gap ${input.gap}, and color ${input.color}. Excuse extra properties, quote style, and property order. Partial credit if bullets are gone or the row layout is missing.`,
    preview: {
      kind: "note",
      text: `Target: a horizontal .menu list, ${input.color} text, ${input.gap} gap, no bullets.`,
    },
    checks: {
      requiredTokens: [".menu", "list-style", "none", "flex", input.gap, input.color],
    },
  });
}

const PROPS: QuestionGroup = {
  id: "q2-code-props",
  order: 1,
  name: "Coding — CSS properties",
  type: "coding",
  chapter: 2,
  section: "properties",
  skill: "Name the CSS properties that color, pad, and border a box.",
  notes: "Website Q2 only. Canvas fallback stays traditional.",
  questions: [
    boxFib({
      id: "q2-code-props-01",
      color: "navy",
      background: "#fff8dc",
      padding: "12px",
      border: "4px solid gold",
      text: "Office hours today",
    }),
    boxFib({
      id: "q2-code-props-02",
      color: "maroon",
      background: "#fff0f0",
      padding: "8px",
      border: "2px solid crimson",
      text: "Due Sunday",
    }),
    boxFib({
      id: "q2-code-props-03",
      color: "teal",
      background: "#f0ffff",
      padding: "16px",
      border: "3px dashed teal",
      text: "Optional reading",
    }),
    boxFib({
      id: "q2-code-props-04",
      color: "#222",
      background: "#f4f4f4",
      padding: "10px",
      border: "1px solid #888",
      text: "Note to self",
    }),
  ],
};

const LAYOUT: QuestionGroup = {
  id: "q2-code-layout",
  order: 2,
  name: "Coding — CSS list layout",
  type: "coding",
  chapter: 2,
  section: "layout",
  skill: "Write a short CSS rule that lays out a horizontal menu list.",
  notes: "Website Q2 only. Canvas fallback stays traditional.",
  questions: [
    listCss({ id: "q2-code-layout-01", color: "navy", gap: "1rem" }),
    listCss({ id: "q2-code-layout-02", color: "black", gap: "12px" }),
    listCss({ id: "q2-code-layout-03", color: "purple", gap: "8px" }),
    listCss({ id: "q2-code-layout-04", color: "teal", gap: "0.5rem" }),
  ],
};

export const Q2_CODING_GROUPS: QuestionGroup[] = [PROPS, LAYOUT];

export const Q2_CODING_BANK: QuestionBank = {
  id: "q2-css-coding",
  title: "Q2 — CSS coding (website)",
  chapter: 2,
  status: "review_draft",
  groups: Q2_CODING_GROUPS,
};
