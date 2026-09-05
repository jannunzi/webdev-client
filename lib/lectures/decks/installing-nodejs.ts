import type { LectureSlide } from "../types";

export const INSTALLING_NODEJS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "NODE.JS",
    kind: "title",
    bullets: [
      "CS 4550 / CS 5610 — Fall 2026",
      "Lecture 1 · Deck 2 — Installing Node.js",
      "The JavaScript runtime that powers both the Next.js UI and the Express API",
    ],
  },
  {
    id: "client-server-reminder",
    title: "Client–server reminder",
    kind: "content",
    bullets: [
      "Browser (client) sends HTTP. Server responds with HTML, JSON, or files",
      "This course builds **both** sides: a Next.js client and a Node/Express server",
      "They are **sibling** projects — not one folder stuffed inside the other",
      "Today: get Node running, then a one-route Express server on port 4000",
      "Next deck: scaffold the Next.js app students deploy to Vercel",
    ],
  },
  {
    id: "course-stack",
    title: "Course stack",
    kind: "content",
    bullets: [
      "**React** + **Next.js** — user interface, App Router, deployed on Vercel",
      "**Node.js** + **Express** — HTTP API (later chapters; we peek at it today)",
      "**MongoDB** — persistence (Chapter 6)",
      "Languages on the page: **HTML** (structure), **CSS** (presentation), **JavaScript** (behavior)",
      "You already installed a browser. Node is the missing runtime on your laptop",
    ],
  },
  {
    id: "languages",
    title: "HTML, CSS, and JavaScript",
    kind: "content",
    bullets: [
      "**HTML** — markup. Headings, links, forms, tables. What is on the page",
      "**CSS** — style. Later: Tailwind utility classes instead of a giant stylesheet",
      "**JavaScript** — behavior and data. The same language runs in the browser **and** in Node",
      "React is JavaScript (with JSX). Next.js is a React framework. Express is JavaScript on Node",
      "Learn JS once; reuse it across the stack. That is why this course is not PHP + Java + JS",
    ],
  },
  {
    id: "js-vs-ts",
    title: "JavaScript vs TypeScript",
    kind: "content",
    bullets: [
      "**JavaScript** — the language browsers and Node actually run",
      "**TypeScript** — JavaScript plus types. Catches mistakes before the page loads",
      "This course’s Next.js app is TypeScript (`.tsx` components)",
      "Early Node demos may be plain `.js` so you can see `node file.js` with no compile step",
      "Types are a seatbelt, not a different language. `let n: number = 3` is still JavaScript at runtime",
    ],
  },
  {
    id: "what-is-node",
    title: "Node = JavaScript outside the browser",
    kind: "content",
    bullets: [
      "Browsers sandbox JS: no raw filesystem, no arbitrary sockets, no Mongo driver",
      "**Node.js** is a runtime (plus `npm` / `npx`) that runs JS in a terminal or on a server",
      "It ships with V8 (Chrome’s engine) and APIs for files, network, and processes",
      "Next.js `npm run dev` **is** a Node process. Express `app.listen(4000)` is another",
      "Install Node once; both halves of the course use it",
    ],
  },
  {
    id: "download",
    title: "Download Node.js",
    kind: "content",
    bullets: [
      "Go to [nodejs.org](https://nodejs.org/) — download the **LTS** installer for your OS",
      "Fall 2026: prefer **20.9+** (Next.js requirement). 22.x or 24.x LTS is fine",
      "Run the installer. Restart the terminal (or the machine) if `node` is still “not found”",
      "Installing Node also installs **npm** (packages) and **npx** (one-off commands)",
      "Do not install Node *inside* a project folder. It is a system tool",
    ],
    interactiveHint:
      "On the projector: open nodejs.org, point at the LTS button, then switch to a terminal for the next slide.",
  },
  {
    id: "version",
    title: "Confirm the install",
    kind: "demo",
    bullets: [
      "In Terminal (macOS) or PowerShell / Command Prompt (Windows):",
      "`node --version`",
      "You should see something like `v24.19.0` or `v22.11.0` — not an error",
      "`node -v` is the same command (short flag)",
      "Also try `npm --version` so you know the package manager is on the PATH",
    ],
    interactiveHint:
      "If the command is not found: close and reopen the terminal. Still failing? Re-run the installer and restart.",
  },
  {
    id: "course-folder",
    title: "Create the Fall 2026 course folder",
    kind: "demo",
    bullets: [
      "Keep coursework together. From your home directory:",
      "`cd ~`",
      "`mkdir -p 2026/fall/webdev`",
      "`cd 2026/fall/webdev`",
      "Lowercase, no spaces. Sibling folders later: `webdev-client` and `webdev-server`",
    ],
    interactiveHint:
      "This term is **Fall 2026** — use `~/2026/fall/webdev`.",
  },
  {
    id: "demo",
    title: "DEMO",
    kind: "demo",
    bullets: [
      "Live: folder exists, `node --version` prints, we are in `~/2026/fall/webdev`",
      "Next we initialize a tiny Node server app — not the Next.js client",
      "Do **not** run this inside an existing `webdev-client` repo",
    ],
    interactiveHint:
      "Instructor demo. Students: follow on your laptop; ask if `node` is missing.",
  },
  {
    id: "npm-init",
    title: "npm init a Node server app",
    kind: "demo",
    bullets: [
      "`mkdir kambaz-node-server-app`",
      "`cd kambaz-node-server-app`",
      "`npm init -y`",
      "That writes `package.json` — the manifest npm and Node tools read",
      "Course spelling is **kambaz** — the same name as the LMS prototype",
    ],
  },
  {
    id: "hello-js",
    title: "hello.js",
    kind: "demo",
    bullets: [
      "Create `hello.js` in that folder:",
      "`console.log(\"Hello World!\");`",
      "Run it: `node hello.js`",
      "The terminal should print `Hello World!`",
      "This is Node without HTTP — just the runtime. Next we listen on a port",
    ],
    interactiveHint:
      "Use the IDE’s integrated terminal so the file and the command stay in one window.",
  },
  {
    id: "express",
    title: "Express: GET /hello on port 4000",
    kind: "demo",
    bullets: [
      "`npm install express`",
      "Create `server.js`:",
      "`import express from \"express\";`",
      "`const app = express();`",
      "`app.get(\"/hello\", (req, res) => res.send(\"Hello World!\"));`",
      "`app.listen(4000);`",
    ],
  },
  {
    id: "express-module",
    title: "ES modules for that import",
    kind: "content",
    bullets: [
      "`import express` needs `\"type\": \"module\"` in `package.json` (or use `require` / CommonJS)",
      "Add it next to `name` if `node server.js` complains about import",
      "This course’s later `webdev-server` is the real sibling project — today’s folder is the lecture demo",
      "Port **4000** is the lab convention so Next.js can keep **3000**",
    ],
  },
  {
    id: "visit",
    title: "Visit localhost:4000/hello",
    kind: "demo",
    bullets: [
      "Run `node server.js` and leave it running",
      "In Chrome open `http://localhost:4000/hello`",
      "You should see `Hello World!` — that body is `res.send`",
      "The browser is the client. Your Node process is the server. HTTP connected them",
      "Stop the server with Ctrl+C when you are done",
    ],
    interactiveHint:
      "404? Check the path is `/hello`, not `/`. Connection refused? The process is not listening — look at the terminal.",
  },
  {
    id: "next-up",
    title: "Next: create the Next.js app",
    kind: "title",
    bullets: [
      "Node is installed. You have seen a one-route Express server",
      "Deck 3: `npx create-next-app@latest` and the App Router — no Vite SPA leftover",
    ],
  },
];
