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
    title: "State is data that can change",
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
    kind: "demo",
    bullets: [
      "`count++` updates memory. The heading stays at 7",
      "React never saw a state change, so the virtual DOM is the same",
      "Click Up and Down here — the number does not move",
    ],
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
        }}
        id="wd-counter-broken-up-click"
      >
        Up
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/CounterBroken.tsx",
    codeHighlightLines: [4, [10, 12]],
    embed: "counter-broken",
  },
  {
    id: "working",
    title: "setCount queues a new render",
    kind: "demo",
    bullets: [
      "`useState(7)` seeds the heading. Up and Down call the setter",
      "React diffs the virtual DOM and writes the heading to the real one",
      "Same integer you will rebuild with Context, Zustand, and Redux",
    ],
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
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/Counter.tsx",
    codeAddedLines: [3, 6, 12, 19],
    embed: "counter",
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
