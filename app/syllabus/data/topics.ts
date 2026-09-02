import type { LectureTopic } from "./types";

/**
 * Shared weekly lecture sequence (one 3-hour meeting per week).
 * Projected onto each section’s weekday. Due dates live in `deadlines.ts`.
 */
export const lectureTopics: LectureTopic[] = [
  {
    topic:
      "Course introduction, syllabus, environment, and HTML foundations (Chapter 1)",
  },
  {
    topic:
      "HTML forms, navigation, and layouts; start the Kambaz prototype (A1)",
  },
  {
    topic:
      "CSS fundamentals and Tailwind — selectors, box model, utilities (Chapter 2, A2)",
  },
  {
    topic: "Styling Kambaz with Tailwind and React Icons",
  },
  {
    topic:
      "JavaScript and data-driven UI — functions, arrays, JSON rendering (Chapter 3, A3)",
  },
  {
    topic: "Events, forms, useState, and React Context (Chapter 4)",
  },
  {
    topic:
      "Zustand stores and Kambaz client state — courses, modules, account (A4)",
  },
  {
    topic: "Node.js HTTP servers and Express REST APIs (Chapter 5, A5)",
  },
  {
    topic:
      "HTTP clients, the Kambaz Node server, and Next.js route handlers",
  },
  {
    topic:
      "MongoDB locally — Compass, collections, and Mongoose (Chapter 6, A6)",
  },
  {
    topic: "Atlas, sessions, and wiring Kambaz to a database; exam / project prep",
  },
];
