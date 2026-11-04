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
      "Restart on save, route files",
    ],
  },
  {
    id: "purpose",
    title: "Restarting and Organizing the Server",
    kind: "content",
    bullets: [
      "Every code change means stopping and restarting the server by hand",
      "Nodemon watches your files and restarts the server when you save",
      "As routes grow, one `index.ts` gets hard to read",
      "Route files group related routes, like the hello routes in `Hello.ts`",
    ],
  },
  {
    id: "nodemon",
    title: "Restarting the Server with Nodemon",
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
    title: "Adding a Root Route Beside /hello",
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
    id: "hello-fn-intro",
    title: "Moving Hello Routes to Hello.ts",
    kind: "demo",
    bullets: [
      "Group related routes in their own route file, `Hello.ts`",
      "Export a function that receives the shared `app`",
      "Do not call `express()` again — one instance per server",
    ],
  },
  {
    id: "hello-fn",
    links: ["http://localhost:4000/hello", "http://localhost:4000/"],
    title: "Exporting Hello Routes from Hello.ts",
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
    title: "Passing app to Hello from index.ts",
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
    title: "Recap: Nodemon and ES6 Routes",
    kind: "content",
    bullets: [
      "`npm run dev` is nodemon + tsx. `npm start` is `tsx index.ts`",
      "Relative imports omit the extension: `./Hello` loads `Hello.ts`",
      "JSON files import directly: `import courses from \"./courses.json\"`",
      "Group related routes in route files that receive `app`",
    ],
  },
  {
    id: "next-up",
    title: "Next: Configuring Environment Variables",
    kind: "title",
    bullets: [
      "A welcome route, then never hard-code localhost",
      "`const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER`",
    ],
  },
];
