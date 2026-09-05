import type { LectureSlide } from "../types";

export const SINGLE_PAGE_NAVIGATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 6 — Single-page Navigation",
      "Move between lab screens without a full reload",
    ],
  },
  {
    id: "section",
    title: "SINGLE PAGE NAV",
    kind: "content",
    bullets: [
      "A **SPA** keeps one HTML shell loaded and updates the UI as the user moves around",
      "Next.js does that for in-app routes: Labs → Lab 1 should feel instant",
      "A raw `<a href=\"/labs/lab1\">` still works — and tells the browser to fetch a new document",
      "Prefer `Link` from `next/link` for routes you created with `page.tsx`",
    ],
  },
  {
    id: "lab-screens",
    title: "Lab 1, Lab 2, Lab 3 are separate screens",
    kind: "content",
    bullets: [
      "`/labs/lab1` — HTML examples (this week)",
      "`/labs/lab2` — CSS (next chapter). A heading is enough as a placeholder today",
      "`/labs/lab3` — JavaScript. Same idea: a real route, even if the page is still a stub",
      "Each screen is a `page.tsx`. Navigation is how the user *moves between* those files",
    ],
  },
  {
    id: "link-toc",
    title: "Next.js Link TOC — no full reload",
    kind: "demo",
    embed: "labs-index",
    bullets: [
      "`import Link from \"next/link\"`",
      "`<Link href=\"/labs/lab1\">Lab 1</Link>` — `href` is the path, not a file path",
      "`Link` still renders an anchor. It intercepts the click so React can swap the page",
      "Use `<a>` for true external URLs (`mailto:`, GitHub, lipsum)",
    ],
    code: `import Link from "next/link";

<Link href="/labs/lab1" id="wd-lab1-link">Lab 1</Link>
<Link href="/labs/lab2" id="wd-lab2-link">Lab 2</Link>
<Link href="/labs/lab3" id="wd-lab3-link">Lab 3</Link>`,
    codeLanguage: "tsx",
  },
  {
    id: "labs-index-toc",
    title: "app/labs/page.tsx and TOC.tsx",
    kind: "demo",
    bullets: [
      "The Labs index is `app/labs/page.tsx` — URL `/labs`",
      "`TOC.tsx` is a small table of contents you reuse in the layout — not copied into every lab",
      "Put `Link`s to Lab 1–3 (and later placeholders) in both files",
    ],
    code: `import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
        </li>
        <li>
          <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
        </li>
        <li>
          <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/page.tsx",
    codeBlocks: [
      {
        file: "app/labs/TOC.tsx",
        language: "tsx",
        code: `import Link from "next/link";

export default function TOC() {
  return (
    <ul>
      <li><Link href="/labs">Home</Link></li>
      <li><Link href="/labs/lab1">Lab 1</Link></li>
      <li><Link href="/labs/lab2">Lab 2</Link></li>
      <li><Link href="/labs/lab3">Lab 3</Link></li>
    </ul>
  );
}`,
      },
    ],
    embed: "labs-index",
  },
  {
    id: "layout-children",
    title: "layout.tsx keeps the TOC; children swap",
    kind: "demo",
    bullets: [
      "`page.tsx` creates a URL. `layout.tsx` does **not**",
      "The labs layout renders `TOC` beside `{children}`",
      "Click Lab 1 → Lab 2: the TOC stays. Only the page column changes",
    ],
    code: `import TOC from "./TOC";

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top"><TOC /></td>
          <td valign="top">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/layout.tsx",
    embed: "labs-layout",
    interactiveHint:
      "Click Lab 2 in the live TOC. The left column stays. Only the page column — {children} — changes.",
  },
  {
    id: "lab2-page",
    title: "Lab 2 is its own page.tsx",
    kind: "demo",
    embed: "labs-layout",
    bullets: [
      "Create `app/labs/lab2/page.tsx` — URL `/labs/lab2`",
      "A heading is enough for this week. CSS fills the file in Chapter 2",
      "The labs layout still wraps it. You do not copy the TOC into Lab 2",
    ],
    code: `export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
  },
  {
    id: "lab3-page",
    title: "Lab 3 is the same pattern",
    kind: "demo",
    embed: "labs-layout",
    bullets: [
      "`app/labs/lab3/page.tsx` — URL `/labs/lab3`",
      "Add a `Link` on the Labs index (and in `TOC.tsx`) so the screen is reachable",
      "Three routes, one layout, one TOC",
    ],
    code: `export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/page.tsx",
  },
  {
    id: "history-not-hash",
    title: "Paths, not hash routes",
    kind: "content",
    bullets: [
      "Old SPAs used `#/lab1` because changing the fragment does not reload",
      "That is **not** how the App Router works",
      "Next.js uses the **History API** so `/labs/lab1` updates without a full reload",
      "Reserve `#fragment` for in-page TOC (the last deck)",
    ],
  },
  {
    id: "kambaz-group",
    title: "Move Kambaz into app/(kambaz)/",
    kind: "content",
    bullets: [
      "Parentheses make a **route group**. `app/(kambaz)/dashboard/page.tsx` is still `/dashboard`",
      "The group name does **not** appear in the URL. It is for organization and a shared layout",
      "Do Kambaz work under `app/(kambaz)` — Account, Dashboard, courses",
      "A1 starts that prototype. Structure first; CSS is Chapter 2",
    ],
    code: `app/(kambaz)/page.tsx              →  /
app/(kambaz)/dashboard/page.tsx    →  /dashboard
app/(kambaz)/account/signin/page.tsx →  /account/signin`,
    codeLanguage: "text",
  },
  {
    id: "kambaz-default",
    title: "(kambaz) can own the site root",
    kind: "content",
    bullets: [
      "`app/(kambaz)/page.tsx` is the `/` route — not `/(kambaz)`",
      "That is how Kambaz becomes the default home instead of a leftover `app/page.tsx`",
      "If two `page.tsx` files both claim `/`, Next.js errors. Keep one",
      "This course site currently sends `/` to the syllabus. Your student app can send `/` to Kambaz",
    ],
  },
  {
    id: "table-layout-temp",
    title: "Tables for layout are temporary",
    kind: "content",
    bullets: [
      "The labs (and Kambaz) layouts still use a `<table>` to sit nav beside content",
      "That is a 1990s trick so you can finish HTML before CSS",
      "Chapter 2 / Lab 2 replace it with Flex, Grid, and Tailwind",
      "Do not invent a new table layout language. Borrow this one, then delete it",
    ],
  },
  {
    id: "checklist",
    title: "Before you leave Chapter 1 HTML",
    kind: "content",
    bullets: [
      "Lab 1 covers headings, paragraphs, lists, tables, images, forms, and anchors",
      "Labs index + TOC use `Link` to Lab 1–3",
      "A labs layout keeps navigation visible while `{children}` swap",
      "The book’s §1.3.12 checklist is the written version of this list",
    ],
    interactiveHint:
      "Click Lab 1 on /labs. The URL becomes /labs/lab1 and the TOC should stay. That is the SPA.",
  },
  {
    id: "next-up",
    title: "Next: start the Kambaz prototype",
    kind: "title",
    bullets: [
      "HTML structure is in place. A1 applies the same tags under `app/(kambaz)`",
      "Visual polish is Chapter 2 / A2. This week: structure first",
    ],
  },
];
