import type { LectureSlide } from "../types";

export const CH4_CHECK_UNDERSTANDING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Check Your Understanding",
      "§4.9 · a self-check before Kambaz state",
    ],
  },
  {
    id: "purpose",
    title: "Pause and test client state",
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
      "`\"use client\"`, event wrappers, `useState` vs `let`",
      "Controlled `value` / `onChange`, spreading objects and arrays",
      "Parent state vs prop drilling, query vs path parameters",
      "When Context is the wrong store, Zustand selectors, `useEffect` deps",
    ],
  },
  {
    id: "lab-checklist",
    title: "Lab 4 coverage before you quiz",
    kind: "content",
    bullets: [
      "§4.8 is the Lab 4 checklist — import every component in order",
      "Complete each section’s On your own and With AI blocks",
      "Redux in §4.6 is literacy. Kambaz will not use those reducers",
      "Kambaz later in the chapter is the application you keep",
    ],
  },
  {
    id: "where",
    title: "Open the practice quiz",
    kind: "content",
    bullets: [
      "Book: `/book/ch4#sec-4-9` — the Check Your Understanding card",
      "Or `/book/practice` and pick the Chapter 4 lab bank",
      "Then come back here and start the stateful Kambaz decks",
    ],
  },
  {
    id: "recap",
    title: "Chapter 4 so far",
    kind: "content",
    bullets: [
      "Events, then `useState`, then sharing through a parent or the URL",
      "Context for a stable tree value. Zustand for lists many screens mutate",
      "The next screens keep Kambaz — Add, Edit, and Delete start to work",
    ],
  },
  {
    id: "next-up",
    title: "Next: a courses store",
    kind: "title",
    bullets: [
      "Dashboard `useState` alone would not name a new course on Home",
      "§4.10.1: Zustand holds the published list",
    ],
  },
];
