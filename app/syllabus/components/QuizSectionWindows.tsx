import {
  formatSectionQuizWindow,
  sectionQuizWindows,
  sectionQuizWindowsForLabel,
} from "../data/quiz-windows";

/** Known Canvas windows for one quiz. Renders nothing when none are confirmed. */
export default function QuizSectionWindows({
  quizId,
  label,
}: {
  quizId?: string;
  label?: string;
}) {
  const rows = label
    ? sectionQuizWindowsForLabel(label)
    : sectionQuizWindows(quizId ?? "");
  if (rows.length === 0) return null;
  return (
    <ul className="mt-1 mb-0 list-none space-y-0.5 p-0 text-sm text-neutral-800">
      {rows.map((row) => (
        <li key={row.section}>{formatSectionQuizWindow(row)}</li>
      ))}
    </ul>
  );
}
