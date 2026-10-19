import type { LectureSlide } from "../types";

export const JAVASCRIPT_FUNCTIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · JavaScript Functions",
      "§3.3 · reuse an algorithm from JSX",
    ],
  },
  {
    id: "purpose",
    title: "A function is a named, parameterized block",
    kind: "content",
    bullets: [
      "Wrap an algorithm, call it from JavaScript **or** from JSX",
      "Two styles: the older `function` keyword, then ES6 arrows",
      "TypeScript annotations (`a: number`) are compile-time only",
      "`console.log` writes to the browser console — inspect it later in §3.4.12",
    ],
  },
  {
    id: "legacy",
    title: "Legacy ES5 function add (1/2)",
    kind: "content",
    code: `function add(a: number, b: number) {
  return a + b;
}

export default function LegacyFunctions() {
  const twoPlusFour = add(2, 4);
  console.log(twoPlusFour);`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/LegacyFunctions.tsx",
    codeHighlightLines: [1, 2, 3, 6],
  },
  {
    id: "legacy-return",
    title: "Legacy ES5 function add (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-legacy-functions">
      <h4>Functions</h4>
      <h5>Legacy ES5 functions</h5>
      twoPlusFour = {twoPlusFour}
      <br />
      add(2, 4) = {add(2, 4)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/LegacyFunctions.tsx",
    codeStartLine: 8,
    codeHighlightLines: [7],
  },
  {
    id: "legacy-live",
    title: "LegacyFunctions: live demo",
    kind: "demo",
    bullets: [
      "The sum prints both as a stored result and as a call inlined in JSX",
      "`add(2, 4)` inside `{…}` is just another expression",
      "Create `LegacyFunctions` and import it into Lab 3",
    ],
    embed: "js-legacy-functions",
  },
  {
    id: "arrow",
    title: "ES6 arrows drop the function keyword (1/2)",
    kind: "content",
    code: `const subtract = (a: number, b: number) => {
  return a - b;
};

export default function ArrowFunctions() {
  const threeMinusOne = subtract(3, 1);
  console.log(threeMinusOne);`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ArrowFunctions.tsx",
    codeAddedLines: [1, 2, 3],
  },
  {
    id: "arrow-return",
    title: "ES6 arrows drop the function keyword (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-arrow-functions">
      <h4>New ES6 arrow functions</h4>
      threeMinusOne = {threeMinusOne}
      <br />
      subtract(3, 1) = {subtract(3, 1)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ArrowFunctions.tsx",
    codeStartLine: 8,
  },
  {
    id: "arrow-live",
    title: "ArrowFunctions: live demo",
    kind: "demo",
    bullets: [
      "`const subtract = (a, b) => { return a - b; }`",
      "The name is optional; you typically store the function in a `const`",
      "This is the shape of almost every callback — `map`, handlers, predicates",
    ],
    embed: "js-arrow-functions",
  },
  {
    id: "implied",
    title: "Implied return drops the braces (1/2)",
    kind: "content",
    code: `export default function ImpliedReturn() {
  const multiply = (a: number, b: number) => a * b;
  const fourTimesFive = multiply(4, 5);
  console.log(fourTimesFive);`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ImpliedReturn.tsx",
    codeHighlightLines: [2],
  },
  {
    id: "implied-return",
    title: "Implied return drops the braces (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-implied-return">
      <h4>Implied return</h4>
      fourTimesFive = {fourTimesFive}
      <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ImpliedReturn.tsx",
    codeStartLine: 5,
  },
  {
    id: "implied-live",
    title: "ImpliedReturn: live demo",
    kind: "demo",
    bullets: [
      "`(a, b) => a * b` is the same as `(a, b) => { return a * b; }`",
      "Use it when the body is a single expression",
      "That one-liner is what you will pass into `map` and `filter` in §3.4",
    ],
    embed: "js-implied-return",
  },
  {
    id: "templates",
    title: "Template literals embed expressions (1/3)",
    kind: "content",
    code: `export default function TemplateLiterals() {
  const five = 2 + 3;
  const result1 = "2 + 3 = " + five;
  const result2 = \`2 + 3 = \${2 + 3}\`;
  const username = "alice";
  const greeting1 = \`Welcome home \${username}\`;
  const loggedIn = false;
  const greeting2 = \`Logged in: \${loggedIn ? "Yes" : "No"}\`;`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/TemplateLiterals.tsx",
    codeHighlightLines: [4, 6, 8],
  },
  {
    id: "templates-return",
    title: "Template literals embed expressions (2/3)",
    kind: "content",
    code: `  return (
    <div id="wd-template-literals">
      <h4>Template Literals</h4>
      result1 = {result1}
      <br />
      result2 = {result2}
      <br />
      greeting1 = {greeting1}
      <br />
      greeting2 = {greeting2}
      <hr />
    </div>
  );`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/TemplateLiterals.tsx",
    codeStartLine: 9,
  },
  {
    id: "templates-part-3",
    title: "Template literals embed expressions (3/3)",
    kind: "content",
    code: `}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/TemplateLiterals.tsx",
    codeStartLine: 22,
  },
  {
    id: "templates-live",
    title: "TemplateLiterals: live demo",
    kind: "demo",
    bullets: [
      "Backticks, not quotes. `${expr}` interpolates inside the string",
      "`result1` concatenates with `+`. `result2` does the same with a template",
      "A ternary can live inside `${…}` — `Logged in: Yes` or `No`",
    ],
    embed: "js-template-literals",
  },
  {
    id: "recap",
    title: "Functions recap",
    kind: "content",
    bullets: [
      "`function add(a, b) { return a + b; }` — the older spelling still works",
      "`const subtract = (a, b) => { return a - b; }` — ES6, named by the `const`",
      "`const multiply = (a, b) => a * b` — implied return for one expression",
      "`\`Welcome home ${username}\`` — templates, including a ternary",
    ],
  },
  {
    id: "next-up",
    title: "Next: data structures",
    kind: "title",
    bullets: [
      "Functions reuse logic. Arrays and objects reuse data",
      "§3.4: index, map, find, filter, spread — next decks",
    ],
  },
];
