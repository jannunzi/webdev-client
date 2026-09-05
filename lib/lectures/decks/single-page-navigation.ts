import type { LectureSlide } from "../types";

export const SINGLE_PAGE_NAVIGATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Single-page Navigation",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 6 — move between routes without a full reload",
      "App Router: page.tsx creates a URL; Link moves between URLs",
    ],
  },
  {
    id: "spa",
    title: "A single-page application keeps one shell",
    kind: "content",
    bullets: [
      "A **SPA** keeps one HTML shell loaded and updates the UI as the user moves around",
      "Next.js apps work that way for in-app routes: Labs → Lab 1 should feel instant",
      "A raw `<a href=\"/labs/lab1\">` still works — and tells the browser to fetch a new document",
      "Inside this app, prefer `Link` so React can swap the next route’s UI",
    ],
  },
  {
    id: "history-not-hash",
    title: "Paths, not hash routes",
    kind: "content",
    bullets: [
      "Old SPAs used the URL **hash** (`#/lab1`) because changing the fragment does not reload",
      "That is **not** how the App Router works",
      "Next.js uses the browser **History API** so `/labs/lab1` updates without a full reload",
      "Reserve `#fragment` for in-page jumps (the last deck), not for app routes",
    ],
  },
  {
    id: "link-from-next",
    title: "Link from next/link",
    kind: "content",
    bullets: [
      "`import Link from \"next/link\"`",
      "`<Link href=\"/labs/lab1\">Lab 1</Link>` — `href` is the path, not a file path",
      "`Link` can prefetch when helpful and keep client state where appropriate",
      "Use `<a>` for true external URLs (GitHub, MDN, lipsum)",
    ],
    code: `import Link from "next/link";

<Link href="/labs/lab1">Lab 1: HTML Examples</Link>`,
    codeLanguage: "tsx",
  },
  {
    id: "labs-index",
    title: "A Labs index lists Lab 1–3",
    kind: "demo",
    bullets: [
      "Create placeholder pages: `app/labs/lab2/page.tsx` and `app/labs/lab3/page.tsx` (a heading is enough)",
      "The index lives at `app/labs/page.tsx` — URL `/labs`",
      "Each item is a `Link` to a route you already created",
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
    embed: "labs-index",
  },
  {
    id: "layouts",
    title: "layout.tsx wraps, it does not create a URL",
    kind: "content",
    bullets: [
      "`page.tsx` creates a route. `layout.tsx` does **not** create its own URL",
      "A layout wraps `page.tsx` (and nested layouts) in the same folder and below",
      "Shared chrome — nav, TOC, headers — belongs in a layout so you do not copy it into every page",
      "`app/layout.tsx` wraps the app. `app/labs/layout.tsx` wraps only `/labs/*`",
    ],
  },
  {
    id: "children",
    title: "Layouts receive children",
    kind: "content",
    bullets: [
      "The framework renders the matching `page.tsx` into the layout’s `children` prop",
      "You practiced the same wrapping idea with `HighlightedBox` — a parent around nested content",
      "Create `app/labs/TOC.tsx`, then a labs `layout.tsx` that places the TOC beside `children`",
      "When you open Lab 1, Next.js renders the labs layout around the Lab 1 page",
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
    embed: "link-nav",
  },
  {
    id: "checklist",
    title: "Before you leave Chapter 1 HTML",
    kind: "content",
    bullets: [
      "Lab 1 covers headings, paragraphs, lists, tables, images, forms, highlights, and anchors",
      "Labs index uses `Link` to Lab 1–3 (and later placeholders)",
      "A labs layout keeps navigation visible while the page content changes",
      "The book’s §1.3.12 checklist is the written version of this list — walk it after you build",
    ],
    interactiveHint:
      "Click Lab 1 on /labs. The URL becomes /labs/lab1 and the TOC should stay. That is the SPA.",
  },
  {
    id: "next-up",
    title: "Next: start the Kambaz prototype",
    kind: "title",
    bullets: [
      "HTML structure is in place. A1 applies the same tags to Account, Dashboard, and course screens",
      "Visual polish is Chapter 2 / A2. This week: structure first",
    ],
  },
];
