import type { QuizQuestion } from "./types";

/** Curated self-check bank for §2.1. Add items over time; the quiz draws 10. */
export const CH2_SECTION_21_QUESTIONS: QuizQuestion[] = [
  {
    id: "2-1-style-attr-bad",
    section: "2.1.1",
    kind: "concept",
    prompt:
      "Why does the chapter treat the JSX style attribute as a bad habit for a real project?",
    choices: [
      {
        id: "a",
        text: "Browsers ignore the style attribute on most tags",
      },
      {
        id: "b",
        text: "Scattering styles on individual tags makes the project hard to maintain",
      },
      {
        id: "c",
        text: "The style attribute cannot set background or text color",
      },
      {
        id: "d",
        text: "React forbids the style attribute in .tsx files",
      },
    ],
    answer: "b",
    explanation:
      "Inline styles are convenient for a quick experiment, but they live on each tag. A CSS file lets one rule restyle many elements without touching the markup again.",
  },
  {
    id: "2-1-jsx-camelcase",
    section: "2.1.1",
    kind: "syntax",
    prompt:
      "In a JSX style object, which key correctly sets the CSS background-color property without quotes?",
    choices: [
      { id: "a", text: "background-color" },
      { id: "b", text: "background_color" },
      { id: "c", text: "backgroundColor" },
      { id: "d", text: "bgColor" },
    ],
    answer: "c",
    explanation:
      "Unquoted JavaScript keys must be valid identifiers, so hyphens are not allowed. The usual React convention is camelCase: backgroundColor.",
  },
  {
    id: "2-1-quoted-hyphen",
    section: "2.1.2",
    kind: "syntax",
    prompt:
      "Which style object keeps the original hyphenated CSS property name?",
    choices: [
      { id: "a", text: '{ background-color: "green" }' },
      { id: "b", text: '{ "background-color": "green" }' },
      { id: "c", text: '{ background_color: "green" }' },
      { id: "d", text: "You cannot use hyphens in a style object at all" },
    ],
    answer: "b",
    explanation:
      "A hyphenated key is legal in JavaScript if you quote it. Unquoted camelCase is still the usual convention in React.",
  },
  {
    id: "2-1-css-hyphen",
    section: "2.1.2",
    kind: "syntax",
    prompt:
      "In a .css file, which is the original CSS property name for a background color?",
    choices: [
      { id: "a", text: "backgroundColor" },
      { id: "b", text: "background-color" },
      { id: "c", text: "BackgroundColor" },
      { id: "d", text: "bg-color" },
    ],
    answer: "b",
    explanation:
      "Plain CSS files use hyphenated names — background-color — that is the original CSS syntax. CamelCase belongs to the JavaScript style object.",
  },
  {
    id: "2-1-selector-blank",
    section: "2.1.2",
    kind: "blank",
    prompt:
      "In a CSS rule, the part before the opening curly brace — the part that answers “which elements?” — is called the _____.",
    answer: "selector",
    accept: ["the selector", "a selector", "css selector"],
    explanation:
      "A CSS rule is a selector plus a declaration block. Here the selector is the tag name p.",
  },
  {
    id: "2-1-declaration-anatomy",
    section: "2.1.2",
    kind: "syntax",
    prompt: "In this rule, which piece is one declaration?",
    code: `p {
  background-color: green;
  color: white;
}`,
    choices: [
      { id: "a", text: "p" },
      { id: "b", text: "the pair of curly braces" },
      { id: "c", text: "background-color: green;" },
      { id: "d", text: "the whole snippet including p and the braces" },
    ],
    answer: "c",
    explanation:
      "A declaration is a property, a colon, a value, and a semicolon. The selector is p; the braces wrap the declaration block; the whole snippet is the rule.",
  },
  {
    id: "2-1-css-acronym",
    section: "2.1.2",
    kind: "acronym",
    prompt: "What does CSS stand for?",
    choices: [
      { id: "a", text: "Creative Style Syntax" },
      { id: "b", text: "Cascading Style Sheets" },
      { id: "c", text: "Computed Screen Styles" },
      { id: "d", text: "Component Style System" },
    ],
    answer: "b",
    explanation:
      "CSS is Cascading Style Sheets. The “Cascading” part is how the browser picks a winner when several rules target the same property.",
  },
  {
    id: "2-1-import-css",
    section: "2.1.2",
    kind: "syntax",
    prompt:
      "How do you attach app/labs/lab2/index.css to the Lab 2 page component?",
    choices: [
      { id: "a", text: '<link rel="stylesheet" href="index.css" />' },
      { id: "b", text: 'import "./index.css";' },
      { id: "c", text: 'require("index.css")' },
      { id: "d", text: "<Css file=\"index.css\" />" },
    ],
    answer: "b",
    explanation:
      "In this Next.js lab you import the stylesheet at the top of the component, the same way you import another file: import \"./index.css\";",
  },
  {
    id: "2-1-tag-selector-broad",
    section: "2.1.2",
    kind: "concept",
    prompt: "What is the main drawback of a tag selector such as p { … }?",
    choices: [
      { id: "a", text: "It only works on the first paragraph in the file" },
      {
        id: "b",
        text: "It matches every instance of that tag, which is powerful but blunt",
      },
      { id: "c", text: "Tag selectors are ignored once you import a CSS file" },
      { id: "d", text: "It cannot set background-color, only color" },
    ],
    answer: "b",
    explanation:
      "Selecting by tag name restyles every matching tag in the document. ID and class selectors narrow that down.",
  },
  {
    id: "2-1-id-hash",
    section: "2.1.3",
    kind: "syntax",
    prompt:
      "Which selector targets the paragraph whose id is wd-id-selector-1?",
    choices: [
      { id: "a", text: "p.wd-id-selector-1" },
      { id: "b", text: "p#wd-id-selector-1" },
      { id: "c", text: "p wd-id-selector-1" },
      { id: "d", text: "#p.wd-id-selector-1" },
    ],
    answer: "b",
    explanation:
      "An ID selector is the tag name, a #, and the id value: p#wd-id-selector-1.",
  },
  {
    id: "2-1-class-dot",
    section: "2.1.4",
    kind: "syntax",
    prompt: "Which selector targets every element with class wd-class-selector?",
    choices: [
      { id: "a", text: "#wd-class-selector" },
      { id: "b", text: "wd-class-selector" },
      { id: "c", text: ".wd-class-selector" },
      { id: "d", text: "class.wd-class-selector" },
    ],
    answer: "c",
    explanation:
      "A class selector is a name prefixed with a dot. The same class can be reused on different tag types (a paragraph and a heading in the lab).",
  },
  {
    id: "2-1-class-reuse",
    section: "2.1.4",
    kind: "concept",
    prompt:
      "Unlike an id, a class name can be applied to which of the following?",
    choices: [
      { id: "a", text: "Only one element in the whole document" },
      {
        id: "b",
        text: "A group of tags, even if they are different types of elements",
      },
      { id: "c", text: "Only p tags, never headings" },
      { id: "d", text: "Only elements that also have an id" },
    ],
    answer: "b",
    explanation:
      "The lab applies .wd-class-selector to both a paragraph and an h4 so they share a look. An id is meant to be unique.",
  },
  {
    id: "2-1-descendant-vs-child",
    section: "2.1.5",
    kind: "snippet",
    prompt:
      "Which selector matches a .wd-selector-3 nested at any depth inside .wd-selector-1?",
    choices: [
      { id: "a", text: ".wd-selector-1 > .wd-selector-3" },
      { id: "b", text: ".wd-selector-1 .wd-selector-3" },
      { id: "c", text: ".wd-selector-1 + .wd-selector-3" },
      { id: "d", text: ".wd-selector-3 > .wd-selector-1" },
    ],
    answer: "b",
    explanation:
      "A space is a descendant combinator (any depth). The > combinator is stricter: only a direct child.",
  },
  {
    id: "2-1-child-combinator",
    section: "2.1.5",
    kind: "puzzle",
    prompt: "Given this markup, which rule colors the span?",
    code: `<div className="wd-selector-2">
  <p className="wd-selector-3">
    <span className="wd-selector-4">…</span>
  </p>
</div>`,
    choices: [
      { id: "a", text: ".wd-selector-2 > .wd-selector-4 { color: red; }" },
      {
        id: "b",
        text: ".wd-selector-2 > .wd-selector-3 > .wd-selector-4 { color: red; }",
      },
      { id: "c", text: ".wd-selector-4 > .wd-selector-3 { color: red; }" },
      {
        id: "d",
        text: ".wd-selector-2 + .wd-selector-3 + .wd-selector-4 { color: red; }",
      },
    ],
    answer: "b",
    explanation:
      "Each > requires a direct child. The span is a child of the paragraph, which is a child of the div — not a direct child of the div.",
  },
  {
    id: "2-1-specificity",
    section: "2.1.6",
    kind: "concept",
    prompt:
      "Several rules set color on the same element. Which selector wins if all are present?",
    choices: [
      { id: "a", text: "A tag selector, because it is the most general" },
      { id: "b", text: "A class selector, because classes always win" },
      {
        id: "c",
        text: "An id selector, which beats a class, which beats a tag, which beats the browser default",
      },
      { id: "d", text: "Whichever rule appears first in the CSS file" },
    ],
    answer: "c",
    explanation:
      "Specificity: id > class > tag > browser default. Source order only breaks a tie when specificity is equal.",
  },
  {
    id: "2-1-source-order",
    section: "2.1.6",
    kind: "concept",
    prompt:
      "Two rules have the same specificity and set the same property. Which one wins?",
    choices: [
      { id: "a", text: "The rule declared earlier in the CSS" },
      { id: "b", text: "The rule declared later in the CSS" },
      { id: "c", text: "The rule in the HTML style attribute always loses" },
      { id: "d", text: "The browser picks at random" },
    ],
    answer: "b",
    explanation:
      "Equal specificity is resolved by source order: the later rule wins. That is why the id rules in §2.1.3 had to come after (or replace) the blanket p rule.",
  },
  {
    id: "2-1-inherit",
    section: "2.1.6",
    kind: "concept",
    prompt: "Which statement about inheritance is the one the chapter makes?",
    choices: [
      {
        id: "a",
        text: "color can inherit from a parent; width and margin do not",
      },
      {
        id: "b",
        text: "Every CSS property inherits unless you write inherit: none",
      },
      { id: "c", text: "margin inherits; color never does" },
      { id: "d", text: "Inheritance only works with id selectors" },
    ],
    answer: "a",
    explanation:
      "Font-related properties such as color pass down to children. Layout properties like width and margin do not — each element needs its own rule.",
  },
  {
    id: "2-1-specificity-puzzle",
    section: "2.1.6",
    kind: "puzzle",
    prompt: "An element matches all three of these rules. What color is the text?",
    code: `p { color: green; }
.wd-note { color: blue; }
p#wd-title { color: red; }`,
    choices: [
      { id: "a", text: "green" },
      { id: "b", text: "blue" },
      { id: "c", text: "red" },
      { id: "d", text: "the browser default (black)" },
    ],
    answer: "c",
    explanation:
      "p#wd-title is an id selector, so it beats both the class and the tag rule regardless of source order.",
  },
  {
    id: "2-1-foreground",
    section: "2.1.7",
    kind: "syntax",
    prompt: "Which property sets an element’s foreground (text) color?",
    choices: [
      { id: "a", text: "background-color" },
      { id: "b", text: "color" },
      { id: "c", text: "foreground" },
      { id: "d", text: "text-color" },
    ],
    answer: "b",
    explanation:
      "The color property is foreground text. Background uses background-color. CSS accepts named colors, hex triples such as #7070ff, or rgb(…).",
  },
  {
    id: "2-1-padding-vs-margin",
    section: "2.1.10",
    kind: "concept",
    prompt: "What is the difference between padding and margin?",
    choices: [
      {
        id: "a",
        text: "Padding is outside the border; margin is between content and border",
      },
      {
        id: "b",
        text: "Padding is the space between content and border; margin is outside the border, separating neighbors",
      },
      { id: "c", text: "They are two names for the same property" },
      { id: "d", text: "Margin only works on images; padding only works on text" },
    ],
    answer: "b",
    explanation:
      "Padding sits inside the border (content → padding → border). Margin sits outside the border and separates the element from its neighbors.",
  },
  {
    id: "2-1-box-model-order",
    section: "2.1.10",
    kind: "concept",
    prompt:
      "From the inside out, what is the order of the CSS box-model layers?",
    choices: [
      {
        id: "a",
        text: "margin, border, padding, content",
      },
      {
        id: "b",
        text: "content, padding, border, margin",
      },
      {
        id: "c",
        text: "content, border, padding, margin",
      },
      {
        id: "d",
        text: "padding, content, margin, border",
      },
    ],
    answer: "b",
    explanation:
      "Content is in the middle, then padding, then border, then margin on the outside.",
  },
  {
    id: "2-1-box-sizing-blank",
    section: "2.1.10",
    kind: "blank",
    prompt:
      "The CSS property that chooses whether width includes padding and border is named _____.",
    answer: "box-sizing",
    accept: ["boxsizing", "box sizing"],
    explanation:
      "box-sizing is either content-box (width is content only) or border-box (width includes padding and border).",
  },
  {
    id: "2-1-content-box-math",
    section: "2.1.10",
    kind: "puzzle",
    prompt: "What is this box’s total width on screen, including padding and border?",
    code: `width: 100px;
padding: 10px;
border: 10px solid red;
box-sizing: content-box;`,
    choices: [
      { id: "a", text: "100px" },
      { id: "b", text: "110px" },
      { id: "c", text: "120px" },
      { id: "d", text: "140px" },
    ],
    answer: "d",
    explanation:
      "content-box sizes only the content to 100px. Padding adds 10px on the left and 10px on the right, and the border adds another 10px per side: 100 + 20 + 20 = 140px.",
  },
  {
    id: "2-1-border-box",
    section: "2.1.10",
    kind: "concept",
    prompt:
      "A box has width: 200px, padding: 20px, border: 10px, and box-sizing: border-box. How wide is it on screen?",
    choices: [
      { id: "a", text: "200px — padding and border count inside the 200px" },
      { id: "b", text: "230px — only the border is added outside" },
      { id: "c", text: "260px — padding and border are added outside" },
      { id: "d", text: "180px — padding is subtracted twice" },
    ],
    answer: "a",
    explanation:
      "border-box keeps the declared width. Padding and border eat into the 200px instead of adding to it, which is why layout math is easier with border-box.",
  },
  {
    id: "2-1-inline-width",
    section: "2.1.12",
    kind: "concept",
    prompt:
      "You set width: 150px and height: 50px on a span whose display is inline. What happens?",
    choices: [
      { id: "a", text: "The span becomes a 150×50 box" },
      {
        id: "b",
        text: "The width and height are ignored; the span sizes to its text and stays in the line",
      },
      { id: "c", text: "The span starts a new line and stretches full width" },
      { id: "d", text: "The browser reports an error and skips the rule" },
    ],
    answer: "b",
    explanation:
      "Inline boxes ignore width and height. Use display: inline-block (or block) when you need those dimensions to stick.",
  },
  {
    id: "2-1-inline-block",
    section: "2.1.12",
    kind: "syntax",
    prompt:
      "Which declaration makes an element sit in a line of text and still honor width and height?",
    choices: [
      { id: "a", text: "display: inline;" },
      { id: "b", text: "display: block;" },
      { id: "c", text: "display: inline-block;" },
      { id: "d", text: "position: inline;" },
    ],
    answer: "c",
    explanation:
      "inline-block is the hybrid: it flows like a word, but width, height, padding, and margin work as they do on a block.",
  },
  {
    id: "2-1-display-block-stack",
    section: "2.1.12",
    kind: "snippet",
    prompt:
      "Three spans all have display: block and width: 150px. How do they lay out?",
    choices: [
      { id: "a", text: "Side by side on one line, each 150px wide" },
      {
        id: "b",
        text: "Stacked vertically, each starting a new line, each 150px wide",
      },
      { id: "c", text: "Stacked, but each still stretches to the full parent width" },
      { id: "d", text: "They overlap because spans cannot be blocks" },
    ],
    answer: "b",
    explanation:
      "display: block makes each span start a new line. Width still applies, so they are 150px rather than full-bleed. That is the third row of the lab demo.",
  },
  {
    id: "2-1-div-vs-span",
    section: "2.1.12",
    kind: "concept",
    prompt:
      "By default, how do a div and a span differ?",
    choices: [
      {
        id: "a",
        text: "A div is inline (sits in the line); a span is block (starts a new line)",
      },
      {
        id: "b",
        text: "A div is block (starts a new line, full width); a span is inline (sits in the line)",
      },
      { id: "c", text: "They have the same default display" },
      { id: "d", text: "A span cannot go inside a paragraph; a div can" },
    ],
    answer: "b",
    explanation:
      "div (and headings, p, form) default to block. span (and a, strong) default to inline. CSS display can override either one.",
  },
  {
    id: "2-1-border-radius-blank",
    section: "2.1.11",
    kind: "blank",
    prompt:
      "The CSS property that rounds an element’s corners is named _____.",
    answer: "border-radius",
    accept: ["borderradius", "border radius"],
    explanation:
      "border-radius curves the corners. In a JSX style object the same property is borderRadius.",
  },
  {
    id: "2-1-relative-ghost",
    section: "2.1.13",
    kind: "concept",
    prompt:
      "When you position an element relatively and nudge it with top/left, what happens to its original space?",
    choices: [
      { id: "a", text: "Neighbors slide in and fill the gap" },
      {
        id: "b",
        text: "A “ghost” of the original space stays, so surrounding elements do not shift",
      },
      { id: "c", text: "The element is removed from the document entirely" },
      { id: "d", text: "The page always scrolls so the element stays in view" },
    ],
    answer: "b",
    explanation:
      "position: relative offsets the box from where it would have sat, but the layout still reserves the original spot.",
  },
  {
    id: "2-1-absolute-ancestor",
    section: "2.1.14",
    kind: "concept",
    prompt:
      "An absolutely positioned element is placed relative to which ancestor?",
    choices: [
      { id: "a", text: "Always the <body>, never anything else" },
      {
        id: "b",
        text: "Its nearest ancestor whose position is relative, absolute, or fixed — or the page if none exists",
      },
      { id: "c", text: "The next sibling in the HTML" },
      { id: "d", text: "The viewport only, same as position: fixed" },
    ],
    answer: "b",
    explanation:
      "That is why the lab wraps the absolutely positioned boxes in a relative container: they anchor to that container instead of the whole page.",
  },
  {
    id: "2-1-fixed-viewport",
    section: "2.1.15",
    kind: "concept",
    prompt: "position: fixed anchors an element to which of the following?",
    choices: [
      { id: "a", text: "Its parent’s padding box" },
      { id: "b", text: "The browser’s viewport" },
      { id: "c", text: "The nearest paragraph" },
      { id: "d", text: "The top of the CSS file" },
    ],
    answer: "b",
    explanation:
      "Fixed positioning is relative to the viewport, so the element stays put while the rest of the page scrolls — the pattern used later for Kambaz Navigation.",
  },
  {
    id: "2-1-zindex",
    section: "2.1.16",
    kind: "syntax",
    prompt:
      "Two overlapping positioned elements: which property overrides the default “later HTML on top” stacking order?",
    choices: [
      { id: "a", text: "order" },
      { id: "b", text: "z-index" },
      { id: "c", text: "layer" },
      { id: "d", text: "stack" },
    ],
    answer: "b",
    explanation:
      "A higher z-index renders above a lower one, regardless of source order. The lab uses z-index: 10 to bring a box to the front.",
  },
  {
    id: "2-1-flex-display",
    section: "2.1.19",
    kind: "syntax",
    prompt:
      "Which declaration lines up a container’s children in a row without floats?",
    choices: [
      { id: "a", text: "display: block;" },
      { id: "b", text: "display: grid-row;" },
      { id: "c", text: "display: flex; flex-direction: row;" },
      { id: "d", text: "float: row;" },
    ],
    answer: "c",
    explanation:
      "Flexbox (display: flex) is the purpose-built alternative to float-based layout. flex-direction: row lines children up horizontally.",
  },
  {
    id: "2-1-media-query",
    section: "2.1.20",
    kind: "concept",
    prompt: "What do media queries mainly give you in this chapter?",
    choices: [
      { id: "a", text: "A way to import CSS only on Tuesdays" },
      {
        id: "b",
        text: "Rules that apply only when the viewport matches a condition — the foundation of responsive design",
      },
      { id: "c", text: "A replacement for class selectors" },
      { id: "d", text: "A JavaScript API for playing video" },
    ],
    answer: "b",
    explanation:
      "A @media block applies CSS only when a condition matches, most commonly a width range, so the same markup can look different on a phone and a desktop.",
  },
  {
    id: "2-1-media-syntax",
    section: "2.1.20",
    kind: "snippet",
    prompt: "Which snippet is a valid media query like the ones in the lab?",
    choices: [
      { id: "a", text: "@media screen.width > 750 { … }" },
      { id: "b", text: "@media (min-width: 750px) and (max-width: 1000px) { … }" },
      { id: "c", text: "media-query: 750px-1000px { … }" },
      { id: "d", text: "@viewport 750px { … }" },
    ],
    answer: "b",
    explanation:
      "The lab uses @media (min-width: …) and (max-width: …) to switch background colors as the window is resized.",
  },
  {
    id: "2-1-classname-jsx",
    section: "2.1.4",
    kind: "syntax",
    prompt:
      "In JSX, which attribute puts an element in the CSS class wd-fg-color-red?",
    choices: [
      { id: "a", text: 'class="wd-fg-color-red"' },
      { id: "b", text: 'className="wd-fg-color-red"' },
      { id: "c", text: 'css="wd-fg-color-red"' },
      { id: "d", text: 'styleName="wd-fg-color-red"' },
    ],
    answer: "b",
    explanation:
      "JSX uses className because class is a reserved word in JavaScript. The CSS file still selects with a leading dot: .wd-fg-color-red.",
  },
  {
    id: "2-1-rule-blank",
    section: "2.1.2",
    kind: "blank",
    prompt:
      "A selector plus its declaration block together make one CSS _____.",
    answer: "rule",
    accept: ["rules", "css rule", "style rule", "stylesheet rule"],
    explanation:
      "That shape does not change for the rest of the chapter — later sections only introduce new selectors and new properties.",
  },
  {
    id: "2-1-button-default-type",
    section: "1.3.7.7",
    kind: "concept",
    prompt:
      "Inside a <form>, what does a <button> do if you omit the type attribute?",
    choices: [
      { id: "a", text: "Nothing — a button requires type or the browser ignores the click" },
      {
        id: "b",
        text: "It submits the form (type defaults to submit) and the page typically reloads",
      },
      { id: "c", text: "It always cancels and clears the fields" },
      { id: "d", text: "It behaves like type=\"button\" and never submits" },
    ],
    answer: "b",
    explanation:
      "A button inside a form defaults to type=\"submit\". Always write type explicitly: submit for Save, button for Cancel and for Kambaz actions that are not sending a form.",
  },
  {
    id: "2-1-button-type-button",
    section: "1.3.7.7",
    kind: "syntax",
    prompt:
      "Which attribute stops a <button> from submitting the surrounding form?",
    choices: [
      { id: "a", text: 'type="submit"' },
      { id: "b", text: 'type="button"' },
      { id: "c", text: 'type="reset"' },
      { id: "d", text: "action=\"none\"" },
    ],
    answer: "b",
    explanation:
      "type=\"button\" is a clickable control that does not submit. Kambaz uses it for Go, Publish, + Assignment, and similar actions.",
  },
  {
    id: "2-1-button-vs-input",
    section: "1.3.7.7",
    kind: "concept",
    prompt:
      "Why does the lab prefer <button> over <input type=\"submit\">?",
    choices: [
      {
        id: "a",
        text: "input cannot live inside a form, but button can",
      },
      {
        id: "b",
        text: "The label is nested text (so later you can put an icon inside), and type still chooses submit vs button",
      },
      { id: "c", text: "button is the only tag browsers style as a clickable control" },
      { id: "d", text: "React forbids the input tag in .tsx files" },
    ],
    answer: "b",
    explanation:
      "Both can submit a form. button is more flexible because its children are the label, not a value attribute.",
  },
];
