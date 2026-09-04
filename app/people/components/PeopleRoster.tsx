import Link from "next/link";
import {
  studentDisplayName,
  type RosterSectionGroup,
} from "@/lib/roster/sections";

function sectionHref(section: string | undefined): string {
  if (!section) return "/people";
  return `/people?section=${encodeURIComponent(section)}`;
}

function TabLink({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  const className = active
    ? "rounded-t border border-b-0 border-neutral-300 bg-white px-3 py-1.5 font-medium text-neutral-900"
    : "rounded-t border border-transparent px-3 py-1.5 text-neutral-600 hover:text-neutral-900";

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {label}
      <span className="ml-1.5 tabular-nums text-neutral-500">{count}</span>
    </Link>
  );
}

function StudentTable({
  students,
}: {
  students: RosterSectionGroup["students"];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
            <th className="px-3 py-2 font-semibold">Name</th>
            <th className="px-3 py-2 font-semibold">Email</th>
            <th className="px-3 py-2 font-semibold">SIS ID</th>
            <th className="px-3 py-2 font-semibold">Canvas ID</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.email} className="border-b border-neutral-200">
              <td className="px-3 py-2 font-medium">
                {studentDisplayName(student)}
              </td>
              <td className="px-3 py-2">
                <a href={`mailto:${student.email}`}>{student.email}</a>
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-700">
                {student.sisUserId?.trim() || "—"}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-700">
                {student.canvasUserId?.trim() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PeopleRoster({
  groups,
  selectedSection,
}: {
  groups: RosterSectionGroup[];
  selectedSection?: string;
}) {
  const total = groups.reduce((sum, group) => sum + group.students.length, 0);
  const selected = selectedSection
    ? groups.find((group) => group.section === selectedSection)
    : undefined;
  const visible = selected ? [selected] : groups;

  return (
    <section className="font-sans">
      <p className="mt-0 text-neutral-700">
        {total} student{total === 1 ? "" : "s"} across {groups.length} section
        {groups.length === 1 ? "" : "s"}.
      </p>
      <nav
        className="-mb-px flex flex-wrap gap-1 border-b border-neutral-300"
        aria-label="Course sections"
      >
        <TabLink
          href="/people"
          active={!selected}
          label="All"
          count={total}
        />
        {groups.map((group) => (
          <TabLink
            key={group.section}
            href={sectionHref(group.section)}
            active={selected?.section === group.section}
            label={group.section}
            count={group.students.length}
          />
        ))}
      </nav>
      <div className="space-y-8 rounded-b border border-t-0 border-neutral-300 bg-white p-4">
        {visible.map((group) => (
          <div key={group.section}>
            <h2 className="mt-0 mb-3 text-lg font-semibold tracking-tight">
              {group.section}
              <span className="ml-2 text-sm font-normal text-neutral-500">
                {group.students.length} student
                {group.students.length === 1 ? "" : "s"}
              </span>
            </h2>
            <StudentTable students={group.students} />
          </div>
        ))}
      </div>
    </section>
  );
}
