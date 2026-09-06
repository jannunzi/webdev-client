import type { LectureSlide } from "../types";

export const JAVASCRIPT_ARRAYS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · JavaScript Arrays",
      "§3.4–3.4.2 · gather values, then grow and shrink them",
    ],
  },
  {
    id: "purpose",
    title: "Arrays gather values into one variable",
    kind: "content",
    bullets: [
      "Primitives were one value. Arrays hold many — numbers, strings, even JSX",
      "Kambaz will use them for courses, modules, and people",
      "JSX prints a number or string array **without commas**",
      "Each mapped sibling needs a `key` so React can match items",
    ],
  },
  {
    id: "simple",
    title: "A todo list is an array of li",
    kind: "demo",
    bullets: [
      "`htmlArray1` is JSX — interpolate it inside `<ol>`",
      "`variableArray1` mixes numbers, strings, and nested arrays",
      "Create `SimpleArrays` and import it into Lab 3",
    ],
    code: `export default function SimpleArrays() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let htmlArray1 = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  let variableArray1 = [
    functionScoped,
    blockScoped,
    constant1,
    numberArray1,
    stringArray1,
  ];
  return (
    <div id="wd-simple-arrays">
      <h4>Simple Arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      variableArray1 = {variableArray1}
      <br />
      Todo list:
      <ol>{htmlArray1}</ol>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/SimpleArrays.tsx",
    codeHighlightLines: [[5, 10], 26],
    embed: "js-simple-arrays",
  },
  {
    id: "index",
    title: "length and indexOf",
    kind: "demo",
    bullets: [
      "`length` is how many items. Arrays are **zero-based**",
      "`indexOf(3)` is `2`. A missing value returns `-1`",
      "Create `ArrayIndexAndLength` and import it into Lab 3",
    ],
    code: `export default function ArrayIndexAndLength() {
  let numberArray1 = [1, 2, 3, 4, 5];
  const length1 = numberArray1.length;
  const index1 = numberArray1.indexOf(3);
  return (
    <div id="wd-array-index-and-length">
      <h4>Array index and length</h4>
      length1 = {length1}
      <br />
      index1 = {index1}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ArrayIndexAndLength.tsx",
    codeHighlightLines: [3, 4],
    embed: "js-array-index",
  },
  {
    id: "mutate",
    title: "push appends; splice cuts",
    kind: "demo",
    bullets: [
      "JavaScript arrays are mutable. `push` adds at the end",
      "`splice(2, 1)` removes one item at index 2",
      "After push-then-splice the numbers are `1 2 4 5 6`",
    ],
    code: `export default function AddingAndRemovingToFromArrays() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let todoArray = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  numberArray1.push(6);
  stringArray1.push("string3");
  todoArray.push(<li key={3}>Walk the dogs</li>);
  numberArray1.splice(2, 1);
  stringArray1.splice(1, 1);
  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      Todo list:
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/AddingAndRemovingToFromArrays.tsx",
    codeAddedLines: [[8, 12]],
    embed: "js-array-add-remove",
  },
  {
    id: "recap",
    title: "Arrays recap",
    kind: "content",
    bullets: [
      "`[1, 2, 3]` gathers values. JSX omits the commas when you print them",
      "`length` and `indexOf` — missing values are `-1`",
      "`push` / `splice` grow and shrink. New `li`s still need a `key`",
    ],
  },
  {
    id: "next-up",
    title: "Next: walk every item",
    kind: "title",
    bullets: [
      "A loop (or `map`) turns one array into another",
      "§3.4.3–3.4.4: `for`, then `map` to JSX",
    ],
  },
];
