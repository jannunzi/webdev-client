import type { LectureSlide } from "../types";

export const CH3_CHECK_UNDERSTANDING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Check Your Understanding",
      "§3.8 · a self-check before Kambaz data",
    ],
  },
  {
    id: "purpose",
    title: "Pause and test the JavaScript",
    kind: "content",
    bullets: [
      "The practice quiz draws **10 items** from this chapter",
      "It is a self-check, not part of the course grade",
      "Misses link back to the subsection you should reread",
      "Each new attempt draws a different 10",
    ],
  },
  {
    id: "topics",
    title: "What the quiz samples",
    kind: "content",
    bullets: [
      "`var` / `let` / `const`, `===`, ternaries, arrows",
      "`map` / `filter` / `find`, spread, destructuring, JSON",
      "Client vs server, `\"use client\"`, list `key`s",
      "`reduce` and `?.`",
    ],
  },
  {
    id: "lab-checklist",
    title: "Lab 3 coverage before you quiz",
    kind: "content",
    bullets: [
      "§3.7.5 is the Lab 3 checklist — import every component in order",
      "Complete each section’s On your own and With AI blocks",
      "Give every mapped JSX sibling a `key`",
      "Kambaz later in the chapter is the application you keep",
    ],
  },
  {
    id: "where",
    title: "Open the practice quiz",
    kind: "content",
    bullets: [
      "Book: `/book/ch3#sec-3-8` — the Check Your Understanding card",
      "Or `/book/practice` and pick the Chapter 3 lab bank",
      "Then come back here and start the data-driven Kambaz decks",
    ],
  },
  {
    id: "recap",
    title: "Chapter 3 so far",
    kind: "content",
    bullets: [
      "Values, decisions, functions, then arrays and objects",
      "Style and components can follow data. Server vs client is a file directive",
      "The next screens keep Kambaz — JSON in, `map` / `filter` / `find` out",
    ],
  },
  {
    id: "next-up",
    title: "Next: data-driven Kambaz",
    kind: "title",
    bullets: [
      "Labs were throwaway drills. Kambaz is the app you keep",
      "§3.9: a Database folder, then each screen reads it",
    ],
  },
];
