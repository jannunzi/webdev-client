import type { LectureSlide } from "../types";

export const USE_EFFECT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Side Effects with useEffect",
      "§4.7 · work that is not the return value",
    ],
  },
  {
    id: "purpose",
    title: "Render is a transformation",
    kind: "content",
    bullets: [
      "The component body should compute JSX from props and state",
      "Talking to `document`, a timer, or a network is a side effect",
      "Those belong in `useEffect`, which runs after React paints",
      "Do not `fetch` or set `document.title` in the function body",
    ],
  },
  {
    id: "deps",
    title: "The dependency array is the when",
    kind: "content",
    bullets: [
      "`[name, count]` re-runs the effect when either value changes",
      "`[]` runs only after the first paint — later chapters load data that way",
      "Omit the array and the effect runs after every paint — rarely useful",
    ],
  },
  {
    id: "demo",
    title: "Title follows name and clicks",
    kind: "demo",
    bullets: [
      "Type in the field and click the button. Watch the browser tab",
      "The title string is `` `${name} — clicked ${count}` ``",
      "Kambaz Profile will use `[]` to copy the current user after mount",
    ],
    code: `"use client";

import { useEffect, useState } from "react";

export default function Effect() {
  const [name, setName] = useState("Kambaz");
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`\${name} — clicked \${count}\`;
  }, [name, count]);

  return (
    <div id="wd-use-effect">
      <h2>useEffect</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        id="wd-effect-name"
      />
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-effect-count-click"
      >
        Clicked {count}
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/Effect.tsx",
    codeHighlightLines: [[9, 11]],
    embed: "use-effect",
  },
  {
    id: "later",
    title: "Where Kambaz uses the same hook",
    kind: "content",
    bullets: [
      "Profile: if nobody is signed in, redirect; else fill the form",
      "Chapter 5: load welcome messages and arrays from an HTTP server",
      "Practice the hook here so those screens are not the first time",
    ],
  },
  {
    id: "recap",
    title: "useEffect recap",
    kind: "content",
    bullets: [
      "JSX in the return. Side effects in `useEffect`",
      "List every value the effect reads in the dependency array",
      "Empty array = once after mount. No array = every paint",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check before stateful Kambaz",
      "§4.9: events, `useState`, Context, Zustand, `useEffect`",
    ],
  },
];
