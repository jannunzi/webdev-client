import type { QuizQuestion } from "./types";

/** Curated self-check bank for Chapter 1 labs. The quiz draws 10. */
export const CH1_LAB_QUESTIONS: QuizQuestion[] = [
  {
    id: "1-html-acronym",
    section: "1.3",
    kind: "acronym",
    prompt: "What does HTML stand for?",
    choices: [
      { id: "a", text: "HyperText Markup Language" },
      { id: "b", text: "High-level Text Module Library" },
      { id: "c", text: "Host Transfer Markup Link" },
      { id: "d", text: "Hashed Tag Markup Language" },
    ],
    answer: "a",
    explanation:
      "HTML is HyperText Markup Language, a dialect of XML for structuring documents so browsers can render them.",
  },
  {
    id: "1-jsx-acronym",
    section: "1.2.5",
    kind: "acronym",
    prompt: "What does JSX stand for?",
    choices: [
      { id: "a", text: "Java Syntax eXtension" },
      { id: "b", text: "JavaScript XML" },
      { id: "c", text: "JSON Style eXchange" },
      { id: "d", text: "Just Simple XML" },
    ],
    answer: "b",
    explanation:
      "JSX is JavaScript XML: HTML-like markup written inside React components. This course uses it in .tsx files.",
  },
  {
    id: "1-xml-acronym",
    section: "1.3",
    kind: "acronym",
    prompt: "HTML is described as a specialized dialect of XML. What does XML stand for?",
    choices: [
      { id: "a", text: "eXtra Markup Language" },
      { id: "b", text: "eXtensible Markup Language" },
      { id: "c", text: "eXternal Module Language" },
      { id: "d", text: "eXecutable Markup List" },
    ],
    answer: "b",
    explanation:
      "XML is eXtensible Markup Language. HTML is a specialized dialect of it for web documents.",
  },
  {
    id: "1-dom-acronym",
    section: "1.3",
    kind: "acronym",
    prompt: "What does DOM stand for?",
    choices: [
      { id: "a", text: "Data Object Map" },
      { id: "b", text: "Document Object Model" },
      { id: "c", text: "Display Order Method" },
      { id: "d", text: "Dynamic Output Markup" },
    ],
    answer: "b",
    explanation:
      "The browser parses HTML/JSX into an in-memory tree called the Document Object Model. Each tag becomes a node.",
  },
  {
    id: "1-spa-acronym",
    section: "1.3.10",
    kind: "acronym",
    prompt: "What does SPA stand for in this chapter?",
    choices: [
      { id: "a", text: "Server Page Application" },
      { id: "b", text: "Style Property Attribute" },
      { id: "c", text: "Single Page Application" },
      { id: "d", text: "Static Package Archive" },
    ],
    answer: "c",
    explanation:
      "A Single Page Application keeps one HTML shell loaded and updates the UI as the user moves around, without a full reload for every in-app route.",
  },
  {
    id: "1-page-tsx-route",
    section: "1.2.5",
    kind: "syntax",
    prompt:
      "In the App Router, which file under a folder creates that folder’s route?",
    choices: [
      { id: "a", text: "index.html" },
      { id: "b", text: "route.ts" },
      { id: "c", text: "page.tsx" },
      { id: "d", text: "component.tsx" },
    ],
    answer: "c",
    explanation:
      "A page.tsx file under app/ registers a route. app/labs/lab1/page.tsx is the URL /labs/lab1.",
  },
  {
    id: "1-forms-folder-no-page",
    section: "1.3.6",
    kind: "concept",
    prompt:
      "Why must you not put a page.tsx inside app/labs/lab1/forms/?",
    choices: [
      { id: "a", text: "Next.js forbids folders named forms" },
      {
        id: "b",
        text: "That file would create a /labs/lab1/forms route; the folder is only for organizing components",
      },
      { id: "c", text: "Forms.tsx cannot import files from a folder that has a page" },
      { id: "d", text: "page.tsx is allowed only at the app/ root" },
    ],
    answer: "b",
    explanation:
      "Folders with page.tsx become URLs. forms/ is organization so related files sit together. Import Forms from page.tsx with ./forms/Forms.",
  },
  {
    id: "1-htmlfor",
    section: "1.3.6.1",
    kind: "syntax",
    prompt:
      "In JSX, which attribute on a <label> links it to an input’s id?",
    choices: [
      { id: "a", text: "for" },
      { id: "b", text: "htmlFor" },
      { id: "c", text: "target" },
      { id: "d", text: "name" },
    ],
    answer: "b",
    explanation:
      "Plain HTML uses for. In JSX it must be htmlFor because for is a reserved word in JavaScript. The value must match the input’s id.",
  },
  {
    id: "1-radio-name",
    section: "1.3.6.3",
    kind: "blank",
    prompt:
      "The browser groups radio buttons that share the same _____ attribute.",
    answer: "name",
    accept: ["the name", "name attribute", "the name attribute"],
    explanation:
      "Radios with the same name are one group. Each option still needs its own id (and usually a value). A second independent choice needs a different name.",
  },
  {
    id: "1-radio-exclusive",
    section: "1.3.6.3",
    kind: "concept",
    prompt:
      "What does mutually exclusive mean for radio buttons that share a name?",
    choices: [
      { id: "a", text: "The user can select every option at once" },
      {
        id: "b",
        text: "Selecting one option clears the others in that name group",
      },
      { id: "c", text: "The radios ignore the name attribute" },
      { id: "d", text: "Only checkboxes can be selected" },
    ],
    answer: "b",
    explanation:
      "One name group, one selection. Picking Comedy clears Drama. Mutual exclusion does not cross name groups.",
  },
  {
    id: "1-radio-two-groups",
    section: "1.3.6.3",
    kind: "puzzle",
    prompt:
      "Comedy is selected in radio-genre. The user then picks Weekly in radio-frequency. What is selected?",
    code: `<input type="radio" name="radio-genre" id="wd-radio-comedy" />
<input type="radio" name="radio-frequency" id="wd-radio-weekly" />`,
    choices: [
      { id: "a", text: "Only Weekly — any new radio click clears every radio on the page" },
      { id: "b", text: "Only Comedy — frequency radios do not work" },
      { id: "c", text: "Both Comedy and Weekly — different name values are separate groups" },
      { id: "d", text: "Neither — radios cannot stay selected" },
    ],
    answer: "c",
    explanation:
      "Mutual exclusion applies within a name, not across the page. radio-genre and radio-frequency are independent, so both selections stay.",
  },
  {
    id: "1-radio-same-name-snippet",
    section: "1.3.6.3",
    kind: "snippet",
    prompt:
      "Which pair of radios is one mutually exclusive group?",
    choices: [
      {
        id: "a",
        text: '<input type="radio" name="genre" id="comedy" /> and <input type="radio" name="genre" id="drama" />',
      },
      {
        id: "b",
        text: '<input type="radio" name="genre" id="comedy" /> and <input type="radio" name="frequency" id="weekly" />',
      },
      {
        id: "c",
        text: '<input type="radio" id="comedy" /> and <input type="radio" id="drama" />  (no name)',
      },
      {
        id: "d",
        text: '<input type="checkbox" name="genre" /> and <input type="checkbox" name="genre" />',
      },
    ],
    answer: "a",
    explanation:
      "Shared name groups radios. Different names are separate groups. Missing name does not form a group. Checkboxes with the same name are still independent.",
  },
  {
    id: "1-textarea-snippet",
    section: "1.3.6.2",
    kind: "snippet",
    prompt: "Which JSX textarea is valid in React 19?",
    choices: [
      {
        id: "a",
        text: "<textarea id=\"wd-textarea\">Lorem ipsum</textarea>",
      },
      {
        id: "b",
        text: "<textarea id=\"wd-textarea\" defaultValue=\"Lorem ipsum\" />",
      },
      {
        id: "c",
        text: "<textarea id=\"wd-textarea\" placeholder=\"Lorem ipsum\" /> with the biography as children",
      },
      {
        id: "d",
        text: "<input type=\"textarea\" defaultValue=\"Lorem ipsum\" />",
      },
    ],
    answer: "b",
    explanation:
      "Put the starting text on defaultValue. Children throw in React 19. placeholder is hint text, not the value. There is no input type textarea — use the textarea tag.",
  },
  {
    id: "1-link-snippet",
    section: "1.3.10",
    kind: "snippet",
    prompt: "Which markup navigates from the Labs index to Lab 1 without a full reload?",
    choices: [
      { id: "a", text: '<a href="/labs/lab1">Lab 1</a>' },
      { id: "b", text: '<Link href="/labs/lab1">Lab 1</Link>' },
      { id: "c", text: '<a href="#/labs/lab1">Lab 1</a>' },
      { id: "d", text: '<Link href="app/labs/lab1/page.tsx">Lab 1</Link>' },
    ],
    answer: "b",
    explanation:
      "Import Link from next/link and point href at the route (/labs/lab1), not the file path. A plain <a> still works but reloads the document. Hash routes are not how the App Router works.",
  },
  {
    id: "1-label-htmlfor-id",
    section: "1.3.6.3",
    kind: "concept",
    prompt:
      "A label has htmlFor=\"wd-radio-comedy\" and a radio has id=\"wd-radio-comedy\". What happens when the user clicks the label text?",
    choices: [
      { id: "a", text: "Nothing — only the circle itself is clickable" },
      { id: "b", text: "The matching radio is selected (or focused)" },
      { id: "c", text: "Every radio with that name is selected" },
      { id: "d", text: "The form submits" },
    ],
    answer: "b",
    explanation:
      "htmlFor matching id associates the caption with the control. Clicking the text selects the radio and enlarges the clickable area — especially useful on small screens.",
  },
  {
    id: "1-label-wrap",
    section: "1.3.6.3",
    kind: "snippet",
    prompt:
      "Which label pattern can omit htmlFor and id because nesting creates the association?",
    code: `{/* A */}
<input type="radio" name="g" id="yes" />
<label htmlFor="yes">Yes</label>

{/* B */}
<label>
  <input type="radio" name="g" /> Yes
</label>`,
    choices: [
      { id: "a", text: "Only A — wrapping never associates a label" },
      { id: "b", text: "Only B — the input sits inside the label" },
      { id: "c", text: "Neither — every radio must use htmlFor" },
      { id: "d", text: "Both require htmlFor or the click does nothing" },
    ],
    answer: "b",
    explanation:
      "Two common ways: sibling label + htmlFor/id, or wrap the input inside the label. Wrapping is compact; separate labels are more flexible when the caption and control are not next to each other.",
  },
  {
    id: "1-checkbox-independent",
    section: "1.3.6.4",
    kind: "concept",
    prompt:
      "How do checkboxes differ from radio buttons that share a name?",
    choices: [
      {
        id: "a",
        text: "Checkboxes are also mutually exclusive — only one box in the name group can be on",
      },
      {
        id: "b",
        text: "Each checkbox can be selected independently, so Comedy and Drama can both be on",
      },
      { id: "c", text: "Checkboxes cannot use a label" },
      { id: "d", text: "Checkboxes ignore id and htmlFor" },
    ],
    answer: "b",
    explanation:
      "Checkboxes use the same htmlFor/id label pattern as radios, but they are not mutually exclusive. The user can pick several options at once.",
  },
  {
    id: "1-checkbox-label",
    section: "1.3.6.4",
    kind: "syntax",
    prompt:
      "Which markup correctly labels a checkbox in the sibling-label style Lab 1 uses?",
    choices: [
      {
        id: "a",
        text: '<input type="checkbox" id="wd-chkbox-comedy" /> <label for="wd-chkbox-comedy">Comedy</label>',
      },
      {
        id: "b",
        text: '<input type="checkbox" id="wd-chkbox-comedy" /> <label htmlFor="wd-chkbox-comedy">Comedy</label>',
      },
      {
        id: "c",
        text: '<input type="checkbox" htmlFor="wd-chkbox-comedy" /> <label id="wd-chkbox-comedy">Comedy</label>',
      },
      {
        id: "d",
        text: '<label name="wd-chkbox-comedy">Comedy</label> <input type="checkbox" />',
      },
    ],
    answer: "b",
    explanation:
      "Same pairing as radios: the input’s id matches the label’s htmlFor. for is the HTML name; JSX needs htmlFor. Do not put htmlFor on the input.",
  },
  {
    id: "1-defaultvalue",
    section: "1.3.6.1",
    kind: "concept",
    prompt:
      "For Lab 1 text fields, why use defaultValue instead of value?",
    choices: [
      {
        id: "a",
        text: "value is invalid on <input> in JSX",
      },
      {
        id: "b",
        text: "defaultValue is uncontrolled: the browser owns later typing. value without state looks frozen",
      },
      { id: "c", text: "defaultValue is only for passwords" },
      { id: "d", text: "placeholder and defaultValue are the same thing" },
    ],
    answer: "b",
    explanation:
      "Uncontrolled fields get an initial defaultValue, then the browser owns what the user types. Controlled value needs state and onChange — later chapters.",
  },
  {
    id: "1-textarea-jsx",
    section: "1.3.6.2",
    kind: "puzzle",
    prompt: "What happens in React 19 if you put the starting biography between <textarea> tags?",
    code: `<textarea id="wd-textarea">Lorem ipsum...</textarea>`,
    choices: [
      { id: "a", text: "It works — that is the HTML and the JSX pattern" },
      {
        id: "b",
        text: "React 19 throws; put the text on defaultValue (or value) instead of children",
      },
      { id: "c", text: "The text shows as a tooltip" },
      { id: "d", text: "The textarea becomes a void element" },
    ],
    answer: "b",
    explanation:
      "In HTML the body is the starting value. In JSX a textarea is modeled like input: current text is a prop, not children. React 19 errors if you set children.",
  },
  {
    id: "1-textarea-blank",
    section: "1.3.6.2",
    kind: "blank",
    prompt:
      "In JSX, put a textarea’s initial text on the _____ prop, not between the tags.",
    answer: "defaultValue",
    accept: ["defaultvalue", "default value"],
    explanation:
      "Lab 1 uses defaultValue for uncontrolled fields. value is the controlled form, saved for later chapters when you wire state.",
  },
  {
    id: "1-img-void",
    section: "1.3.5",
    kind: "concept",
    prompt: "Why is <img> written as a self-closing tag in JSX?",
    choices: [
      { id: "a", text: "React forbids all closing tags" },
      {
        id: "b",
        text: "img is a void element: no body and no children; configuration lives on attributes such as src and alt",
      },
      { id: "c", text: "Self-closing is optional and never used for input" },
      { id: "d", text: "Only remote images must be self-closing" },
    ],
    answer: "b",
    explanation:
      "Void elements have no body. In JSX write <img … />. The same pattern applies to <br /> and <input />.",
  },
  {
    id: "1-img-alt",
    section: "1.3.5",
    kind: "blank",
    prompt:
      "The _____ attribute holds a short text description of an image when it cannot load, and it matters for accessibility.",
    answer: "alt",
    accept: ["alt text", "the alt", "alt attribute", "the alt attribute"],
    explanation:
      "alt describes the picture for people and tools that cannot see it. src points at the file; width and height are optional size hints.",
  },
  {
    id: "1-public-image",
    section: "1.3.5",
    kind: "syntax",
    prompt:
      "A file saved as public/images/teslabot.jpg is referenced in <img src> as:",
    choices: [
      { id: "a", text: "public/images/teslabot.jpg" },
      { id: "b", text: "/images/teslabot.jpg" },
      { id: "c", text: "./public/images/teslabot.jpg" },
      { id: "d", text: "app/images/teslabot.jpg" },
    ],
    answer: "b",
    explanation:
      "Files under public/ are served from the site root. Drop the public/ prefix: /images/teslabot.jpg.",
  },
  {
    id: "1-ol-ul",
    section: "1.3.3",
    kind: "concept",
    prompt: "When should you use <ol> instead of <ul>?",
    choices: [
      { id: "a", text: "When the items have no meaningful order" },
      {
        id: "b",
        text: "When the sequence matters — for example numbered steps in a recipe",
      },
      { id: "c", text: "When you need table rows" },
      { id: "d", text: "ol and ul are interchangeable in HTML5" },
    ],
    answer: "b",
    explanation:
      "ol is an ordered list (sequence matters). ul is unordered (a set of items). Each item is an li.",
  },
  {
    id: "1-table-parts",
    section: "1.3.4",
    kind: "syntax",
    prompt:
      "Which tags wrap the header row, the data rows, and the average row of the quiz table?",
    choices: [
      { id: "a", text: "<head>, <body>, <foot>" },
      { id: "b", text: "<thead>, <tbody>, <tfoot>" },
      { id: "c", text: "<header>, <main>, <footer>" },
      { id: "d", text: "<tr>, <td>, <th>" },
    ],
    answer: "b",
    explanation:
      "thead holds column headings, tbody the data rows, tfoot the summary (Average). Rows are tr; cells are th or td.",
  },
  {
    id: "1-paragraph",
    section: "1.3.2",
    kind: "concept",
    prompt:
      "Why wrap a block of text in <p> instead of leaving it as raw text in the component?",
    choices: [
      { id: "a", text: "Browsers ignore text that is not in a paragraph" },
      {
        id: "b",
        text: "A paragraph is block layout: vertical gaps between blocks. Raw text flows inline and can blend together",
      },
      { id: "c", text: "<p> is required before every heading" },
      { id: "d", text: "Paragraphs create tables" },
    ],
    answer: "b",
    explanation:
      "Without paragraph tags, the browser treats later text as one inline stream. <p> formats vertical spacing between long pieces of text.",
  },
  {
    id: "1-fragment",
    section: "1.3.6.1",
    kind: "syntax",
    prompt:
      "TextFields returns several sibling tags. Which wrapper groups them without adding an extra DOM node?",
    choices: [
      { id: "a", text: "<div>…</div>" },
      { id: "b", text: "<>…</>" },
      { id: "c", text: "<span>…</span>" },
      { id: "d", text: "<form> is the only legal wrapper" },
    ],
    answer: "b",
    explanation:
      "A fragment (<>…</>) groups siblings without inserting a div. Forms.tsx still wraps the assembled fields in a real <form>.",
  },
  {
    id: "1-select-multiple",
    section: "1.3.6.5",
    kind: "syntax",
    prompt:
      "How do you let the user pick more than one option in a <select>?",
    choices: [
      { id: "a", text: 'type="multiple"' },
      { id: "b", text: "Add the multiple attribute on <select>" },
      { id: "c", text: "Use <option multiple> on every choice" },
      { id: "d", text: "You cannot; use radio buttons instead" },
    ],
    answer: "b",
    explanation:
      "multiple on the select turns it into a multi-select. defaultValue can be an array of option values to preselect more than one.",
  },
  {
    id: "1-button-type",
    section: "1.3.6.7",
    kind: "puzzle",
    prompt:
      "Inside a <form>, what does a <button> with no type attribute do when clicked?",
    choices: [
      { id: "a", text: "Nothing — buttons do nothing until you add onClick" },
      {
        id: "b",
        text: "It defaults to submit and the browser sends the form (which reloads the page unless you stop it)",
      },
      { id: "c", text: "It defaults to button, so Cancel is safe with no type" },
      { id: "d", text: "It defaults to reset and clears every field" },
    ],
    answer: "b",
    explanation:
      "Always write type explicitly. type=\"submit\" for Save; type=\"button\" for Cancel and for clicks that must not send the form.",
  },
  {
    id: "1-props",
    section: "1.3.7",
    kind: "concept",
    prompt:
      "In HighlightedParagraph, values such as text and backgroundColor that you pass as attributes are called:",
    choices: [
      { id: "a", text: "routes" },
      { id: "b", text: "props" },
      { id: "c", text: "void elements" },
      { id: "d", text: "fragments" },
    ],
    answer: "b",
    explanation:
      "Props (properties) are parameters on your component. You declare them on the function and pass them as attributes when you use the tag.",
  },
  {
    id: "1-children",
    section: "1.3.8",
    kind: "blank",
    prompt:
      "Content nested between a component’s tags — for example the list inside <HighlightedBox>…</HighlightedBox> — arrives as the _____ prop.",
    answer: "children",
    accept: ["the children", "children prop", "the children prop"],
    explanation:
      "children is the nested body. HighlightedBox wraps whatever you put between its tags. Layouts use the same idea.",
  },
  {
    id: "1-link-vs-a",
    section: "1.3.10",
    kind: "concept",
    prompt:
      "For in-app routes you created with page.tsx, why prefer <Link> from next/link over a plain <a>?",
    choices: [
      { id: "a", text: "Link is required for external https URLs" },
      {
        id: "b",
        text: "Link intercepts navigation so React can swap the next route without a full page reload",
      },
      { id: "c", text: "<a> cannot have an href" },
      { id: "d", text: "Link is only for hash fragments such as #wd-anchor-bottom" },
    ],
    answer: "b",
    explanation:
      "A plain <a href=\"/labs/lab1\"> asks the browser for a new document. Link keeps the SPA shell. Use <a> for true external URLs.",
  },
  {
    id: "1-href-hash",
    section: "1.3.9",
    kind: "syntax",
    prompt:
      "Which href scrolls to an element on the same page without loading a new document?",
    choices: [
      { id: "a", text: "https://www.lipsum.com" },
      { id: "b", text: "/labs/lab1" },
      { id: "c", text: "#wd-anchor-bottom" },
      { id: "d", text: "app/labs/lab1/page.tsx" },
    ],
    answer: "c",
    explanation:
      "A fragment is a leading # plus an id. Absolute URLs go to other sites; relative paths go to other routes on this site.",
  },
  {
    id: "1-layout",
    section: "1.3.11",
    kind: "concept",
    prompt:
      "What does app/labs/layout.tsx do that page.tsx does not?",
    choices: [
      { id: "a", text: "It creates the URL /labs/layout" },
      {
        id: "b",
        text: "It wraps page.tsx files in the same folder and below, so shared chrome such as a TOC is not copied into each page",
      },
      { id: "c", text: "It replaces page.tsx so Lab 1 no longer needs a page file" },
      { id: "d", text: "It only runs in production" },
    ],
    answer: "b",
    explanation:
      "layout.tsx does not create its own URL. It receives children — the page (and nested layouts) — and wraps them. app/labs/layout.tsx wraps every /labs route.",
  },
];
