import type { LectureSlide } from "../types";

export const LAB5_ENV_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "code",
      headline: "Environment Variables",
    },
    bullets: [
      "Chapter 5 · Lab 5 Environment",
      "The server URL in a .env file",
    ],
  },
  {
    id: "purpose",
    title: "Why Use Environment Variables",
    kind: "content",
    bullets: [
      "The server URL is `http://localhost:4000` on your laptop, but different once deployed",
      "An environment variable is a named value set outside the code, like `NEXT_PUBLIC_HTTP_SERVER`",
      "A `.env` file sets it for each environment: `.env.development` on your laptop",
      "Code reads it with `process.env.NEXT_PUBLIC_HTTP_SERVER`, so no URL is hardcoded",
    ],
  },
  {
    id: "welcome-route",
    links: ["http://localhost:4000/lab5/welcome"],
    title: "Implementing the Lab 5 Welcome Route",
    kind: "demo",
    bullets: [
      "In a new `Lab5/index.ts`, export the Lab 5 routes",
      "Keep `npm run dev` running in both projects, then try the link",
      "Import into `index.ts`, as the next slide shows",
    ],
    code: `export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/index.ts",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "register",
    title: "Registering Lab5 Routes in index.ts",
    kind: "demo",
    bullets: [
      "Import `./Lab5/index` with no extension; pass the shared `app`",
    ],
    code: `import express from "express";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
const app = express();
Lab5(app);
Hello(app);
app.listen(4000);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [3, 5],
  },
  {
    id: "lab5-page-intro",
    title: "Linking the Lab 5 Page to the Server",
    kind: "demo",
    bullets: [
      "In a new `app/labs/lab5/page.tsx`, create the page as shown below",
      "Add the route to the Labs TOC. Do not hard-code the host for long",
      "The next slide replaces `localhost:4000` with an environment variable",
    ],
  },
  {
    id: "lab5-page",
    title: "Implementing the Lab 5 Welcome Link",
    kind: "demo",
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
    title: "Exposing NEXT_PUBLIC_ Variables",
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
    id: "environment",
    title: "Reading the Server URL from the Env",
    kind: "demo",
    bullets: [
      "In a new `Environment.tsx` component, create the link as shown below",
      "The Welcome `href` is `${HTTP_SERVER}/lab5/welcome`",
      "Import into `app/labs/lab5/page.tsx`",
    ],
    code: `export default function Environment() {
  const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
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
    codeFile: "app/labs/lab5/Environment.tsx",
    codeAddedLines: [2, [9, 12]],
    embed: "lab5-env",
  },
  {
    id: "recap",
    title: "Recap: Configuring Environment Variables",
    kind: "content",
    bullets: [
      "`.env.development` sets `NEXT_PUBLIC_HTTP_SERVER`; restart `next dev` after changes",
      "`const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER` — no host literals",
      "Server `PORT` is the matching remote knob",
    ],
  },
  {
    id: "next-up",
    title: "Next: Path and Query Parameters",
    kind: "title",
    bullets: [
      "Send `a` and `b` in the path, then after `?`",
      "`/lab5/add/:a/:b` and `/lab5/calculator`",
    ],
  },
];
