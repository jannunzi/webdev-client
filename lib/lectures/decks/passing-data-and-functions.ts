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
    title: "Handlers often need an argument",
    kind: "content",
    bullets: [
      "Which item to delete, which string to alert, which two numbers to add",
      "`onClick={add(2, 3)}` calls `add` during render and passes `undefined`",
      "Wrap the call: `onClick={() => add(2, 3)}` so it waits for the click",
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
    title: "Functions are values too",
    kind: "content",
    bullets: [
      "A parent can pass a function the child does not own",
      "The child only knows the type `(message: string) => void` and calls it with a string",
      "Lab 4 itself is a Client Component so it can create `sayHello`",
    ],
  },
  {
    id: "passing-functions",
    title: "theFunction is a prop",
    kind: "content",
    code: `"use client";

export default function PassingFunctions({
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
    codeHighlightLines: [[3, 9], 15],
  },
  {
    id: "passing-functions-live",
    title: "PassingFunctions: live demo",
    kind: "demo",
    bullets: [
      "Type the props: `message: string`, `theFunction: (message: string) => void`",
      "The child calls `theFunction(`From parent: ${message}`)` on click",
      "The child does not know the alert text. The parent does",
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
