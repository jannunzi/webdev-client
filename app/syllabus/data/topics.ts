import type { IsoDate, LectureTopic } from "./types";

/**
 * Shared Fall 2026 lecture sequence, aligned to the book.
 * Chapter 1 starts the week of Monday 2026-09-14 for every section.
 * Ideal spine is 14 slots (Ch1–Ch6 × 2 weeks + X1 + X2). The term has 13
 * shared Monday-weeks through last day of classes, so Chapter 3 weeks 1–2
 * are combined into one meeting. Holidays do not skip a slot.
 */
export const SHARED_CURRICULUM_START: IsoDate = "2026-09-14";

export const ORIENTATION_TOPIC =
  "Orientation and syllabus — Chapter 1 begins the week of September 14";

export const lectureTopics: LectureTopic[] = [
  {
    topic:
      "Chapter 1 week 1 — Building Next.js user interfaces with HTML: introduction, environment, and HTML foundations",
  },
  {
    topic:
      "Chapter 1 week 2 — HTML forms, navigation, and layouts; prototyping Kambaz (A1)",
  },
  {
    topic:
      "Chapter 2 week 1 — Styling user interfaces with CSS and Tailwind (A2)",
  },
  {
    topic: "Chapter 2 week 2 — Styling Kambaz with CSS and Tailwind",
  },
  {
    topic:
      "Chapter 3 — Creating single-page applications with JavaScript: language, data-driven UI, and chapter wrap (A3)",
  },
  {
    topic: "X1 midterm — Chapters 1–3",
  },
  {
    topic:
      "Chapter 4 week 1 — Managing client state: events, forms, useState, and React Context",
  },
  {
    topic:
      "Chapter 4 week 2 — Zustand stores and adding state to Kambaz (A4)",
  },
  {
    topic:
      "Chapter 5 week 1 — Implementing RESTful Web APIs with Express.js; Next.js route handlers (A5)",
  },
  {
    topic:
      "Chapter 5 week 2 — The Kambaz Node.js HTTP server and HTTP clients",
  },
  {
    topic:
      "Chapter 6 week 1 — Integrating React with MongoDB: Compass, collections, and Mongoose (A6)",
  },
  {
    topic:
      "Chapter 6 week 2 — Atlas, sessions, and wiring Kambaz to a database",
  },
  {
    topic: "X2 final — Chapters 4–6",
  },
];
