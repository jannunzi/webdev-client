import type { LectureSlide } from "../types";

export const NODEMON_ES6_ROUTES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Nodemon, ES6, Routes",
      "§5.1.6–5.1.8 · restart, modules, Hello(app)",
    ],
  },
  {
    id: "nodemon",
    title: "Nodemon restarts on save",
    kind: "demo",
    bullets: [
      "React already reloads. Node does not unless you install nodemon",
      "Prefer `--save-dev` so `package.json` records the tool",
      "Keep this process running while `next dev` runs next door",
    ],
    code: `npm install nodemon --save-dev
npx nodemon index.js`,
    codeLanguage: "bash",
  },
  {
    id: "two-routes",
    title: "Change /hello and add /",
    kind: "demo",
    bullets: [
      "Edit the string to `Life is good!` and refresh — nodemon restarts",
      "Root `/` welcomes you to full stack development",
    ],
    code: `import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Life is good!");
});
app.get("/", (req, res) => {
  res.send("Welcome to Full Stack Development!");
});
app.listen(4000);`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeAddedLines: [
      [3, 4],
      [6, 8],
    ],
  },
  {
    id: "es6",
    title: "ES modules and npm scripts",
    kind: "demo",
    bullets: [
      "`import` needs `\"type\": \"module\"` (Node 12+)",
      "`start` is what Render runs. `dev` is nodemon locally",
      "Relative imports must include the `.js` extension",
    ],
    code: `{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`,
    codeLanguage: "json",
    codeFile: "webdev-server/package.json",
    codeHighlightLines: [2, [3, 6]],
  },
  {
    id: "hello-fn",
    title: "Move hello routes to Hello.js",
    kind: "demo",
    bullets: [
      "Too many routes will not fit in `index.js`",
      "Export a function that receives the shared `app`",
      "Do not call `express()` again — one instance per server",
    ],
    code: `export default function Hello(app) {
  const sayHello = (req, res) => {
    res.send("Life is good!");
  };
  const sayWelcome = (req, res) => {
    res.send("Welcome to Full Stack Development!");
  };
  app.get("/hello", sayHello);
  app.get("/", sayWelcome);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Hello.js",
    codeHighlightLines: [1, [8, 9]],
  },
  {
    id: "wire-hello",
    title: "index.js creates app once",
    kind: "demo",
    bullets: [
      "Import `Hello.js` with the `.js` extension",
      "Pass `app`, then listen. Lab 5 will register the same way",
    ],
    code: `import express from "express";
import Hello from "./Hello.js";
const app = express();
Hello(app);
app.listen(4000);`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeAddedLines: [2, 4],
  },
  {
    id: "recap",
    title: "Nodemon and routes recap",
    kind: "content",
    bullets: [
      "`npm run dev` is nodemon. `npm start` is `node index.js`",
      "`\"type\": \"module\"` unlocks `import` and requires `.js` paths",
      "Group routes in files that receive `app`",
    ],
  },
  {
    id: "next-up",
    title: "Next: Lab 5 environment",
    kind: "title",
    bullets: [
      "A welcome route, then never hard-code localhost",
      "§5.2.1: `NEXT_PUBLIC_HTTP_SERVER` and `httpServer()`",
    ],
  },
];
