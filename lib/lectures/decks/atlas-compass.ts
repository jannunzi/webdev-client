import type { LectureSlide } from "../types";

export const ATLAS_COMPASS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#00684A",
      icon: "cloud",
      headline: "Connecting Compass to Atlas",
    },
    bullets: [
      "Chapter 6 · Atlas Compass",
      "Connect, then import JSON",
    ],
  },
  {
    id: "purpose",
    title: "Viewing Cloud Data in Compass",
    kind: "content",
    bullets: [
      "Local Compass is still on `mongodb://127.0.0.1:27017`",
      "The cluster you just created needs its own Compass window",
      "Import the same five JSON files so counts match localhost",
    ],
  },
  {
    id: "copy",
    title: "Copying the Compass Connection String",
    kind: "demo",
    bullets: [
      "In Atlas, choose a connection method → Compass",
      "Copy the string from **Access your data through tools**",
      "The host will differ. Scheme, username, password, and hostname matter",
    ],
    code: `mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`,
    codeLanguage: "text",
    interactiveHint:
      "This is the Compass string. The Drivers string later adds `/kambaz?`.",
  },
  {
    id: "paste",
    title: "Opening Atlas in a New Compass Window",
    kind: "content",
    bullets: [
      "Click Done in Atlas, then Compass → Connect → New Window",
      "Paste the connection string and click Connect",
      "Compass is now talking to the cloud — not `127.0.0.1`",
      "Leave the localhost connection open for daily development",
    ],
  },
  {
    id: "create",
    title: "Creating the kambaz Database on Atlas",
    kind: "content",
    bullets: [
      "Same steps as the local Compass setup: Create database, name `kambaz`",
      "First collection can be `users` — Mongo creates the database with it",
      "Keep the name **kambaz** — the Node.js connection string later ends with `/kambaz?`",
    ],
  },
  {
    id: "import",
    title: "Importing Collections into Atlas",
    kind: "content",
    bullets: [
      "ADD DATA → Import JSON for `courses`, `modules`, `users`, `assignments`, `enrollments`",
      "Confirm document counts match the localhost Compass window",
      "Edits on localhost do not appear on Atlas until you import or the app writes",
    ],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "two",
    title: "Keeping Local and Cloud Connections",
    kind: "demo",
    bullets: [
      "Local string stays `mongodb://127.0.0.1:27017` for `nodemon`",
      "Remote string is `mongodb+srv://…` for Render and the project",
      "Dashboard on Vercel reads Atlas. Dashboard on localhost reads `mongod`",
    ],
    codeBlocks: [
      {
        file: "localhost",
        language: "text",
        code: `mongodb://127.0.0.1:27017`,
      },
      {
        file: "Atlas / Compass",
        language: "text",
        code: `mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`,
        addedLines: [1],
      },
    ],
  },
  {
    id: "recap",
    title: "Compass recap",
    kind: "content",
    bullets: [
      "New Compass window, `mongodb+srv` string, Connect",
      "Create `kambaz` if needed, then import all five JSON files",
      "Two connections: laptop for labs, Atlas for Render and 12/7",
    ],
  },
  {
    id: "next-up",
    title: "Next: Connecting Node.js to Atlas",
    kind: "title",
    bullets: [
      "Network Access, then the Drivers string with `/kambaz?`",
      "Same env key, new Render service",
    ],
  },
];
