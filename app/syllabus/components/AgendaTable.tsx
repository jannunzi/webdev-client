import { holidayMeetingNote } from "../data/holidays";
import { formatAgendaDate } from "../data/dates";
import type { AgendaRow, CourseSection } from "../data/types";
import SyllabusSection from "./SyllabusSection";

function rowClass(row: AgendaRow): string {
  if (row.onlineNote) {
    return "border-b border-amber-200 bg-amber-50 text-neutral-700";
  }
  if (
    row.topic.startsWith("X1") ||
    row.topic.startsWith("X2") ||
    row.deadlines.some((deadline) => deadline.kind === "exam")
  ) {
    return "border-b border-neutral-200 bg-sky-50";
  }
  return "border-b border-neutral-200";
}

export default function AgendaTable({
  section,
  rows,
}: {
  section: CourseSection;
  rows: AgendaRow[];
}) {
  return (
    <SyllabusSection id="agenda" title="Agenda">
      <p>
        Every section follows the same book-aligned sequence from the week of
        September 14, 2026. Monday, Tuesday, and Wednesday sections are on the
        same chapter that calendar week. CS 4550’s September 9 meeting is
        orientation only and does not start Chapter 1. Each chapter spans two
        weeks, except Chapter 3, which is one combined week so X1 can follow
        Chapter 3 and X2 can fall in the last week of classes.
      </p>
      <p>{holidayMeetingNote}</p>
      <p className="font-sans text-sm text-neutral-600">
        Showing {section.tabLabel}. Use the section buttons at the top of the
        page to switch. Due dates in the last column are the shared Canvas
        dates when they fall on a meeting day.
      </p>
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
                  {row.kind === "orientation" ? "—" : row.lectureNumber}
                </td>
                <td className="px-3 py-2">
                  {row.kind === "orientation" ? (
                    <span className="font-medium italic">{row.topic}</span>
                  ) : (
                    row.topic
                  )}
                  {row.onlineNote ? (
                    <div className="mt-1 font-medium italic text-amber-900">
                      {row.onlineNote}
                    </div>
                  ) : null}
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
