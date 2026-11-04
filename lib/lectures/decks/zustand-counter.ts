import type { LectureSlide } from "../types";

export const ZUSTAND_COUNTER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Zustand Counter",
      "A store hook with no Provider",
    ],
  },
  {
    id: "purpose",
    title: "Implementing a Zustand Counter",
    kind: "content",
    bullets: [
      "Zustand (German for state) is a small, popular library for shared state",
      "Its docs use a joke about bears. It is not a misspelling of bare",
      "A store holds values and the functions that change them",
      "Any component imports the store's hook; no provider is needed",
    ],
  },
  {
    id: "store-intro",
    title: "Planning a Counter Store",
    kind: "content",
    bullets: [
      "Goal: a store holding a count, plus up and down functions",
      "It starts at 7, the same as the Context and useState counters",
      "The next slide builds the store, then a component that uses it",
    ],
  },
  {
    id: "store",
    title: "State and functions on one object (code)",
    kind: "content",
    code: `import { create } from "zustand";

type CounterStore = {
  count: number;
  up: () => void;
  down: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 7,
  up: () => set((state) => ({ count: state.count + 1 })),
  down: () => set((state) => ({ count: state.count - 1 })),
}));`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/counterStore.ts",
    codeHighlightLines: [[11, 15]],
  },
  {
    id: "component",
    title: "Select count, up, and down",
    kind: "content",
    code: `import { useCounterStore } from "./counterStore";

export default function ZustandCounter() {
  const count = useCounterStore((state) => state.count);
  const up = useCounterStore((state) => state.up);
  const down = useCounterStore((state) => state.down);
  return (
    <div id="wd-zustand-counter">
      <h3>Zustand Counter: {count}</h3>
      <button
        type="button"
        onClick={up}
        id="wd-zustand-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={down}
        id="wd-zustand-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/zustand/ZustandCounter.tsx",
    codeHighlightLines: [4, 5, 6],
  },
  {
    id: "component-live",
    title: "ZustandCounter: live demo",
    kind: "demo",
    bullets: [
      "Three selector calls — this component rerenders when `count` changes",
      "`onClick={up}` — the store already owns the increment",
    ],
    embed: "zustand-counter",
  },
  {
    id: "recap",
    title: "Zustand counter recap",
    kind: "content",
    bullets: [
      "Import the hook. No wrap. Select the slices you read",
      "`set((state) => …)` when the next value depends on the last",
      "Context still wins for a rare, tree-wide value like who is signed in",
    ],
  },
  {
    id: "next-up",
    title: "Next: a Zustand todo list",
    kind: "title",
    bullets: [
      "Array plus a draft, then add / update / delete",
      "The create, read, update, and delete (CRUD) Kambaz will reuse for courses",
    ],
  },
];
