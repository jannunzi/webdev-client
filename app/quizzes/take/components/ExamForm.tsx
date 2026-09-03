"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type {
  StudentAnswer,
  StudentQuestion,
  SubmitExamResult,
} from "@/lib/quiz-exam/types";
import { submitExamAttempt } from "../actions";

function readAnswers(
  questions: StudentQuestion[],
  form: FormData,
): Record<string, StudentAnswer> {
  const answers: Record<string, StudentAnswer> = {};
  for (const question of questions) {
    if (question.type === "multiple_choice") {
      const choiceId = String(form.get(`q-${question.id}`) ?? "");
      if (choiceId) {
        answers[question.id] = { type: "multiple_choice", choiceId };
      }
    } else if (question.type === "true_false") {
      const value = String(form.get(`q-${question.id}`) ?? "");
      if (value === "true" || value === "false") {
        answers[question.id] = { type: "true_false", value: value === "true" };
      }
    } else {
      const blanks = Array.from(
        { length: question.blankCount ?? 1 },
        (_, index) => String(form.get(`q-${question.id}-${index}`) ?? ""),
      );
      if (blanks.some((blank) => blank.trim() !== "")) {
        answers[question.id] = { type: "fill_in_blank", blanks };
      }
    }
  }
  return answers;
}

export default function ExamForm({
  quizId,
  title,
  questions,
  startedAt,
}: {
  quizId: string;
  title: string;
  questions: StudentQuestion[];
  startedAt: string;
}) {
  const [result, setResult] = useState<SubmitExamResult | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    const next = await submitExamAttempt({
      quizId,
      drawnQuestionIds: questions.map((question) => question.id),
      answers: readAnswers(questions, form),
      startedAt,
    });
    setPending(false);
    setResult(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result?.ok) {
    return (
      <ScoreSummary title={title} questions={questions} result={result} />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {result && !result.ok ? (
        <div
          role="alert"
          className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950"
        >
          <p className="m-0 font-semibold">{result.message}</p>
        </div>
      ) : null}

      <p className="text-sm text-neutral-700">
        One question is drawn from each of {questions.length} groups. Answers
        stay hidden until you submit. Grading happens on the server.
      </p>

      {questions.map((question, index) => (
        <QuestionField key={question.id} question={question} index={index + 1} />
      ))}

      <button
        type="submit"
        disabled={pending}
        className="rounded border border-neutral-800 bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit graded attempt"}
      </button>
    </form>
  );
}

function QuestionField({
  question,
  index,
}: {
  question: StudentQuestion;
  index: number;
}) {
  return (
    <fieldset className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
      <legend className="px-1 text-sm font-semibold text-neutral-700">
        {index}. {question.groupName}
      </legend>
      <p className="mt-1 font-medium whitespace-pre-wrap break-words">
        {question.prompt}
      </p>
      {question.code ? (
        <pre className="mt-2 overflow-x-auto rounded border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
          <code>{question.code}</code>
        </pre>
      ) : null}

      {question.type === "multiple_choice" ? (
        <ul className="mt-3 mb-0 list-none space-y-1.5 p-0">
          {question.choices?.map((choice) => (
            <li key={choice.id}>
              <label className="flex cursor-pointer items-start gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 has-[:checked]:border-neutral-800 has-[:checked]:bg-white">
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={choice.id}
                  className="mt-1"
                />
                <span>
                  <span className="mr-1 font-mono text-xs uppercase text-neutral-500">
                    {choice.id}.
                  </span>
                  {choice.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}

      {question.type === "true_false" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(["true", "false"] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 has-[:checked]:border-neutral-800 has-[:checked]:bg-white"
            >
              <input type="radio" name={`q-${question.id}`} value={value} />
              {value === "true" ? "True" : "False"}
            </label>
          ))}
        </div>
      ) : null}

      {question.type === "fill_in_blank" ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: question.blankCount ?? 1 }, (_, blankIndex) => (
            <label key={blankIndex} className="block text-sm">
              <span className="mb-1 block text-neutral-600">
                Blank {blankIndex + 1}
              </span>
              <input
                type="text"
                name={`q-${question.id}-${blankIndex}`}
                autoComplete="off"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono"
              />
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}

function ScoreSummary({
  title,
  questions,
  result,
}: {
  title: string;
  questions: StudentQuestion[];
  result: Extract<SubmitExamResult, { ok: true }>;
}) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return (
    <div>
      <div
        role="status"
        className="mb-6 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-emerald-950"
      >
        <p className="m-0 text-lg font-semibold">
          {title}: {result.score} / {result.maxScore}
        </p>
        <p className="mb-0 mt-1 text-sm">
          {result.persisted
            ? "This attempt was stored in MongoDB Atlas for later Canvas grade import."
            : "Your score was calculated, but the attempt was not stored. Ask the instructor to check Atlas configuration."}
        </p>
      </div>
      <ol className="m-0 list-none space-y-3 p-0">
        {result.graded.map((item, index) => {
          const question = byId.get(item.questionId);
          return (
            <li
              key={item.questionId}
              className={`rounded-lg border px-4 py-3 ${
                item.correct
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <p className="m-0 text-sm font-semibold">
                {index + 1}. {question?.groupName ?? item.groupId}
                {" — "}
                {item.correct ? "Correct" : "Incorrect"}
              </p>
              {question ? (
                <p className="mt-1 mb-0 whitespace-pre-wrap">{question.prompt}</p>
              ) : null}
              <p className="mb-0 mt-2 text-sm">
                Correct answer: {item.correctReveal}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
