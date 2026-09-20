import Link from "next/link";
import { listExamBanks } from "@/lib/quiz-exam/banks";
import { staffAttemptsHref } from "@/lib/quiz-exam/staff";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export default async function StaffAttemptsLink({
  quizId,
}: {
  quizId?: string;
}) {
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!staff || impersonating) return null;

  const exams = quizId
    ? listExamBanks().filter((row) => row.quizId === quizId)
    : listExamBanks();
  if (exams.length === 0) return null;

  return (
    <section className="mt-6 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sky-950">
      <h2 className="mt-0 mb-1 text-lg font-semibold">Staff attempt review</h2>
      <p className="mt-0 mb-2 text-sm">
        Browse each student’s submission, mark questions correct or wrong, or
        enter custom points. Overrides persist in Mongo and the score
        recalculates.
      </p>
      <p className="mb-0 text-sm">
        {exams.map((exam, index) => (
          <span key={exam.quizId}>
            {index > 0 ? " · " : null}
            <Link href={staffAttemptsHref(exam.quizId)}>
              {exam.bank.title} attempts
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
