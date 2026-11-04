import type { LectureSlide } from "../types";

export const ATLAS_SESSIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#00684A",
      icon: "cloud",
      headline: "Remote Sessions with Atlas",
    },
    bullets: [
      "Chapter 6 · Atlas remote sessions",
      "Five keys, then sign in",
    ],
  },
  {
    id: "purpose",
    title: "Keeping Users Signed In on Render",
    kind: "content",
    bullets: [
      "Local Node already stores `currentUser` in a cookie",
      "Render must do the same so Vercel can send that cookie back",
      "CORS and `sameSite` read `CLIENT_URL` and `SERVER_ENV`",
      "The Atlas connection string is one of five keys — not the only one",
    ],
  },
  {
    id: "keys",
    title: "Setting Five Render Environment Keys",
    kind: "demo",
    bullets: [
      "Use these **keys**. Do not copy the sample values",
      "`SERVER_URL` must **not** start with `https://`",
      "`SESSION_SECRET` is a long random phrase you choose",
    ],
    code: `DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority
CLIENT_URL=https://your-a6-preview.vercel.app
SERVER_URL=your-webdev-server.onrender.com
SERVER_ENV=production
SESSION_SECRET=a long random phrase`,
    codeLanguage: "bash",
    codeFile: "Render Environment",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "client",
    title: "Allowing the Vercel Origin with CORS",
    kind: "demo",
    bullets: [
      "Must be the Vercel `a6` origin — CORS and cookie `sameSite`",
      "No trailing slash. Must match the browser address bar",
      "Wrong origin → Sign in fails even when Atlas is reachable",
    ],
    code: `app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [3],
    embed: "kambaz-styled-signin",
  },
  {
    id: "secure-intro",
    title: "Turning On Secure Cookies",
    kind: "demo",
    bullets: [
      "In `index.ts`, switch the cookie settings on `SERVER_ENV` as shown below",
      "`SERVER_ENV=production` sets `sameSite: \"none\"` and `secure: true` so Vercel can send cookies",
      "Leave this as `development` on your laptop",
    ],
  },
  {
    id: "secure",
    title: "Configuring Cookies for Production",
    kind: "demo",
    code: `if (process.env.SERVER_ENV === "production") {
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [1, [4, 7]],
  },
  {
    id: "host",
    title: "Setting SERVER_URL Without https://",
    kind: "content",
    bullets: [
      "Render hostname only — `your-webdev-server.onrender.com`",
      "Strip `https://` if the dashboard prefilled it",
      "Vercel `NEXT_PUBLIC_HTTP_SERVER` **does** include `https://`",
    ],
  },
  {
    id: "redeploy",
    title: "Redeploying After Env Changes",
    kind: "content",
    bullets: [
      "Render: Manual Deploy → Deploy latest commit",
      "Vercel: Redeploy after changing `NEXT_PUBLIC_HTTP_SERVER`",
      "Env edits do nothing until both processes restart",
    ],
  },
  {
    id: "verify",
    title: "Testing Sign In Against Atlas",
    kind: "content",
    bullets: [
      "Open the Vercel `a6` URL, sign in, confirm Dashboard lists courses",
      "Network error? Check `NEXT_PUBLIC_HTTP_SERVER` matches Render",
      "Empty Dashboard? Drivers string is missing `/kambaz?` or Network Access",
      "Compass on the Atlas connection should show the same documents",
    ],
  },
  {
    id: "secrets",
    title: "Keeping Database Secrets on the Server",
    kind: "content",
    bullets: [
      "Atlas credentials live on Render — never in `NEXT_PUBLIC_*`",
      "The browser talks to Express. Express talks to Atlas",
      "Do not commit `.env`, and never paste the password into code or a commit",
    ],
  },
  {
    id: "project",
    title: "Using Atlas for the Final Project",
    kind: "content",
    bullets: [
      "Quizzes, Pazza, and open-ended all persist through Atlas",
      "Graders on 12/7 open Vercel, sign in, and read hosted documents",
      "Same five keys. Same `/dbname?` rule. Same `0.0.0.0/0` allow list",
      "Zustand still talks to Express — Mongoose is what reaches Atlas",
    ],
  },
  {
    id: "recap",
    title: "Remote sessions recap",
    kind: "content",
    bullets: [
      "Five keys: Atlas string, `CLIENT_URL`, `SERVER_URL`, `SERVER_ENV`, secret",
      "`SERVER_ENV=production` plus a Vercel origin with no trailing slash",
      "Manual Deploy, then sign in. Secrets stay on Render",
    ],
  },
  {
    id: "next-up",
    title: "Next: Check Your Understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check on schemas, DAOs, and Atlas",
      "Self-check, then migrate Kambaz collections",
    ],
  },
];
