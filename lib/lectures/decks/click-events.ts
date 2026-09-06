import type { LectureSlide } from "../types";

export const CLICK_EVENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Click Events",
      "§4.2.1 · `onClick` needs `\"use client\"`",
    ],
  },
  {
    id: "purpose",
    title: "Clicks are events, not markup",
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
    kind: "demo",
    bullets: [
      "`mkdir app/labs/lab4` then a page that only prints a heading",
      "Link it from `app/labs/page.tsx` and `TOC.tsx`",
      "Install stores now: `npm install zustand @reduxjs/toolkit react-redux`",
    ],
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
    embed: "lab4-stub",
  },
  {
    id: "reference",
    title: "Pass the function, not the result",
    kind: "content",
    bullets: [
      "`onClick={hello}` stores a reference React can call later",
      "`onClick={hello()}` runs during render — the alert fires on load",
      "Wrap several statements in an arrow when one click does more than one thing",
    ],
  },
  {
    id: "click",
    title: "A hello handler on a button",
    kind: "demo",
    bullets: [
      "`hello` alerts `Hello World!` — no arguments, so a reference is enough",
      "Click Hello and confirm the dialog appears",
      "Import `<ClickEvent />` under the Lab 4 heading",
    ],
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
      "§4.2.2–4.2.3: closures, then functions as props",
    ],
  },
];
