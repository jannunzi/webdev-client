import type { LectureSlide } from "../types";

export const NODEMON_ES6_ROUTES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "code",
      headline: "Nodemon, tsx, and Routes",
    },
    bullets: [
      "Chapter 5 · Nodemon, tsx, Routes",
      "§5.1.6–5.1.8 · restart, module loading, Hello(app)",
    ],
  },
  {
    id: "nodemon",
    title: "Nodemon restarts on save",
    kind: "demo",
    bullets: [
      "React already reloads. Node does not unless you install nodemon",
      "Prefer `--save-dev` so `package.json` records the tool",
      "Add a `dev` script next to `start`. It restarts through tsx",
    ],
    codeBlocks: [
      {
        file: "webdev-server/package.json",
        language: "json",
        code: `{
  "scripts": {
    "dev": "nodemon --exec tsx index.ts",
    "start": "tsx index.ts"
  }
}`,
        addedLines: [3],
      },
      { code: "npm install nodemon --save-dev\nnpm run dev", language: "bash" },
    ],
  },
  {
    id: "two-routes",
    links: ["http://localhost:4000/hello", "http://localhost:4000/"],
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
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [
      [3, 4],
      [6, 8],
    ],
  },
  {
    id: "modules-intro",
    title: "How server modules load",
    kind: "demo",
    bullets: [
      "Every server file is a TypeScript module: `import`, no `require()`",
      "Relative imports omit the extension. `./Hello` loads `Hello.ts`",
      "JSON imports directly, thanks to `resolveJsonModule`",
    ],
  },
  {
    id: "modules",
    title: "How server modules load (code)",
    kind: "demo",
    code: `import Hello from "./Hello"; // loads Hello.ts
import courses from "./courses.json"; // §5.4.1`,
    codeLanguage: "ts",
  },
  {
    id: "hello-fn-intro",
    title: "Move hello routes to Hello.ts",
    kind: "demo",
    bullets: [
      "Too many routes will not fit in `index.ts`",
      "Export a function that receives the shared `app`",
      "Do not call `express()` again — one instance per server",
    ],
  },
  {
    id: "hello-fn",
    links: ["http://localhost:4000/hello", "http://localhost:4000/"],
    title: "Move hello routes to Hello.ts (code)",
    kind: "demo",
    code: `import type { Express, Request, Response } from "express";

export default function Hello(app: Express) {
  const sayHello = (req: Request, res: Response) => {
    res.send("Life is good!");
  };
  const sayWelcome = (req: Request, res: Response) => {
    res.send("Welcome to Full Stack Development!");
  };
  app.get("/hello", sayHello);
  app.get("/", sayWelcome);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Hello.ts",
    codeHighlightLines: [1, 3, [10, 11]],
  },
  {
    id: "wire-hello",
    links: ["http://localhost:4000/hello", "http://localhost:4000/"],
    title: "index.ts creates app once",
    kind: "demo",
    bullets: [
      "Import `./Hello` — no extension. tsx loads `Hello.ts`",
      "Pass `app`, then listen. Lab 5 will register the same way",
      "Inline callbacks get types; standalone ones name `Request`/`Response`",
    ],
    code: `import express from "express";
import Hello from "./Hello";
const app = express();
Hello(app);
app.listen(4000);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [2, 4],
  },
  {
    id: "recap",
    title: "Nodemon and routes recap",
    kind: "content",
    bullets: [
      "`npm run dev` is nodemon + tsx. `npm start` is `tsx index.ts`",
      "Extensionless relative imports; JSON imports directly",
      "Group routes in files that receive `app`",
    ],
  },
  {
    id: "next-up",
    title: "Next: Lab 5 environment",
    kind: "title",
    bullets: [
      "A welcome route, then never hard-code localhost",
      "§5.2.1: `const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER`",
    ],
  },
];
