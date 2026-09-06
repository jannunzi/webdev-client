import type { LectureSlide } from "../types";

export const CH5_CHECK_UNDERSTANDING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Check Your Understanding",
      "§5-check · a self-check before Kambaz APIs",
    ],
  },
  {
    id: "purpose",
    title: "Pause and test HTTP APIs",
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
      "Sibling `webdev-server`, Nodemon, `\"type\": \"module\"`",
      "`NEXT_PUBLIC_HTTP_SERVER`, path vs query, `res.json`",
      "axios, CORS, `express.json()`, POST / PUT / DELETE",
      "App Router `route.ts` calculator vs Express on 4000",
    ],
  },
  {
    id: "lab-checklist",
    title: "Lab 5 coverage before you quiz",
    kind: "content",
    bullets: [
      "§5.2 is the walkthrough — multiply and divide on both encodings",
      "Welcome via axios after `cors()`, then JSON body verbs",
      "§5.3 calculator is same-origin `/api` — Express still required for Lab 5",
    ],
  },
  {
    id: "where",
    title: "Open the practice quiz",
    kind: "content",
    bullets: [
      "Book: `/book/ch5#sec-5-check` — the Check Your Understanding card",
      "Or `/book/practice` and pick the Chapter 5 lab bank",
      "Then come back here and move Kambaz onto Express",
    ],
  },
  {
    id: "recap",
    title: "Chapter 5 so far",
    kind: "content",
    bullets: [
      "A sibling HTTP server, env vars, path and query, remote JSON",
      "axios stays on the page. Route Handlers are the same-app option",
      "Kambaz next: migrate the database, then account and courses APIs",
    ],
  },
  {
    id: "next-up",
    title: "Next: migrate the database",
    kind: "title",
    bullets: [
      "Copy courses and users JSON into `webdev-server/Kambaz`",
      "§5.4.1: `.json` becomes `.js` with `export default`",
    ],
  },
];
