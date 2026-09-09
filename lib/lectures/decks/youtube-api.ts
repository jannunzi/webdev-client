import type { LectureSlide } from "../types";

export const YOUTUBE_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · Integrating with YouTube",
      "Data API v3 · key, then search",
    ],
  },
  {
    id: "docs",
    title: "YouTube Data API v3",
    kind: "content",
    bullets: [
      "docs: `https://developers.google.com/youtube/v3`",
      "Need a Google account, a Cloud project, and an API key",
      "Register the app, then turn **YouTube Data API v3** ON",
      "OAuth 2.0 only if a method needs the signed-in Google user",
    ],
  },
  {
    id: "console",
    title: "Create a Cloud project",
    kind: "content",
    bullets: [
      "Open `https://console.cloud.google.com/apis/dashboard`",
      "Create a new project — Jose’s classroom project is enough",
      "APIs & Services → Credentials → Create credentials → API key",
      "Copy the key. Do **not** commit it",
    ],
  },
  {
    id: "env",
    title: "Store the key in .env.development",
    kind: "demo",
    bullets: [
      "Same Next.js env pattern as `NEXT_PUBLIC_HTTP_SERVER`",
      "Replace the sample key. Never paste a live key into a commit",
    ],
    code: `NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
NEXT_PUBLIC_YOUTUBE_API=https://www.googleapis.com/youtube/v3
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY`,
    codeLanguage: "bash",
    codeFile: ".env.development",
    codeAddedLines: [[2, 3]],
  },
  {
    id: "safe",
    title: "Keep the API key safe",
    kind: "content",
    bullets: [
      "Restrict the key in Cloud Console to YouTube Data API v3",
      "Classroom demos use `NEXT_PUBLIC_*` because the browser calls Google",
      "A production project can proxy search through Express instead",
    ],
  },
  {
    id: "enable",
    title: "Enable YouTube Data API v3",
    kind: "content",
    bullets: [
      "Enabled APIs → Enable APIs and Services → search YouTube",
      "Open YouTube Data API v3 and click Enable",
      "Libraries: `https://developers.google.com/youtube/v3/libraries`",
      "The course client uses axios, not the Google JS client",
    ],
  },
  {
    id: "recap",
    title: "YouTube key recap",
    kind: "content",
    bullets: [
      "Cloud project, API key, YouTube Data API v3 enabled",
      "`NEXT_PUBLIC_YOUTUBE_API` plus a key you do not commit",
      "Search is `GET /search?part=snippet&q=&key=` next",
    ],
  },
  {
    id: "next-up",
    title: "Next: search videos",
    kind: "title",
    bullets: [
      "Keyword search, axios client, then a Search screen",
      "Kambaz course nav gets a YouTube link",
    ],
  },
];
