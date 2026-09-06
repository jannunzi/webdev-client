import type { LectureSlide } from "../types";

export const LAB5_ENV_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Lab 5 Environment",
      "§5.2.1 · two terminals and an env var",
    ],
  },
  {
    id: "two-terminals",
    title: "Two terminals for Lab 5",
    kind: "demo",
    bullets: [
      "Terminal 1: Next.js UI on 3000. Terminal 2: Express on 4000",
      "Leave both running for the rest of the chapter",
      "§5.3 Route Handlers stay on same-origin `/api` and do not need 4000",
    ],
    code: `# terminal 1 — Next.js UI (port 3000)
npm run dev

# terminal 2 — sibling Express (port 4000)
cd webdev-server
npm run dev`,
    codeLanguage: "bash",
  },
  {
    id: "welcome-route",
    title: "Welcome route in Lab5/index.js",
    kind: "demo",
    bullets: [
      "Same pattern as `Hello.js`: export a function that receives `app`",
      "Confirm `http://localhost:4000/lab5/welcome` greets you",
    ],
    code: `export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/index.js",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "register",
    title: "Register Lab5 from index.js",
    kind: "demo",
    bullets: [
      "Import with the `.js` extension and pass the shared `app`",
    ],
    code: `import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
const app = express();
Lab5(app);
Hello(app);
app.listen(4000);`,
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeAddedLines: [3, 5],
  },
  {
    id: "lab5-page",
    title: "A Lab 5 page with a Welcome link",
    kind: "demo",
    bullets: [
      "Add the route to the Labs TOC. Do not hard-code the host for long",
      "The next slide replaces `localhost:4000` with an environment variable",
    ],
    code: `export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <a id="wd-welcome-link" href="http://localhost:4000/lab5/welcome">
        Welcome
      </a>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/page.tsx",
    codeHighlightLines: [5],
  },
  {
    id: "env-file",
    title: "NEXT_PUBLIC_ reaches the browser",
    kind: "demo",
    bullets: [
      "`.env.development` at the Next.js root. No quotes or spaces around `=`",
      "Restart `next dev` after every env change",
      "Only `NEXT_PUBLIC_*` is exported to client components",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000`,
    codeLanguage: "bash",
    codeFile: ".env.development",
  },
  {
    id: "helper",
    title: "httpServer() wraps the env var",
    kind: "demo",
    bullets: [
      "Unset, the helper still points at the companion on 4000",
      "§5.5 later points the same helper at Render — screens do not change",
    ],
    code: `export function httpServer(): string {
  const raw =
    process.env.NEXT_PUBLIC_HTTP_SERVER ??
    "http://localhost:4000";
  return raw.replace(/\\/$/, "");
}`,
    codeLanguage: "ts",
    codeFile: "app/lib/httpServer.ts",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "environment",
    title: "Print the origin, never a literal",
    kind: "demo",
    bullets: [
      "The Welcome `href` is `${HTTP_SERVER}/lab5/welcome`",
      "Express `listen` uses `process.env.PORT || 4000` for Render",
    ],
    code: `import { httpServer } from "@/app/lib/httpServer";
export default function Environment() {
  const HTTP_SERVER = httpServer();
  return (
    <div id="wd-lab5-environment">
      <h4>Environment</h4>
      <p>
        <code>NEXT_PUBLIC_HTTP_SERVER</code> = <code>{HTTP_SERVER}</code>
      </p>
      <a id="wd-welcome-link" className="text-blue-700 underline"
        href={\`\${HTTP_SERVER}/lab5/welcome\`}>
        Welcome
      </a>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-2-1-Environment.tsx",
    codeAddedLines: [1, 3, [10, 12]],
    embed: "lab5-env",
  },
  {
    id: "recap",
    title: "Environment recap",
    kind: "content",
    bullets: [
      "Two processes: Next.js 3000 and Express 4000",
      "`NEXT_PUBLIC_HTTP_SERVER` plus `httpServer()` — no host literals",
      "Server `PORT` is the matching remote knob",
    ],
  },
  {
    id: "next-up",
    title: "Next: path and query params",
    kind: "title",
    bullets: [
      "Send `a` and `b` in the path, then after `?`",
      "§5.2.2: `/lab5/add/:a/:b` and `/lab5/calculator`",
    ],
  },
];
