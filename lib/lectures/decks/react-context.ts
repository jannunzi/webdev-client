import type { LectureSlide } from "../types";

export const REACT_CONTEXT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · React Context",
      "§4.4 · a provider for a stable shared value",
    ],
  },
  {
    id: "purpose",
    title: "Skip the middle props",
    kind: "content",
    bullets: [
      "A parent publishes a value. Any descendant can read it",
      "Right tool: theme, signed-in user, current course id",
      "Wrong tool: a list every keystroke rewrites — every consumer re-renders",
      "Kambaz will use this pattern for who is signed in — not courses",
    ],
  },
  {
    id: "context-file",
    title: "Context, provider, and a hook",
    kind: "content",
    bullets: [
      "`createContext` starts `null` so a missing wrap is detectable",
      "The provider holds `useState(7)` — same seed as §4.2.4",
      "`useCounterContext` throws if you forget the provider",
    ],
    code: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CounterContextValue = {
  count: number;
  setCount: (count: number) => void;
};

const CounterContext = createContext<CounterContextValue | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(7);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  const value = useContext(CounterContext);
  if (!value) {
    throw new Error("useCounterContext must be used inside CounterProvider");
  }
  return value;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/CounterContext.tsx",
    codeHighlightLines: [10, [12, 18], [21, 27]],
  },
  {
    id: "siblings",
    title: "Two siblings, no props between",
    kind: "demo",
    bullets: [
      "`ContextCounterRead` only needs `count`",
      "`ContextCounterWrite` calls `setCount` — the reader updates",
      "Wrap both in `<CounterProvider>` on `ContextExamples`",
    ],
    code: `export default function ContextExamples() {
  return (
    <div id="wd-context-examples">
      <h2>React Context</h2>
      <CounterProvider>
        <ContextCounterRead />
        <ContextCounterWrite />
      </CounterProvider>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextExamples.tsx",
    codeAddedLines: [[5, 8]],
    embed: "context-counter",
  },
  {
    id: "writer",
    title: "The writer calls the setter",
    kind: "content",
    bullets: [
      "`const { count, setCount } = useCounterContext()`",
      "Up and Down are the same arrows as the `useState` counter",
      "On your own: a Context todo list — do not put Kambaz courses here",
    ],
    code: `export default function ContextCounterWrite() {
  const { count, setCount } = useCounterContext();
  return (
    <div id="wd-context-counter-write">
      <button type="button" onClick={() => setCount(count + 1)}>
        Up
      </button>
      <button type="button" onClick={() => setCount(count - 1)}>
        Down
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/context/ContextCounterWrite.tsx",
    codeHighlightLines: [2, 5, 8],
  },
  {
    id: "recap",
    title: "Context recap",
    kind: "content",
    bullets: [
      "Provider + hook + throw if missing — that is the whole pattern",
      "Stable values only. Lists that change often belong in Zustand",
      "§4.10.5 wraps Kambaz in `AccountProvider` the same way",
    ],
  },
  {
    id: "next-up",
    title: "Next: Zustand",
    kind: "title",
    bullets: [
      "No provider. Import a hook. Select the fields you read",
      "§4.5.1: the same counter, then a todo list",
    ],
  },
];
