import { COVER_MONGO } from "../cover-colors";
import type { LectureSlide } from "../types";

export const LOCAL_MONGO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_MONGO,
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
    title: "Implementing a Local MongoDB",
    kind: "content",
    bullets: [
      "Chapters 3–5 already built the UI, client, routes, and the in-memory DAO",
      "Chapter 6 adds MongoDB on `127.0.0.1:27017`. Atlas replaces `127.0.0.1` later",
    ],
    diagram: "mongo-roadmap",
  },
  {
    id: "nosql",
    title: "Documents, not rows",
    kind: "content",
    bullets: [
      "SQL stores flat rows. A document can nest modules in an array",
      "Kambaz keeps a modules collection and stores the course id",
    ],
    diagram: "sql-vs-document",
  },
  {
    id: "install",
    title: "Install Community as a service",
    kind: "content",
    bullets: [
      "Download MongoDB Community Server for your OS",
      "Choose **run as a service** so MongoDB Community starts when you log in",
      "Windows: Services. macOS: System Settings. Linux: `systemctl`",
      "Leave MongoDB Community set to start automatically for this chapter",
    ],
  },
  {
    id: "manual-macos",
    title: "macOS: Homebrew or a PATH",
    kind: "demo",
    bullets: [
      "Atlas CLI can stand up a local sandbox",
      "Or unzip under `/usr/local` and add `bin` to PATH",
    ],
    code: `brew install mongodb-atlas
atlas setup

# ~/.zshrc — version folder will differ
export PATH="$PATH:/usr/local/\\
mongodb-macos-x86_64-8.0.4/bin"

# /usr/local/mongodb-macos-aarch64-8.0.4/\\
# bin/mongod --dbpath data`,
    codeLanguage: "bash",
  },
  {
    id: "manual-windows",
    title: "Windows: unzip and add PATH",
    kind: "demo",
    bullets: [
      "Unzip under `C:\\Program Files`",
      "Win+R, `sysdm.cpl`, Advanced, Environment Variables, edit Path",
    ],
    code: `# version folder will differ
# C:\\Program Files\\
# mongodb-windows-x86_64-8.0.4\\bin

# C:\\Program Files\\
# mongodb-windows-x86_64-8.0.4\\bin\\
# mongod --dbpath data`,
    codeLanguage: "bash",
  },
  {
    id: "manual-linux",
    title: "Linux: mongodb-org and systemctl",
    kind: "demo",
    bullets: [
      "MongoDB's apt or yum repo, not the distro `mongodb` package",
      "Package data dir: `/var/lib/mongodb` or `/var/lib/mongo`",
      "Tarball: copy `bin` to `/usr/local/bin`, then `--dbpath`",
    ],
    code: `# Ubuntu
sudo apt-get install -y mongodb-org
# RHEL
sudo yum install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod`,
    codeLanguage: "bash",
  },
  {
    id: "start-compass",
    title: "Start mongod and Connect Compass",
    kind: "demo",
    bullets: [
      "Skip `mongod --dbpath` when the MongoDB service already listens on port `27017`",
      "Otherwise create `data` and pass `--dbpath`",
      "Connect fails when `mongod` is not listening",
    ],
    code: `cd ~
mkdir data
mongod --dbpath data

mongodb://127.0.0.1:27017`,
    codeLanguage: "bash",
    interactiveHint:
      "Port 27017 is the Compass New Connection URI and the host Mongoose uses next.",
  },
  {
    id: "create-user",
    title: "Create kambaz.users and Insert a User",
    kind: "demo",
    bullets: [
      "Create database `kambaz` and collection `users` together",
      "Keep **kambaz** — the URI later ends with `/kambaz`",
      "ADD DATA → Insert document. `_id` is a string",
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
      "Connect, env string, UserModel",
    ],
  },
];
