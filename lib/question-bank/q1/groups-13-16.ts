import { fib, mc } from "../builders";
import type { QuestionGroup } from "../types";

export const q1Group13: QuestionGroup = {
  id: "q1-g13-buttons",
  order: 13,
  name: "Buttons and form submission",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.6.7",
  skill: "Prefer <button> with an explicit type; default inside a form is submit.",
  questions: [
    mc(
      "q1-g13-01",
      "Inside a <form>, what does a <button> with no type attribute do when clicked?",
      [
        "Nothing — buttons do nothing until you add onClick",
        "It defaults to submit and the browser sends the form (which reloads the page unless you stop it)",
        "It defaults to button, so Cancel is safe with no type",
        "It defaults to reset and clears every field",
      ],
      1,
    ),
    mc(
      "q1-g13-02",
      "Which type should a Save control use when it should send the form?",
      ['type="button"', 'type="submit"', 'type="reset"', "no type, ever"],
      1,
    ),
    mc(
      "q1-g13-03",
      "Which type should Cancel use so the click does not send the form?",
      ['type="submit"', 'type="button"', 'type="reset" is required', "type=\"email\""],
      1,
    ),
    mc(
      "q1-g13-04",
      "Why prefer <button> over <input type=\"submit\"> in this chapter?",
      [
        "input cannot live inside a form",
        "The label is nested text (so you can later put an icon inside) and type says what the click should do",
        "button cannot submit",
        "input type=\"submit\" is invalid HTML5",
      ],
      1,
    ),
    mc(
      "q1-g13-05",
      "Always write type explicitly because _____.",
      [
        "browsers ignore type",
        "the default inside a form is submit, which is easy to trigger by accident on Cancel",
        "type is only for CSS",
        "Next.js forbids submit buttons",
      ],
      1,
    ),
    mc(
      "q1-g13-06",
      "A click that must not send the form should use _____.",
      ['<button type="submit">', '<button type="button">', "<a href=\"submit\">", "<p>"],
      1,
    ),
    mc(
      "q1-g13-07",
      "Submitting a form with the browser default typically _____.",
      [
        "keeps you on the same document with no network request",
        "sends the form as a document request, which reloads the page unless that default is stopped",
        "only runs CSS",
        "creates a new page.tsx file",
      ],
      1,
    ),
    mc(
      "q1-g13-08",
      "The nested text of <button type=\"submit\">Save</button> is _____.",
      [
        "the accessible/visible label of the control",
        "ignored by browsers",
        "the form’s action URL",
        "a heading level",
      ],
      0,
    ),
    mc(
      "q1-g13-09",
      "Which pair is the chapter’s recommended Save / Cancel markup?",
      [
        '<input type="button">Save</input> and <input type="submit">Cancel</input>',
        '<button type="submit">Save</button> and <button type="button">Cancel</button>',
        '<button>Save</button> and <button>Cancel</button> with no types',
        "<label>Save</label> with no button",
      ],
      1,
    ),
    mc(
      "q1-g13-10",
      "If both Save and Cancel are written as <button> with no type inside a <form>, clicking Cancel will _____.",
      [
        "always reset the fields",
        "also submit the form, because the default type is submit",
        "navigate to layout.tsx",
        "only work if the button contains an icon",
      ],
      1,
    ),
  ],
};

const PROP_DOMAINS = [
  "title and backgroundColor",
  "label and accentColor",
  "heading and borderWidth",
  "caption and borderRadius",
  "message and borderColor",
  "summary and padding",
  "kicker and backgroundColor",
  "quote and borderWidth",
  "status and borderColor",
  "eyebrow and borderRadius",
];

const CHILD_DOMAINS = [
  "a heading and a list",
  "a paragraph and a table",
  "an image and a caption",
  "two paragraphs",
  "a form and its labels",
  "an ordered list of steps",
  "a nested unordered list",
  "a callout heading and body copy",
  "a toolbar of links",
  "a figure and a short note",
];

