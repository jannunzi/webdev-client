import { fib, mc } from "../builders";
import type { QuestionGroup } from "../types";

export const q1Group05: QuestionGroup = {
  id: "q1-g05-lists",
  order: 5,
  name: "Ordered, unordered, and nested lists",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.3",
  skill: "Choose ol vs ul, wrap items in li, and nest lists inside an li.",
  questions: [
    mc(
      "q1-g05-01",
      "When should you use <ol> instead of <ul>?",
      [
        "When the items have no meaningful order",
        "When the sequence matters — for example numbered steps in a recipe",
        "When you need table rows",
        "ol and ul are interchangeable in HTML5",
      ],
      1,
    ),
    mc(
      "q1-g05-02",
      "Which tag wraps each item inside either an ordered or unordered list?",
      ["<dt>", "<item>", "<li>", "<p>"],
      2,
    ),
    mc(
      "q1-g05-03",
      "If you type “1. Mix dry ingredients.” as plain text with no list tags, what does the browser do?",
      [
        "It always creates a numbered list automatically",
        "It treats the lines as ordinary text that can blend like unwrapped paragraphs",
        "It converts them into a table",
        "It throws until you add <ol>",
      ],
      1,
    ),
    mc(
      "q1-g05-04",
      "A list of favorite books in no particular order should use which outer tag?",
      ["<ol>", "<ul>", "<table>", "<select>"],
      1,
    ),
    mc(
      "q1-g05-05",
      "Both <ol> and <li> are _____ elements, so items stack vertically.",
      ["inline", "void", "block", "replaced"],
      2,
    ),
    mc(
      "q1-g05-06",
      "The browser numbers <ol> items for you. What is a practical consequence?",
      [
        "You must hard-code 1. 2. 3. in every <li>",
        "Adding or removing a step still keeps numbering correct",
        "Ordered lists cannot have more than three items",
        "Numbering only works inside a <table>",
      ],
      1,
    ),
    mc(
      "q1-g05-07",
      "How do you nest a sub-list (for example ingredients under a recipe step)?",
      [
        "Place a <ul> or <ol> as a sibling after the parent </ol>, not inside any <li>",
        "Place the inner <ul> or <ol> inside the <li> it belongs to",
        "Use <nest> around the inner items",
        "Put the inner list in a <span> next to the parent list",
      ],
      1,
    ),
    mc(
      "q1-g05-08",
      "Which markup is a valid nested list structure?",
      [
        "<ul><ul><li>A</li></ul></ul>",
        "<ul><li>Fruit<ul><li>Apple</li></ul></li></ul>",
        "<li><ul><ul>Apple</ul></ul></li>",
        "<ul Apple><li></li></ul>",
      ],
      1,
    ),
    mc(
      "q1-g05-09",
      "Which collection is a better fit for <ul> than <ol>?",
      [
        "The steps to reset a password, in the order they must be done",
        "A set of related tags to remember, where order does not change the meaning",
        "A ranking of finishers from first to last",
        "Turn-by-turn directions",
      ],
      1,
    ),
    mc(
      "q1-g05-10",
      "Can an ordered list contain an unordered nested list (and vice versa)?",
      [
        "No — nested lists must use the same tag as the parent",
        "Yes — nest either <ul> or <ol> inside an <li>",
        "Only unordered lists may nest",
        "Only if you wrap them in <div>",
      ],
      1,
    ),
  ],
};

