import { formatAgendaDate } from "../data/dates";
import type { AgendaRow, CourseSection } from "../data/types";
import SectionTabs from "./SectionTabs";
import SyllabusSection from "./SyllabusSection";

function rowClass(row: AgendaRow): string {
  if (row.kind === "holiday") {
    return "border-b border-amber-200 bg-amber-50 text-neutral-700";
  }
  if (row.deadlines.some((deadline) => deadline.kind === "exam")) {
    return "border-b border-neutral-200 bg-sky-50";
  }
  return "border-b border-neutral-200";
}

export default function AgendaTable({
  section,
  rows,
  sections,
  onSelect,
}: {
  section: CourseSection;
  rows: AgendaRow[];
  sections: CourseSection[];
  onSelect: (id: string) => void;
}) {
  return (
    <SyllabusSection id="agenda" title="Agenda">
      <p>
        Every section follows the same lecture sequence (Lecture 1, 2, 3…).
        Tabs project that sequence onto this section’s calendar from its first
        class. Thanksgiving week is a calendar blackout — those meetings are
        labeled and do not consume a lecture number. Due dates in the last
        column are the shared Canvas dates when they fall on a meeting day;
        they do not slide with the section start.
      </p>
      <p className="font-sans text-sm text-neutral-600">
        Showing {section.tabLabel}. Early in the term, sections are on different
        lecture numbers in the same calendar week — that is intended.
      </p>
      <SectionTabs
        sections={sections}
        activeId={section.id}
        onSelect={onSelect}
      />
      <div
        id="syllabus-agenda-panel"
        role="tabpanel"
        aria-labelledby={`syllabus-tab-${section.id}`}
        className="overflow-x-auto rounded-md border border-neutral-200"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Topic</th>
              <th className="px-3 py-2 font-semibold">Shared due that day</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${section.id}-${row.date}`} className={rowClass(row)}>
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  {formatAgendaDate(row.date)}
                </td>
                <td className="px-3 py-2 tabular-nums text-neutral-600">
                  {row.kind === "holiday" ? "—" : row.lectureNumber}
                </td>
                <td className="px-3 py-2">
                  {row.kind === "holiday" ? (
                    <span className="font-medium italic">{row.topic}</span>
                  ) : (
                    row.topic
                  )}
                </td>
                <td className="px-3 py-2">
                  {row.deadlines.map((deadline) => deadline.label).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SyllabusSection>
  );
}
