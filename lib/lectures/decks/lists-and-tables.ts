import type { LectureSlide } from "../types";

export const LISTS_AND_TABLES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "LISTS",
      "Lab 1: ListTags.tsx (`wd-lists`) then Tables.tsx (`wd-tables`)",
    ],
  },
  {
    id: "ol-vs-ul",
    title: "Lists",
    kind: "content",
    bullets: [
      "`<ul>` — **unordered**. Order does not change the meaning. The browser uses bullets",
      "`<ol>` — **ordered**. Sequence matters. The browser numbers the items",
      "Each item is an `<li>`",
    ],
    code: `<h2>Topics</h2>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<h2>Steps</h2>
<ol>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ol>`,
    codeLanguage: "html",
  },
  {
    id: "ordered-lists",
    title: "Ordered lists",
    kind: "content",
    bullets: [
      "Ordered lists **enumerate** line items",
      "Use `ol` when the sequence is the point: steps, ranked results",
    ],
    code: `<h2>Ordered lists</h2>
Follow these steps
<ol>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ol>`,
    codeLanguage: "html",
  },
  {
    id: "unordered-lists",
    title: "Unordered lists",
    kind: "content",
    bullets: [
      "Unordered lists render as **bullet points**",
      "Same `li` children. Change the parent from `ol` to `ul`",
    ],
    code: `<h2>Unordered lists</h2>
Follow these steps
<ul>
  <li>Learn HTML</li>
  <li>Learn JavaScript</li>
  <li>Build cool stuff</li>
</ul>`,
    codeLanguage: "html",
  },
  {
    id: "pancakes-before",
    title: "Example",
    kind: "content",
    bullets: [
      "Start with the pancake steps as **plain text** — no `ol` yet",
      "Browsers **ignore** white spaces. The numbers look like a list in the file and fail on the page",
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
    title: "Add ol and li for ordered list",
    kind: "demo",
    bullets: [
      "Wrap the list in `ol` and each step in `li`",
      "The browser numbers them. Lab 1 sample id: `wd-pancakes`",
    ],
    embed: "list-tags",
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
    codeAddedLines: [[2, 11]],
  },
  {
    id: "books-ul",
    title: "Use ul for unordered lists",
    kind: "demo",
    bullets: [
      "Favorite books — order is **not** the point",
      "Lab 1 sample id: `wd-my-books`",
    ],
    code: `<h5>Unordered List Tag</h5>
My favorite books (in no particular order)
<ul id="wd-my-books">
  <li>Dune</li>
  <li>Lord of the Rings</li>
  <li>Ender&apos;s Game</li>
  <li>Red Mars</li>
  <li>The Forever War</li>
</ul>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
    embed: "list-tags",
  },
  {
    id: "tables-not-layout",
    title: "Tables",
    kind: "content",
    bullets: [
      "Use tables to display **tabular data** — each row is a record, each column has the same type",
      "Do **not** use tables to layout content. Use `div`s and CSS instead",
    ],
    code: `<table>
  <thead></thead>
  <tbody></tbody>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "thead-th",
    title: "Table headings and rows",
    kind: "content",
    bullets: [
      "`thead` contains table heading content",
      "`tr` is a row. `th` is a **header cell**",
      "`border` sets border width — old HTML, fine for Lab 1",
    ],
    code: `<table border="1">
  <thead>
    <tr>
      <th>Quiz</th>
      <th>Topic</th>
      <th>Date</th>
      <th>Grade</th>
    </tr>
  </thead>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "tbody-td",
    title: "Table body, rows, and data",
    kind: "content",
    bullets: [
      "`tbody` groups the data rows",
      "`td` is a data cell. One `tr` per record",
    ],
    code: `<table border="1">
  <tbody>
    <tr>
      <td>Q1</td>
      <td>HTML</td>
      <td>2/3/21</td>
      <td>85</td>
    </tr>
  </tbody>
</table>`,
    codeLanguage: "html",
  },
  {
    id: "tfoot-colspan",
    title: "tfoot and colSpan",
    kind: "content",
    bullets: [
      "`tfoot` is the summary row — Average, totals, notes",
      "`colSpan` stretches a cell across columns. In JSX it is camelCase: `colSpan={3}`",
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
    title: "Example",
    kind: "demo",
    bullets: [
      "Lab 1 sample id: `wd-tables` — `thead` / `tbody` / `tfoot`",
      "Alignment attributes (`align`) are old HTML. Chapter 2 moves that into CSS",
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
    codeAddedLines: [[16, 21]],
    embed: "tables",
  },
  {
    id: "next-up",
    title: "Next: web forms",
    kind: "title",
    bullets: [
      "Lists and tables structure collections. Tables are data, **not layout**",
      "Next: labels, text, buttons, file, radio vs checkbox, select, typed inputs",
    ],
  },
];
