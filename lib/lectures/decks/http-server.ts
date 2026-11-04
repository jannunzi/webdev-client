import type { LectureSlide } from "../types";

export const HTTP_SERVER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "server",
      headline: "Creating Express Servers",
    },
    bullets: [
      "Chapter 5 · HTTP Server",
      "§5.1 · sibling Express on port 4000",
    ],
  },
  {
    id: "purpose",
    title: "Implementing an HTTP Server",
    kind: "content",
    bullets: [
      "Chapters 1–4 built the Next.js UI. Refresh still resets Kambaz",
      "A browser cannot be the permanent store — it crashes, closes, and is untrusted",
      "This chapter adds the other half: an Express HTTP server in `webdev-server`",
      "MongoDB is Chapter 6. Here the arrays live in process memory",
    ],
  },
  {
    id: "sibling",
    title: "Sibling folders, two ports",
    kind: "content",
    bullets: [
      "`webdev-client` is Next.js on port 3000 — the user interface",
      "`webdev-server` is Express on port 4000 — HTTP and later Mongo",
      "**Do not nest** the server inside the Next.js tree",
      "Same parent folder. Own `package.json`, own GitHub repo later",
    ],
  },
  {
    id: "node-intro-intro",
    title: "Node runs JS outside the browser",
    kind: "content",
    bullets: [
      "Browser JS cannot open files, sockets, or a database driver",
      "Node is a runtime plus `npm` — V8 with filesystem and network APIs",
      "You already installed it for `next dev`. Confirm with `node -v`",
      "LTS 20.9+ is enough. 22.x is fine",
    ],
  },
  {
    id: "node-intro",
    title: "Node runs JS outside the browser (code)",
    kind: "content",
    code: `node -v
# v22.11.0`,
    codeLanguage: "bash",
  },
  {
    id: "project",
    title: "Create the sibling server project",
    kind: "demo",
    bullets: [
      "Lowercase, dashes, no spaces. Accept `npm init` defaults",
      "Except the entry point: type `index.ts`, not `index.js`",
      "That writes `package.json` — Node’s project manifest",
    ],
    code: `mkdir webdev-server
cd webdev-server
npm init`,
    codeLanguage: "bash",
    interactiveHint:
      "Create the `webdev-server` folder yourself, as a sibling of the Next.js app.",
  },
  {
    id: "hello-ts",
    title: "Hello World in TypeScript",
    kind: "demo",
    bullets: [
      "The server is TypeScript, like the Next.js client",
      "tsx runs `.ts` files — no separate `.js` build",
      "Later we export a function from this same `Hello.ts`",
    ],
    code: `console.log("Hello World!");`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Hello.ts",
    codeBlocks: [{ code: "npm i tsx\nnpx tsx Hello.ts\n# Hello World!", language: "bash" }],
  },
  {
    id: "express-intro",
    title: "Express GET /hello on 4000",
    kind: "demo",
    bullets: [
      "Goal: answer `GET /hello` with Hello World! on port 4000",
      "Install Express so colleagues and Render can `npm install`",
      "`index.ts` is a TypeScript module. It loads Express with `import`",
      "Port 4000 leaves 3000 for Next.js",
    ],
  },
  {
    id: "express",
    links: ["http://localhost:4000/hello"],
    title: "Express GET /hello on 4000 (code)",
    kind: "demo",
    codeBlocks: [
      { code: "npm install express", language: "bash" },
      {
        file: "webdev-server/index.ts",
        language: "ts",
        code: `import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.listen(4000);`,
        addedLines: [[3, 6]],
      },
    ],
  },
  {
    id: "visit",
    title: "Visit localhost:4000/hello",
    kind: "demo",
    bullets: [
      "The browser is the client. Your Node process is the server",
      "Stop with Ctrl+C. A later host can set `PORT`",
    ],
    codeBlocks: [
      { code: "npx tsx index.ts", language: "bash" },
      { code: "http://localhost:4000/hello", language: "text" },
    ],
    interactiveHint:
      "404? Path must be /hello. Connection refused? The process is not listening.",
  },
  {
    id: "recap",
    title: "HTTP server recap",
    kind: "content",
    bullets: [
      "Sibling `webdev-server` — never inside the Next.js app",
      "`Hello.ts` prints. `index.ts` listens on 4000",
      "Express `app.get(\"/hello\", …)` plus `res.send`",
    ],
  },
  {
    id: "next-up",
    title: "Next: nodemon, tsx, and routes",
    kind: "title",
    bullets: [
      "Restart on save, npm scripts, `tsconfig.json`, then routes",
      "§5.1.6–5.1.8: Nodemon, the tsx runner, and `Hello(app)`",
    ],
  },
];
