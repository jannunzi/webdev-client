import { acronymFib, fib, mc, tf } from "../builders";
import type { QuestionGroup } from "../types";

const P_ANSWERS = [
  "p",
  "<p>",
  "</p>",
  "p tag",
  "p element",
  "paragraph",
  "paragraph tag",
  "paragraph element",
  "<p> tag",
  "<p> element",
  "the p element",
  "the paragraph element",
];

export const q1Group01: QuestionGroup = {
  id: "q1-g01-acronyms",
  order: 1,
  name: "Acronyms",
  type: "fill_in_blank",
  chapter: 1,
  section: "1.3",
  skill:
    "Expand core web acronyms from Chapter 1: one blank per letter, words in letter order.",
  notes:
    "Each stem is a different acronym. blankCount equals the letter count. Example instruction: CSS → Cascading / Style / Sheets. Alternate spellings are extra same-length combinations.",
  questions: [
    acronymFib(
      "q1-g01-01",
      "HTML",
      ["Hyper", "Text", "Markup", "Language"],
      "HTML is HyperText Markup Language, a dialect of XML for structuring documents so browsers can render them.",
      { extraCombinations: [["HyperText", "Text", "Markup", "Language"]] },
    ),
    acronymFib(
      "q1-g01-02",
      "XML",
      ["eXtensible", "Markup", "Language"],
      "XML is eXtensible Markup Language. HTML is a specialized dialect of it for web documents.",
      { extraCombinations: [["Extensible", "Markup", "Language"]] },
    ),
    acronymFib(
      "q1-g01-03",
      "JSX",
      ["Java", "Script", "XML"],
      "JSX is JavaScript XML: HTML-like markup written inside React components. One blank per letter: Java / Script / XML.",
    ),
    acronymFib(
      "q1-g01-04",
      "DOM",
      ["Document", "Object", "Model"],
      "The browser parses HTML/JSX into an in-memory tree called the Document Object Model.",
    ),
    acronymFib(
      "q1-g01-05",
      "URL",
      ["Uniform", "Resource", "Locator"],
      "A URL is a Uniform Resource Locator — the address of a resource on the Web.",
    ),
    acronymFib(
      "q1-g01-06",
      "HTTP",
      ["Hyper", "Text", "Transfer", "Protocol"],
      "HTTP is HyperText Transfer Protocol, the application protocol browsers use to request documents.",
      { extraCombinations: [["HyperText", "Text", "Transfer", "Protocol"]] },
    ),
    acronymFib(
      "q1-g01-07",
      "SPA",
      ["Single", "Page", "Application"],
      "A Single Page Application keeps one HTML shell loaded and updates the UI without a full reload for every in-app route.",
      { prefix: "In this chapter, " },
    ),
    acronymFib(
      "q1-g01-08",
      "API",
      ["Application", "Programming", "Interface"],
      "An API is an Application Programming Interface — a contract other code can call.",
    ),
    acronymFib(
      "q1-g01-09",
      "CSS",
      ["Cascading", "Style", "Sheets"],
      "CSS is Cascading Style Sheets. This course covers it in Chapter 2; the acronym still appears in Chapter 1 context.",
    ),
    acronymFib(
      "q1-g01-10",
      "IDE",
      ["Integrated", "Development", "Environment"],
      "An IDE (Integrated Development Environment) is the editor/tooling used to write the app, such as VS Code or Cursor.",
    ),
    acronymFib(
      "q1-g01-11",
      "npm",
      ["Node", "Package", "Manager"],
      "npm is the Node Package Manager used to install JavaScript packages. Lowercase npm is accepted after normalization.",
    ),
  ],
};

