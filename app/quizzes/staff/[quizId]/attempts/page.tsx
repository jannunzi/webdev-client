import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusPanel from "../../../components/StatusPanel";
import InstructorPeopleLink from "../../../components/InstructorPeopleLink";
import { renderStaffReview } from "../../../components/render-staff-review";
import StaffAttemptBrowser from "../../components/StaffAttemptBrowser";
import { isMongoConfigured, isQuizTakingConfigured } from "@/lib/config";
import {
  findLatestQuizAttemptForStaff,
  listLatestQuizAttempts,
  type QuizAttemptStored,
} from "@/lib/quiz-exam/attempts";
import { getExamBank } from "@/lib/quiz-exam/banks";
import { listQuizGradeOverrides } from "@/lib/quiz-exam/grade-overrides";
import { serializeClassOverride } from "@/lib/quiz-exam/grade-override";
import { buildAttemptReview } from "@/lib/quiz-exam/review";
import {
  buildQuizStaffQueue,
  findQuizStaffStudent,
  firstAttemptKey,
  parseQuizStaffStudentKey,
  quizStaffQueueForSection,
  resolveQuizStaffSectionFilter,
  listQuizStaffSections,
  staffAttemptsHref,
} from "@/lib/quiz-exam/staff";
import type { QuizClassQuestionOverride } from "@/lib/quiz-exam/types";
import { listCanvasRoster } from "@/lib/roster/list";
import type { CanvasRosterEntry } from "@/lib/roster/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ student?: string; section?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { quizId } = await params;
  const bank = getExamBank(quizId);
  return {
    title: bank
      ? `Staff attempts — ${bank.title}`
      : "Staff quiz attempts",
  };
}

export default async function StaffAttemptsPage({
  params,
  searchParams,
}: PageProps) {
  const { quizId } = await params;
  const { student: studentKey, section: sectionParam } = await searchParams;
  const bank = getExamBank(quizId);
  if (!bank) notFound();

  return renderStaffReview(() =>
    renderAttempts({
      quizId,
      title: bank.title,
      studentKey,
      sectionParam,
    }),
  );
}

async function renderAttempts({
  quizId,
  title,
  studentKey,
  sectionParam,
}: {
  quizId: string;
  title: string;
  studentKey?: string;
  sectionParam?: string;
}) {
  if (!isQuizTakingConfigured() || !isMongoConfigured()) {
    return (
      <article>
        <StaffNav quizId={quizId} />
        <StatusPanel title="Staff attempt review is not available yet" tone="warn">
          <p>
            Clerk and MongoDB must be configured (`MONGODB_URI`,
            `MONGODB_DB=web-dev`, plus the staff allowlists) before
            submissions can be loaded.
          </p>
        </StatusPanel>
      </article>
    );
  }

  const [rosterResult, attemptResult, overrideResult] = await Promise.all([
    listCanvasRoster().catch((error) => {
      console.error("staff quiz roster failed", error);
      return { status: "not_configured" as const };
    }),
    listLatestQuizAttempts(quizId).catch((error) => {
      console.error("staff quiz attempts failed", error);
      return null;
    }),
    listQuizGradeOverrides(quizId).catch(() => [] as QuizClassQuestionOverride[]),
  ]);

  if (attemptResult === null) {
    return (
      <article>
        <StaffNav quizId={quizId} />
        <StatusPanel title="Could not load quiz attempts" tone="warn">
          <p>
            MongoDB did not return `quiz_attempts` for {title}. Existing
            documents were not changed.
          </p>
        </StatusPanel>
      </article>
    );
  }

  const rosterEntries: CanvasRosterEntry[] =
    rosterResult.status === "ok" ? rosterResult.entries : [];
  const attempts: QuizAttemptStored[] = attemptResult;
  const classOverrides = overrideResult.map(serializeClassOverride);

  const queue = buildQuizStaffQueue(rosterEntries, attempts);
  const sections = listQuizStaffSections(queue);
  const selectedSection = resolveQuizStaffSectionFilter(sectionParam, sections);
  const visible = quizStaffQueueForSection(queue, selectedSection);
  const selected =
    findQuizStaffStudent(visible, studentKey) ??
    findQuizStaffStudent(queue, studentKey) ??
    findQuizStaffStudent(visible, firstAttemptKey(visible));

  let review = null;
  if (selected?.hasAttempt) {
    const parsed = parseQuizStaffStudentKey(selected.key);
    try {
      const attempt = await findLatestQuizAttemptForStaff({
        quizId,
        clerkUserId: selected.clerkUserId ?? parsed.clerkUserId,
        email: selected.email || parsed.email,
      });
      if (attempt) {
        const built = buildAttemptReview(attempt, true, classOverrides);
        if (built) {
          review = {
            questions: built.questions,
            graded: built.graded,
            score: built.score,
            maxScore: built.maxScore,
            submittedAt:
              built.submittedAt instanceof Date
                ? built.submittedAt.toISOString()
                : new Date(built.submittedAt).toISOString(),
          };
        }
      }
    } catch (error) {
      console.error("staff quiz attempt rebuild failed", error);
    }
  }

  return (
    <article>
      <StaffNav quizId={quizId} />
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">
        {title} — staff attempts
      </h1>
      <p className="text-neutral-700">
        Same preview a student sees during answer review, with marks and
        points. Override a question for this student, enter custom points, or
        apply correct / wrong to every student who drew that question.
      </p>
      <StaffAttemptBrowser
        quizId={quizId}
        title={title}
        queue={queue}
        selectedKey={selected?.key}
        selectedSection={selectedSection}
        review={review}
        classOverrides={classOverrides}
      />
    </article>
  );
}

function StaffNav({ quizId }: { quizId: string }) {
  return (
    <p className="mb-4 text-sm">
      <Link href="/quizzes/staff">Staff attempts</Link>
      {" · "}
      <Link href={`/quizzes/take/${quizId}`}>Student exam</Link>
      {" · "}
      <Link href={`/quizzes/${quizId}`}>Author review</Link>
      {" · "}
      <Link href={staffAttemptsHref(quizId)}>This quiz</Link>
      <InstructorPeopleLink />
    </p>
  );
}
