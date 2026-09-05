import type { LectureSlide } from "../types";

export const KAMBAZ_OVERVIEW_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 3 · Deck 1 — Kambaz overview",
      "A1: HTML prototype of the LMS screens",
    ],
  },
  {
    id: "what",
    title: "Kambaz is an LMS prototype",
    kind: "content",
    bullets: [
      "**Kambaz** is inspired by a popular online learning management system",
      "Chapter 1 builds **plain HTML structure**. CSS is Chapter 2 / A2",
      "Do all Kambaz work under `app/(kambaz)` — App Router folders plus `page.tsx`",
      "The book’s §1.4.9 checklist is coverage, not a substitute for building as you read",
    ],
  },
  {
    id: "route-group",
    title: "(kambaz) is a route group",
    kind: "content",
    bullets: [
      "Parentheses make a **route group**. The name does **not** appear in the URL",
      "`app/(kambaz)/dashboard/page.tsx` is still `/dashboard`, not `/(kambaz)/dashboard`",
      "The group is for organization and a shared layout",
      "Same App Router rule as Labs: a folder with `page.tsx` is a route",
    ],
    code: `app/(kambaz)/page.tsx                 →  /
app/(kambaz)/dashboard/page.tsx       →  /dashboard
app/(kambaz)/account/signin/page.tsx  →  /account/signin`,
    codeLanguage: "text",
  },
  {
    id: "landing",
    title: "Landing page owns /",
    kind: "demo",
    embed: "kambaz-landing",
    bullets: [
      "A **landing page** is the screen for `/`. In the App Router that is a `page.tsx` at the root",
      "Put it inside the group: `app/(kambaz)/page.tsx` — not a leftover `app/page.tsx` beside it",
      "If two `page.tsx` files both claim `/`, Next.js errors. Keep one",
      "Wrapper id: `wd-kambaz`",
    ],
    code: `export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <h1>Kambaz</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
  },
  {
    id: "labs-link",
    title: "Link Labs TOC to Kambaz",
    kind: "content",
    bullets: [
      "Add a Kambaz `Link` in `app/labs/TOC.tsx` **and** the Labs index",
      "`href=\"/\"` — the group owns `/`, so the link is the site root",
      "Id `wd-kambaz-link` is what graders look for",
      "`import Link from \"next/link\"` — same as the Lecture 2 SPA deck",
    ],
    code: `<li>
  <Link href="/" id="wd-kambaz-link">
    Kambaz
  </Link>
</li>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
  },
  {
    id: "redirect",
    title: "Then redirect / to Sign in",
    kind: "content",
    bullets: [
      "After the heading works, Sign in becomes the default entry",
      "`redirect` from `next/navigation` runs when the route renders — the user does not click",
      "Replace the landing `h1` with a redirect to `/account/signin`",
      "`/account` will do the same in the next deck",
    ],
    code: `import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
  },
  {
    id: "structure-first",
    title: "Structure first — CSS later",
    kind: "content",
    bullets: [
      "These screens use browser-default HTML: inputs, `Link`s, a `<table>` for chrome",
      "Keep the given `id` and `className` values (`wd-*`) so graders and later chapters can find them",
      "`className` in JSX is HTML `class`. `htmlFor` is HTML `for`",
      "Chapter 2 / Lab 2 add Tailwind. Do not invent a new layout language this week",
    ],
  },
  {
    id: "next-up",
    title: "Next: Account screens",
    kind: "title",
    bullets: [
      "Sign in, Sign up, Profile, then an account layout that keeps nav visible",
      "Absolute paths: `/account/signin`, not a relative `href=\"signin\"`",
    ],
  },
];
