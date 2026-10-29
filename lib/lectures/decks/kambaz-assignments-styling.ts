import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · People and Assignments",
      "§2.4.6–2.4.8 · Table utilities, then assignment rows and the editor",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Assignments Styling",
    kind: "content",
    bullets: [
      "People is new in this chapter — no Chapter 1 prototype",
      "Assignments reuse `AssignmentItem` from §1.4.7 with Tailwind + icons",
      "The editor gets labeled fields in a grid instead of a raw table",
    ],
  },
  {
    id: "people-tsx-intro",
    title: "People is a styled table",
    kind: "content",
    bullets: [
      "People lists the students, teaching assistants, and faculty in a course as a table.",
      "`w-full border-collapse text-left text-sm`",
      "`odd:bg-neutral-50` for alternating rows",
      "`FaUserCircle` beside each name — `text-4xl text-neutral-500`",
    ],
  },
  {
    id: "people-tsx",
    title: "People is a styled table (code)",
    kind: "content",
    code: `import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-neutral-50">
            <td className="p-2 text-nowrap">
              <FaUserCircle className="me-2 inline text-4xl text-neutral-500" />
              Tony Stark
            </td>
            <td className="p-2">001234561S</td>
            <td className="p-2">S101</td>
            <td className="p-2">STUDENT</td>
            <td className="p-2">2020-10-01</td>
            <td className="p-2">10:21:32</td>
          </tr>
          <tr className="odd:bg-neutral-50">
            <td className="p-2 text-nowrap">
              <FaUserCircle className="me-2 inline text-4xl text-neutral-500" />
              Bruce Wayne
            </td>
            <td className="p-2">001234562S</td>
            <td className="p-2">S101</td>
            <td className="p-2">STUDENT</td>
            <td className="p-2">2020-11-02</td>
            <td className="p-2">23:32:23</td>
          </tr>
          <tr className="odd:bg-neutral-50">
            <td className="p-2 text-nowrap">
              <FaUserCircle className="me-2 inline text-4xl text-neutral-500" />
              Steve Rogers
            </td>
            <td className="p-2">001234563S</td>
            <td className="p-2">S101</td>
            <td className="p-2">STUDENT</td>
            <td className="p-2">2020-10-02</td>
            <td className="p-2">13:21:32</td>
          </tr>
          <tr className="odd:bg-neutral-50">
            <td className="p-2 text-nowrap">
              <FaUserCircle className="me-2 inline text-4xl text-neutral-500" />
              Natasha Romanoff
            </td>
            <td className="p-2">001234564S</td>
            <td className="p-2">S101</td>
            <td className="p-2">TA</td>
            <td className="p-2">2020-11-05</td>
            <td className="p-2">11:22:33</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
  },
  {
    id: "people-demo",
    title: "Live People roster",
    kind: "demo",
    bullets: [
      "Style a plain HTML `table` with Tailwind so each person gets one row.",
      "Four sample rows — names, login ids, roles, activity",
      "The People link in Course Navigation should open this table",
    ],
    embed: "kambaz-styled-people",
  },
  {
    id: "item-intro",
    title: "AssignmentItem, lesson borders",
    kind: "content",
    bullets: [
      "As with Dashboard and Modules, the plain `AssignmentItem` stays and gains Tailwind and React Icons.",
      "Green left border matches `Lesson`",
      "`FaFileAlt` on the left. Title is a `Link` to the editor",
      "Muted details line under the title",
    ],
  },
  {
    id: "item",
    title: "AssignmentItem, lesson borders (code)",
    kind: "content",
    code: `import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";

export default function AssignmentItem({
  cid, aid, title, details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item mb-3 flex gap-3 border border-neutral-300 border-l-[3px] border-l-green-600 bg-white p-3">
      <FaFileAlt className="mt-1 shrink-0 text-xl text-green-700" />
      <div>
        <Link
          href={\`/courses/\${cid}/assignments/\${aid}\`}
          className="wd-assignment-link font-semibold text-neutral-900 no-underline"
        >
          {title}
        </Link>
        <div className="mt-1 text-sm text-neutral-600">{details}</div>
      </div>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx",
  },
  {
    id: "toolbar-intro",
    title: "Search left, actions right",
    kind: "content",
    bullets: [
      "`justify-between` puts search on the left and `+ Group` / `+ Assignment` on the right",
      "Magnifying-glass icon is `absolute` inside a `relative` wrapper",
      "Gray group header reuses the module-title treatment",
    ],
  },
  {
    id: "toolbar",
    title: "Search left, actions right (code)",
    kind: "content",
    code: `import { FaPlus, FaSearch } from "react-icons/fa";
import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
          <input
            placeholder="Search for Assignments"
            id="wd-search-assignment"
            className="rounded border py-1.5 pr-3 pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            id="wd-add-assignment-group"
            type="button"
            className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm"
          >
            <FaPlus /> Group
          </button>
          <button
            id="wd-add-assignment"
            type="button"
            className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            <FaPlus /> Assignment
          </button>
        </div>
      </div>
      <h3
        id="wd-assignments-title"
        className="mb-3 flex items-center justify-between rounded bg-neutral-200 p-3 text-lg"
      >
        <span>ASSIGNMENTS 40% of Total</span>
        <button type="button" className="rounded border bg-white px-2 py-0.5 text-sm">
          <FaPlus />
        </button>
      </h3>
      <ul id="wd-assignment-list" className="m-0 list-none p-0">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts"
        />
        {/* ...remaining AssignmentItems... */}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeAddedLines: [1, [12, 45], 47, 54],
  },
  {
    id: "assignments-demo",
    title: "Live Assignments screen",
    kind: "demo",
    bullets: [
      "Each row and the search toolbar get Tailwind and React Icons while the plain HTML stays.",
      "`wd-search-assignment`, `wd-assignment-link`, green left borders",
      "Exact due dates may differ. Keep the ids",
    ],
    embed: "kambaz-styled-assignments",
  },
  {
    id: "editor-intro",
    title: "Styling the Assignment Editor",
    kind: "content",
    bullets: [
      "Same ids as the Chapter 1 editor; Tailwind replaces the raw table",
      "Labels in a right-aligned column with a `grid grid-cols-[10rem_1fr]`",
      "Submission options and Assign fields sit in bordered boxes",
      "Cancel / Save still return to the assignments list (`wd-cancel`, `wd-save`)",
    ],
  },
  {
    id: "editor",
    title: "Styled Assignment Editor (code)",
    kind: "content",
    code: `import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="max-w-3xl space-y-4 p-4">
      <div>
        <label htmlFor="wd-name" className="mb-1 block font-medium">
          Assignment Name
        </label>
        <input
          id="wd-name"
          defaultValue="A1 - ENV + HTML"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <textarea
        id="wd-description"
        rows={6}
        defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Vercel."
        className="w-full rounded border px-3 py-2"
      />
      <div className="grid grid-cols-[10rem_1fr] items-center gap-4">
        <label htmlFor="wd-points" className="text-right">Points</label>
        <input id="wd-points" defaultValue={100} className="w-full rounded border px-3 py-2" />

        <label htmlFor="wd-group" className="text-right">Assignment Group</label>
        <select id="wd-group" defaultValue="ASSIGNMENTS" className="w-full rounded border px-3 py-2">
          <option value="ASSIGNMENTS">ASSIGNMENTS</option>
          <option value="QUIZZES">QUIZZES</option>
          <option value="EXAMS">EXAMS</option>
          <option value="PROJECT">PROJECT</option>
        </select>

        <label htmlFor="wd-display-grade-as" className="text-right">Display Grade as</label>
        <select id="wd-display-grade-as" defaultValue="PERCENTAGE" className="w-full rounded border px-3 py-2">
          <option value="PERCENTAGE">Percentage</option>
          <option value="POINTS">Points</option>
        </select>

        <label htmlFor="wd-submission-type" className="self-start pt-2 text-right">
          Submission Type
        </label>
        <div className="space-y-3 rounded border p-4">
          <select id="wd-submission-type" defaultValue="ONLINE" className="w-full rounded border px-3 py-2">
            <option value="ONLINE">Online</option>
            <option value="ON_PAPER">On Paper</option>
          </select>
          <div className="font-semibold">Online Entry Options</div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-text-entry" />
            <label htmlFor="wd-text-entry">Text Entry</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-website-url" />
            <label htmlFor="wd-website-url">Website URL</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-media-recordings" />
            <label htmlFor="wd-media-recordings">Media Recordings</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-student-annotation" />
            <label htmlFor="wd-student-annotation">Student Annotation</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-file-upload" />
            <label htmlFor="wd-file-upload">File Uploads</label>
          </div>
        </div>

        <div className="self-start pt-2 text-right">Assign</div>
        <div className="space-y-3 rounded border p-4">
          <div>
            <label htmlFor="wd-assign-to" className="mb-1 block font-semibold">Assign to</label>
            <input id="wd-assign-to" defaultValue="Everyone" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label htmlFor="wd-due-date" className="mb-1 block font-semibold">Due</label>
            <input type="date" id="wd-due-date" defaultValue="2024-05-13" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wd-available-from" className="mb-1 block font-semibold">Available from</label>
              <input type="date" id="wd-available-from" defaultValue="2024-05-06" className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label htmlFor="wd-available-until" className="mb-1 block font-semibold">Until</label>
              <input type="date" id="wd-available-until" defaultValue="2024-05-20" className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-end gap-2">
        <Link href="/courses/1234/assignments" id="wd-cancel" className="rounded bg-neutral-200 px-4 py-2">
          Cancel
        </Link>
        <Link href="/courses/1234/assignments" id="wd-save" className="rounded bg-red-600 px-4 py-2 text-white">
          Save
        </Link>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
  },
  {
    id: "editor-live",
    title: "Styled Assignment Editor: live",
    kind: "demo",
    bullets: [
      "Full-width inputs line up beside their labels",
      "Save is the red button; Cancel is gray",
    ],
    embed: "kambaz-styled-assignment-editor",
  },
  {
    id: "next-up",
    title: "Next: Account screens",
    kind: "title",
    bullets: [
      "You can style a roster table and assignment rows with the same utilities",
      "§2.4.9: Sign in, Sign up, Profile, and Account Navigation — On your own",
    ],
  },
];
