import type { LectureSlide } from "../types";

export const SHARING_PARENT_CHILD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Sharing Parent and Child",
      "§4.3.1 · lift the value, pass the setter",
    ],
  },
  {
    id: "purpose",
    title: "useState is local until you lift it",
    kind: "content",
    bullets: [
      "A sibling cannot read another component’s `useState`",
      "Move the value and setter to a parent both can reach",
      "Pass them down as props — the child displays and calls the setter",
      "That is enough for a few components. Larger trees need a store",
    ],
  },
  {
    id: "parent",
    title: "The parent owns the counter",
    kind: "demo",
    bullets: [
      "`useState(123)` lives in `ParentStateComponent`",
      "Both `counter` and `setCounter` go to the child as attributes",
      "The child’s heading and the parent’s heading stay in sync",
    ],
    code: `"use client";

import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);
  return (
    <div id="wd-parent-state">
      <h2>Counter {counter}</h2>
      <ChildStateComponent
        counter={counter}
        setCounter={setCounter}
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ParentStateComponent.tsx",
    codeHighlightLines: [7, [11, 14]],
    embed: "parent-child-state",
  },
  {
    id: "child",
    title: "The child does not own the data",
    kind: "content",
    bullets: [
      "Type the props: `counter: number` and `setCounter: (n: number) => void`",
      "Increment calls `setCounter(counter + 1)` — the parent re-renders both",
      "Same pattern as passing `theFunction` in §4.2.3",
    ],
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
      >
        Increment
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ChildStateComponent.tsx",
    codeHighlightLines: [[1, 6], 13],
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
      "§4.3.2–4.3.3: drilling, then encode the next page in the URL",
    ],
  },
];
