import Link from "next/link";

const SECTIONS = [
  { href: "#overview", label: "Overview" },
  { href: "#goals", label: "Goals" },
  { href: "#meetings", label: "Meetings" },
  { href: "#office-hours", label: "Office hours" },
  { href: "#evaluation", label: "Evaluation" },
  { href: "#late-policy", label: "Late policy" },
  { href: "#assignments", label: "Assignments" },
  { href: "#deadlines", label: "Deadlines" },
  { href: "#project", label: "Project" },
  { href: "#agenda", label: "Agenda" },
  { href: "#ai-policy", label: "AI" },
  { href: "#integrity", label: "Integrity" },
  { href: "#classroom", label: "Classroom" },
  { href: "#title-ix", label: "Title IX" },
  { href: "#disabilities", label: "DAS" },
] as const;

export default function SyllabusNav() {
  return (
    <nav
      aria-label="Syllabus sections"
      className="mb-8 rounded-lg border border-neutral-200 bg-white px-4 py-3 font-sans text-sm"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        On this page
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <a href={section.href} className="no-underline hover:underline">
              {section.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-neutral-200 pt-2 text-neutral-600">
        <Link href="/book">Book</Link>
        {" · "}
        <Link href="/labs">Labs</Link>
        {" · "}
        <Link href="/">Kambaz</Link>
      </p>
    </nav>
  );
}
