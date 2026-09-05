import type { LectureSlide } from "../types";

export const LISTS_AND_TABLES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Lists and Tables",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 3 — collections you can scan, then rows and columns",
      "Lab 1 files: ListTags.tsx, Tables.tsx, Images.tsx",
    ],
  },
  {
    id: "why-lists",
    title: "Lists group related items",
    kind: "content",
    bullets: [
      "`<ol>`, `<ul>`, and `<li>` turn a collection into something the reader can scan",
      "**Ordered** (`ol`) — sequence matters: recipe steps, ranked results",
      "**Unordered** (`ul`) — order does not change the meaning; the browser uses bullets",
      "Each item is an `li`. Typed “1. 2. 3.” without list tags still blends into a paragraph",
    ],
  },
  {
    id: "plain-steps",
    title: "Numbered lines are not a list",
    kind: "content",
    bullets: [
      "Start ListTags.tsx with the pancake steps as plain text — no `ol` yet",
      "The numbers look like a list in the source and fail in the browser",
      "Same lesson as unwrapped paragraphs: the browser does not honor your line breaks",
    ],
    code: `How to make pancakes:
1. Mix dry ingredients.
2. Add wet ingredients.
3. Stir to combine.`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/ListTags.tsx",
  },
  {
    id: "ordered-list",
    title: "ol numbers the items for you",
    kind: "demo",
    bullets: [
      "Wrap the list in `ol` and each step in `li`",
      "The browser numbers them. Add or remove a step — the sequence stays correct",
      "Lab 1 sample id: `wd-pancakes` inside `div#wd-lists`",
      "Both `ol` and `li` are **block** elements, so items stack",
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
    id: "unordered-list",
    title: "ul is the same items, bullets instead",
    kind: "demo",
    bullets: [
      "Same `li` children. Change the parent from `ol` to `ul`",
      "Use `ul` for books, tags, or anything where order is not the point",
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
    id: "why-tables",
    title: "Tables are for tabular data",
    kind: "content",
    bullets: [
      "`<table>` organizes data into rows and columns — not for page layout",
      "HTML began as a way to share scientific documents; tables arrived for measurements",
      "Quiz grades, rosters, and assignment lists are tabular. A landing-page grid is not (use CSS later)",
      "Lab 1 sample id: `wd-tables`",
    ],
  },
  {
    id: "table-anatomy",
    title: "thead, tbody, tfoot, tr, th, td",
    kind: "content",
    bullets: [
      "`tr` — a row. `th` — a header cell. `td` — a data cell",
      "`thead` / `tbody` / `tfoot` group header, body, and summary rows",
      "`colSpan` stretches a cell across columns (the Average row)",
      "In JSX, `colSpan` is camelCase. HTML’s `colspan` becomes `colSpan={3}`",
    ],
  },
  {
    id: "table-code",
    title: "A quiz-grade table",
    kind: "demo",
    bullets: [
      "Keep the sample small: Quiz, Topic, Date, Grade, then an Average footer",
      "Alignment attributes (`align`) are old HTML. Fine for Lab 1; Chapter 2 will use CSS",
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
    id: "images",
    title: "img needs src and alt",
    kind: "content",
    bullets: [
      "`<img>` is empty — no closing tag. In JSX write `<img … />`",
      "`src` is the URL or a path under `public/` (for example `/images/teslabot.jpg`)",
      "`alt` describes the image for assistive tech and failed loads",
      "Lab 1: `div#wd-images` with `wd-starship` (remote) and `wd-teslabot` (local)",
    ],
    code: `<img
  id="wd-starship"
  width="400px"
  alt="Starship"
  src="https://example.com/starship.jpg"
/>
<img
  id="wd-teslabot"
  src="/images/teslabot.jpg"
  height="200px"
  alt="Tesla Bot"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/Images.tsx",
  },
  {
    id: "next-up",
    title: "Next: web forms",
    kind: "title",
    bullets: [
      "Lists and tables structure collections. Images are content, not layout",
      "Deck 4: `form`, labels, and the Lab 1 `forms/` folder",
    ],
  },
];
