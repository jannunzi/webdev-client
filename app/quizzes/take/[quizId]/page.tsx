import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import StatusPanel from "../../components/StatusPanel";
import {
  isClerkConfigured,
  isMongoConfigured,
  isQuizTakingConfigured,
} from "@/lib/config";
import { findLatestQuizAttempt } from "@/lib/quiz-exam/attempts";
import {
  drawOnePerGroup,
  getExamBank,
  toStudentQuestion,
} from "@/lib/quiz-exam";
import { buildAttemptReview } from "@/lib/quiz-exam/review";
import {
  canRevealAnswers,
  getAnswerRevealPhase,
  getQuizSchedule,
  isTakeWindowOpen,
  scheduleToIso,
} from "@/lib/quiz-exam/schedule";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import {
  effectiveIsStaff,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import {
  IMPERSONATION_STUDENT_NAME,
  impersonationStudentEmail,
} from "@/lib/roster/view-mode";
import { SubmittedAttemptView, WindowBanner } from "../components/AttemptReview";
import ExamForm from "../components/ExamForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ quizId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { quizId } = await params;
  const bank = getExamBank(quizId);
  return {
    title: bank
      ? `Take ${bank.title} — CS 4550 / CS 5610`
      : "Graded quiz",
  };
}

function TakeNav({
  quizId,
  showAuthorReview,
}: {
  quizId: string;
  showAuthorReview: boolean;
}) {
  return (
    <p className="mb-4 text-sm">
      <Link href="/quizzes/take">Graded quizzes</Link>
      {showAuthorReview ? (
        <>
          {" · "}
          <Link href={`/quizzes/${quizId}`}>Author review (answers shown)</Link>
        </>
      ) : null}
      {" · "}
      <Link href="/book">Book</Link>
    </p>
  );
}

export default async function TakeExamPage({ params }: PageProps) {
  const { quizId } = await params;
  const bank = getExamBank(quizId);
  if (!bank) notFound();

  if (!isQuizTakingConfigured()) {
    const missing = [
      !isClerkConfigured() ? "Clerk" : null,
      !isMongoConfigured() ? "MongoDB Atlas" : null,
    ].filter(Boolean);
    return (
      <StatusPanel title="Graded quizzes are not configured yet" tone="warn">
        <p>
          {missing.join(" and ")} env vars are missing, so this exam cannot
          start or store an attempt. The rest of the course book stays
          available.
        </p>
        <p>
          Jose: add the keys from <code>.env.example</code> to Vercel (and
          <code>.env.local</code> for local work), then import the Canvas
          roster. See the README section “Graded quizzes”.
        </p>
      </StatusPanel>
    );
  }

  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const emails = collectClerkEmails(user);
  const canvasUserId = canvasUserIdFromMetadata(user);
  const impersonating = await isImpersonatingStudent();
  const showAuthorReview = await effectiveIsStaff();
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
    impersonating,
  });

  if (roster.status === "empty") {
    return (
      <StatusPanel title="Canvas roster has not been loaded" tone="warn">
        <p>
          You are signed in, but this course has no roster yet. Graded
          attempts are disabled until the instructor imports Canvas student
          emails.
        </p>
      </StatusPanel>
    );
  }

  if (roster.status === "not_on_roster" || roster.status === "not_configured") {
    return (
      <StatusPanel
        title="Your account isn’t on the Canvas roster for this course"
        tone="warn"
      >
        <p>
          Signed-in browsing of the book, syllabus, labs, and practice pages
          is fine. A graded attempt was not created.
        </p>
        <p>
          Use the same email as your Canvas account (Northeastern login). If
          that still fails, ask the instructor to refresh the roster.
        </p>
      </StatusPanel>
    );
  }

  const now = new Date();
  const schedule = getQuizSchedule(quizId);
  const attempt = impersonating
    ? null
    : await findLatestQuizAttempt(user.id, quizId);
  const phase = schedule
    ? getAnswerRevealPhase(schedule, now, Boolean(attempt))
    : attempt
      ? "submitted_waiting"
      : "take_open";

  const showForm =
    Boolean(schedule) &&
    !attempt &&
    (impersonating || phase === "take_open");
  const questions = showForm
    ? drawOnePerGroup(bank, `${user.id}:${bank.id}`).map(toStudentQuestion)
    : [];

  return (
    <article>
      <TakeNav quizId={quizId} showAuthorReview={showAuthorReview} />
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">
        {bank.title}
      </h1>
      {impersonating ? (
        <p className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950">
          Impersonation — viewing as {IMPERSONATION_STUDENT_NAME} (
          {impersonationStudentEmail()}). You can submit to smoke-test the
          exam UI. The attempt is <strong>not saved</strong>.
        </p>
      ) : null}

      {attempt && schedule && phase ? (
        <AttemptReviewSection
          title={bank.title}
          schedule={schedule}
          phase={phase}
          attempt={attempt}
          now={now}
        />
      ) : attempt && !schedule ? (
        <StatusPanel title="Attempt submitted" tone="ok">
          <p>
            Your score is {attempt.score} / {attempt.maxScore}. This quiz has
            no class review schedule configured yet, so answers stay hidden.
          </p>
        </StatusPanel>
      ) : showForm && schedule ? (
        <>
          {impersonating && schedule && !isTakeWindowOpen(schedule, now) ? (
            <div className="mt-4">
              <WindowBanner schedule={schedule} phase="take_closed" now={now} />
              <p className="text-sm text-neutral-700">
                Students cannot start a new attempt right now. Impersonation
                still shows the form so you can smoke-test the UI (not saved).
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sky-950">
              Student exam mode. Correct answers stay hidden until the
              class-wide review window. Returning to this same URL later is how
              you review.
            </p>
          )}
          <div className="mt-4">
            <ExamForm
              quizId={quizId}
              title={bank.title}
              questions={questions}
              startedAt={now.toISOString()}
              schedule={scheduleToIso(schedule)}
              impersonating={impersonating}
            />
          </div>
        </>
      ) : schedule ? (
        <div className="mt-4">
          <WindowBanner schedule={schedule} phase="take_closed" now={now} />
        </div>
      ) : (
        <StatusPanel title="This quiz is not open" tone="warn">
          <p>No class-wide take window is configured for this quiz.</p>
        </StatusPanel>
      )}
    </article>
  );
}

async function AttemptReviewSection({
  title,
  schedule,
  phase,
  attempt,
  now,
}: {
  title: string;
  schedule: NonNullable<ReturnType<typeof getQuizSchedule>>;
  phase: NonNullable<ReturnType<typeof getAnswerRevealPhase>>;
  attempt: NonNullable<Awaited<ReturnType<typeof findLatestQuizAttempt>>>;
  now: Date;
}) {
  const reveal = canRevealAnswers(phase);
  const review = buildAttemptReview(attempt, reveal);
  if (!review) {
    return (
      <StatusPanel title="Attempt submitted" tone="ok">
        <p>
          Your score is {attempt.score} / {attempt.maxScore}. The drawn
          questions could not be rebuilt from the bank, so a full review is
          unavailable.
        </p>
      </StatusPanel>
    );
  }

  return (
    <div className="mt-4">
      <SubmittedAttemptView
        title={title}
        schedule={schedule}
        phase={phase}
        score={review.score}
        maxScore={review.maxScore}
        questions={review.questions}
        graded={review.graded}
        submittedAt={review.submittedAt}
        now={now}
      />
    </div>
  );
}
