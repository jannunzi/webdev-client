import type { LectureSlide } from "../types";

export const PASSING_DATA_AND_FUNCTIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Passing Data and Functions",
      "§4.2.2–4.2.3 · closures, then callbacks as props",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Passing Data and Functions",
    kind: "content",
    bullets: [
      "Many clicks need data: which item to delete, which numbers to add",
      "A handler that takes arguments can't be passed by name alone",
      "And a child component often needs to run a function its parent owns",
      "This deck covers both: arguments, then functions passed as props",
    ],
  },
  {
    id: "passing-data",
    title: "A closure holds the argument",
    kind: "content",
    code: `"use client";

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(good);
};

export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-pass-data-click"
        className="me-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Pass Data
      </button>
      <button
        type="button"
        onClick={() => lifeIs("Life is Good!")}
        id="wd-pass-data-parameter-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Pass Data Parameter
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/PassingDataOnEvent.tsx",
    codeAddedLines: [7, 8, 9, 25],
  },
  {
    id: "passing-data-live",
    title: "PassingDataOnEvent: live demo",
    kind: "demo",
    bullets: [
      "First button still uses a reference — `hello` needs no data",
      "Second button wraps `lifeIs(\"Life is Good!\")` in an arrow",
      "Click both and confirm each alert matches the argument",
    ],
    embed: "passing-data",
  },
  {
    id: "functions-are-values",
    title: "Passing a Function as a Prop",
    kind: "content",
    bullets: [
      "In JavaScript a function is a value, so it can be passed as a prop",
      "Goal: a parent hands a child a function, and the child calls it on click",
      "The next slide shows the child that receives the function",
    ],
  },
  {
    id: "passing-functions",
    title: "theFunction is a prop",
    kind: "content",
    code: `export default function PassingFunctions({
  message,
  theFunction,
}: {
  message: string;
  theFunction: (message: string) => void;
}) {
  return (
    <div id="wd-passing-functions">
      <h2>Passing Functions</h2>
      <button
        type="button"
        onClick={() => theFunction(\`From parent: \${message}\`)}
        id="wd-pass-functions-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/PassingFunctions.tsx",
    codeHighlightLines: [[1, 7], 13],
  },
  {
    id: "passing-functions-live",
    title: "PassingFunctions: live demo",
    kind: "demo",
    bullets: [
      "Type the props: `message: string`, `theFunction: (message: string) => void`",
      "On click the child calls `theFunction` with `From parent:` plus `message`",
      "Data goes down as a prop. The callback sends changed data back up",
    ],
    embed: "passing-functions",
  },
  {
    id: "wire-parent",
    title: "The parent owns the callback",
    kind: "content",
    bullets: [
      "On the Lab 4 page, declare `sayHello` and pass it down",
      "Later a todo item will ask a store to delete a row the same way",
    ],
    code: `const sayHello = (message: string) => {
  alert(message);
};

<PassingFunctions message="Hello from Lab 4" theFunction={sayHello} />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/page.tsx",
    codeAddedLines: [[1, 3], 5],
  },
  {
    id: "recap",
    title: "Data and functions recap",
    kind: "content",
    bullets: [
      "Need an argument? Wrap the call in `() => …`",
      "Need parent behavior? Pass the function as a prop",
      "Never call the handler while React is rendering",
    ],
  },
  {
    id: "next-up",
    title: "Next: useState and the counter",
    kind: "title",
    bullets: [
      "A click that only alerts does not change the page",
      "§4.2.4: a `let` stays at 7; `useState` paints again",
    ],
  },
];
