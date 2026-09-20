import Link from "next/link";
import InstructorPeopleLink from "../components/InstructorPeopleLink";
import { renderStaffReview } from "../components/render-staff-review";
import { listExamBanks } from "@/lib/quiz-exam/banks";
import { staffAttemptsHref } from "@/lib/quiz-exam/staff";

export default async function StaffQuizIndexPage() {
  return renderStaffReview(() => {
    const exams = listExamBanks();
    return (
      <article className="page-content font-sans">
        <p className="mb-4 text-sm">
          <Link href="/quizzes/take">Graded quizzes</Link>
          {" · "}
          <Link href="/quizzes">Question banks</Link>
          <InstructorPeopleLink />
        </p>
        <h1 className="mt-0 text-3xl font-semibold tracking-tight">
          Staff attempt review
        </h1>
        <p className="text-neutral-700">
          Browse each student’s submitted quiz, see the same correct / wrong
          marking they would see in review, and override a question for that
          student or for everyone who drew it.
        </p>
        <ul className="list-none space-y-3 p-0">
          {exams.map(({ quizId, bank }) => (
            <li
              key={quizId}
              className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h2 className="mt-0 mb-2 text-lg font-semibold">{bank.title}</h2>
              <Link
                href={staffAttemptsHref(quizId)}
                className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
              >
                Review {bank.title} attempts
              </Link>
            </li>
          ))}
        </ul>
      </article>
    );
  });
}
