import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ MODULES",
      "Nested lists, then Home + Course Status",
    ],
  },
  {
    id: "nesting",
    title: "Creating the Modules Screen",
    kind: "content",
    bullets: [
      "Opening a course lands on **Home**. Home shows the same module list",
      "Build **Modules** first, then reuse that page on Home",
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
    id: "modules-page",
    title: "Create Modules Screen",
    kind: "demo",
    embed: "kambaz-modules",
    bullets: [
      "List id `wd-modules`. Expand Week 1 with **LEARNING OBJECTIVES**",
      "Weeks 2–3 can start thin. Content items use `wd-content-item`",
      "Extract `Lesson` the same way — title plus `{children}`",
    ],
    code: `export default function Modules() {
  return (
    <div>
      {/* Collapse All, View Progress, Publish All, + Module */}
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
  },
  {
    id: "status",
    title: "Implement Course Status Sidebar",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/home/Status.tsx` — wrapper `wd-course-status`",
      "Start from the stub; complete the remaining buttons on your own",
    ],
    code: `export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button>Unpublish</button> <button>Publish</button>
      {/* Complete on your own */}
      <button>View Course Notifications</button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/Status.tsx",
  },
  {
    id: "home",
    title: "Implementing the Home Screen",
    kind: "demo",
    embed: "kambaz-home",
    bullets: [
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
            <td valign="top" width="70%"> <Modules /> </td>
            <td valign="top"> <CourseStatus /> </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/page.tsx",
    codeAddedLines: [1, 2, 10, 11],
  },
  {
    id: "next-up",
    title: "Next: Assignments",
    kind: "title",
    bullets: [
      "On your own — match the book LiveDemo and `wd-*` ids",
    ],
  },
];
