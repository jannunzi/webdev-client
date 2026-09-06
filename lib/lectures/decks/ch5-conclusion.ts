import type { LectureSlide } from "../types";

export const CH5_CONCLUSION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Conclusion",
      "§5.6–5.7 · Express APIs, then deliver a5",
    ],
  },
  {
    id: "built",
    title: "What this chapter built",
    kind: "content",
    bullets: [
      "A sibling Node HTTP server with Express routes",
      "Lab 5: env, path/query, remote objects and arrays, axios, CORS, JSON body",
      "Route Handlers as a same-app option — not the chapter spine",
      "Kambaz account and courses on those same HTTP verbs, plus sessions",
    ],
  },
  {
    id: "pair",
    title: "Client on 3000, API on 4000",
    kind: "content",
    bullets: [
      "Next.js is the client. Express in `webdev-server` is the server",
      "Vercel hosts the UI. Render (or Heroku) hosts Express",
      "`NEXT_PUBLIC_HTTP_SERVER` is the only origin that should change",
      "Chapter 6 keeps the URLs and swaps in-memory arrays for MongoDB",
    ],
  },
  {
    id: "deliverables",
    title: "Branch a5 in both repos",
    kind: "demo",
    bullets: [
      "Lab 5 complete, including × ÷ and POST / PUT / DELETE",
      "Course, module, and assignment routes plus matching clients",
      "Disable Vercel Deployment Protection so graders can open a5",
    ],
    code: `# in webdev-client
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5

# in webdev-server
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5`,
    codeLanguage: "bash",
  },
  {
    id: "recap",
    title: "Chapter 5 recap",
    kind: "content",
    bullets: [
      "HTTP is the contract. Memory is temporary. Mongo is next",
      "Never hard-code the host — `httpServer()` in every client",
      "Submit the Vercel a5 URL. Graders also open Render and both GitHub branches",
    ],
  },
  {
    id: "next-up",
    title: "Next: MongoDB in Chapter 6",
    kind: "title",
    bullets: [
      "The routes and axios clients stay",
      "Collections replace the in-memory arrays",
    ],
  },
];
