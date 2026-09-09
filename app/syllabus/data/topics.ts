import { BOOK_CHAPTERS } from "@/lib/lectures/types";
import type { IsoDate, LectureTopic } from "./types";

/**
 * Shared Fall 2026 lecture sequence, aligned to Jose’s Canvas modules.
 * Fourteen Monday-weeks from 2026-09-14 through 2026-12-14
 * (Ch1–Ch6 × 2 weeks + X1 + X2). Chapter 3 is two weeks. Holidays do
 * not skip a slot. The week of Dec 14 is X2 even though lastDayOfClasses
 * is Dec 13.
 */
export const SHARED_CURRICULUM_START: IsoDate = "2026-09-14";

/** Final shared Monday (X2 + project), inclusive. */
export const SHARED_CURRICULUM_END: IsoDate = "2026-12-14";

/** Alias used by Week-of / deadline tests. */
export const AGENDA_CURRICULUM_START = SHARED_CURRICULUM_START;

export const ORIENTATION_TOPIC =
  "Orientation and syllabus — Chapter 1 begins the week of September 14";

export function bookChapterHeading(chapter: number): string {
  const meta = BOOK_CHAPTERS.find((entry) => entry.chapter === chapter);
  return `Chapter ${chapter}: ${meta?.title ?? ""}`;
}

export function examModuleHeading(exam: "X1" | "X2"): string {
  return exam === "X1"
    ? "Midterm — review + X1"
    : "Final — X2 + final project";
}

export const lectureTopics: LectureTopic[] = [
  {
    chapter: 1,
    topic:
      "Chapter 1 week 1 — Building Next.js user interfaces with HTML: introduction, environment, and HTML foundations",
  },
  {
    chapter: 1,
    topic:
      "Chapter 1 week 2 — HTML forms, navigation, and layouts; prototyping Kambaz (A1)",
  },
  {
    chapter: 2,
    topic:
      "Chapter 2 week 1 — Styling user interfaces with CSS and Tailwind (A2)",
  },
  {
    chapter: 2,
    topic: "Chapter 2 week 2 — Styling Kambaz with CSS and Tailwind",
  },
  {
    chapter: 3,
    topic:
      "Chapter 3 week 1 — Creating single-page applications with JavaScript: language, functions, arrays, and JSON",
  },
  {
    chapter: 3,
    topic:
      "Chapter 3 week 2 — Data-driven UI and chapter wrap (A3)",
  },
  {
    exam: "X1",
    topic: "X1 midterm — review + Chapters 1–3",
  },
  {
    chapter: 4,
    topic:
      "Chapter 4 week 1 — Managing client state: events, forms, useState, and React Context",
  },
  {
    chapter: 4,
    topic:
      "Chapter 4 week 2 — Zustand stores and adding state to Kambaz (A4)",
  },
  {
    chapter: 5,
    topic:
      "Chapter 5 week 1 — Implementing RESTful Web APIs with Express.js; Next.js route handlers (A5)",
  },
  {
    chapter: 5,
    topic:
      "Chapter 5 week 2 — The Kambaz Node.js HTTP server and HTTP clients",
  },
  {
    chapter: 6,
    topic:
      "Chapter 6 week 1 — Integrating React with MongoDB: Compass, collections, and Mongoose (A6)",
  },
  {
    chapter: 6,
    topic:
      "Chapter 6 week 2 — Atlas, sessions, and wiring Kambaz to a database",
  },
  {
    exam: "X2",
    topic: "X2 final + project — Chapters 4–6",
  },
];
