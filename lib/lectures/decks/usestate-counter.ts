import type { LectureSlide } from "../types";

export const USESTATE_COUNTER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · useState and the Counter",
      "§4.2.4 · a setter that tells React to paint",
    ],
  },
  {
    id: "purpose",
    title: "Implementing useState",
    kind: "content",
    bullets: [
      "React turns data structures into a user interface",
      "Until now that data was static JSON. Clicks must rewrite it",
      "Controllers handle events; React turns the new state into DOM",
      "A virtual DOM lets React skip real-DOM writes that did not change",
    ],
  },
  {
    id: "hook-pair",
    title: "useState returns a pair",
    kind: "content",
    bullets: [
      "`const [count, setCount] = useState(7)`",
      "The first item is the current value. The second is the mutator",
      "Calling the setter queues a render so the heading can move",
      "A plain `let` can change in memory and the heading stays put",
    ],
    code: `const [stateVariable, setStateVariable] = useState(initialStateValue);`,
    codeLanguage: "tsx",
  },
  {
    id: "broken",
    title: "A let does not notify React",
    kind: "content",
    code: `"use client";

export default function CounterBroken() {
  let count = 7;
  return (
    <div id="wd-counter-broken">
      <h2>Broken Counter: {count}</h2>
      <button
        type="button"
        onClick={() => {
          count++;
          console.log(count);
        }}
        id="wd-counter-broken-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => {
          count--;
          console.log(count);
        }}
        id="wd-counter-broken-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/CounterBroken.tsx",
    codeHighlightLines: [4, 11, 12, 21, 22],
  },
  {
    id: "broken-live",
    title: "CounterBroken: live demo",
    kind: "demo",
    bullets: [
      "`count++` updates memory. The heading stays at 7",
      "Open the console: count changes there, the heading does not",
      "React never saw a state change, so the virtual DOM is the same",
      "Click Up and Down here — the number does not move",
    ],
    embed: "counter-broken",
  },
  {
    id: "working",
    title: "setCount queues a new render",
    kind: "content",
    code: `"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  return (
    <div id="wd-counter">
      <h2>Counter: {count}</h2>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/Counter.tsx",
    codeAddedLines: [3, 6, 12, 20],
  },
  {
    id: "working-live",
    title: "Counter: live demo",
    kind: "demo",
    bullets: [
      "`useState(7)` seeds the heading. Up and Down call the setter",
      "React compares an in-memory copy of the page (the **virtual DOM**) and writes only the heading to the real DOM",
      "Later decks share this same integer across components",
    ],
    embed: "counter",
  },
  {
    id: "hooks",
    title: "What a hook is",
    kind: "content",
    bullets: [
      "A **hook** is a function whose name starts with `use` that a component calls to get something React or Next.js provides",
      "A **render** is one call of your component that produces its JSX, on first appearance and on every state or props change",
      "A local variable is created fresh each render, so CounterBroken kept showing 7. `useState` remembers a value between renders",
    ],
  },
  {
    id: "effects",
    title: "useEffect reaches outside",
    kind: "content",
    bullets: [
      "An **effect** is code that reaches outside the component, such as reading the window size",
      "`useEffect(fn, deps)` runs `fn` after render and paint, and again only when a value in the **dependency array** `deps` changes",
      "The §3.7.4 window demo read `window` in `useEffect`. The geolocation demo kept coordinates in `useState`",
    ],
  },
  {
    id: "hook-rules",
    title: "The rules of hooks",
    kind: "content",
    bullets: [
      "Call hooks only at the top level of a component, never in loops, conditions, or nested functions",
      "React then sees the same hooks in the same order on every render",
      "Most hooks need a Client Component, which is why each one so far started with `\"use client\"`",
    ],
  },
  {
    id: "hooks-table",
    title: "The hooks so far",
    kind: "content",
    bullets: [
      "The first three come from Next.js. `useState` and `useEffect` come with React",
    ],
    diagram: "hooks-table",
  },
  {
    id: "recap",
    title: "Counter recap",
    kind: "content",
    bullets: [
      "`let` changes silently. `useState` asks React to paint",
      "Pass the next value to the setter — `setCount(count + 1)`",
      "Next subsections use the same hook for other types",
    ],
  },
  {
    id: "next-up",
    title: "Next: form state types",
    kind: "title",
    bullets: [
      "Boolean, string, date, object, and array — same hook",
      "§4.2.5–4.2.9: `checked`, `value`, and spread copies",
    ],
  },
];
