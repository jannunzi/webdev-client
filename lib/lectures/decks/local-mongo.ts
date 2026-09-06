import type { LectureSlide } from "../types";

export const LOCAL_MONGO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Local MongoDB",
      "§6.1 · install, Compass, then kambaz",
    ],
  },
  {
    id: "purpose",
    title: "Arrays die when Node restarts",
    kind: "content",
    bullets: [
      "Chapter 5 stored courses and users in process memory",
      "Restart `nodemon` and Dashboard reseeds from JSON files",
      "MongoDB keeps **documents** in **collections** — JSON that survives reboot",
      "This section installs a local instance before any Node code talks to it",
    ],
  },
  {
    id: "nosql",
    title: "Documents, not rows",
    kind: "content",
    bullets: [
      "SQL tables store primitive columns; documents nest objects and arrays",
      "No predefined schema — Mongoose later decides which shapes are valid",
      "A course can hold modules and lessons without three foreign-key tables",
      "Same `_id`, `username`, and `role` fields you already mapped in Account",
    ],
  },
  {
    id: "install",
    title: "Install Community as a service",
    kind: "content",
    bullets: [
      "Download MongoDB Community Server for your OS",
      "Choose **run as a service** so it starts when you log in",
      "Windows: Services dialog. macOS: System Settings MongoDB icon",
      "Leave it set to start automatically while you work this chapter",
    ],
  },
  {
    id: "manual",
    title: "Optional: Homebrew or PATH",
    kind: "demo",
    bullets: [
      "Atlas CLI can stand up a local sandbox if you prefer",
      "Or unzip, add `bin` to PATH, then `which mongod`",
    ],
    code: `brew install mongodb-atlas
atlas setup

# ~/.zshrc — version folder will differ
export PATH="$PATH:/usr/local/mongodb-macos-x86_64-8.0.4/bin"`,
    codeLanguage: "bash",
  },
  {
    id: "mongod",
    title: "mongod listens on 27017",
    kind: "demo",
    bullets: [
      "Skip this if the installer already registered a service",
      "Create `~/data`, then pass `--dbpath`. Leave that terminal open",
    ],
    code: `cd ~
mkdir data
# macOS path and version will differ
# /usr/local/mongodb-macos-aarch64-8.0.4/bin/mongod --dbpath data`,
    codeLanguage: "bash",
    interactiveHint:
      "Waiting for connections on port 27017 means Compass and later Mongoose can reach it.",
  },
  {
    id: "compass",
    title: "Connect Compass to localhost",
    kind: "demo",
    bullets: [
      "Compass is the GUI. Spotlight or the Windows search finds it",
      "New Connection should already show the local URI",
      "If Connect fails, the service or `mongod` is not listening",
    ],
    code: `mongodb://127.0.0.1:27017`,
    codeLanguage: "text",
    interactiveHint:
      "Same host and port Mongoose uses in §6.2.1.",
  },
  {
    id: "create-db",
    title: "Create kambaz and users",
    kind: "content",
    bullets: [
      "Click the connection, then Create database",
      "Database `kambaz`, first collection `users` — both names together",
      "MongoDB creates a database when the first collection is created",
      "Keep the name **kambaz** — the connection string later ends with `/kambaz`",
    ],
  },
  {
    id: "insert",
    title: "Insert one user document",
    kind: "demo",
    bullets: [
      "Select `kambaz` → `users`, then ADD DATA → Insert document",
      "Shape matches `users.json` from Chapter 3 — `_id` is a string",
    ],
    code: `{
  "_id": "123",
  "username": "iron_man",
  "password": "stark123",
  "firstName": "Tony",
  "lastName": "Stark",
  "role": "FACULTY"
}`,
    codeLanguage: "json",
    codeFile: "kambaz.users",
  },
  {
    id: "import",
    title: "Import the five JSON files",
    kind: "content",
    bullets: [
      "ADD DATA → Import JSON: `users`, `courses`, `modules`, `assignments`, `enrollments`",
      "Create a collection per file so names match later Mongoose `collection` options",
      "Confirm counts. Open one course — `name` and `_id` look like the React database",
      "Those string ids are why the user schema declares `_id` as `String`",
    ],
  },
  {
    id: "recap",
    title: "Local MongoDB recap",
    kind: "content",
    bullets: [
      "Community as a service, or `mongod --dbpath data` on 27017",
      "Compass URI `mongodb://127.0.0.1:27017`",
      "Database `kambaz`, collections imported from Chapter 3 JSON",
    ],
  },
  {
    id: "next-up",
    title: "Next: program with Mongoose",
    kind: "title",
    bullets: [
      "Install the library, connect, then schemas and a DAO",
      "§6.2.1–6.2.5: connect, env string, UserModel",
    ],
  },
];
