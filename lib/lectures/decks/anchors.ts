import type { LectureSlide } from "../types";

export const ANCHORS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Anchors",
      "The Hyper in HyperText Markup Language",
    ],
  },
  {
    id: "section",
    title: "ANCHORS",
    kind: "content",
    bullets: [
      "The `<a>` tag creates a **hyperlink** — another document, or a spot in this one",
      "`href` (hypertext reference) is the destination",
      "Same tag, different schemes: `https:`, `/relative`, `mailto:`, `tel:`, `#hash`",
      "Lab 1 file: `AnchorTag.tsx` — sample ids `wd-lipsum` and `wd-github`",
    ],
  },
  {
    id: "href-documents",
    title: "href to other documents",
    kind: "demo",
    bullets: [
      "**Absolute** — another site: `https://www.lipsum.com`",
      "**Relative** — this origin: `/labs` or `/labs/lab1`",
      "A plain `a` triggers a normal browser navigation (full document request for a new URL)",
      "External new-tab links: `target=\"_blank\"` and `rel=\"noreferrer\"`",
    ],
    code: `<a href="https://www.lipsum.com" id="wd-lipsum">click here</a>
<a href="https://github.com/jannunzi" id="wd-github">GitHub</a>
<a href="/labs">Back to Labs</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/AnchorTag.tsx",
    embed: "anchors",
  },
  {
    id: "mailto-tel",
    title: "mailto: and tel:",
    kind: "demo",
    bullets: [
      "`mailto:ada@example.com` opens the user’s mail client with that address",
      "`tel:+16175551212` opens the phone dialer on a phone (or a helper app on a laptop)",
      "These are still `a` tags. The scheme in `href` is what changes",
      "Useful on a profile or contact page — not a substitute for a form",
    ],
    code: `<a href="mailto:ada@example.com">Email Ada</a>
<a href="tel:+16175551212">Call the office</a>`,
    codeLanguage: "html",
    embed: "mailto-tel",
  },
  {
    id: "hash-toc",
    title: "Same-page TOC — #hash matches id",
    kind: "demo",
    bullets: [
      "`href=\"#wd-anchor-bottom\"` scrolls to the element whose `id` is `wd-anchor-bottom`",
      "Wikipedia-style fragments: the hash is an in-page jump, not a new route",
      "The `id` must match exactly. `#wd-anchor-bottom` does nothing if that id is missing",
      "Reserve hash fragments for in-page TOC. App routes use paths like `/labs/lab1` (next deck)",
    ],
    code: `<a href="#wd-anchor-bottom">Jump to bottom</a>
<p id="wd-anchor-bottom">You landed here.</p>`,
    codeLanguage: "tsx",
    embed: "hash-toc",
  },
];