export const q1Group14: QuestionGroup = {
  id: "q1-g14-props-children",
  order: 14,
  name: "Component props and children",
  type: "fill_in_blank",
  chapter: 1,
  section: "1.3.8",
  skill: "Attributes passed into a component are props; nested markup arrives as children.",
  questions: [
    ...PROP_DOMAINS.map((domain, index) =>
      fib(
        `q1-g14-${String(index + 1).padStart(2, "0")}`,
        `A function component is used as <Callout ${domain.split(" and ")[0]}="…" />. Values such as ${domain} that you pass as attributes are called _____.`,
        ["props", "properties", "prop", "the props"],
        "Props (properties) are parameters on your component, passed as attributes when you use the tag.",
      ),
    ).slice(0, 5),
    ...CHILD_DOMAINS.map((domain, index) =>
      fib(
        `q1-g14-${String(index + 6).padStart(2, "0")}`,
        `Content nested between a wrapper component’s tags — for example ${domain} inside <Panel>…</Panel> — arrives as the _____ prop.`,
        ["children", "the children", "children prop", "the children prop"],
        "children is the nested body. Wrappers and layouts use the same idea.",
      ),
    ).slice(0, 5),
  ],
};

export const q1Group15: QuestionGroup = {
  id: "q1-g15-hyperlinks",
  order: 15,
  name: "Hyperlinks and href forms",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.9",
  skill: "Absolute vs relative vs fragment href; target=_blank with rel=noreferrer.",
  questions: [
    mc(
      "q1-g15-01",
      "The href attribute on <a> is short for _____.",
      [
        "host reference",
        "hypertext reference",
        "HTML refresh",
        "hash route format",
      ],
      1,
    ),
    mc(
      "q1-g15-02",
      "Which href is an absolute URL to another site?",
      [
        "/labs",
        "#overview",
        "https://www.lipsum.com",
        "app/page.tsx",
      ],
      2,
    ),
    mc(
      "q1-g15-03",
      "Which href is a relative path on the same site?",
      [
        "https://github.com",
        "/labs/lab1",
        "mailto:nobody@example.com",
        "#overview",
      ],
      1,
    ),
    mc(
      "q1-g15-04",
      "Which href scrolls to an element on the same page without loading a new document?",
      [
        "https://www.lipsum.com",
        "/labs/lab1",
        "#overview",
        "app/labs/page.tsx",
      ],
      2,
    ),
    mc(
      "q1-g15-05",
      "A fragment href is a leading # plus _____.",
      [
        "a folder name under node_modules",
        "an element id on the same page",
        "a CSS class that may be reused",
        "the text of an h1",
      ],
      1,
    ),
    mc(
      "q1-g15-06",
      "target=\"_blank\" on a link does what?",
      [
        "Downloads the file instead of opening it",
        "Opens the destination in a new browser tab or window",
        "Makes the link a button",
        "Disables the href",
      ],
      1,
    ),
    mc(
      "q1-g15-07",
      "When you use target=\"_blank\", you should also set rel=\"noreferrer\" (or at least noopener) so that _____.",
      [
        "the browser ignores href",
        "the new page cannot access window.opener",
        "search engines skip the link",
        "the link becomes a fragment",
      ],
      1,
    ),
    mc(
      "q1-g15-08",
      "The “Hyper” in HyperText Markup Language refers to _____.",
      [
        "very large font sizes",
        "the ability to navigate from one document (or place) to another",
        "HTTP status codes only",
        "CSS animations",
      ],
      1,
    ),
    mc(
      "q1-g15-09",
      "Use a plain <a> (not Next.js Link) when _____.",
      [
        "the destination is an in-app route you created with page.tsx and you want SPA navigation",
        "the destination is a true external URL (or you explicitly want a full document load)",
        "you are linking to a hash on the same page — <a> is invalid for hashes",
        "you need nested children; <a> cannot wrap text",
      ],
      1,
    ),
    mc(
      "q1-g15-10",
      "Which markup is the safer external new-tab pattern taught in this chapter?",
      [
        '<a href="https://example.com">Example</a>',
        '<a href="https://example.com" target="_blank" rel="noreferrer">Example</a>',
        '<a href="#https://example.com" target="_blank">Example</a>',
        '<a href="app/example.com/page.tsx" target="_blank">Example</a>',
      ],
      1,
    ),
  ],
};

