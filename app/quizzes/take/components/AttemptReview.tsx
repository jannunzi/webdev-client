import {
  answerWindowCopy,
  formatEasternDateTime,
  type QuizPhase,
  type QuizSchedule,
} from "@/lib/quiz-exam/schedule";
import { formatStudentResponse } from "@/lib/quiz-exam/review";
import type { GradedAnswer, StudentQuestion } from "@/lib/quiz-exam/types";
import PromptMarkup from "../../components/PromptMarkup";

export function WindowBanner({
  schedule,
  phase,
  now,
}: {
  schedule: QuizSchedule;
  phase: QuizPhase;
  now?: Date;
}) {
  const copy = answerWindowCopy(schedule, phase, now);
  const toneClass =
    copy.tone === "ok"
      ? "border-emerald-600 bg-emerald-50 text-emerald-950"
      : copy.tone === "warn"
        ? "border-amber-500 bg-amber-50 text-amber-950"
        : "border-sky-300 bg-sky-50 text-sky-950";

  return (
    <div role="status" className={`rounded-lg border-2 px-4 py-3 ${toneClass}`}>
      <p className="m-0 text-lg font-semibold">{copy.title}</p>
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mb-0 mt-2 text-sm">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function AttemptScore({
  title,
  score,
  maxScore,
  submittedAt,
  persisted = true,
  impersonation = false,
}: {
  title: string;
  score: number;
  maxScore: number;
  submittedAt?: Date | string;
  persisted?: boolean;
  impersonation?: boolean;
}) {
  return (
    <div
      className={`mb-4 rounded-lg border-2 px-4 py-3 ${
        impersonation
          ? "border-amber-500 bg-amber-50 text-amber-950"
          : "border-emerald-600 bg-emerald-50 text-emerald-950"
      }`}
    >
      <p className="m-0 text-lg font-semibold">
        {title}: {score} / {maxScore}
      </p>
      {submittedAt ? (
        <p className="mb-0 mt-1 text-sm">
          Submitted {formatEasternDateTime(submittedAt)}.
        </p>
      ) : null}
      <p className="mb-0 mt-1 text-sm">
        {impersonation
          ? "Impersonation — attempt not saved."
          : persisted
            ? "This attempt is stored for later Canvas grade import."
            : "Your score was calculated, but the attempt was not stored. Ask the instructor to check Atlas configuration."}
      </p>
    </div>
  );
}

export function GradedQuestionList({
  questions,
  graded,
  revealAnswers,
}: {
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  revealAnswers: boolean;
}) {
  const byId = new Map(questions.map((question) => [question.id, question]));

  return (
    <ol className="m-0 list-none space-y-3 p-0">
      {graded.map((item, index) => {
        const question = byId.get(item.questionId);
        const showMark = revealAnswers;
        return (
          <li
            key={item.questionId}
            className={`rounded-lg border px-4 py-3 ${
              showMark
                ? item.correct
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
                : "border-neutral-300 bg-white"
            }`}
          >
            <p className="m-0 text-sm font-semibold">
              {index + 1}. {question?.groupName ?? item.groupId}
              {showMark ? ` — ${item.correct ? "Correct" : "Incorrect"}` : ""}
            </p>
            {question ? (
              <PromptMarkup
                text={question.prompt}
                className="mt-1 mb-0 whitespace-pre-wrap"
              />
            ) : null}
            {question ? (
              <p className="mb-0 mt-2 text-sm">
                Your answer:{" "}
                <PromptMarkup
                  as="span"
                  text={formatStudentResponse(question, item.response)}
                />
              </p>
            ) : null}
            {revealAnswers && item.correctReveal ? (
              <p className="mb-0 mt-2 text-sm">
                Correct answer:{" "}
                <PromptMarkup as="span" text={item.correctReveal} />
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function SubmittedAttemptView({
  title,
  schedule,
  phase,
  score,
  maxScore,
  questions,
  graded,
  submittedAt,
  persisted = true,
  impersonation = false,
  now,
}: {
  title: string;
  schedule: QuizSchedule;
  phase: QuizPhase;
  score: number;
  maxScore: number;
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  submittedAt?: Date | string;
  persisted?: boolean;
  impersonation?: boolean;
  now?: Date;
}) {
  const revealAnswers = phase === "answers_open" || phase === "answers_reopen";
  return (
    <div className="space-y-4">
      <AttemptScore
        title={title}
        score={score}
        maxScore={maxScore}
        submittedAt={submittedAt}
        persisted={persisted}
        impersonation={impersonation}
      />
      <WindowBanner schedule={schedule} phase={phase} now={now} />
      {revealAnswers ? (
        <GradedQuestionList
          questions={questions}
          graded={graded}
          revealAnswers
        />
      ) : null}
    </div>
  );
}
