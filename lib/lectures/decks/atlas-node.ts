import type { LectureSlide } from "../types";

export const ATLAS_NODE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#00684A",
      icon: "cloud",
      headline: "Connecting Node.js to Atlas",
    },
    bullets: [
      "Chapter 6 · Atlas from Node.js",
      "Network Access, then Drivers",
    ],
  },
  {
    id: "purpose",
    title: "Letting the Server Reach Atlas",
    kind: "content",
    bullets: [
      "Compass can see Atlas. Mongoose on Render still cannot",
      "Atlas blocks unknown computers, so open Network Access for Render",
      "Then copy the **Drivers** connection string — it includes `/kambaz?`",
    ],
  },
  {
    id: "network-intro",
    title: "Allowing Connections from Anywhere",
    kind: "demo",
    bullets: [
      "Atlas → Network Access → + ADD IP ADDRESS",
      "ALLOW ACCESS FROM ANYWHERE adds `0.0.0.0/0`",
      "Free Render IP addresses change. A laptop-only allow list will fail",
      "Without this entry, Mongoose hangs even if the password is correct",
    ],
  },
  {
    id: "network",
    title: "Adding 0.0.0.0/0 to Network Access",
    kind: "demo",
    code: `0.0.0.0/0`,
    codeLanguage: "text",
    codeFile: "Atlas Network Access",
  },
  {
    id: "drivers",
    title: "Copying the Node.js Connection String",
    kind: "demo",
    bullets: [
      "Database → Connect → Drivers → Node.js 5.5 or later",
      "`kambaz` must sit between the last `/` and the `?`",
      "Replace `<password>`. Do not commit the completed string",
    ],
    code: `mongodb+srv://giuseppi:<password>@kambaz.jxui0bc.mongodb.net/kambaz?retryWrites=true&w=majority&appName=Kambaz`,
    codeLanguage: "text",
    codeHighlightLines: [1],
    interactiveHint:
      "Compass can omit the path. Node cannot — omit it and Mongoose writes to `test`.",
  },
  {
    id: "omit",
    title: "Why the Database Name Matters",
    kind: "content",
    bullets: [
      "Mongoose connects to the cluster even if the path is missing",
      "Default database is `test` — Compass `kambaz` then looks empty",
      "Dashboard on Vercel shows no courses. Compass on Atlas still has them",
      "Fix: put `/kambaz?` in `DATABASE_CONNECTION_STRING` and redeploy",
    ],
  },
  {
    id: "env",
    title: "Using One Key for Local and Atlas",
    kind: "demo",
    bullets: [
      "In `index.ts`, the connect code you wrote already reads the key",
      "Local `.env` stays on `127.0.0.1`. Render holds the `mongodb+srv` value",
    ],
    code: `const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [[1, 3]],
    embed: "lab6-status",
  },
  {
    id: "render",
    title: "Deploying a New Render Service",
    kind: "demo",
    bullets: [
      "Push branch `a6`. Deploy a **new** Render (or Heroku) service",
      "Do not overwrite the Chapter 5 `a5` URL while TAs are grading",
      "Environment: `DATABASE_CONNECTION_STRING` = the Atlas Drivers string",
    ],
    code: `DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority`,
    codeLanguage: "bash",
    codeFile: "Render Environment",
    codeAddedLines: [1],
  },
  {
    id: "vercel",
    title: "Pointing Vercel at the New Server",
    kind: "demo",
    bullets: [
      "Vercel `a6`: `NEXT_PUBLIC_HTTP_SERVER` = new Render origin",
      "Include `https://`. No trailing slash",
      "Redeploy both so the env vars take effect",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=https://your-webdev-server.onrender.com`,
    codeLanguage: "bash",
    codeFile: "Vercel Environment",
    interactiveHint:
      "Local `.env.development` stays `http://localhost:4000`. Same `NEXT_PUBLIC_HTTP_SERVER` variable.",
  },
  {
    id: "recap",
    title: "Node.js recap",
    kind: "content",
    bullets: [
      "`0.0.0.0/0`, Drivers string with `/kambaz?`, same env key",
      "New Render service — do not overwrite `a5`",
      "Vercel `NEXT_PUBLIC_HTTP_SERVER` points at the new origin",
    ],
  },
  {
    id: "next-up",
    title: "Next: Remote Sessions with Atlas",
    kind: "title",
    bullets: [
      "Sign in still needs a cookie the Vercel app can send back",
      "Five Render keys, then Manual Deploy",
    ],
  },
];
