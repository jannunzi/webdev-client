import type { LectureSlide } from "../types";

export const CSS_INTRO_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 4 · Deck 1 — CSS Intro",
      "Chapter 2 §2.1.1–2.1.6 · Lab 2 starts here",
    ],
  },
  {
    id: "purpose",
    title: "CSS configures look and feel",
    kind: "content",
    bullets: [
      "**CSS** = Cascading Style Sheets — a declarative language for color, space, borders, and layout",
      "HTML says what a node *is*. CSS says how it *looks*",
      "Chapter 1 Kambaz screens were unstyled on purpose. Lab 2 teaches the rules before Tailwind utilities",
      "Same snippets as the book: `app/labs/lab2/page.tsx` and `index.css`",
    ],
  },
  {
    id: "three-places",
    title: "Load CSS three ways",
    kind: "content",
    bullets: [
      "**Best** — a `.css` file you import (or, in plain HTML, `<link rel=\"stylesheet\">`)",
      "**Better** — a `<style>` block in the document (still local, still hard to reuse)",
      "**Avoid** — a `style` attribute on one tag. Fine for a one-off experiment, not a project",
      "This course writes CSS files and imports them in React — not `<link>` in `layout.tsx`",
    ],
  },
  {
    id: "style-attr",
    title: "Style attribute is a JSX object",
    kind: "demo",
    bullets: [
      "In HTML the value is a string: `style=\"background-color: blue\"`",
      "In JSX it is an **object**: double curly braces, camelCase keys (`backgroundColor`)",
      "Hyphens are illegal in unquoted JS keys — that is why React uses camelCase",
    ],
    code: `<p style={{ backgroundColor: "blue", color: "white" }}>
  Style attribute allows configuring look and feel right on the
  element. Although it's very convenient it is considered bad
  practice and you should avoid using the style attribute
</p>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    embed: "css-style-attr",
  },
  {
    id: "why-avoid",
    title: "Inline style does not scale",
    kind: "content",
    bullets: [
      "The blue-on-white paragraph is convenient — and a warning",
      "Scatter `style={{…}}` across tags and you cannot change a look in one place",
      "The rest of Lab 2 moves rules into `index.css` so markup stays markup",
    ],
  },
  {
    id: "css-rule",
    title: "A CSS rule has three parts",
    kind: "content",
    bullets: [
      "**Selector** — what to match (`p`, `#id`, `.class`)",
      "**Declaration block** — the `{ … }` list of styles",
      "**Declaration** — `property: value;` — hyphenated names in a CSS file",
    ],
    code: `p {
  background-color: green;
  color: white;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "import-css",
    title: "Import a CSS file in React",
    kind: "demo",
    bullets: [
      "Create `app/labs/lab2/index.css` next to `page.tsx`",
      "`import \"./index.css\"` — same as importing a component",
      "A tag selector restyles **every** `p` in the file. Powerful, blunt",
      "JSX still uses `className`, not `class`",
    ],
    code: `import "./index.css";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the
        element. Although it's very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/page.tsx",
    codeAddedLines: [1],
    embed: "css-import",
  },
  {
    id: "id-selectors",
    title: "ID selectors target one id",
    kind: "demo",
    bullets: [
      "Write `p#wd-id-selector-1` — tag + `#` + the unique `id`",
      "Comment out the blanket `p` rule so it stops winning",
      "Each paragraph keeps its own colors. Other `p` tags stay untouched",
    ],
    code: `p#wd-id-selector-1 {
  background-color: red;
  color: white;
}
p#wd-id-selector-2 {
  background-color: yellow;
  color: black;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeAddedLines: [[1, 8]],
    codeBlocks: [
      {
        file: "app/labs/lab2/page.tsx",
        language: "tsx",
        code: `<div id="wd-css-id-selectors">
  <h3>ID selectors</h3>
  <p id="wd-id-selector-1">
    Instead of changing the look and feel of all the
    elements of the same name, e.g., P, we can refer to a
    specific element by its ID
  </p>
  <p id="wd-id-selector-2">
    Here's another paragraph using a different ID and a
    different look and feel
  </p>
</div>`,
      },
    ],
    embed: "css-id-selectors",
  },
  {
    id: "class-selectors",
    title: "Class selectors share a look",
    kind: "demo",
    bullets: [
      "An `id` is unique. A **class** can sit on many tags, even different types",
      "CSS: `.wd-class-selector` (a leading dot). JSX: `className=\"wd-class-selector\"`",
      "React reserves `class` for JavaScript classes — that is why JSX renamed the attribute",
    ],
    code: `.wd-class-selector {
  background-color: yellow;
  color: blue;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    codeBlocks: [
      {
        file: "app/labs/lab2/page.tsx",
        language: "tsx",
        code: `<div id="wd-css-class-selectors">
  <h3>Class selectors</h3>
  <p className="wd-class-selector">
    Instead of using IDs to refer to elements, you can use an
    element's CLASS attribute
  </p>
  <h4 className="wd-class-selector">
    This heading has same style as paragraph above
  </h4>
</div>`,
      },
    ],
    embed: "css-class-selectors",
  },
  {
    id: "structure",
    title: "Descendant vs child combinators",
    kind: "demo",
    bullets: [
      "A **space** is a descendant: `.wd-selector-1 .wd-selector-3` — any depth",
      "A `>` is a **direct child**: `.wd-selector-2 > .wd-selector-3 > .wd-selector-4`",
      "The paragraph turns red from the broader rule. The inner span is yellow-on-blue",
    ],
    code: `.wd-selector-1 .wd-selector-3 {
  background-color: red;
  color: white;
}
.wd-selector-2 > .wd-selector-3 > .wd-selector-4 {
  background-color: yellow;
  color: blue;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-structure-selectors",
  },
  {
    id: "cascade",
    title: "Cascade picks the winning rule",
    kind: "content",
    bullets: [
      "**Specificity** — id beats class beats tag beats the browser default",
      "**Source order** — equal specificity: the later rule in the file wins",
      "**Inheritance** — `color` and fonts pass down. `width` and `margin` do not",
      "If a style “does nothing,” check a more specific selector or a later twin",
    ],
  },
  {
    id: "next-up",
    title: "Next: colors",
    kind: "title",
    bullets: [
      "You can target a tag, one id, a shared class, or a place in the tree",
      "Deck 2: `color` and `background-color` as reusable `wd-fg-*` / `wd-bg-*` classes",
    ],
  },
];
