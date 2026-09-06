import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 3 · Deck 6 — Kambaz Modules",
      "Nested lists, then Home + Course Status",
    ],
  },
  {
    id: "nesting",
    title: "Modules are nested lists",
    kind: "content",
    bullets: [
      "Opening a course lands on **Home**. Home shows the same module list",
      "Build **Modules** first, then reuse that page on Home",
      "Three columns of chrome: Kambaz nav, Course nav, then the list",
      "Top-level **modules** → nested **lessons** → **content items**",
    ],
  },
  {
    id: "module",
    title: "Module is one week",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/modules/Module.tsx`",
      "Title plus a `children` slot where lessons nest",
      "Classes: `wd-module`, `wd-title`, `wd-lessons`",
    ],
    code: `import type { ReactNode } from "react";

export default function Module({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module">
      <div className="wd-title">{title}</div>
      <ul className="wd-lessons">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
  },
  {
    id: "lesson",
    title: "Lesson is one section",
    kind: "content",
    bullets: [
      "Title is LEARNING OBJECTIVES, READING, or SLIDES",
      "Always render the `wd-content` list — even if empty — so you stay with `{children}`",
      "Avoid new JavaScript conditionals this week",
    ],
    code: `import type { ReactNode } from "react";

export default function Lesson({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-lesson">
      <span className="wd-title">{title}</span>
      <ul className="wd-content">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Lesson.tsx",
  },
  {
    id: "modules-page",
    title: "Weeks 1–3 on the Modules page",
    kind: "demo",
    embed: "kambaz-modules",
    bullets: [
      "Toolbar: Collapse All, View Progress, Publish All, + Module",
      "List id `wd-modules`. Expand Week 1 with LEARNING OBJECTIVES, READING, SLIDES",
      "Weeks 2–3 can start thin. Content items use `wd-content-item`",
      "Keep the markup unstyled — Tailwind is Chapter 2",
    ],
    code: `import Module from "./Module";
import Lesson from "./Lesson";

export default function Modules() {
  return (
    <div>
      <button>Collapse All</button> <button>View Progress</button>{" "}
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
      </select>{" "}
      <button>+ Module</button>
      <ul id="wd-modules">
        <Module title="Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda">
          <Lesson title="LEARNING OBJECTIVES">
            <li className="wd-content-item">Introduction to the course</li>
            <li className="wd-content-item">Learn what is Web Development</li>
          </Lesson>
          <Lesson title="READING">{/* chapter rows */}</Lesson>
          <Lesson title="SLIDES">{/* slide rows */}</Lesson>
        </Module>
        <Module title="Week 2">{/* Expand lessons on your own */}</Module>
        <Module title="Week 3" />
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
  },
  {
    id: "status",
    title: "Course Status sidebar",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/home/Status.tsx` — wrapper `wd-course-status`",
      "Labels matter: Unpublish, Publish, Import Existing Content, Import from Commons",
      "Also: Choose Home Page, View Course Stream, New Announcement, New Analytics, View Course Notifications",
      "Start from the stub; complete the remaining buttons on your own",
    ],
    code: `export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button>Unpublish</button> <button>Publish</button>
      <br /><br />
      {/* Complete the remaining status actions on your own */}
      <button>View Course Notifications</button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/Status.tsx",
  },
  {
    id: "home",
    title: "Home = Modules + Status",
    kind: "demo",
    embed: "kambaz-home",
    bullets: [
      "Kambaz nav and Course nav already come from outer layouts",
      "Home only needs Modules (70%) beside Course Status",
      "Import the Modules **page** — `import Modules from \"../modules/page\"`",
      "Delete any leftover `page.tsx` directly under `courses/[cid]/`",
    ],
    code: `import Modules from "../modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div id="wd-home">
      <table>
        <tbody>
          <tr>
            <td valign="top" width="70%">
              <Modules />
            </td>
            <td valign="top">
              <CourseStatus />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/page.tsx",
    codeAddedLines: [1, 2, 11, 14],
  },
  {
    id: "next-up",
    title: "Next: Assignments (on your own)",
    kind: "title",
    bullets: [
      "Match the book LiveDemo and `wd-*` ids — no line-by-line walkthrough",
      "List plus editor placeholders. `defaultValue`, not `value`",
    ],
  },
];