export const q1Group16: QuestionGroup = {
  id: "q1-g16-routes-layouts",
  order: 16,
  name: "Next.js routes, layouts, and Link navigation",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.11",
  skill: "App Router page.tsx vs layout.tsx; Link vs <a> for in-app routes.",
  questions: [
    mc(
      "q1-g16-01",
      "In the App Router, which file under a folder creates that folder’s route?",
      ["index.html", "route.ts", "page.tsx", "component.tsx"],
      2,
    ),
    mc(
      "q1-g16-02",
      "A page.tsx file at app/labs/lab1/page.tsx is served at which URL path?",
      [
        "/app/labs/lab1/page.tsx",
        "/labs/lab1",
        "/page/labs/lab1",
        "#/labs/lab1",
      ],
      1,
    ),
    mc(
      "q1-g16-03",
      "Why must you not put a page.tsx inside a folder that is only for organizing components?",
      [
        "Next.js forbids folders named forms",
        "That file would create a URL for that folder; an organization-only folder should not define a route",
        "Components cannot import files from a folder that has a page",
        "page.tsx is allowed only at the app/ root",
      ],
      1,
    ),
    mc(
      "q1-g16-04",
      "What does layout.tsx do that page.tsx does not?",
      [
        "It creates the URL /layout",
        "It wraps page.tsx files in the same folder and below, so shared chrome is not copied into each page",
        "It replaces page.tsx so child routes no longer need a page file",
        "It only runs in production",
      ],
      1,
    ),
    mc(
      "q1-g16-05",
      "layout.tsx receives the page (and nested layouts) as _____.",
      ["href", "children", "src", "defaultValue"],
      1,
    ),
    mc(
      "q1-g16-06",
      "Which markup navigates between in-app App Router routes without a full document reload?",
      [
        '<a href="/labs/lab1">HTML examples</a>',
        '<Link href="/labs/lab1">HTML examples</Link>',
        '<a href="#/labs/lab1">HTML examples</a>',
        '<Link href="app/labs/lab1/page.tsx">HTML examples</Link>',
      ],
      1,
      "Import Link from next/link and point href at the route, not the file path. A plain <a> still works but reloads the document.",
    ),
    mc(
      "q1-g16-07",
      "Where does Link come from in this course’s Next.js app?",
      [
        "the browser’s built-in HTML Link tag with a capital L",
        "import Link from \"next/link\"",
        "import Link from \"react-router\"",
        "a global CSS class named Link",
      ],
      1,
    ),
    mc(
      "q1-g16-08",
      "Hash URLs such as #/lab1 were a historical SPA trick. In the App Router you should _____.",
      [
        "use hash prefixes for every in-app route",
        "use History API paths like /labs/lab1, and reserve #fragments for in-page jumps",
        "put a # before page.tsx filenames",
        "avoid Link entirely",
      ],
      1,
    ),
    mc(
      "q1-g16-09",
      "app/layout.tsx wraps _____; app/labs/layout.tsx wraps _____.",
      [
        "only /labs; the whole app",
        "the whole app; only routes under /labs",
        "nothing; nothing",
        "API routes; Mongo collections",
      ],
      1,
    ),
    mc(
      "q1-g16-10",
      "Link’s href should be _____.",
      [
        "the filesystem path of page.tsx",
        "the public URL path of the route, for example /labs/lab1",
        "always an https URL",
        "the component function name",
      ],
      1,
    ),
  ],
};
