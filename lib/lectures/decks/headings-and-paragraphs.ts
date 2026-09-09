import type { LectureSlide } from "../types";

export const HEADINGS_AND_PARAGRAPHS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "HEADINGS & PARAGRAPHS",
      "Lab 1: HeadingTags.tsx (`wd-h-tag`) and ParagraphTag.tsx (`wd-p-tag`)",
    ],
  },
  {
    id: "heading-scale",
    title: "Headings",
    kind: "demo",
    bullets: [
      "Use headings as **titles** to introduce distinct sections",
      "Six sizes: `h1`, `h2`, through `h6`",
      "**`h1`** is the largest. **`h6`** is the smallest",
    ],
    code: `<h1>This is the largest heading</h1>
<h2>This is the second largest heading</h2>
<h6>This is the smallest heading</h6>`,
    codeLanguage: "html",
    embed: "heading-scale",
  },
  {
    id: "import-lab1",
    title: "Using headings",
    kind: "content",
    bullets: [
      "Use headings to introduce the topics you have covered so far",
      "A page usually has one `h1`. Nested topics step down (`h2`, `h3`, …)",
    ],
    code: `<h1>HTML</h1>
<h2>Paragraphs</h2>
{/* content discussing paragraphs */}
<h2>Headings</h2>
{/* content discussing headings */}`,
    codeLanguage: "tsx",
  },
  {
    id: "lab1-nest",
    title: "Example",
    kind: "demo",
    bullets: [
      "Create `app/labs/lab1/HeadingTags.tsx` with `id=\"wd-h-tag\"`",
      "An `h4` titles the sample. Import the component into `app/labs/lab1/page.tsx`",
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
    title: "Paragraphs",
    kind: "content",
    bullets: [
      "Use `<p>` to **explicitly** add **vertical spacing** between portions of text",
      "Without `p`, leftover text inside a `div` flows as one stream",
      "Lab 1 wrapper id: `wd-p-tag`. Intro sample: `wd-p-1`",
    ],
    code: `<p>
  Lorem Ipsum is simply dummy text of the printing
  and typesetting industry.
</p>
<p>
  Lorem Ipsum has been the industry's standard dummy
  text ever since the 1500s.
</p>`,
    codeLanguage: "html",
  },
  {
    id: "devtools",
    title: "Example",
    kind: "content",
    bullets: [
      "The intro sample is `id=\"wd-p-1\"` — one wrapped paragraph so far",
      "Find `wd-p-tag` in DevTools → Elements",
    ],
    code: `<div id="wd-p-tag">
  <h4>Paragraph Tag</h4>
  <p id="wd-p-1">
    This is a paragraph. We often separate a long set
    of sentences with vertical spaces to make the text
    easier to read.
  </p>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
  },
  {
    id: "whitespace-without-p",
    title: "Browser ignores white spaces",
    kind: "content",
    bullets: [
      "These three chunks look like separate paragraphs in the file",
      "The browser still paints them as **one** contiguous block",
      "Tabs and newlines are **not** structure",
    ],
    code: `<div id="wd-p-tag">
  <h4>Paragraph Tag</h4>
  <p id="wd-p-1"> ... </p>
This is the first paragraph.

This is the second paragraph.

This is the third paragraph.
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
  },
  {
    id: "wrap-p",
    title: "Add Paragraph Tags for Vertical Spacing",
    kind: "demo",
    bullets: [
      "Wrap each chunk so the browser **keeps** the vertical gaps",
      "The three demonstration paragraphs are `wd-p-2`, `wd-p-3`, and `wd-p-4`",
    ],
    code: `<p id="wd-p-1">
  Wrap text in p so the browser keeps a vertical gap.
</p>
<p id="wd-p-2">This is the first sample paragraph.</p>
<p id="wd-p-3">This is the second sample paragraph.</p>
<p id="wd-p-4">This is the third sample paragraph.</p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ParagraphTag.tsx",
    codeAddedLines: [1, [3, 6]],
    embed: "paragraph-tag",
  },
  {
    id: "next-up",
    title: "Next: lists and tables",
    kind: "title",
    bullets: [
      "You can outline a page and keep paragraphs from blending",
      "Next: `ol` / `ul` / `li`, then a semantic `table` — not a layout trick",
    ],
  },
];
