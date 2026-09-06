import type { LectureSlide } from "../types";

export const ARRAY_SEARCH_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Array Search",
      "§3.4.5–3.4.8 · find one, or keep many",
    ],
  },
  {
    id: "purpose",
    title: "Ask the array a question",
    kind: "content",
    bullets: [
      "`find` returns the **item** (or `undefined`)",
      "`findIndex` returns the **index** (or `-1`)",
      "`filter` returns a **new array** of every match",
      "`includes` / `some` / `every` return a **boolean**",
    ],
  },
  {
    id: "find",
    title: "find stops at the first hit",
    kind: "demo",
    bullets: [
      "The predicate returns true when this is the item you want",
      "A miss is `undefined` — JSX hides it unless you `String()` it",
      "Create `FindFunction` and import it into Lab 3",
    ],
    code: `export default function FindFunction() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2", "string3"];
  const four = numberArray1.find((a) => a === 4);
  const string3 = stringArray1.find((a) => a === "string3");
  return (
    <div id="wd-find-function">
      <h4>Find Function</h4>
      four = {four}
      <br />
      string3 = {string3}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/FindFunction.tsx",
    codeHighlightLines: [4, 5],
    embed: "js-find",
  },
  {
    id: "find-index",
    title: "findIndex returns a position",
    kind: "demo",
    bullets: [
      "`4` sits at index `2`. `\"string3\"` sits at index `1`",
      "A miss is `-1` — the same sentinels as `indexOf`",
      "Create `FindIndex` and import it into Lab 3",
    ],
    code: `export default function FindIndex() {
  let numberArray1 = [1, 2, 4, 5, 6];
  let stringArray1 = ["string1", "string3"];
  const fourIndex = numberArray1.findIndex((a) => a === 4);
  const string3Index = stringArray1.findIndex((a) => a === "string3");
  return (
    <div id="wd-find-index">
      <h4>Find Index Function</h4>
      fourIndex = {fourIndex}
      <br />
      string3Index = {string3Index}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/FindIndex.tsx",
    codeHighlightLines: [4, 5],
    embed: "js-find-index",
  },
  {
    id: "filter",
    title: "filter keeps every match",
    kind: "demo",
    bullets: [
      "Greater than 2, then evens, then odds — three new arrays",
      "Kambaz will filter modules, assignments, and people by course id",
      "Create `FilterFunction` and import it into Lab 3",
    ],
    code: `export default function FilterFunction() {
  let numberArray1 = [1, 2, 4, 5, 6];
  const numbersGreaterThan2 = numberArray1.filter((a) => a > 2);
  const evenNumbers = numberArray1.filter((a) => a % 2 === 0);
  const oddNumbers = numberArray1.filter((a) => a % 2 !== 0);
  return (
    <div id="wd-filter-function">
      <h4>Filter Function</h4>
      numbersGreaterThan2 = {numbersGreaterThan2}
      <br />
      evenNumbers = {evenNumbers}
      <br />
      oddNumbers = {oddNumbers}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/FilterFunction.tsx",
    codeHighlightLines: [[3, 5]],
    embed: "js-filter",
  },
  {
    id: "booleans",
    title: "includes, some, and every",
    kind: "demo",
    bullets: [
      "`includes(value)` — is this value present?",
      "`some(predicate)` — does **at least one** item pass?",
      "`every(predicate)` — do **all** items pass? Coerce with `+ \"\"`",
    ],
    code: `export default function IncludesSomeEvery() {
  const numbers = [1, 2, 3, 4, 5];
  const includes3 = numbers.includes(3);
  const includes8 = numbers.includes(8);
  const someGreaterThan4 = numbers.some((n) => n > 4);
  const everyGreaterThan0 = numbers.every((n) => n > 0);
  return (
    <div id="wd-includes-some-every">
      <h4>Includes, Some, Every</h4>
      includes(3) = {includes3 + ""}
      <br />
      includes(8) = {includes8 + ""}
      <br />
      some(n &gt; 4) = {someGreaterThan4 + ""}
      <br />
      every(n &gt; 0) = {everyGreaterThan0 + ""}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/IncludesSomeEvery.tsx",
    codeHighlightLines: [[3, 6]],
    embed: "js-includes-some-every",
  },
  {
    id: "recap",
    title: "Search recap",
    kind: "content",
    bullets: [
      "`find` → item or `undefined`. `findIndex` → index or `-1`",
      "`filter` → a new array of every match — later, `course === cid`",
      "`includes` / `some` / `every` → booleans. People uses `some`",
    ],
  },
  {
    id: "next-up",
    title: "Next: fold, then print JSON",
    kind: "title",
    bullets: [
      "`reduce` collapses an array to one value",
      "§3.4.9–3.4.10: a sum, then `JSON.stringify`",
    ],
  },
];