export const q1Group06: QuestionGroup = {
  id: "q1-g06-tables",
  order: 6,
  name: "Table structure and merged cells",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.4",
  skill: "Use table/thead/tbody/tfoot/tr/th/td and colSpan/rowSpan for merged cells.",
  questions: [
    mc(
      "q1-g06-01",
      "Which tags wrap the header rows, the data rows, and the footer rows of a table?",
      [
        "<head>, <body>, <foot>",
        "<thead>, <tbody>, <tfoot>",
        "<header>, <main>, <footer>",
        "<tr>, <td>, <th>",
      ],
      1,
    ),
    mc(
      "q1-g06-02",
      "A table row is marked up with which tag?",
      ["<td>", "<th>", "<tr>", "<row>"],
      2,
    ),
    mc(
      "q1-g06-03",
      "Which tag is a heading cell, and which is a data cell?",
      [
        "th is heading; td is data",
        "td is heading; th is data",
        "tr is heading; table is data",
        "thead is a cell; tbody is a cell",
      ],
      0,
    ),
    mc(
      "q1-g06-04",
      "In JSX, which attribute merges a cell across several columns?",
      ["rowSpan", "colSpan", "width", "align"],
      1,
      "HTML colspan becomes colSpan in JSX. The Average label covering Quiz, Topic, and Date uses colSpan={3}.",
    ),
    mc(
      "q1-g06-05",
      "Which attribute merges a cell across several rows?",
      ["colSpan", "rowSpan", "valign", "border"],
      1,
    ),
    mc(
      "q1-g06-06",
      "Presentational align on a cell sets which of the following?",
      [
        "How many columns the cell occupies",
        "Horizontal placement of the cell’s content (left, center, right)",
        "Whether the cell is a heading",
        "The file path of an image",
      ],
      1,
    ),
    mc(
      "q1-g06-07",
      "Numeric grades in a table are often easier to scan when they are _____.",
      [
        "left-aligned as headings",
        "right-aligned with align=\"right\"",
        "merged with colSpan on every score",
        "placed in a <span> outside the table",
      ],
      1,
    ),
    mc(
      "q1-g06-08",
      "What does table border={1} control in this chapter’s HTML-presentational style?",
      [
        "The thickness of the grid lines in pixels",
        "How many rows are visible",
        "Whether tfoot is required",
        "The number of merged cells",
      ],
      0,
    ),
    mc(
      "q1-g06-09",
      "width=\"100%\" on a <table> typically does what?",
      [
        "Limits the table to 100 pixels",
        "Stretches the table across its container",
        "Merges all columns",
        "Converts the table into a list",
      ],
      1,
    ),
    mc(
      "q1-g06-10",
      "Which statement about valign is correct?",
      [
        "It sets horizontal alignment of numbers",
        "It sets vertical placement when a row is taller than its content (top, middle, bottom)",
        "It is the JSX name for colspan",
        "It replaces thead",
      ],
      1,
    ),
  ],
};

const IMG_PATH_DOMAINS: { label: string; file: string }[] = [
  { label: "campus map", file: "campus-map" },
  { label: "faculty portrait", file: "faculty-portrait" },
  { label: "lab equipment", file: "lab-equipment" },
  { label: "library hours poster", file: "library-hours" },
  { label: "shuttle schedule graphic", file: "shuttle-schedule" },
];

const IMG_ALT_DOMAINS = [
  "campus map",
  "faculty portrait",
  "robot demo",
  "dining menu photo",
  "course logo",
];

export const q1Group07: QuestionGroup = {
  id: "q1-g07-images",
  order: 7,
  name: "Images, paths, and alternative text",
  type: "fill_in_blank",
  chapter: 1,
  section: "1.3.5",
  skill: "Reference files under public/ from the site root, and describe images with alt.",
  questions: [
    ...IMG_PATH_DOMAINS.map((domain, index) =>
      fib(
        `q1-g07-${String(index + 1).padStart(2, "0")}`,
        `A ${domain.label} file is saved as public/images/${domain.file}.jpg. In \`<img src>\`, write the path as _____ (do not include the \`public/\` prefix).`,
        [
          `/images/${domain.file}.jpg`,
          `images/${domain.file}.jpg`,
        ],
        "Files under public/ are served from the site root. Drop the public/ prefix: /images/…. (A leading slash is preferred.)",
      ),
    ),
    ...IMG_ALT_DOMAINS.map((domain, index) =>
      fib(
        `q1-g07-${String(index + 6).padStart(2, "0")}`,
        `The _____ attribute holds a short text description of a ${domain} image when it cannot load, and it matters for accessibility.`,
        ["alt", "alt text", "the alt", "alt attribute", "the alt attribute"],
        "`alt` describes the picture for people and tools that cannot see it. `src` points at the file.",
      ),
    ),
  ],
};

