import type { LectureTopic } from "./types";

/**
 * Shared lecture sequence for every section. The agenda projector assigns
 * Lecture 1, 2, 3… to each section’s own meeting dates. Due dates do not live
 * here — see `deadlines.ts`.
 */
export const lectureTopics: LectureTopic[] = [
  { topic: "Course introduction, syllabus, and HTML foundations (Chapter 1)" },
  { topic: "Development environment: Node.js, Git, Next.js App Router, Vercel" },
  { topic: "HTML structure — headings, lists, tables, images, and semantic markup" },
  { topic: "Forms, navigation, and layouts; start the Kambaz HTML prototype" },
  { topic: "Kambaz screens in HTML — Dashboard, Modules, Account, Assignments" },
  { topic: "CSS fundamentals — selectors, color, the box model (Chapter 2)" },
  { topic: "Flex, grid, and responsive CSS" },
  { topic: "Tailwind CSS — spacing, typography, and utility-first layout" },
  { topic: "Styling Kambaz with Tailwind and React Icons" },
  { topic: "JavaScript fundamentals — types, conditionals, functions (Chapter 3)" },
  { topic: "Arrays, objects, map/filter, and destructuring" },
  { topic: "Data-driven UI — rendering JSON, path parameters, breadcrumbs" },
  { topic: "Client and server components; dynamic styling" },
  { topic: "Events, forms, and useState (Chapter 4)" },
  { topic: "Sharing state, prop drilling, and React Context" },
  { topic: "Zustand stores for shared client state (Redux literacy, optional)" },
  { topic: "Kambaz client state — courses, modules, and account" },
  { topic: "Node.js HTTP servers and Express routes (Chapter 5)" },
  { topic: "RESTful Web APIs — path params, query params, JSON bodies" },
  { topic: "HTTP clients, the Kambaz Node server, and Next.js route handlers" },
  { topic: "MongoDB locally — Compass, collections, and Mongoose (Chapter 6)" },
  { topic: "Atlas, sessions, and wiring Kambaz to a database" },
];
