import type { LectureSlide } from "../types";

export const SPREAD_AND_DESTRUCTURING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Spread and Destructuring",
      "§3.4.13–3.4.16 · copy, unpack, then import",
    ],
  },
  {
    id: "purpose",
    title: "Copy a structure, or pull it apart",
    kind: "content",
    bullets: [
      "`...` **spreads** (copies) an array or object into another",
      "Destructuring **unpacks** properties or positions into names",
      "The lab files say **Destructing** — the assignment spelling",
      "React props are one object. You almost always destructure it",
    ],
  },
  {
    id: "spread",
    title: "Spread copies, last write wins",
    kind: "demo",
    bullets: [
      "`arr2` is `arr1` plus `4, 5, 6`",
      "`obj2` is `obj1` plus `d, e, f`",
      "`obj3.b` is `4`, not `2` — the later `b` overrides the copy",
    ],
    code: `export default function Spreading() {
  const arr1 = [1, 2, 3];
  const arr2 = [...arr1, 4, 5, 6];
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { ...obj1, d: 4, e: 5, f: 6 };
  const obj3 = { ...obj1, b: 4 };
  return (
    <div id="wd-spreading">
      <h2>Spread Operator</h2>
      <h3>Array Spread</h3>
      arr1 = {JSON.stringify(arr1)}
      <br />
      arr2 = {JSON.stringify(arr2)}
      <br />
      <h3>Object Spread</h3>
      {JSON.stringify(obj1)}
      <br />
      {JSON.stringify(obj2)}
      <br />
      {JSON.stringify(obj3)}
      <br />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Spreader.tsx",
    codeHighlightLines: [3, 5, 6],
    embed: "js-spreader",
  },
  {
    id: "destruct",
    title: "Names from objects, slots from arrays",
    kind: "demo",
    bullets: [
      "`const { name, age } = person` is `person.name` and `person.age`",
      "`const [first, second, third] = numbers` is index 0, 1, 2",
      "Create `Destructing` and import it into Lab 3",
    ],
    code: `export default function Destructing() {
  const person = { name: "John", age: 25 };
  const { name, age } = person;
  const numbers = ["one", "two", "three"];
  const [first, second, third] = numbers;
  return (
    <div id="wd-destructing">
      <h2>Destructing</h2>
      <h3>Object Destructing</h3>
      const &#123; name, age &#125; = &#123; name: "John", age: 25 &#125;
      <br />
      <br />
      name = {name}
      <br />
      age = {age}
      <h3>Array Destructing</h3>
      const [first, second, third] = ["one","two","three"]
      <br />
      <br />
      first = {first}
      <br />
      second = {second}
      <br />
      third = {third}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Destructing.tsx",
    codeHighlightLines: [3, 5],
    embed: "js-destructing",
  },
  {
    id: "fn-destruct",
    title: "Functions can unpack a props object",
    kind: "demo",
    bullets: [
      "`add(a, b)` takes two numbers. `subtract({ a, b })` takes one object",
      "That object shape is how React components receive props",
      "Defaults work too: `(name = \"Ada\")` or `{ b = 0 }`",
    ],
    code: `export default function FunctionDestructing() {
  const add = (a: number, b: number) => a + b;
  const sum = add(1, 2);
  const subtract = ({ a, b }: { a: number; b: number }) => a - b;
  const difference = subtract({ a: 4, b: 2 });
  return (
    <div id="wd-function-destructing">
      <h2>Function Destructing</h2>
      const add = (a, b) =&gt; a + b;
      <br />
      const sum = add(1, 2);
      <br />
      const subtract = (&#123; a, b &#125;) =&gt; a - b;
      <br />
      const difference = subtract(&#123; a: 4, b: 2 &#125;);
      <br />
      sum = {sum}
      <br />
      difference = {difference}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/FunctionDestructing.tsx",
    codeHighlightLines: [2, 4],
    embed: "js-function-destructing",
  },
  {
    id: "imports",
    title: "Three ways to import Math",
    kind: "demo",
    bullets: [
      "Named: `export function add`. Default: `export default Math`",
      "`import Math from \"./Math\"` — then `Math.add(2, 3)`",
      "`import * as Matematica` gathers every export. `{ add }` unpacks one",
    ],
    code: `export function add(a: number, b: number): number {
  return a + b;
}
export function subtract(a: number, b: number): number {
  return a - b;
}
export function multiply(a: number, b: number): number {
  return a * b;
}
export function divide(a: number, b: number): number {
  return a / b;
}
const Math = {
  add,
  subtract,
  multiply,
  divide,
};
export default Math;`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab3/Math.ts",
    codeHighlightLines: [1, 19],
    embed: "js-destructing-imports",
  },
  {
    id: "recap",
    title: "Spread and destructuring recap",
    kind: "content",
    bullets: [
      "`[...arr, 4]` and `{ ...obj, b: 4 }` copy; later keys win",
      "`const { name } = person` and `const [first] = nums` unpack",
      "`({ a, b }) => a - b` is the props spelling. Imports use the same braces",
    ],
  },
  {
    id: "next-up",
    title: "Next: missing values safely",
    kind: "title",
    bullets: [
      "Reading `house.address.city` throws if `address` is missing",
      "§3.4.17: `?.` and `??`",
    ],
  },
];
