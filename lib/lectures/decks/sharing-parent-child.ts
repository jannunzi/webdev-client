import type { LectureSlide } from "../types";

export const SHARING_PARENT_CHILD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Sharing Parent and Child",
      "Lift the value, pass the setter",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Parent-Child State Sharing",
    kind: "content",
    bullets: [
      "A sibling cannot read another component’s `useState`",
      "Move the value and setter to a parent both can reach",
      "Pass them down as props — the child displays and calls the setter",
      "That is enough for a few components. Larger trees need a store",
    ],
  },
  {
    id: "child-intro",
    title: "Sharing a Counter with a Child",
    kind: "content",
    bullets: [
      "Goal: a child shows a counter and increments it, but the parent owns it",
      "The parent passes both the value and the function that changes it",
      "The next slide builds the child, then the parent",
    ],
  },
  {
    id: "child",
    title: "The child does not own the data (code)",
    kind: "content",
    code: `export default function ChildStateComponent({
  counter,
  setCounter,
}: {
  counter: number;
  setCounter: (counter: number) => void;
}) {
  return (
    <div id="wd-child-state">
      <h3>Counter {counter}</h3>
      <button
        type="button"
        onClick={() => setCounter(counter + 1)}
        id="wd-increment-child-state-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => setCounter(counter - 1)}
        id="wd-decrement-child-state-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Decrement
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ChildStateComponent.tsx",
    codeHighlightLines: [1, 2, 3, 4, 5, 6, 13],
  },
  {
    id: "parent",
    title: "The parent owns the counter",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);
  return (
    <div id="wd-parent-state">
      <h2>Counter {counter}</h2>
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ParentStateComponent.tsx",
    codeHighlightLines: [7],
  },
  {
    id: "parent-live",
    title: "ParentStateComponent: live demo",
    kind: "demo",
    bullets: [
      "`useState(123)` lives in `ParentStateComponent`",
      "Both `counter` and `setCounter` go to the child as attributes",
      "The child’s heading and the parent’s heading stay in sync",
    ],
    embed: "parent-child-state",
  },
  {
    id: "recap",
    title: "Sharing recap",
    kind: "content",
    bullets: [
      "Declare state where every reader can reach it — usually a parent",
      "Pass the value and the setter. The child never calls `useState` for that data",
      "Next: the same pass-through gets painful when a grandchild needs it",
    ],
  },
  {
    id: "next-up",
    title: "Next: prop drilling and URLs",
    kind: "title",
    bullets: [
      "A middle component that only forwards props is a smell",
      "Drilling, then encode the next page in the URL",
    ],
  },
];
