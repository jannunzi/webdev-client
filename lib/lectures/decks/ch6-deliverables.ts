import type { LectureSlide } from "../types";

export const CH6_DELIVERABLES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Deliverables",
      "§6.5 · branch a6, then submit Vercel",
    ],
  },
  {
    id: "purpose",
    title: "Both repos on branch a6",
    kind: "content",
    bullets: [
      "React and Node work lives on `a6` — add, commit, push both",
      "Render does not branch-deploy like Vercel — use a **new** Web service",
      "Do not overwrite the Chapter 5 `a5` API URL",
      "Canvas submit: the Vercel URL for the `a6` branch deployment",
    ],
  },
  {
    id: "git",
    title: "Create and push both a6 branches",
    kind: "demo",
    bullets: [
      "Same commands in `webdev-client` and the sibling `webdev-server`",
    ],
    code: `# in webdev-client
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6

# in webdev-server
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6`,
    codeLanguage: "bash",
  },
  {
    id: "checklist",
    title: "What graders will open",
    kind: "content",
    bullets: [
      "Lab 6 on `/labs/lab6`. Schemas, models, DAOs, `async` routes",
      "Sign in, ADMIN Users, Dashboard CRUD, modules, enroll / unenroll",
      "Labs TOC: every lab, full name, `wd-github`, Node repo, new Render root",
      "Free Atlas `Kambaz`, `0.0.0.0/0`, JSON imported into remote `kambaz`",
    ],
  },
  {
    id: "remote",
    title: "New Render plus Vercel a6",
    kind: "content",
    bullets: [
      "Render: Atlas URI with `/kambaz` in the path, plus session keys",
      "`CLIENT_URL`, `SERVER_URL`, `SERVER_ENV=production`, `SESSION_SECRET`",
      "Vercel: `NEXT_PUBLIC_HTTP_SERVER` — no trailing slash — then redeploy",
      "Disable Deployment Protection so graders open the preview",
    ],
  },
  {
    id: "recap",
    title: "Chapter 6 recap",
    kind: "content",
    bullets: [
      "Local Mongo + Compass, then Mongoose schemas, models, DAOs",
      "Async Users APIs, Atlas, courses / modules / enrollments",
      "Remote app must persist in Compass on the Atlas connection",
    ],
  },
  {
    id: "next-up",
    title: "Submit the Vercel a6 URL",
    kind: "title",
    bullets: [
      "Sign in remotely. Create a course. Refresh Atlas Compass",
      "Canvas: the `a6` preview — not the Render hostname",
    ],
  },
];
