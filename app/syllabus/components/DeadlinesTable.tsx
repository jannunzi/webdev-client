import { formatAgendaDate, formatWeekOf } from "../data/dates";
import { CANVAS_QUIZ_WINDOWS_NOTE } from "../data/quiz-windows";
import type { Deadline } from "../data/types";
import QuizSectionWindows from "./QuizSectionWindows";
import SyllabusSection from "./SyllabusSection";

const KIND_LABEL: Record<Deadline["kind"], string> = {
  assignment: "Assignment",
  quiz: "Quiz",
  exam: "Exam",
  project: "Project",
};

function formatDeadlineDate(deadline: Deadline): string {
  if (deadline.kind === "quiz" && deadline.date) {
    return formatWeekOf(deadline.date);
  }
  if (
    deadline.kind === "exam" &&
    deadline.date &&
    /2nd half of lecture/i.test(deadline.label)
  ) {
    return `${formatWeekOf(deadline.date)} · 2nd half of lecture`;
  }
  if (deadline.kind === "quiz" || !deadline.date) return "That week";
  return formatAgendaDate(deadline.date);
}

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
      <p>{CANVAS_QUIZ_WINDOWS_NOTE}</p>
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
                key={`${deadline.date ?? "lecture"}-${deadline.kind}-${deadline.label}`}
                className={
                  deadline.kind === "exam"
                    ? "border-b border-neutral-200 bg-sky-50"
                    : "border-b border-neutral-200"
                }
              >
                <td className="px-3 py-2 align-top font-sans">
                  {formatDeadlineDate(deadline)}
                </td>
                <td className="px-3 py-2 align-top">{KIND_LABEL[deadline.kind]}</td>
                <td className="px-3 py-2 align-top">
                  {deadline.label}
                  {deadline.kind === "quiz" ? (
                    <QuizSectionWindows label={deadline.label} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SyllabusSection>
  );
}
