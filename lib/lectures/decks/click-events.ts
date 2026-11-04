import type { LectureSlide } from "../types";

export const CLICK_EVENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Click Events",
      "`onClick` needs `\"use client\"`",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Click Events",
    kind: "content",
    bullets: [
      "HTML and CSS describe how a screen looks",
      "Clicks, keystrokes, and submits describe what the user did",
      "React listens with `onClick` and `onChange` — only in the browser",
      "Lab 4 files start with `\"use client\"` so those listeners can run",
    ],
  },
  {
    id: "lab4-stub",
    title: "Start Lab 4 as a Client page",
    kind: "content",
    code: `"use client";

export default function Lab4() {
  return (
    <div id="wd-lab4">
      <h2>Lab 4</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/page.tsx",
    codeHighlightLines: [1, [5, 7]],
  },
  {
    id: "lab4-stub-live",
    title: "Lab 4 page: live demo",
    kind: "demo",
    bullets: [
      "`mkdir app/labs/lab4` then a page that only prints a heading",
      "Link it from `app/labs/page.tsx` and `TOC.tsx`",
      "Install stores now: `npm install zustand @reduxjs/toolkit react-redux`",
    ],
    embed: "lab4-stub",
  },
  {
    id: "reference",
    title: "Running Code When a Button Is Clicked",
    kind: "content",
    bullets: [
      "Goal: a button that shows a Hello World! alert when clicked",
      "React must run the handler later, on the click, not while drawing the page",
      "So the button gets the function itself, not the result of calling it",
      "The next slide builds that button",
    ],
  },
  {
    id: "click",
    title: "A hello handler on a button",
    kind: "content",
    code: `"use client";

const hello = () => {
  alert("Hello World!");
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event">
      <h2>Click Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-onclick-hello"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Click Hello
      </button>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ClickEvent.tsx",
    codeHighlightLines: [[3, 5], 13],
  },
  {
    id: "click-live",
    title: "ClickEvent: live demo",
    kind: "demo",
    bullets: [
      "`hello` alerts `Hello World!` — no arguments, so a reference is enough",
      "Click Hello and confirm the dialog appears",
      "Import `<ClickEvent />` under the Lab 4 heading",
    ],
    embed: "click-event",
  },
  {
    id: "recap",
    title: "Click events recap",
    kind: "content",
    bullets: [
      "`\"use client\"` first — clicks never run on the server",
      "Pass `hello`, not `hello()`, unless you wrap the call in an arrow",
      "Every Lab 4 exercise: implement, import, confirm in the browser",
    ],
  },
  {
    id: "next-up",
    title: "Next: pass data and functions",
    kind: "title",
    bullets: [
      "A click often needs an argument or a parent callback",
      "Closures (functions that remember values around them), then functions as props",
    ],
  },
];
