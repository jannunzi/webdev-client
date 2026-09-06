import type { LectureSlide } from "../types";

export const HTML_AND_DOM_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 1 — HTML and the DOM",
      "Chapter 1 in the course book · Lab 1 starts here",
    ],
  },
  {
    id: "html-means",
    title: "HTML = HyperText Markup Language",
    kind: "content",
    bullets: [
      "**HyperText** — documents linked to other documents (the next decks: anchors, then in-app `Link`)",
      "**Markup** — tags wrap plain text so the browser knows what each piece *is*",
      "**Language** — a small vocabulary of tags, not a programming language",
      "You write `.html` files on the classic Web. In this course you write the same tags as **JSX** in `.tsx` components",
    ],
  },
  {
    id: "tags",
    title: "Tags mark up plain text",
    kind: "content",
    bullets: [
      "`<h1>Labs</h1>` — opening tag, **body** (`Labs`), closing tag",
      "A **tag** is the syntax. An **element** is the tag + attributes + body + the DOM node",
      "Browsers style `h1` large and bold because the tag is **semantic** — it means “top-level heading”",
      "Without tags, “Labs” is just characters. With tags, it is a heading in the tree",
    ],
    code: `<h1>Labs</h1>`,
    codeLanguage: "html",
  },
  {
    id: "plain-text",
    title: "Start from plain text",
    kind: "content",
    bullets: [
      "A `.html` file is a text file. You can open it in any editor",
      "The browser does not run it as a program. It **parses** the tags and paints a page",
      "Save `hello.html`, double-click it (or drag it onto Chrome). That is still how the Web began",
      "Next.js later serves the same idea at a URL — but first, know the document",
    ],
  },
  {
    id: "hello-html",
    title: "hello.html",
    kind: "demo",
    bullets: [
      "The smallest useful page: a document type, an `html` root, a `head`, and a `body`",
      "`<!DOCTYPE html>` tells the browser this is HTML5 — not a 1990s quirk mode",
      "Save this as `hello.html` and open it in Chrome. You should see “Hello” as a heading",
    ],
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>`,
    codeLanguage: "html",
    codeFile: "hello.html",
    embed: "html-skeleton",
  },
  {
    id: "doctype-skeleton",
    title: "DOCTYPE, html, head, body",
    kind: "content",
    bullets: [
      "`<!DOCTYPE html>` — first line. Not a tag. A declaration",
      "`<html>` — the **root**. Everything else nests inside it",
      "`<head>` — metadata the user does not see as page content (`title`, `link` to CSS, later `script`)",
      "`<body>` — what the user sees: headings, paragraphs, forms, images",
    ],
  },
  {
    id: "comments",
    title: "Comments: HTML vs JSX",
    kind: "content",
    bullets: [
      "HTML comments: `<!-- this is ignored -->` — they do not appear on the page",
      "JSX comments: `{/* this is ignored */}` — JavaScript expression comments inside the tree",
      "Do not paste `<!-- -->` inside a `.tsx` return. The parser wants `{/* */}`",
      "In a raw `.html` file, use `<!-- -->`. In Lab 1 components, use `{/* */}`",
    ],
    code: `<!-- HTML file -->
<h1>Labs</h1>

{/* JSX in a .tsx component */}
<h1>Labs</h1>`,
    codeLanguage: "tsx",
  },
  {
    id: "body",
    title: "body holds the visible page",
    kind: "content",
    bullets: [
      "Put headings, paragraphs, lists, tables, forms, and images in `body`",
      "In Next.js you rarely write `<body>` yourself — `app/layout.tsx` already has the document shell",
      "Your `page.tsx` return is **body content**. Lab 1’s `<div id=\"wd-lab1\">` lives there",
      "Inspect a Next.js page: Elements still shows `html` → `head` + `body`",
    ],
  },
  {
    id: "structure",
    title: "Structure is nesting",
    kind: "content",
    bullets: [
      "Parent / child is indentation in the source and nesting in the tree",
      "`html` contains `head` and `body`. `body` contains your Lab 1 `div`. The `div` contains an `h2`",
      "Close tags in reverse order. A missing `</div>` breaks the tree",
      "Indent children. You are drawing the DOM on the page",
    ],
  },
  {
    id: "html-root-xml",
    title: "html is the root — XML-ish",
    kind: "content",
    bullets: [
      "HTML is a specialized dialect of **XML** (eXtensible Markup Language)",
      "XML: every element has a name, optional attributes, optional children",
      "HTML adds a fixed vocabulary (`h1`, `p`, `form`, …) and browser default styles",
      "JSX is stricter than casual HTML: self-close voids (`<img />`), quote attributes, `className` not `class`",
    ],
  },
  {
    id: "head-title-link",
    title: "head: title and link",
    kind: "content",
    bullets: [
      "`<title>` is the tab label and the default bookmark name — not an `h1` on the page",
      "`<link rel=\"stylesheet\" href=\"…\">` attaches CSS. Next.js often does this via `import \"./globals.css\"`",
      "Keep user-visible copy out of `head`. Put it in `body`",
      "In the App Router, `export const metadata = { title: \"…\" }` fills the document title",
    ],
    code: `<head>
  <title>Lab 1</title>
  <link rel="stylesheet" href="styles.css" />
</head>`,
    codeLanguage: "html",
  },
  {
    id: "whitespace",
    title: "Browsers ignore extra whitespace",
    kind: "content",
    bullets: [
      "Spaces, tabs, and newlines in the source collapse to a single space in the page",
      "Blank lines between chunks do **not** become vertical gaps — that is why you need `p` (next deck)",
      "Indentation is for *you*. The browser does not paint your tabs",
      "Use tags for structure. Do not fight the file with extra Enter keys",
    ],
  },
  {
    id: "the-dom",
    title: "DOM: Window → Document → tree",
    kind: "content",
    bullets: [
      "The browser’s **Window** owns a **Document**. The document’s tree is the **DOM**",
      "Each tag becomes a **node**. Nesting in the file is parent/child in memory",
      "The DOM is what the browser paints. JavaScript — including React — updates nodes later",
      "Your source is a file. The DOM is the live tree. DevTools → Elements shows the live one",
    ],
    diagram: "dom-tree",
  },
  {
    id: "triad",
    title: "HTML, CSS, and JavaScript",
    kind: "content",
    bullets: [
      "**HTML** — structure. What is on the page (this week)",
      "**CSS** — presentation. How it looks (Chapter 2 / Lab 2)",
      "**JavaScript** — behavior and data (Chapter 3 / Lab 3). React is JavaScript with JSX",
      "Keep the jobs separate. Do not fake layout with extra `table`s forever — CSS comes next",
    ],
  },
  {
    id: "jsx-lab1",
    title: "Lab 1 delivers HTML as JSX",
    kind: "demo",
    bullets: [
      "A Lab 1 topic is a **component**: a function that returns JSX",
      "Keep each HTML topic in its own file under `app/labs/lab1/`, then import it into `page.tsx`",
      "Lab 1 stays one URL (`/labs/lab1`) while the file list grows",
      "Give wrappers `id`s that start with `wd-` so graders and DevTools Find land on the same node",
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
    codeAddedLines: [5],
    embed: "lab1-stub",
  },
  {
    id: "next-up",
    title: "Next: headings and paragraphs",
    kind: "title",
    bullets: [
      "You have a document: DOCTYPE, html, head, body, and a DOM the browser builds",
      "Deck 2: `h1`–`h6`, then `p` so whitespace becomes real vertical gaps",
    ],
  },
];
