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
      "§5.1.6–5.1.8 · restart, TypeScript modules, Hello(app)",
    ],
  },
  {
    id: "nodemon",
    title: "Nodemon restarts on save",
    kind: "demo",
    bullets: [
      "React already reloads. Node does not unless you install nodemon",
      "Prefer `--save-dev` so `package.json` records the tool",
      "`--exec tsx` restarts the `.ts` server through tsx",
    ],
    code: `npm install nodemon --save-dev
npx nodemon --exec tsx index.ts
# later: npm run dev   (the script in 5.1.7)`,
    codeLanguage: "bash",
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
    id: "tsx-intro",
    title: "TypeScript modules and tsx",
    kind: "demo",
    bullets: [
      "Server files are TypeScript modules: `import`, no `require()`",
      "Record `\"type\": \"module\"` plus `dev` and `start` scripts",
      "tsx is a runner, not a file type. `index.ts` stays `index.ts`",
      "`start` is what Render runs; tsx sits in `dependencies`",
    ],
  },
  {
    id: "tsx",
    title: "TypeScript modules and tsx (code)",
    kind: "demo",
    code: `{
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec tsx index.ts",
    "start": "tsx index.ts"
  },
  "dependencies": {
    "express": "^5.1.0",
    "tsx": "^4.20.5"
  }
}`,
    codeLanguage: "json",
    codeFile: "webdev-server/package.json",
    codeHighlightLines: [2, [3, 6], 9],
  },
  {
    id: "tsconfig-intro",
    title: "A tsconfig for the server",
    kind: "demo",
    bullets: [
      "Goal: the editor understands extensionless and JSON imports",
      "`./Hello` loads `Hello.ts`. `./courses.json` imports directly",
      "Types are dev dependencies. `noEmit`: no build folder",
    ],
  },
  {
    id: "tsconfig",
    title: "A tsconfig for the server (code)",
    kind: "demo",
    codeBlocks: [
      { code: "npm i -D typescript@^5.9.3 @types/node@^22 @types/express", language: "bash" },
      {
        file: "webdev-server/tsconfig.json",
        language: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": false,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["**/*.ts"]
}`,
        highlightLines: [5, 6, 10],
      },
    ],
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
      "`tsconfig.json`: extensionless imports and JSON modules",
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