export const q1Group02: QuestionGroup = {
  id: "q1-g02-elements-attributes",
  order: 2,
  name: "HTML elements, attributes, block vs inline",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.1",
  skill: "Distinguish tags vs elements vs attributes, and block vs inline layout.",
  questions: [
    mc(
      "q1-g02-01",
      "In `<h1>Labs</h1>`, what is the textual syntax `<h1>` called?",
      [
        "An attribute",
        "A tag",
        "The DOM",
        "A fragment",
      ],
      1,
      "A tag is the textual syntax in source. An element is the fuller idea: tag, attributes, body, and the resulting DOM node.",
    ),
    mc(
      "q1-g02-02",
      "A name/value pair written inside an opening tag (for example `id=\"main\"`) is called a(n) _____.",
      ["element", "attribute", "fragment", "void node"],
      1,
      "Attributes configure an element. The pattern is `name=\"value\"` on the opening tag.",
    ),
    mc(
      "q1-g02-03",
      "Which element is a generic block container that starts on a new line and stretches as wide as its parent?",
      ["<span>", "<a>", "<div>", "<strong>"],
      2,
      "div is a generic block container for grouping. span is the generic inline container.",
    ),
    mc(
      "q1-g02-04",
      "Which element is a generic inline container that sits in the line of text without breaking to a new row?",
      ["<div>", "<p>", "<h1>", "<span>"],
      3,
      "span stays in the sentence. Headings, p, and div are blocks.",
    ),
    mc(
      "q1-g02-05",
      "Which set is all block-level by default in this chapter’s model?",
      [
        "span, a, strong",
        "h1, p, div",
        "img, input, br",
        "label, option, a",
      ],
      1,
      "Headings, p, and div are blocks. span, a, and strong are inline.",
    ),
    mc(
      "q1-g02-06",
      "What does the `id` attribute provide?",
      [
        "A CSS class that can be reused on many elements",
        "A unique name for that element on the page",
        "The visible caption of a form control",
        "The destination of a hyperlink",
      ],
      1,
      "`id` gives a unique name — useful for styling, testing, labels, and in-page links.",
    ),
    mc(
      "q1-g02-07",
      "When the browser parses HTML/JSX, it builds an in-memory tree. That tree is the _____.",
      [
        "SPA",
        "API",
        "DOM",
        "URL",
      ],
      2,
      "Each tag becomes a node in the Document Object Model.",
    ),
    mc(
      "q1-g02-08",
      "Which statement about tags vs elements is most accurate?",
      [
        "They are identical terms with no distinction even in DevTools",
        "A tag is source syntax; an element includes attributes, body, and the DOM node",
        "An element is only the closing tag",
        "Attributes are never part of an element",
      ],
      1,
      "Day to day either word is fine; the distinction helps when inspecting the live tree.",
    ),
    mc(
      "q1-g02-09",
      "Which of these is inline by default?",
      ["<form>", "<ul>", "<h4>", "<a>"],
      3,
      "Anchor tags sit in the line of text. form, ul, and headings are blocks.",
    ),
    mc(
      "q1-g02-10",
      "A void element (such as img, br, or input) is written in JSX as which shape?",
      [
        "<img></img> with required children",
        "A self-closing tag such as <img />",
        "<img> with no slash and a matching </img>",
        "Only as a CSS class",
      ],
      1,
      "Void elements have no body. In JSX write <img … />, <br />, <input />.",
    ),
  ],
};

export const q1Group03: QuestionGroup = {
  id: "q1-g03-paragraphs",
  order: 3,
  name: "Paragraphs and whitespace",
  type: "fill_in_blank",
  chapter: 1,
  section: "1.3.2",
  skill: "Wrap a block of text in p so the browser adds vertical space (source whitespace is ignored).",
  questions: [
    ...[
      "Tenured Faculty biography",
      "Full Time Employee handbook excerpt",
      "Savings Account disclosure",
      "Course catalog description",
      "Office hours policy",
      "Library borrowing notice",
      "Dining hall allergen statement",
      "Parking permit rules",
      "Research abstract",
      "Student club announcement",
    ].map((domain, index) =>
      fib(
        `q1-g03-${String(index + 1).padStart(2, "0")}`,
        `A long ${domain} is written as several sentences of prose, with blank lines between those sentences in the source. Browsers ignore that extra whitespace and blend the text into one stream. Wrap each paragraph of prose in the HTML _____ element — the paragraph element, not a heading and not a generic container.`,
        P_ANSWERS,
        "Chapter 1.3.2 teaches the paragraph tag (`<p>`). Browsers ignore extra spaces, tabs, and newlines; wrapping each block of prose in `p` adds vertical space. A `div` is a generic container and `h1`–`h6` are headings — neither is the paragraph element.",
      ),
    ),
  ],
};

export const q1Group04: QuestionGroup = {
  id: "q1-g04-headings",
  order: 4,
  name: "Headings and document hierarchy",
  type: "true_false",
  chapter: 1,
  section: "1.3.1",
  skill: "Heading levels h1–h6 and using headings for document outline, not decoration.",
  questions: [
    tf(
      "q1-g04-01",
      "HTML provides six heading levels: h1 through h6, where h1 is the largest by default and h6 is the smallest.",
      true,
    ),
    tf(
      "q1-g04-02",
      "An h6 heading is larger than an h1 heading by default.",
      false,
      "h1 is the largest; h6 is the smallest.",
    ),
    tf(
      "q1-g04-03",
      "A heading is a block element: it takes the width of its parent and adds vertical space before and after.",
      true,
    ),
    tf(
      "q1-g04-04",
      "You should skip from h1 directly to h5 whenever you want smaller text, even if no h2–h4 sections exist, because heading tags are only a font-size shortcut.",
      false,
      "Headings express document hierarchy. Use the next outline level; do not skip levels just to shrink type.",
    ),
    tf(
      "q1-g04-05",
      "Section titles that summarize the topic they precede are a typical use of heading tags.",
      true,
    ),
    tf(
      "q1-g04-06",
      "A div heading (a div with large bold text but no h1–h6) is the same as an h2 for document structure and accessibility.",
      false,
      "div does not add heading semantics. Use heading tags for titles in the outline.",
    ),
    tf(
      "q1-g04-07",
      "There is no h7 tag in HTML heading levels taught in this chapter; the smallest heading is h6.",
      true,
    ),
    tf(
      "q1-g04-08",
      "An h3 is an appropriate subsection title under an h2 for the same topic area.",
      true,
    ),
    tf(
      "q1-g04-09",
      "Wrapping a whole page of body copy in a single h1 is a good way to make all of the text large and bold.",
      false,
      "h1 marks a top-level title. Body copy belongs in paragraphs, not a heading.",
    ),
    tf(
      "q1-g04-10",
      "Headings, like paragraphs, participate in block layout rather than sitting inline like a span.",
      true,
    ),
  ],
};
