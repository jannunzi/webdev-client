import type { LectureSlide } from "../types";

export const ANCHORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Anchors",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 5 — the Hyper in HyperText",
      "Lab 1 file: AnchorTag.tsx",
    ],
  },
  {
    id: "hypertext",
    title: "a creates a hyperlink",
    kind: "content",
    bullets: [
      "The `<a>` tag navigates from one document to another, or to a spot in the same document",
      "**Hyper** in HTML is that idea — documents linked into a web",
      "`href` (hypertext reference) is the destination the browser should load or jump to",
      "A plain `a` triggers a normal browser navigation: a full document request for a new URL",
    ],
  },
  {
    id: "href-shapes",
    title: "Three shapes of href",
    kind: "content",
    bullets: [
      "**Absolute** — scheme + host, for another site: `https://www.lipsum.com`",
      "**Relative** — a path on this origin: `/labs` or `/labs/lab1`",
      "**Fragment** — `#` plus an element `id`: `#wd-anchor-bottom` scrolls on the same page",
      "Fragments are in-page jumps. They are not App Router routes",
    ],
    code: `{/* Absolute — another site */}
<a href="https://www.lipsum.com">lipsum.com</a>

{/* Relative — same site */}
<a href="/labs">Back to Labs</a>

{/* Fragment — same page */}
<a href="#wd-anchor-bottom">Jump to bottom</a>`,
    codeLanguage: "tsx",
  },
  {
    id: "new-tab",
    title: "New tab needs rel too",
    kind: "content",
    bullets: [
      "`target=\"_blank\"` opens the destination in a new tab — useful for external sites",
      "Also set `rel=\"noreferrer\"` (or at least `noopener`) so the new page cannot use `window.opener`",
      "That is a small security habit. Lab 1’s personal GitHub link should do both",
    ],
    code: `<a
  href="https://github.com/jannunzi"
  target="_blank"
  rel="noreferrer"
>
  GitHub (new tab)
</a>`,
    codeLanguage: "tsx",
  },
  {
    id: "lab1-anchors",
    title: "Lipsum and GitHub in Lab 1",
    kind: "demo",
    bullets: [
      "Create `AnchorTag.tsx` and import it into Lab 1",
      "Lipsum link id: `wd-lipsum`. GitHub link id: `wd-github`",
      "These two are enough for the core sample. Personal links come after",
    ],
    code: `export default function AnchorTag() {
  return (
    <>
      <h4>Anchor tag</h4>
      Please{" "}
      <a href="https://www.lipsum.com" id="wd-lipsum">
        click here
      </a>{" "}
      to get dummy text
      <br />
      <a href="https://github.com/jannunzi" id="wd-github">
        GitHub
      </a>
    </>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/AnchorTag.tsx",
    embed: "anchors",
  },
  {
    id: "a-vs-link",
    title: "a vs next/link — preview",
    kind: "content",
    bullets: [
      "Use `<a>` for **external** URLs, or when you truly want a full reload",
      "Use `Link` from `next/link` for **in-app** routes you created with `page.tsx`",
      "`Link` still renders an anchor. It intercepts the click so React can swap the page",
      "Next deck: the Labs index and why `/labs/lab1` should not flash a full reload",
    ],
  },
  {
    id: "next-up",
    title: "Next: single-page navigation",
    kind: "title",
    bullets: [
      "You can leave the site, stay on it, or jump inside the page",
      "Deck 6: `Link`, the Labs index, and `layout.tsx`",
    ],
  },
];
