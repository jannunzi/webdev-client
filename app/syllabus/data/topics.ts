import type { LectureTopic } from "./types";

/**
 * Ordered lecture topics assigned to non-holiday meeting dates.
 * Edit copy here; dates are generated from `meetings` + `holidays`.
 */
export const lectureTopics: LectureTopic[] = [
  {
    topic: "Course introduction, syllabus, and HTML foundations (Chapter 1)",
  },
  {
    topic: "Development environment: Node.js, Git, Next.js App Router, Vercel",
  },
  {
    topic: "HTML structure — headings, lists, tables, images, and semantic markup",
  },
  {
    topic: "Forms, navigation, and layouts; start the Kambaz HTML prototype",
    assignment: "A1 assigned — HTML",
  },
  {
    topic: "Kambaz screens in HTML — Dashboard, Modules, Account, Assignments",
    quiz: "Q1 — HTML",
  },
  {
    topic: "CSS fundamentals — selectors, color, the box model (Chapter 2)",
    assignment: "A1 due",
  },
  {
    topic: "Flex, grid, and responsive CSS",
    assignment: "A2 assigned — CSS & Tailwind",
  },
  {
    topic: "Tailwind CSS — spacing, typography, and utility-first layout",
  },
  {
    topic: "Styling Kambaz with Tailwind and React Icons",
    quiz: "Q2 — CSS & Tailwind",
  },
  {
    topic: "JavaScript fundamentals — types, conditionals, functions (Chapter 3)",
    assignment: "A2 due",
  },
  {
    topic: "Arrays, objects, map/filter, and destructuring",
    assignment: "A3 assigned — JavaScript",
  },
  {
    topic: "Data-driven UI — rendering JSON, path parameters, breadcrumbs",
  },
  {
    topic: "Client and server components; dynamic styling",
    quiz: "Q3 — JavaScript",
    assignment: "A3 due",
  },
  {
    topic: "Events, forms, and useState (Chapter 4)",
  },
  {
    topic: "Sharing state, prop drilling, and React Context",
    assignment: "A4 assigned — Client state",
  },
  {
    topic: "Zustand stores for shared client state (Redux literacy, optional)",
  },
  {
    topic: "Kambaz client state — courses, modules, and account",
    quiz: "Q4 — Client state",
    assignment: "A4 due",
  },
  {
    topic: "Node.js HTTP servers and Express routes (Chapter 5)",
    assignment: "A5 assigned — REST APIs",
  },
  {
    topic: "RESTful Web APIs — path params, query params, JSON bodies",
  },
  {
    topic: "HTTP clients, the Kambaz Node server, and Next.js route handlers",
    quiz: "Q5 — REST APIs",
  },
  {
    topic: "MongoDB locally — Compass, collections, and Mongoose (Chapter 6)",
    assignment: "A5 due · A6 assigned — MongoDB",
  },
  {
    topic: "Atlas, sessions, and wiring Kambaz to a database",
    quiz: "Q6 — MongoDB",
  },
  {
    topic: "Review: full-stack Kambaz walkthrough and exam preparation",
    assignment: "A6 due",
    exam: "Exam this week",
  },
  {
    topic: "Exam",
    exam: "Exam",
  },
  {
    topic: "Project workshop — deploy, document, and polish",
  },
  {
    topic: "Project presentations and course close",
    assignment: "Project due",
  },
];
