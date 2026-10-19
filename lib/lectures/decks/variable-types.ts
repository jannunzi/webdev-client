import type { LectureSlide } from "../types";

export const VARIABLE_TYPES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Variable Types",
      "§3.2.2 · number, string, boolean, and `typeof`",
    ],
  },
  {
    id: "purpose",
    title: "JavaScript has a handful of types",
    kind: "content",
    bullets: [
      "Number, String, Boolean, Date, plus objects and arrays later",
      "`typeof` reports that type as a **string** — `\"number\"`, `\"string\"`",
      "Create `VariableTypes` and import it at the bottom of Lab 3",
      "Note the `+ \"\"` on the boolean — JSX will not render a bare `true`",
    ],
  },
  {
    id: "sample",
    title: "Values and their typeof strings (1/3)",
    kind: "content",
    code: `export default function VariableTypes() {
  let numberVariable = 123;
  let floatingPointNumber = 234.345;
  let stringVariable = "Hello World!";
  let booleanVariable = true;
  let isNumber = typeof numberVariable;
  let isString = typeof stringVariable;
  let isBoolean = typeof booleanVariable;`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/VariableTypes.tsx",
    codeHighlightLines: [6, 7, 8],
  },
  {
    id: "sample-return",
    title: "Values and their typeof strings (2/3)",
    kind: "content",
    code: `  return (
    <div id="wd-variable-types">
      <h4>Variables Types</h4>
      numberVariable = {numberVariable}
      <br />
      floatingPointNumber = {floatingPointNumber}
      <br />
      stringVariable = {stringVariable}
      <br />
      booleanVariable = {booleanVariable + ""}
      <br />
      isNumber = {isNumber}
      <br />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/VariableTypes.tsx",
    codeStartLine: 9,
    codeHighlightLines: [10],
  },
  {
    id: "sample-part-3",
    title: "Values and their typeof strings (3/3)",
    kind: "content",
    code: `      isString = {isString}
      <br />
      isBoolean = {isBoolean}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/VariableTypes.tsx",
    codeStartLine: 22,
  },
  {
    id: "sample-live",
    title: "VariableTypes: live demo",
    kind: "demo",
    bullets: [
      "`123` and `234.345` are both `number` — no separate float type",
      "`\"Hello World!\"` is a `string`. `true` is a `boolean`",
      "`typeof numberVariable` stores the string `\"number\"`",
    ],
    embed: "js-variable-types",
  },
  {
    id: "boolean-coerce",
    title: "JSX hides a bare boolean",
    kind: "content",
    bullets: [
      "`{true}` and `{false}` produce **nothing** on the page",
      "React treats a boolean as a flag, not as text",
      "`booleanVariable + \"\"` concatenates an empty string and coerces to `\"true\"`",
      "Same trick in the next deck for every `&&` / `===` result",
    ],
  },
  {
    id: "on-your-own",
    title: "Add a second string and number",
    kind: "content",
    bullets: [
      "Declare another string and another number",
      "Store `typeof` for each",
      "Display value, then the typeof string, same layout as the samples",
    ],
  },
  {
    id: "next-up",
    title: "Next: booleans and decisions",
    kind: "title",
    bullets: [
      "Types tell you what a value is. Booleans decide what to render",
      "§3.2.3–3.2.6: `===`, `&&`, the ternary, welcome vs login",
    ],
  },
];
