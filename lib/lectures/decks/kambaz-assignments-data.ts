import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_DATA_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Assignments and People",
      "§3.9.8–3.9.9 · filter rows, then join enrollments",
    ],
  },
  {
    id: "purpose",
    title: "Same filter, two more screens",
    kind: "content",
    bullets: [
      "Assignments: `db.assignments.filter` where `assignment.course === cid`",
      "The editor `find`s by `aid` and fills fields with `assignment?.title ?? \"\"`",
      "People: `users` plus `enrollments` — `some` ties a user to this course",
      "Course Navigation, Assignments, and the editor stay On your own",
    ],
  },
  {
    id: "list",
    title: "Assignments can stay a Server page",
    kind: "demo",
    bullets: [
      "`await params` instead of `useParams` — no `\"use client\"`",
      "Map each row to `AssignmentItem` with `key={assignment._id}`",
      "Encode both ids: `/courses/${cid}/assignments/${aid}`",
    ],
    code: `export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const assignments = db.assignments.filter(
    (assignment) => assignment.course === cid,
  );
  return (
    <div id="wd-assignments">
      <ul id="wd-assignment-list" className="m-0 list-none p-0">
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment._id}
            cid={cid}
            aid={assignment._id}
            title={assignment.title}
            details={\`Multiple Modules | Not available until \${assignment.available} | Due \${assignment.due} | \${assignment.points} pts\`}
          />
        ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [[6, 9], [13, 21]],
    embed: "kambaz-styled-assignments",
  },
  {
    id: "editor",
    title: "Editor find + optional fields",
    kind: "content",
    bullets: [
      "Await `cid` and `aid`, then `db.assignments.find((a) => a._id === aid)`",
      "`assignment?.title ?? \"\"` — the same `?.` / `??` as §3.4.17",
      "Cancel and Save are `Link`s back to that course’s list",
    ],
    code: `export default async function AssignmentEditor({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  const assignment = db.assignments.find((a) => a._id === aid);
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue={assignment?.title ?? ""} />
      <textarea id="wd-description"
        defaultValue={assignment?.description ?? ""} rows={8} />
      <input id="wd-points" defaultValue={assignment?.points ?? 100} />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-cancel">Cancel</Link>
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-save">Save</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
    codeHighlightLines: [6, 7, 11],
  },
  {
    id: "people",
    title: "People joins users to enrollments",
    kind: "demo",
    bullets: [
      "`enrollments.some` — the same `some` as §3.4.8",
      "Keep users whose enrollment `user` and `course` both match",
      "Open People for RS101 vs RS102 and confirm the names change",
    ],
    code: `export default async function PeopleTable({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const { users, enrollments } = db;
  const enrolled = users.filter((usr) =>
    enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  );
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {enrolled.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
    codeHighlightLines: [[8, 12], 18],
    embed: "kambaz-styled-people",
  },
  {
    id: "recap",
    title: "Kambaz data recap",
    kind: "content",
    bullets: [
      "Nav and course nav: `LINKS.map`. Dashboard: `courses.map`",
      "Modules and assignments: `filter` by `cid`. Editor: `find` by `aid`",
      "People: `filter` + `some` on enrollments. Every list needs a `key`",
    ],
  },
  {
    id: "done",
    title: "Chapter 3 decks are complete",
    kind: "title",
    bullets: [
      "Lab 3 taught the language. Kambaz now renders from JSON",
      "§3.9.10 is the coverage checklist — then Chapter 4 adds state",
    ],
  },
];
