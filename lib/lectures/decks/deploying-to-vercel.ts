import type { LectureSlide } from "../types";

export const DEPLOYING_TO_VERCEL_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Deploying to Vercel",
    kind: "title",
    bullets: [
      "CS 4550 / CS 5610 — Fall 2026",
      "Lecture 1 · Deck 5 — Host the Next.js app on Vercel",
      "GitHub holds the source. Vercel runs the site. TAs need both URLs",
    ],
  },
  {
    id: "why-vercel",
    title: "Why Vercel",
    kind: "content",
    bullets: [
      "Vercel built Next.js. The defaults (App Router, serverless, previews) match this course",
      "Every `git push` to `main` can produce a new production deploy",
      "Pull requests get preview URLs — useful later for team projects",
      "This course deploys the **client** on Vercel. The Node API is a later, separate host",
    ],
  },
  {
    id: "account",
    title: "Create a Vercel account",
    kind: "demo",
    bullets: [
      "Open [vercel.com](https://vercel.com) → Sign Up",
      "**Prefer Continue with GitHub** so Vercel can see your repos",
      "Use the same GitHub account that owns `kambaz-next-js` / `webdev-client`",
      "Hobby / student is fine for this course",
      "You are signing up for **Vercel**, not another static host",
    ],
    interactiveHint:
      "If you already have a Vercel team from work, you can still add a Hobby project under your personal account.",
  },
  {
    id: "new-project",
    title: "New project from GitHub",
    kind: "demo",
    bullets: [
      "Dashboard → **Add New…** → **Project**",
      "The Import list shows GitHub repositories Vercel is allowed to see",
      "If the list is empty, you still need to grant GitHub access (next slides)",
      "Do not upload a zip. The connection should be GitHub → Vercel",
    ],
  },
  {
    id: "permissions",
    title: "Grant Vercel GitHub permissions",
    kind: "content",
    bullets: [
      "Vercel needs permission to read the repo and install a GitHub App",
      "That is **Vercel + GitHub** — not a different hosting dashboard",
      "Older notes that said “grant Netlify GitHub permissions” are wrong for this course",
      "If a browser tab says Netlify, close it and go back to vercel.com",
    ],
    interactiveHint:
      "Staff will not grade a Netlify URL for the Next.js client. Use Vercel.",
  },
  {
    id: "github-app",
    title: "Install the Vercel GitHub App",
    kind: "demo",
    bullets: [
      "On Import, choose **Adjust GitHub App Permissions** (or Install Vercel) if prompted",
      "GitHub asks which repositories the **Vercel** app may access",
      "You can allow all repos, or only `kambaz-next-js` / `webdev-client`",
      "Authorize / Install. Return to the Vercel New Project screen",
      "Refresh the repo list if your project still does not appear",
    ],
  },
  {
    id: "select-repo",
    title: "Select the repo",
    kind: "demo",
    bullets: [
      "Click **Import** next to your Next.js repo",
      "Framework Preset should be **Next.js** (Vercel usually detects it)",
      "Root Directory: leave `.` unless the app is in a subdirectory (it should not be)",
      "Build command / output: leave the Next.js defaults",
      "Environment variables: none required for the Chapter 1 static UI",
    ],
  },
  {
    id: "deploy",
    title: "Deploy",
    kind: "demo",
    bullets: [
      "Click **Deploy**",
      "Watch the build log. `next build` must succeed — the same command you can run locally",
      "A TypeScript or ESLint error that you ignored locally will fail here",
      "First deploy often takes a minute. Do not close the tab mid-build",
    ],
    interactiveHint:
      "Build failed? Copy the error, fix it in the IDE, commit, push, and Vercel will rebuild.",
  },
  {
    id: "congratulations",
    title: "Congratulations — the dashboard",
    kind: "content",
    bullets: [
      "Vercel shows a congratulations screen and a screenshot of `/`",
      "Open the project **Dashboard**. You will use it all semester",
      "The production URL looks like `https://kambaz-next-js-….vercel.app`",
      "You can later attach a custom domain. Not required for A1",
      "Deployments tab lists each git commit that built",
    ],
  },
  {
    id: "share-url",
    title: "Share the URL with TAs",
    kind: "content",
    bullets: [
      "Copy the **production** deployment URL",
      "Submit that URL on Canvas together with the GitHub repo URL",
      "TAs grade the running site, not only the repo",
      "If the site asks *them* to log in to Vercel, the next slides are not optional",
    ],
  },
  {
    id: "protections",
    title: "Deployment Settings / Protections",
    kind: "demo",
    bullets: [
      "Project → **Settings** → **Deployment Protection** (wording can be under Security)",
      "Vercel may enable **Vercel Authentication** on preview or production URLs",
      "That gate is for private work previews. It blocks TAs who are not on your Vercel team",
      "Open the protection settings **before** you consider A1 submitted",
    ],
  },
  {
    id: "disable-auth",
    title: "Disable Vercel Authentication",
    kind: "demo",
    bullets: [
      "Turn **off** Vercel Authentication / password protection so the production URL is public",
      "Save. Open the URL in a private/incognito window — it must load with **no** Vercel login",
      "If you see “Authentication Required”, TAs cannot grade",
      "Standard Next.js pages stay public. You are not turning off *your* app’s later Clerk quiz gates",
    ],
    interactiveHint:
      "Incognito test is the fastest check. If you get a Vercel login page, protections are still on.",
  },
  {
    id: "push-to-update",
    title: "Push to update production",
    kind: "content",
    bullets: [
      "After today: edit locally → `git add` / `commit` / `push` → Vercel rebuilds",
      "Wait for the deploy to finish before you tell staff “it’s updated”",
      "A failed deploy leaves the last **successful** production URL running",
      "Keep GitHub `main` and Vercel production in sync",
    ],
  },
  {
    id: "break",
    title: "BREAK",
    kind: "break",
    bullets: [
      "Stretch. Confirm your Vercel URL opens in incognito",
      "Help a neighbor if their GitHub App permissions or build log is stuck",
    ],
  },
  {
    id: "office-hours",
    title: "OFFICE HOURS",
    kind: "break",
    bullets: [
      "Install and deploy issues are office-hours material — come with the error text",
      "Bring: `node --version`, the GitHub repo URL, and the Vercel deploy log",
      "Hours and links: the course Office Hours page and the syllabus",
      "Piazza / discussion board: search first, then post the URL + error, not a screenshot of the whole desktop",
    ],
    interactiveHint:
      "After the break: Chapter 1 HTML in the book, Lab 1, then A1 on the Assignments hub.",
  },
  {
    id: "recap",
    title: "Lecture 1 recap",
    kind: "title",
    bullets: [
      "Internet + Web + client/server",
      "Node.js installed; Express `GET /hello` on :4000",
      "Next.js App Router app — Welcome page, Lab 1 route, `Link`",
      "GitHub repo without `node_modules`",
      "Vercel production URL, protections off, share with TAs",
    ],
  },
];
