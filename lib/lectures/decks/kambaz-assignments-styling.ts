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
    title: "A table, then a list, then a form",
    kind: "content",
    bullets: [
      "People is new in this chapter — no Chapter 1 prototype",
      "Assignments reuse `AssignmentItem` from §1.4.7 with Tailwind + icons",
      "The editor is **On your own**: labeled fields instead of a raw table",
    ],
  },
  {
    id: "people-tsx",
    title: "People is a styled table",
    kind: "content",
    bullets: [
      "`w-full border-collapse text-left text-sm`",
      "`odd:bg-neutral-50` for alternating rows",
      "`FaUserCircle` beside each name — `text-4xl text-neutral-500`",
    ],
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
          {/* ...at least 3 more rows... */}
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
      "Four sample rows — names, login ids, roles, activity",
      "The People link in Course Navigation should open this table",
    ],
    embed: "kambaz-styled-people",
  },
  {
    id: "item",
    title: "AssignmentItem, lesson borders",
    kind: "content",
    bullets: [
      "Green left border matches `Lesson`",
      "`FaFileAlt` on the left. Title is a `Link` to the editor",
      "Muted details line under the title",
    ],
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
    id: "toolbar",
    title: "Search left, actions right",
    kind: "content",
    bullets: [
      "`justify-between` puts search on the left and `+ Group` / `+ Assignment` on the right",
      "Magnifying-glass icon is `absolute` inside a `relative` wrapper",
      "Gray group header reuses the module-title treatment",
    ],
    code: `<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
  <div className="relative">
    <FaSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
    <input
      placeholder="Search for Assignments"
      id="wd-search-assignment"
      className="rounded border py-1.5 pr-3 pl-9 text-sm"
    />
  </div>
  <div className="flex gap-2">
    <button id="wd-add-assignment-group" type="button" className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm">
      <FaPlus /> Group
    </button>
    <button id="wd-add-assignment" type="button" className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white">
      <FaPlus /> Assignment
    </button>
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "assignments-demo",
    title: "Live Assignments screen",
    kind: "demo",
    bullets: [
      "`wd-search-assignment`, `wd-assignment-link`, green left borders",
      "Exact due dates may differ. Keep the ids",
    ],
    embed: "kambaz-styled-assignments",
  },
  {
    id: "editor",
    title: "Editor is On your own",
    kind: "content",
    bullets: [
      "Starting markup is still the Chapter 1 form — labels, `defaultValue`, a table of fields",
      "Replace the table with Tailwind form utilities: labels above, full-width inputs",
      "Cancel / Save still return to the assignments list (`wd-cancel`, `wd-save`)",
    ],
    code: `export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
        your Web application running on Vercel.
      </textarea>
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
        </tbody>
      </table>
      <Link href="/courses/1234/assignments" id="wd-cancel">Cancel</Link>{" "}
      <Link href="/courses/1234/assignments" id="wd-save">Save</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
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
