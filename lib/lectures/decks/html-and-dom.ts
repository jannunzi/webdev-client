import type { LectureSlide } from "../types";

export const HTML_AND_DOM_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "HTML and the DOM",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 1 — markup, tags, and the tree the browser builds",
      "Chapter 1 in the course book · Lab 1 starts here",
    ],
  },
  {
    id: "what-is-html",
    title: "HTML is markup, not a program",
    kind: "content",
    bullets: [
      "**HTML** (HyperText Markup Language) is a dialect of **XML** for structuring documents the browser can paint",
      "It marks up plain text: this phrase is a heading, that block is a paragraph, this control is a form field",
      "In Next.js you write that HTML as **JSX** inside React components (`.tsx` files)",
      "Focus on the tags first. The `export default function` wrapper is just the container that delivers HTML",
    ],
  },
  {
    id: "tags-elements",
    title: "Tags, body, and elements",
    kind: "content",
    bullets: [
      "`<h1>Labs</h1>` — opening tag, **body** (`Labs`), closing tag",
      "A **tag** is the syntax in your source. An **element** is the fuller idea: tag + attributes + body + the DOM node",
      "Either word is fine day to day. The distinction helps when you inspect the page in DevTools",
      "Browsers style `h1` large and bold by default because the tag is **semantic** — it means “top-level heading”",
    ],
    code: `<h1>Labs</h1>`,
    codeLanguage: "html",
  },
  {
    id: "attributes",
    title: "Attributes configure the opening tag",
    kind: "content",
    bullets: [
      "An **attribute** is a `name=\"value\"` pair on the opening tag",
      "`id` gives the element a unique name on the page — styling, tests, and later in-page links",
      "Lab 1 ids start with `wd-` so graders and DevTools Find can land on the same node",
      "You will meet many more attributes: `href`, `src`, `type`, `htmlFor`, `defaultValue`",
    ],
    code: `<div id="wd-h-tag">
  <h4>Heading Tags</h4>
</div>`,
    codeLanguage: "html",
  },
  {
    id: "jsx-in-next",
    title: "JSX is HTML in a component",
    kind: "content",
    bullets: [
      "A Lab 1 topic is a **component**: a function that returns JSX",
      "JSX looks like HTML with a few React spellings: `className`, `htmlFor`, self-closing tags (`<img />`)",
      "Keep each HTML topic in its own file under `app/labs/lab1/`, then import it into `page.tsx`",
      "Lab 1 stays one URL (`/labs/lab1`) while the file list grows",
    ],
    code: `export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
    embed: "lab1-stub",
  },
  {
    id: "the-dom",
    title: "The browser builds a DOM",
    kind: "content",
    bullets: [
      "When the browser parses HTML (or JSX), it builds an in-memory tree: the **DOM** (Document Object Model)",
      "Each tag becomes a **node**. Parent/child is nesting: `body` contains a `div`, the `div` contains an `h2`",
      "The DOM is what the browser paints. JavaScript — including React — can update nodes later without reloading",
      "Your source is a file. The DOM is the live tree. They start the same and can drift as scripts run",
    ],
    diagram: "dom-tree",
  },
  {
    id: "devtools",
    title: "Inspect the live tree in DevTools",
    kind: "content",
    bullets: [
      "Chrome: `F12` or `Cmd+Option+I` / `Ctrl+Shift+I` → **Elements**",
      "Find (`Cmd+F` / `Ctrl+F` inside the panel) for an `id` such as `wd-lab1`",
      "Click a node. The right-hand pane shows attributes and computed styles",
      "This habit — find an id, inspect the node — is how you debug markup for the rest of the course",
    ],
    interactiveHint:
      "Open /labs/lab1, press F12, and search for wd-lab1. You should land on the Lab 1 wrapper div.",
  },
  {
    id: "block-inline-preview",
    title: "Block vs inline (you will see both)",
    kind: "content",
    bullets: [
      "**Block** elements start on a new line and stretch as wide as their parent: `h1`–`h6`, `p`, `div`, lists, `form`, `table`",
      "**Inline** elements sit in the line of text: `span`, `a`, `strong`, many form controls",
      "`div` is the generic **block** container. `span` is the generic **inline** container",
      "Chapter 2 can change that with CSS `display`. For Lab 1, notice the default",
    ],
  },
  {
    id: "lab1-plan",
    title: "Lab 1 is a growing page",
    kind: "content",
    bullets: [
      "Start with `app/labs/lab1/page.tsx` — the route `/labs/lab1`",
      "Add one component per topic: headings, paragraphs, lists, tables, images, forms, anchors",
      "Import each component into Lab 1. Do not create extra `page.tsx` files inside topic folders",
      "The book’s §1.3.12 checklist is the finish line — not a substitute for building as you read",
    ],
    interactiveHint:
      "After this deck: Headings and Paragraphs. Create HeadingTags.tsx and import it into Lab 1.",
  },
  {
    id: "next-up",
    title: "Next: headings and paragraphs",
    kind: "title",
    bullets: [
      "You can name a node (`id`), nest tags, and find them in the DOM",
      "Deck 2: `h1`–`h6`, `div`, `span`, and the `p` tag that keeps vertical gaps",
    ],
  },
];
