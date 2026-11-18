import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

export const KAMBAZ_MIGRATE_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
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
    title: "Moving Kambaz Data to the Server",
    kind: "content",
    diagram: "migrate-db",
    bullets: [
      "Dashboard Add, Edit, and Delete still reset on refresh: the data lives in the browser",
      "Data on the server survives refresh and is shared by every browser",
      "Copy the Chapter 3 JSON files into `webdev-server/Kambaz/Database`",
      "Chapter 6 swaps these files for a database; the URLs stay the same",
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
    links: [
      "https://kambaz.dev/downloads/kambaz-database/courses.json",
      "https://kambaz.dev/downloads/kambaz-database/modules.json",
      "https://kambaz.dev/downloads/kambaz-database/assignments.json",
      "https://kambaz.dev/downloads/kambaz-database/users.json",
      "https://kambaz.dev/downloads/kambaz-database/enrollments.json",
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
    id: "barrel-intro",
    title: "Collecting the JSON in One File",
    kind: "content",
    bullets: [
      "Collect every JSON import in `Database/index.ts` and re-export one object so the server loads them together",
      "This file is a barrel: an `index.ts` that re-exports a folder so other code imports from one place",
      "One short import, `import db from \"./Kambaz/Database\"`, instead of one import per file",
      "Callers do not need the individual file names",
      "Adding a file means updating only the barrel",
    ],
  },
  {
    id: "barrel",
    title: "Re-exporting Data from a Barrel",
    kind: "demo",
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
