import { formatAgendaDate } from "../data/dates";
import type { AgendaRow } from "../data/types";
import SyllabusSection from "./SyllabusSection";

function rowClass(row: AgendaRow): string {
  if (row.kind === "holiday") {
    return "border-b border-amber-200 bg-amber-50 text-neutral-700";
  }
  if (row.exam) {
    return "border-b border-neutral-200 bg-sky-50";
  }
  if (row.kind === "intro") {
    return "border-b border-neutral-200 bg-neutral-50";
  }
  return "border-b border-neutral-200";
}

export default function AgendaTable({ rows }: { rows: AgendaRow[] }) {
  return (
    <SyllabusSection id="agenda" title="Agenda">
      <p>
        Rows are generated from the Tuesday/Thursday meeting pattern, the Friday
        introductory session, the ordered topic list, and the holiday list in{" "}
        <code>app/syllabus/data</code>. Thanksgiving week is labeled and does
        not consume a lecture topic — remaining work compresses into early
        December.
      </p>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Topic</th>
              <th className="px-3 py-2 font-semibold">Assignment</th>
              <th className="px-3 py-2 font-semibold">Quiz / exam</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className={rowClass(row)}>
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
                <td className="px-3 py-2">{row.assignment ?? ""}</td>
                <td className="px-3 py-2">
                  {[row.quiz, row.exam].filter(Boolean).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SyllabusSection>
  );
}
