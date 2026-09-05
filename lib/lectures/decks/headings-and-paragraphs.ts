import type { LectureSlide } from "../types";

export const HEADINGS_AND_PARAGRAPHS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Headings and Paragraphs",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 2 — outlines, grouping, and vertical space",
      "Lab 1 files: HeadingTags.tsx and ParagraphTag.tsx",
    ],
  },
  {
    id: "heading-scale",
    title: "Six heading levels",
    kind: "content",
    bullets: [
      "`<h1>` through `<h6>` format section titles. `h1` is largest; `h6` is smallest",
      "Documents break into sections. Each section usually starts with a short title that summarizes what follows",
      "Use the outline for structure, not decoration. Do not pick `h3` only because you like the size",
      "Lab 1’s page already has an `h2` (“Lab 1”). Topic blocks often start at `h4`",
    ],
    code: `<h1>Labs</h1>
<h2>Lab 1</h2>
<h3>HTML Examples</h3>
<h4>Heading Tags</h4>
<h5>A subsection</h5>
<h6>A smaller note</h6>`,
    codeLanguage: "html",
  },
  {
    id: "div-span",
    title: "div groups; span stays in the line",
    kind: "content",
    bullets: [
      "`<div>` is a generic **block** — it starts on a new line and stretches as wide as its parent",
      "Its job is grouping: heading + paragraph + later an image, so you can style or lay them out together",
      "`<span>` is a generic **inline** — it sits in a sentence the way a word does",
      "Headings, `p`, `div`, lists, and `form` are blocks. `span`, `a`, and `strong` are inline",
    ],
  },
  {
    id: "heading-component",
    title: "HeadingTags.tsx",
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
    id: "inspect-heading",
    title: "Find wd-h-tag in Elements",
    kind: "content",
    bullets: [
      "Open Lab 1, then DevTools → Elements",
      "Search for `wd-h-tag`. You should land on the wrapper `div`",
      "Expand it: `h4`, the text node, and the `span#wd-inline-span`",
      "That tree is the DOM your JSX became",
    ],
    interactiveHint:
      "Click the span in Elements. Confirm it does not start a new line in the page.",
  },
  {
    id: "paragraph-why",
    title: "Browsers ignore extra whitespace",
    kind: "content",
    bullets: [
      "The `<p>` tag wraps a block of text so the browser adds vertical space around it",
      "Browsers ignore extra spaces, tabs, and newlines in your source",
      "Blank lines between chunks in the file do **not** become gaps on the page",
      "Without `p` tags, later blocks blend into one contiguous stream — that is **inline** flow",
    ],
  },
  {
    id: "paragraph-unwrapped",
    title: "Unwrapped text runs together",
    kind: "content",
    bullets: [
      "These three chunks look like separate paragraphs in the file",
      "The browser still paints them as one flowing block",
      "Headings and `div`s are blocks; leftover text inside a `div` is not automatically a paragraph",
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
    id: "paragraph-wrapped",
    title: "Wrap each block in p",
    kind: "demo",
    bullets: [
      "`p` is a **block** element — full width, margin above and below",
      "Give Lab 1 sample paragraphs ids `wd-p-1` through `wd-p-4`",
      "Personal paragraphs later use `wd-p-your-1` and `wd-p-your-2`",
    ],
    code: `<p id="wd-p-1">
  This is a paragraph. Wrap text in p so the
  browser keeps a vertical gap.
</p>
<p id="wd-p-2">
  This is the first sample paragraph.
</p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
    embed: "paragraph-tag",
  },
  {
    id: "import-into-lab1",
    title: "Import both into Lab 1",
    kind: "content",
    bullets: [
      "One file per topic. Lab 1 only composes them",
      "After headings and paragraphs, the next files are lists and tables",
      "Do not paste every sample into `page.tsx` — the page becomes unreadable",
    ],
    code: `import HeadingTags from "./HeadingTags";
import ParagraphTag from "./ParagraphTag";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <HeadingTags />
      <ParagraphTag />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
  },
  {
    id: "next-up",
    title: "Next: lists and tables",
    kind: "title",
    bullets: [
      "You can outline a page and keep paragraphs from blending",
      "Deck 3: `ol` / `ul` / `li`, then `table` / `tr` / `th` / `td`",
    ],
  },
];
