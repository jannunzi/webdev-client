import type { LectureSlide } from "../types";

export const LOCAL_MONGO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "database",
      headline: "Local MongoDB",
    },
    bullets: [
      "Chapter 6 · Local MongoDB",
      "Install, Compass, then kambaz",
    ],
  },
  {
    id: "purpose",
    title: "Why Data Needs a Database",
    kind: "content",
    bullets: [
      "Chapter 5 stored courses and users in server memory",
      "Restart `nodemon` and every new course or user is gone",
      "MongoDB is a database that keeps **documents** in **collections** on disk",
      "This deck installs MongoDB on your laptop before any Node code talks to it",
    ],
  },
  {
    id: "nosql",
    title: "Storing Data as Documents",
    kind: "content",
    bullets: [
      "A document is a JSON object: `{ \"_id\": \"123\", \"username\": \"iron_man\" }`",
      "A collection groups documents of one kind: `users`, `courses`, `modules`",
      "SQL tables store flat columns. Documents can nest objects and arrays",
      "Same `_id`, `username`, and `role` fields you already used in Account",
    ],
  },
  {
    id: "install",
    title: "Installing MongoDB as a Service",
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
    title: "Installing MongoDB by Hand",
    kind: "demo",
    bullets: [
      "On macOS, Homebrew's Atlas command-line tool can set up a local database",
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
    title: "Starting the Database Server",
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
    title: "Browsing the Database with Compass",
    kind: "demo",
    bullets: [
      "Compass is MongoDB's desktop app for viewing and editing data",
      "New Connection should already show the local address below",
      "If Connect fails, the service or `mongod` is not running",
    ],
    code: `mongodb://127.0.0.1:27017`,
    codeLanguage: "text",
    interactiveHint:
      "Same host and port Mongoose uses next.",
  },
  {
    id: "create-db",
    title: "Creating a Database and Collection",
    kind: "content",
    bullets: [
      "Click the connection, then Create database",
      "Database `kambaz`, first collection `users` — both names together",
      "MongoDB creates a database when the first collection is created",
      "Keep the name **kambaz** — the connection string later ends with `/kambaz`",
    ],
  },
  {
    id: "insert-intro",
    title: "Inserting a Document by Hand",
    kind: "demo",
    bullets: [
      "In Compass, select `kambaz` → `users`, then ADD DATA → Insert document",
      "Paste the user below. Its shape matches `users.json` from Chapter 3",
      "`_id` is a string, so it matches the ids the app already uses",
    ],
  },
  {
    id: "insert",
    title: "Writing a User Document",
    kind: "demo",
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
    title: "Importing Collections from JSON",
    kind: "content",
    bullets: [
      "ADD DATA → Import JSON: `users`, `courses`, `modules`, `assignments`, `enrollments`",
      "Create one collection per file, named after the file",
      "Confirm counts. Open one course — `name` and `_id` look like the React database",
      "Those string ids are why the user schema later declares `_id` as `String`",
    ],
  },
  {
    id: "recap",
    title: "Local MongoDB recap",
    kind: "content",
    bullets: [
      "Community as a service, or `mongod --dbpath data` on 27017",
      "Compass address `mongodb://127.0.0.1:27017`",
      "Database `kambaz`, collections imported from Chapter 3 JSON",
    ],
  },
  {
    id: "next-up",
    title: "Next: Programming with Mongoose",
    kind: "title",
    bullets: [
      "Install the library, connect, then schemas and data access",
      "Connect, `.env` string, UserModel",
    ],
  },
];
