import { holidayMeetingNote } from "../data/holidays";
import { formatAgendaDate, formatWeekOf } from "../data/dates";
import type { AgendaGroup, AgendaRow, CourseSection } from "../data/types";
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
  if (row.kind === "orientation") {
    return "border-b border-neutral-200 bg-neutral-50";
  }
  return "border-b border-neutral-200";
}

function dateLabel(row: AgendaRow): string {
  return row.kind === "orientation"
    ? formatAgendaDate(row.date)
    : formatWeekOf(row.date);
}

export default function AgendaTable({
  section,
  groups,
}: {
  section: CourseSection;
  groups: AgendaGroup[];
}) {
  return (
    <SyllabusSection id="agenda" title="Agenda">
      <p>
        Every section follows the same Canvas module sequence from the week of
        September 14, 2026, grouped by chapter. Dates are the shared Monday —
        Week of Sep 14 through Week of Dec 14 — so Monday, Tuesday, and
        Wednesday tabs show the same labels. CS 4550’s September 9 meeting is
        orientation only and does not start Chapter 1. Each chapter spans two
        weeks. Chapter 4 is one Canvas module — “Ch 4 — Client state,
        Midterm/X1” — covering the weeks of Oct 26 and Nov 2 (X1 is in that
        window, not a separate midterm module). Chapter 5 is Nov 9 and Nov
        16; Chapter 6 is Nov 23 and Nov 30. Project grading is the week of
        Dec 7 (project due Dec 6), with room for the Integrating with the
        Atlas lecture slides. X2 is the week of Dec 14, even though the last
        day of classes is Dec 13. Quizzes are taken at the end of lecture at
        the end of each chapter.
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
              <th className="px-3 py-2 font-semibold">Shared due that week</th>
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={`${section.id}-${group.id}`}>
              {group.heading ? (
                <tr className="border-b border-neutral-300 bg-neutral-200">
                  <th
                    colSpan={4}
                    scope="colgroup"
                    className="px-3 py-2 font-sans text-sm font-semibold text-neutral-900"
                  >
                    {group.heading}
                  </th>
                </tr>
              ) : null}
              {group.rows.map((row, index) => (
                <tr
                  key={`${section.id}-${group.id}-${row.date}-${row.kind}-${index}`}
                  className={rowClass(row)}
                >
                  <td className="whitespace-nowrap px-3 py-2 font-sans">
                    {dateLabel(row)}
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
          ))}
        </table>
      </div>
    </SyllabusSection>
  );
}
