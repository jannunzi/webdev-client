import type { LectureSlide } from "../types";

export const LISTS_AND_TABLES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 3 — Lists and Tables",
      "Lab 1: ListTags.tsx (`wd-lists`) and Tables.tsx (`wd-tables`)",
    ],
  },
  {
    id: "ol-vs-ul",
    title: "ol vs ul",
    kind: "content",
    bullets: [
      "`<ol>` — **ordered**. Sequence matters: recipe steps, ranked results. The browser numbers the items",
      "`<ul>` — **unordered**. Order does not change the meaning. The browser uses bullets",
      "Each item is an `<li>`. Typed “1. 2. 3.” without list tags still blends into a paragraph",
      "Both `ol` / `ul` and `li` are **block** elements, so items stack",
    ],
  },
  {
    id: "pancakes-before",
    title: "Pancakes before ol — not a list",
    kind: "content",
    bullets: [
      "Start ListTags.tsx with the pancake steps as plain text — no `ol` yet",
      "The numbers look like a list in the source and fail in the browser",
      "Same lesson as unwrapped paragraphs",
    ],
    code: `How to make pancakes:
1. Mix dry ingredients.
2. Add wet ingredients.
3. Stir to combine.`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
  },
  {
    id: "pancakes-after",
    title: "Pancakes after ol / li — wd-pancakes",
    kind: "demo",
    bullets: [
      "Wrap the list in `ol` and each step in `li`",
      "The browser numbers them. Add or remove a step — the sequence stays correct",
      "Lab 1 sample id: `wd-pancakes` inside `div#wd-lists`",
    ],
    code: `How to make pancakes:
<ol id="wd-pancakes">
  <li>Mix dry ingredients.</li>
  <li>Add wet ingredients.</li>
  <li>Stir to combine.</li>
  <li>Heat a skillet or griddle.</li>
  <li>Pour batter onto the skillet.</li>
  <li>Cook until bubbly on top.</li>
  <li>Flip and cook the other side.</li>
  <li>Serve and enjoy!</li>
</ol>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
  },
  {
    id: "books-ul",
    title: "Favorite books — ul",
    kind: "demo",
    bullets: [
      "Same `li` children. Change the parent from `ol` to `ul`",
      "Use `ul` when order is not the point",
      "Lab 1 sample id: `wd-my-books`. Personal list: `wd-your-books`",
    ],
    code: `<h5>Unordered List Tag</h5>
My favorite books (in no particular order)
<ul id="wd-my-books">
  <li>Dune</li>
  <li>Lord of the Rings</li>
  <li>Ender&apos;s Game</li>
</ul>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
    embed: "list-tags",
  },
  {
    id: "tables-not-layout",
    title: "Tables are for tabular data — not layout",
    kind: "content",
    bullets: [
      "`<table>` organizes **rows and columns of data**",
      "Quiz grades, rosters, assignment lists — yes. A two-column page chrome — not forever",
      "Labs layout may still use a table to sit the TOC beside `{children}`. That is temporary until CSS chapters",
      "Lab 1 sample id: `wd-tables`",
    ],
  },
  {
    id: "thead-th",
    title: "thead and th",
    kind: "content",
    bullets: [
      "`thead` groups the header row(s)",
      "`th` is a **header cell** — browsers bold it; screen readers use it as the column name",
      "Put Quiz, Topic, Date, Grade in `th` cells, not `td`",
    ],
    code: `<thead>
  <tr>
    <th>Quiz</th>
    <th>Topic</th>
    <th>Date</th>
    <th>Grade</th>
  </tr>
</thead>`,
    codeLanguage: "html",
  },
  {
    id: "tbody-td",
    title: "tbody and td",
    kind: "content",
    bullets: [
      "`tbody` groups the data rows",
      "`tr` is a row. `td` is a data cell",
      "One `tr` per quiz. Keep the column order aligned with the `th` headers",
    ],
    code: `<tbody>
  <tr>
    <td>Q1</td>
    <td>HTML</td>
    <td>2/3/21</td>
    <td>85</td>
  </tr>
</tbody>`,
    codeLanguage: "html",
  },
  {
    id: "tfoot-colspan",
    title: "tfoot and colSpan",
    kind: "content",
    bullets: [
      "`tfoot` is the summary row — Average, totals, notes",
      "`colSpan` stretches a cell across columns. In JSX it is camelCase: `colSpan={3}`",
      "HTML’s `colspan` attribute becomes `colSpan` in React",
    ],
    code: `<tfoot>
  <tr>
    <td colSpan={3}>Average</td>
    <td>90</td>
  </tr>
</tfoot>`,
    codeLanguage: "tsx",
  },
  {
    id: "quiz-table",
    title: "Quiz table — thead, tbody, tfoot",
    kind: "demo",
    bullets: [
      "Keep the sample small. Alignment attributes (`align`) are old HTML — fine for Lab 1",
      "Chapter 2 will move alignment into CSS",
    ],
    code: `<table id="wd-tables" border={1} width="100%">
  <thead>
    <tr>
      <th>Quiz</th>
      <th>Topic</th>
      <th>Grade</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Q1</td>
      <td>HTML</td>
      <td>85</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2}>Average</td>
      <td>85</td>
    </tr>
  </tfoot>
</table>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/Tables.tsx",
    embed: "tables",
  },
  {
    id: "images-note",
    title: "img is content, not a table",
    kind: "content",
    bullets: [
      "Lab 1 also has `Images.tsx` — `wd-images`, `wd-starship`, `wd-teslabot`",
      "`<img>` is empty. In JSX write `<img … />` with `src` and `alt`",
      "Do not wrap the whole page in a table just to place an image",
    ],
  },
  {
    id: "lab1-ids",
    title: "Lab 1 ids for this deck",
    kind: "content",
    bullets: [
      "`wd-lists` — wrapper. `wd-pancakes` — ordered recipe",
      "`wd-my-books` — sample unordered list. `wd-your-books` — yours",
      "`wd-tables` — the quiz table",
    ],
  },
  {
    id: "next-up",
    title: "Next: web forms",
    kind: "title",
    bullets: [
      "Lists and tables structure collections. Tables are data, not chrome",
      "Deck 4: labels, text, buttons, file, radio vs checkbox, select, typed inputs",
    ],
  },
];
