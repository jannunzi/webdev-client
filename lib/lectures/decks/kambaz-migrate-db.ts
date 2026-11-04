import type { LectureSlide } from "../types";

export const KAMBAZ_MIGRATE_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#C8102E",
      icon: "database",
      headline: "Migrating the Database",
    },
    bullets: [
      "Chapter 5 · Migrating the Database",
      "JSON files imported by the server",
    ],
  },
  {
    id: "purpose",
    title: "Implementing the Server Database",
    kind: "content",
    bullets: [
      "Dashboard Add / Edit / Delete still die on refresh",
      "Copy Chapter 3 JSON into `webdev-server/Kambaz/Database`",
      "URLs stay the same in Chapter 6 — only the storage changes",
    ],
  },
  {
    id: "courses-json",
    title: "Copying the Kambaz JSON Files",
    kind: "demo",
    bullets: [
      "Keep `courses.json`, `users.json`, … as JSON — no rename",
      "Keep the Chapter 3 `_id`s so the client data still lines up",
    ],
    code: `[
  { "_id": "RS101", "name": "Rocket Propulsion", "number": "RS4550",
    "startDate": "2023-01-10", "endDate": "2023-05-15",
    "department": "D123", "credits": 4, "description": "..." }
]`,
    codeLanguage: "json",
    codeFile: "webdev-server/Kambaz/Database/courses.json",
  },
  {
    id: "barrel",
    title: "Re-exporting Data from a Barrel",
    kind: "demo",
    bullets: [
      "`resolveJsonModule` lets TypeScript import each `.json` file",
      "Routes receive `db` and read `db.courses`, `db.users`, …",
      "Customize the seed if you want — the shape stays",
    ],
    code: `import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";
export default { courses, modules, assignments, users, enrollments };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Database/index.ts",
    codeHighlightLines: [[1, 5]],
    codeAddedLines: [6],
  },
  {
    id: "recap",
    title: "Recap: Migrating the Database",
    kind: "content",
    bullets: [
      "`Kambaz/Database/*.json` — imported directly, no rename",
      "Barrel `export default { courses, users, … }`",
      "Mongo replaces these arrays in Chapter 6",
    ],
  },
  {
    id: "next-up",
    title: "Next: Account REST APIs",
    kind: "title",
    bullets: [
      "A Users DAO, then signin / signup / profile / signout",
      "Axios posts credentials; Context stores the user",
    ],
  },
];
