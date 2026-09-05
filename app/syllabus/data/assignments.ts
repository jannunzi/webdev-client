import type { AssignmentItem } from "./types";

export const assignmentsIntro = [
  "Six assignments (A1–A6) implement Kambaz incrementally. Each one corresponds to a chapter of the interactive book. Later assignments build on earlier ones — do not skip ahead and leave a hole in the stack.",
  "Due dates are one Canvas calendar for CS 4550 and both CS 5610 sections. They do not slide if your section starts later. CS 5610-02 (first class September 14) has less runway before A1.",
  "Unless a handout says otherwise, submit (1) a public GitHub repository and (2) a Vercel URL that is running the work for that assignment. The repository must contain the source that produced the deployment.",
];

export const assignments: AssignmentItem[] = [
  {
    id: "A1",
    title: "HTML user interfaces",
    chapter: "Chapter 1",
    summary:
      "Build the Labs HTML work (Lab 1 components and Labs navigation) and prototype Kambaz structure screens with HTML and the App Router: landing, Account, Dashboard, course Home, Modules, and Assignments. Structure first; visual polish comes in A2.",
  },
  {
    id: "A2",
    title: "CSS and Tailwind",
    chapter: "Chapter 2",
    summary:
      "Style the prototype with CSS fundamentals and Tailwind utility classes. Navigation, Dashboard, Modules, and related screens should start to resemble the target product.",
  },
  {
    id: "A3",
    title: "JavaScript and data-driven UI",
    chapter: "Chapter 3",
    summary:
      "Replace hardcoded markup with data. Render courses, modules, and people from JSON; encode IDs in the URL; keep the UI in sync with the structures you define.",
  },
  {
    id: "A4",
    title: "Client state",
    chapter: "Chapter 4",
    summary:
      "Make the UI editable. Use React state for forms and Zustand stores for shared Kambaz data (courses, modules, account). Redux labs are literacy; the assignment store is Zustand.",
  },
  {
    id: "A5",
    title: "RESTful Web APIs",
    chapter: "Chapter 5",
    summary:
      "Move the database off the client. Implement a Node.js / Express HTTP server (and the Next.js route-handler labs) so Kambaz reads and writes over HTTP.",
  },
  {
    id: "A6",
    title: "MongoDB",
    chapter: "Chapter 6",
    summary:
      "Persist courses, modules, users, and related documents in MongoDB with Mongoose. Connect locally and through Atlas so a refresh no longer wipes the semester’s work.",
  },
];
