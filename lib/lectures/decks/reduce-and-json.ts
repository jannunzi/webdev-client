import type { LectureSlide } from "../types";

export const REDUCE_AND_JSON_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Reduce and JSON",
      "§3.4.9–3.4.10 · fold an array, then show its shape",
    ],
  },
  {
    id: "purpose",
    title: "One value in, or the real structure",
    kind: "content",
    bullets: [
      "`reduce` folds an array down to one value — a sum, a string, a group",
      "The callback gets the **accumulator** and the current item",
      "JSX prints arrays without brackets. `JSON.stringify` puts them back",
      "JSON is the text format APIs and files use to ship data",
    ],
  },
  {
    id: "reduce",
    title: "reduce starts at 0 and adds",
    kind: "demo",
    bullets: [
      "Second argument is the starting accumulator — here `0`",
      "Each pass: `total + n`. The sum is `15`",
      "Create `ReduceFunction` and import it into Lab 3",
    ],
    code: `export default function ReduceFunction() {
  const numbers = [1, 2, 3, 4, 5];
  const sum = numbers.reduce((total, n) => total + n, 0);
  return (
    <div id="wd-reduce-function">
      <h4>Reduce Function</h4>
      sum = {sum}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ReduceFunction.tsx",
    codeHighlightLines: [3],
    embed: "js-reduce",
  },
  {
    id: "json",
    title: "JSON.stringify shows the shape",
    kind: "demo",
    bullets: [
      "**JSON** = JavaScript Object Notation",
      "`stringify` writes text. `parse` reads it back into a value",
      "The page now shows `[1,4,16,25,36]` with brackets and commas",
    ],
    code: `export default function JsonStringify() {
  const squares = [1, 4, 16, 25, 36];
  return (
    <div id="wd-json-stringify">
      <h3>JSON Stringify</h3>
      squares = {JSON.stringify(squares)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/JsonStringify.tsx",
    codeHighlightLines: [6],
    embed: "js-json-stringify",
  },
  {
    id: "recap",
    title: "Reduce and JSON recap",
    kind: "content",
    bullets: [
      "`arr.reduce((acc, item) => next, start)` folds to one value",
      "`JSON.stringify(value)` is how you inspect arrays and objects on the page",
      "Pretty-print later with `JSON.stringify(obj, null, 2)` inside `<pre>`",
    ],
  },
  {
    id: "next-up",
    title: "Next: objects",
    kind: "title",
    bullets: [
      "Arrays index by position. Objects name each field",
      "§3.4.11: a house with nested address and owners",
    ],
  },
];