export const q1Group08: QuestionGroup = {
  id: "q1-g08-labels",
  order: 8,
  name: "Labels and form controls",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.6.1",
  skill: "Associate captions with controls using htmlFor/id or wrapping; know why for becomes htmlFor.",
  questions: [
    mc(
      "q1-g08-01",
      "In JSX, which attribute on a `<label>` links it to an input’s `id`?",
      ["`for`", "`htmlFor`", "`target`", "`name`"],
      1,
      "Plain HTML uses `for`. In JSX it must be `htmlFor` because `for` is a reserved word in JavaScript.",
    ),
    mc(
      "q1-g08-02",
      "A label has `htmlFor=\"email\"` and an input has `id=\"email\"`. What happens when the user clicks the label text?",
      [
        "Nothing — only the field itself is clickable",
        "The matching control is focused (or selected, for radios/checkboxes)",
        "Every input on the page is focused",
        "The form submits",
      ],
      1,
    ),
    mc(
      "q1-g08-03",
      "Which label pattern can omit `htmlFor` and `id` because nesting creates the association?",
      [
        "A sibling `<label>` before an unlabeled `<input>`",
        "`<label><input type=\"radio\" name=\"g\" /> Yes</label>`",
        "A `<div>` wrapped around the input",
        "A `<span>` with a `title` attribute",
      ],
      1,
    ),
    mc(
      "q1-g08-04",
      "Why associate labels with controls on small screens?",
      [
        "It shrinks the clickable area so mis-taps are more likely",
        "It enlarges the clickable area — tapping the caption is easier than hitting a tiny control",
        "Labels are required for CSS only",
        "It disables the input until the label is clicked twice",
      ],
      1,
    ),
    mc(
      "q1-g08-05",
      "Which pairing is correct for the sibling-label style?",
      [
        '`<input id="name" /> <label for="name">Name</label>`  (HTML attribute `for`, written as `for` in JSX)',
        '`<input id="name" /> <label htmlFor="name">Name</label>`',
        '`<input htmlFor="name" /> <label id="name">Name</label>`',
        '`<label name="name">Name</label> <input />`',
      ],
      1,
    ),
    mc(
      "q1-g08-06",
      "What should `htmlFor` match?",
      [
        "The input’s `name` attribute only",
        "The input’s `id`",
        "The form’s `id`",
        "The option’s `value`",
      ],
      1,
    ),
    mc(
      "q1-g08-07",
      "The `<form>` element’s job in this chapter is to _____.",
      [
        "style headings",
        "wrap controls so users can fill in and submit information as one unit",
        "replace `<table>` for tabular data",
        "create a new App Router URL by itself",
      ],
      1,
    ),
    mc(
      "q1-g08-08",
      "Which is a form control you would typically place inside `<form>`?",
      ["`<html>`", "`<head>`", "`<input>`", "`<title>`"],
      2,
    ),
    mc(
      "q1-g08-09",
      "Screen readers can announce a field’s purpose when _____.",
      [
        "the field has a placeholder and nothing else",
        "a label is programmatically associated with the control",
        "the input type is text",
        "the page uses a fragment href",
      ],
      1,
    ),
    mc(
      "q1-g08-10",
      "Putting `htmlFor` on the `<input>` instead of the `<label>` is _____.",
      [
        "the required JSX pattern",
        "incorrect — `htmlFor` belongs on the label, matching the input’s `id`",
        "how you group radio buttons",
        "how you set the submitted value",
      ],
      1,
    ),
  ],
};
