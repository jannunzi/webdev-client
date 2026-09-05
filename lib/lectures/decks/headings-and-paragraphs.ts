import type { LectureSlide } from "../types";

export const HEADINGS_AND_PARAGRAPHS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 2 — Headings and Paragraphs",
      "Lab 1: HeadingTags.tsx (`wd-h-tag`) and ParagraphTag.tsx (`wd-p-tag`)",
    ],
  },
  {
    id: "heading-scale",
    title: "h1 through h6",
    kind: "demo",
    bullets: [
      "`<h1>` is the largest heading. `<h6>` is the smallest",
      "Use the outline for **structure**, not decoration. Do not pick `h3` only because you like the size",
      "A page usually has one `h1`. Lab 1’s route already uses `h2` (“Lab 1”). Topic blocks often start at `h4`",
    ],
    code: `<h1>Labs</h1>
<h2>Lab 1</h2>
<h3>HTML Examples</h3>
<h4>Heading Tags</h4>
<h5>A subsection</h5>
<h6>A smaller note</h6>`,
    codeLanguage: "html",
    embed: "heading-scale",
  },
  {
    id: "lab1-nest",
    title: "Lab 1 heading nest — wd-h-tag",
    kind: "demo",
    bullets: [
      "Create `app/labs/lab1/HeadingTags.tsx` with `id=\"wd-h-tag\"` on the wrapper",
      "An `h4` titles the sample. A `span` with `id=\"wd-inline-span\"` stays in the sentence",
      "Import the component into `app/labs/lab1/page.tsx` under the Lab 1 heading",
    ],
    code: `export default function HeadingTags() {
  return (
    <div id="wd-h-tag">
      <h4>Heading Tags</h4>
      Text documents are often broken up into sections.
      A <span id="wd-inline-span">span</span> sits in this
      sentence without starting a new line.
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/HeadingTags.tsx",
    embed: "heading-tags",
  },
  {
    id: "paragraph-why",
    title: "p is for vertical spacing",
    kind: "content",
    bullets: [
      "The `<p>` tag wraps a block of text so the browser adds margin above and below",
      "Headings and `p` are **block** elements — they take the full width of their parent",
      "Without `p`, leftover text inside a `div` flows as one stream",
      "Lab 1 wrapper id: `wd-p-tag`",
    ],
  },
  {
    id: "whitespace-without-p",
    title: "Without p, the browser ignores your blank lines",
    kind: "content",
    bullets: [
      "These three chunks look like separate paragraphs in the file",
      "The browser still paints them as one flowing block",
      "Same rule as the last deck: extra whitespace in the source is not structure",
    ],
    code: `<div id="wd-p-tag">
  <h4>Paragraph Tag</h4>
  This is the first paragraph.

  This is the second paragraph.

  This is the third paragraph.
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
  },
  {
    id: "wrap-p",
    title: "Wrap sample paragraphs — wd-p-2 … wd-p-4",
    kind: "demo",
    bullets: [
      "Give the intro sample `id=\"wd-p-1\"`",
      "The three demonstration paragraphs are `wd-p-2`, `wd-p-3`, and `wd-p-4`",
      "Personal paragraphs later use `wd-p-your-1` and `wd-p-your-2` — not these sample ids",
    ],
    code: `<p id="wd-p-1">
  Wrap text in p so the browser keeps a vertical gap.
</p>
<p id="wd-p-2">This is the first sample paragraph.</p>
<p id="wd-p-3">This is the second sample paragraph.</p>
<p id="wd-p-4">This is the third sample paragraph.</p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
    embed: "paragraph-tag",
  },
  {
    id: "import-lab1",
    title: "Import both into Lab 1",
    kind: "content",
    bullets: [
      "One file per topic. Lab 1 only composes them",
      "After headings and paragraphs, the next files are lists and tables",
    ],
    code: `import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <HeadingTags />
      <ParagraphTag />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
  },
  {
    id: "devtools",
    title: "Find wd-h-tag and wd-p-tag",
    kind: "content",
    bullets: [
      "Open Lab 1, then DevTools → Elements",
      "Search for `wd-h-tag`, then `wd-p-tag`",
      "Expand the paragraph wrapper: you should see `p#wd-p-1` through `p#wd-p-4`",
    ],
    interactiveHint:
      "If the three sample chunks still run together, you have not wrapped wd-p-2 through wd-p-4 yet.",
  },
  {
    id: "next-up",
    title: "Next: lists and tables",
    kind: "title",
    bullets: [
      "You can outline a page and keep paragraphs from blending",
      "Deck 3: `ol` / `ul` / `li`, then a semantic `table` — not a layout trick",
    ],
  },
];
