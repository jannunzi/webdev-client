import { formatAgendaDate } from "../data/dates";
import type { Deadline } from "../data/types";
import SyllabusSection from "./SyllabusSection";

const KIND_LABEL: Record<Deadline["kind"], string> = {
  assignment: "Assignment",
  quiz: "Quiz",
  exam: "Exam",
  project: "Project",
};

export default function DeadlinesTable({
  deadlines,
  note,
}: {
  deadlines: Deadline[];
  note: string;
}) {
  return (
    <SyllabusSection id="deadlines" title="Shared deadlines">
      <p>{note}</p>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Item</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((deadline) => (
              <tr
                key={`${deadline.date}-${deadline.kind}-${deadline.label}`}
                className={
                  deadline.kind === "exam"
                    ? "border-b border-neutral-200 bg-sky-50"
                    : "border-b border-neutral-200"
                }
              >
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  {formatAgendaDate(deadline.date)}
                </td>
                <td className="px-3 py-2">{KIND_LABEL[deadline.kind]}</td>
                <td className="px-3 py-2">{deadline.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SyllabusSection>
  );
}
