import { isMongoConfigured } from "@/lib/config";
import { COURSE_SECTION_IDS } from "@/lib/roster/sections";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";
import { getExamBank } from "@/lib/quiz-exam/banks";
import {
  listQuizAccessOverrides,
  overrideDocsToViews,
} from "@/lib/quiz-exam/access-overrides";
import {
  getQuizSchedule,
  listQuizSchedules,
  scheduleToIso,
} from "@/lib/quiz-exam/schedule";
import QuizAccessOverridePanel from "./QuizAccessOverridePanel";

export default async function QuizAccessOverrides({
  quizId,
}: {
  quizId?: string;
}) {
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!staff || impersonating) return null;

  if (!isMongoConfigured()) {
    return (
      <section className="mt-6 rounded-lg border border-amber-500 bg-amber-50 px-4 py-3 text-amber-950">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Section take overrides</h2>
        <p className="mb-0 text-sm">
          MongoDB is not configured, so per-section open/close overrides cannot
          be saved.
        </p>
      </section>
    );
  }

  const schedules = quizId
    ? [getQuizSchedule(quizId)].filter(
        (schedule): schedule is NonNullable<typeof schedule> => Boolean(schedule),
      )
    : listQuizSchedules();
  if (schedules.length === 0) return null;

  let docs;
  try {
    docs = await listQuizAccessOverrides(schedules.map((row) => row.quizId));
  } catch {
    return (
      <section className="mt-6 rounded-lg border border-amber-500 bg-amber-50 px-4 py-3 text-amber-950">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Section take overrides</h2>
        <p className="mb-0 text-sm">
          Could not load saved overrides from MongoDB. Date windows still apply.
        </p>
      </section>
    );
  }

  return (
    <QuizAccessOverridePanel
      quizzes={schedules.map((schedule) => ({
        quizId: schedule.quizId,
        title: getExamBank(schedule.quizId)?.title ?? schedule.quizId.toUpperCase(),
        schedule: scheduleToIso(schedule),
      }))}
      sections={COURSE_SECTION_IDS}
      overrides={overrideDocsToViews(docs)}
      now={new Date().toISOString()}
    />
  );
}
