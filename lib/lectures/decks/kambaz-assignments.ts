import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Kambaz Assignments",
      "List + editor — on your own, match the ids",
    ],
  },
  {
    id: "on-your-own",
    title: "On your own — match the book",
    kind: "content",
    bullets: [
      "From the Dashboard, open a course, then Assignments in Course Navigation",
      "No line-by-line walkthrough. Match the plain HTML LiveDemo in §1.4.7–1.4.8",
      "Keep the given `id` and `className` values so graders can find them",
      "Styling is Chapter 2. Exact due dates may differ",
    ],
  },
  {
    id: "list-screen",
    title: "Assignments list + search",
    kind: "demo",
    embed: "kambaz-assignments",
    bullets: [
      "Route: `app/(kambaz)/courses/[cid]/assignments/page.tsx`",
      "Search: `id=\"wd-search-assignment\"`, placeholder `Search for Assignments`",
      "Buttons: `+ Group` (`wd-add-assignment-group`) and `+ Assignment` (`wd-add-assignment`)",
      "Heading `wd-assignments-title` — text like `ASSIGNMENTS 40% of Total`",
    ],
  },
  {
    id: "assignment-item",
    title: "Extract AssignmentItem",
    kind: "content",
    bullets: [
      "List id `wd-assignment-list` with **at least three** rows",
      "A1 ENV + HTML, A2 CSS + TAILWIND, A3 JS + REACT are fine examples",
      "Each row: `wd-assignment-list-item`, title `Link` with `wd-assignment-link`",
      "Href: `` `/courses/${cid}/assignments/${aid}` `` — `Link` from `next/link`, not `<a>`",
    ],
    code: `import Link from "next/link";

export default function AssignmentItem({
  cid, aid, title, details,
}: {
  cid: string; aid: string; title: string; details: string;
}) {
  return (
    <li className="wd-assignment-list-item">
      <Link
        href={\`/courses/\${cid}/assignments/\${aid}\`}
        className="wd-assignment-link"
      >
        {title}
      </Link>
      <div>{details}</div>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx",
  },
  {
    id: "await-params",
    title: "Page awaits cid from params",
    kind: "content",
    bullets: [
      "Same `async` / `await params` shape as the courses layout",
      "Copy for now; Chapter 3 explains it",
      "Wrapper id `wd-assignments`",
    ],
    code: `import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* search, + Group, + Assignment, h3 wd-assignments-title */}
      <ul id="wd-assignment-list">
        {/* at least three AssignmentItems using cid */}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "editor",
    title: "Assignment Editor at [aid]",
    kind: "demo",
    embed: "kambaz-assignment-editor",
    bullets: [
      "`app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx`",
      "Wrapper `wd-assignments-editor`. Use **`defaultValue`**, not `value`",
      "Start from name (`wd-name`), description (`wd-description`), points (`wd-points`)",
      "Every assignment can show the same editor content this week",
    ],
    code: `export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <label htmlFor="wd-points">Points</label>
      <input id="wd-points" defaultValue={100} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
  },
  {
    id: "editor-rest",
    title: "Complete the editor fields",
    kind: "content",
    bullets: [
      "Group `wd-group` — ASSIGNMENTS, QUIZZES, EXAMS, PROJECT",
      "`wd-display-grade-as`, `wd-submission-type`",
      "Checkboxes: `wd-text-entry`, `wd-website-url`, `wd-media-recordings`, `wd-student-annotation`, `wd-file-upload`",
      "Assign: `wd-assign-to`, `wd-due-date`, `wd-available-from`, `wd-available-until`",
      "Cancel `wd-cancel` and Save `wd-save` — `Link`s back to the assignments list",
    ],
  },
  {
    id: "labels",
    title: "Labels must focus controls",
    kind: "content",
    bullets: [
      "Same Lab 1 rule: `htmlFor` on the label matches `id` on the control",
      "Clicking a label next to a text field focuses that field",
      "Clicking a label next to a checkbox toggles the checkbox",
      "Clicking a label above a date input focuses the date field",
    ],
  },
  {
    id: "checklist",
    title: "A1 Kambaz coverage",
    kind: "content",
    bullets: [
      "Landing + Labs `wd-kambaz-link`; `/` and `/account` redirect to Sign in",
      "Account screens + layout; Dashboard `CourseCard`s → `/courses/[cid]/home`",
      "Kambaz nav + `not-found`; Course nav + placeholders",
      "Modules nested lists; Home = Modules + Status; Assignments + editor",
      "The written list is book §1.4.9",
    ],
    interactiveHint:
      "Open /account/signin, sign in to /dashboard, then a course Home. That is the A1 path.",
  },
];
