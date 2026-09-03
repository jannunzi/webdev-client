import Link from "next/link";
import { getPracticeQuiz, practicePath } from "../quizzes/registry";

export default function PracticeCard({ quizId }: { quizId: string }) {
  const quiz = getPracticeQuiz(quizId);
  if (!quiz) return null;

  return (
    <aside
      className="my-4 overflow-hidden rounded border border-neutral-300 bg-white shadow-sm"
      aria-label={`Practice: ${quiz.title}`}
    >
      <div className="border-b border-neutral-300 bg-neutral-100 px-3 py-2 font-sans text-sm text-neutral-700">
        Practice — not a graded Canvas exam
      </div>
      <div className="space-y-3 p-4 font-sans text-[0.95rem]">
        <h4 className="m-0 font-semibold text-neutral-900">{quiz.title}</h4>
        <p className="m-0 text-neutral-800">
          {quiz.count} questions drawn at random from a bank of{" "}
          {quiz.bank.length}. Open the dedicated practice page to start the
          self-check, see explanations, and try another draw. Scores stay on
          this device only.
        </p>
        <Link
          href={practicePath(quiz.quizId)}
          className="book-practice-cta inline-block rounded border border-neutral-400 bg-neutral-800 px-3 py-2 text-sm"
        >
          Open practice quiz
        </Link>
      </div>
    </aside>
  );
}
