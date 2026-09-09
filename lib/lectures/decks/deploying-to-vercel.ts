import type { LectureSlide } from "../types";

export const DEPLOYING_TO_VERCEL_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "VERCEL",
      "Host the Next.js app. TAs need the production URL",
    ],
  },
  {
    id: "account",
    title: "Create an account at Vercel",
    kind: "demo",
    bullets: [
      "We're going to use **Vercel.com** to host our application",
      "Create an account at [vercel.com](https://vercel.com)",
      "You can use your **GitHub** account",
      "OR you can use an email",
    ],
  },
  {
    id: "new-project",
    title: "Create a New Site from Git",
    kind: "demo",
    bullets: [
      "Dashboard → **Add New…** → **Project**",
      "Create a website from source control",
      "Do not upload a zip. The connection should be GitHub → Vercel",
    ],
  },
  {
    id: "permissions",
    title: "Create Site from GitHub",
    kind: "content",
    bullets: [
      "We're using **GitHub** to store our source code",
      "Select GitHub for this course",
      "Give **Vercel** permissions to interact with GitHub on your behalf",
    ],
  },
  {
    id: "github-app",
    title: "Install Vercel on GitHub",
    kind: "demo",
    bullets: [
      "GitHub asks which repositories the **Vercel** app may access",
      "You can allow all repos, or only `kambaz-next-js`",
      "Authorize / Install. Return to the Vercel New Project screen",
    ],
  },
  {
    id: "select-repo",
    title: "Search/Select GitHub Repository",
    kind: "demo",
    bullets: [
      "Once you give permission, Vercel can list your repositories",
      "Search for the repo you want to deploy, e.g. `kambaz-next-js`",
      "Framework Preset should be **Next.js**",
    ],
    diagram: "vercel-import-mock",
  },
  {
    id: "deploy",
    title: "Deploy the Site",
    kind: "demo",
    bullets: [
      "After selecting the source repo, select **Deploy**",
      "Vercel copies the source onto their remote server and runs it",
      "`next build` must succeed — the same command you can run locally",
    ],
    diagram: "vercel-deploy-mock",
  },
  {
    id: "congratulations",
    title: "Congratulations!!",
    kind: "content",
    bullets: [
      "Click to navigate to your **website**",
      "Click to navigate to your **dashboard**",
      "The production URL looks like `https://kambaz-next-js-….vercel.app`",
    ],
    diagram: "vercel-success-mock",
  },
  {
    id: "share-url",
    title: "Remote App Identical to Local",
    kind: "content",
    bullets: [
      "**Project name**",
      "Share the **Website URL** with TAs — together with the GitHub repo",
      "GitHub **branch** and **commit**",
    ],
  },
  {
    id: "protections",
    title: "Deployment Settings",
    kind: "demo",
    bullets: [
      "Project → **Settings** → **Deployment Protection**",
      "Vercel may enable **Standard Protection**",
      "That gate blocks TAs who are not on your Vercel team",
    ],
    diagram: "vercel-protect-mock",
  },
  {
    id: "disable-auth",
    title: "Vercel Authentication",
    kind: "demo",
    bullets: [
      "Disable authentication to easily share with TAs and instructors",
      "Turn **off** Vercel Authentication so the production URL is public",
      "Open the URL in a private window — it must load with **no** Vercel login",
    ],
    diagram: "vercel-auth-mock",
    interactiveHint:
      "Incognito test is the fastest check. If you get a Vercel login page, protections are still on.",
  },
  {
    id: "push-to-update",
    title: "Push to update production",
    kind: "content",
    bullets: [
      "Edit locally → `git add` / `commit` / `push` → Vercel rebuilds",
      "Wait for the deploy to finish before you tell staff “it’s updated”",
      "A failed deploy leaves the last **successful** production URL running",
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
    ],
  },
];
