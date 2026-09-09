import type { LectureSlide } from "../types";

export const INSTALLING_NODEJS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "NODE.JS",
    kind: "title",
    bullets: [
      "Jose Annunziato",
    ],
  },
  {
    id: "client-server-reminder",
    title: "The Client Server Architecture",
    kind: "content",
    bullets: [
      "**CLIENTS** — HTML, CSS, JavaScript, React",
      "**SERVERS** — Node, Express, HTTP",
      "**RESOURCES** — Mongo, files",
      "**HTTP REQUEST** / **HTTP RESPONSE** over the Internet",
    ],
    diagram: "client-server",
  },
  {
    id: "course-stack",
    title: "Our Development Environment",
    kind: "content",
    bullets: [
      "**CLIENTS** — **HTML**, **CSS**, **JavaScript**, **React.js** & **Next.js**",
      "**SERVERS** — **HTTP**, Ajax, REST · **Express** & **Node.js**",
      "**RESOURCES** — **MongoDB**, Mongoose, files",
    ],
    diagram: "course-stack",
  },
  {
    id: "first-client",
    title: "First Client User Interface",
    kind: "content",
    bullets: [
      "The **1st** UI we build is the **client** — React.js & Node.js",
      "Same architecture drawing. **Node.js** is the runtime on your laptop",
    ],
    diagram: "course-stack",
  },
  {
    id: "languages",
    title: "Web Development Languages",
    kind: "content",
    bullets: [
      "**HTML** — building Web pages, front end, main content, layout and structure",
      "**CSS** — styling Web pages, look and feel",
      "**JavaScript** — controlling the browser, dynamic content. Now also **back end**",
      "Other languages — C#, Python, PHP, Java, Visual Basic",
    ],
  },
  {
    id: "js-vs-ts",
    title: "JavaScript",
    kind: "content",
    bullets: [
      "Programming language for the Web",
      "Originally just executed by **Browsers**, for controlling the Browser and creating dynamic content",
      "**TypeScript** is a superset of JavaScript",
      "Introduces **type safety**",
    ],
  },
  {
    id: "what-is-node",
    title: "Node.js",
    kind: "content",
    bullets: [
      "Now JavaScript is also for **back end** development, like C#, Python, Java",
      "Need infrastructure to execute on the backend, on desktops: **Node.js**",
      "**Node.js** — JavaScript **runtime** to execute **outside** the browser",
    ],
  },
  {
    id: "download",
    title: "Download Node.js",
    kind: "content",
    bullets: [
      "Navigate to [https://nodejs.org/en/](https://nodejs.org/en/)",
      "Download the **recommended** **LTS** version for your OS",
      "Windows downloads **MSI** · macOS downloads **DMG**",
      "Follow the installer instructions",
    ],
    interactiveHint:
      "On the projector: open nodejs.org and point at the LTS button.",
  },
  {
    id: "version",
    title: "Test Installation",
    kind: "demo",
    bullets: [
      "Once installed, test at the command line. **CMD** on Windows or **Terminal** on macOS",
      "`node` is the new command. `--version` displays the version",
    ],
    code: `node --version
v20.17.0`,
    codeLanguage: "bash",
    interactiveHint:
      "Your number will differ. Need **20.9+** for Next.js. Not found? Reopen the terminal.",
  },
  {
    id: "course-folder",
    title: "Create a Course Folder",
    kind: "demo",
    bullets: [
      "Create a folder for this semester. Lowercase, no spaces",
    ],
    code: `cd ~
mkdir -p webdev
cd webdev`,
    codeLanguage: "bash",
  },
  {
    id: "demo",
    title: "DEMO",
    kind: "demo",
    bullets: [
      "Live: `node --version` prints, we are in the course folder",
    ],
  },
  {
    id: "npm-init",
    title: "Creating a Node Project",
    kind: "demo",
    bullets: [
      "Create a directory, then initialize it from within",
      "Answer questions and confirm the new `package.json` file",
    ],
    code: `mkdir kambaz-node-server-app
cd kambaz-node-server-app
npm init -y`,
    codeLanguage: "bash",
  },
  {
    id: "hello-js",
    title: "Hello World",
    kind: "demo",
    bullets: [
      "Create `hello.js` with any text editor. Save, then run. Confirm the message",
    ],
    code: `console.log("hello world!");`,
    codeLanguage: "js",
    codeFile: "hello.js",
    codeBlocks: [{ code: "node hello.js", language: "bash" }],
  },
  {
    id: "express",
    title: "Creating a Simple Server",
    kind: "demo",
    bullets: [
      "Install **express**. Create `server.js` with one **GET** `/hello` route",
    ],
    codeBlocks: [
      { code: "npm install express", language: "bash" },
      {
        file: "server.js",
        language: "js",
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
    title: "Using the Server",
    kind: "demo",
    bullets: [
      "Start the server. It listens at port **4000**",
      "Point the browser at the URL. The server responds **Hello World!**",
    ],
    codeBlocks: [
      { code: "node server.js", language: "bash" },
      { code: "http://localhost:4000/hello", language: "text" },
    ],
    interactiveHint: "Stop the server with Ctrl+C when you are done.",
  },
  {
    id: "next-up",
    title: "Next: create the Next.js app",
    kind: "title",
    bullets: [
      "**Node.js** is installed. You ran `hello.js` outside the browser",
      "Next deck: `npx create-next-app@latest` and the **App Router**",
    ],
  },
];
