"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  adjacentQuizStaffKeys,
  filterQuizStaffQueueBySection,
  findQuizStaffStudent,
  listQuizStaffSections,
  resolveQuizStaffSectionFilter,
  staffAttemptsHref,
  type QuizStaffStudentRow,
} from "@/lib/quiz-exam/staff";
import type {
  GradedAnswer,
  QuizClassQuestionOverride,
  StudentQuestion,
} from "@/lib/quiz-exam/types";
import {
  AttemptScore,
  GradedQuestionList,
} from "../../take/components/AttemptReview";
import { saveQuizQuestionOverride } from "../actions";

export type StaffAttemptReviewView = {
  questions: StudentQuestion[];
  graded: GradedAnswer[];
  score: number;
  maxScore: number;
  submittedAt: string;
};

export default function StaffAttemptBrowser({
  quizId,
  title,
  queue,
  selectedKey,
  selectedSection,
  review,
  classOverrides,
}: {
  quizId: string;
  title: string;
  queue: QuizStaffStudentRow[];
  selectedKey?: string;
  selectedSection?: string;
  review: StaffAttemptReviewView | null;
  classOverrides: QuizClassQuestionOverride[];
}) {
  const router = useRouter();
  const sections = listQuizStaffSections(queue);
  const section = resolveQuizStaffSectionFilter(selectedSection, sections);
  const visible = filterQuizStaffQueueBySection(queue, section);
  const { previous, next, index } = adjacentQuizStaffKeys(visible, selectedKey);
  const submitted = visible.filter((row) => row.hasAttempt).length;
  const selected = findQuizStaffStudent(visible, selectedKey);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pointsByQuestion, setPointsByQuestion] = useState<Record<string, string>>(
    {},
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    setNote(null);
    setError(null);
    setPointsByQuestion(
      Object.fromEntries(
        (review?.graded ?? []).map((item) => [item.questionId, String(item.points)]),
      ),
    );
  }, [selectedKey, review?.submittedAt, review?.score]);

  function go(key: string | null, nextSection = section) {
    router.push(staffAttemptsHref(quizId, { section: nextSection, student: key }));
  }

  function onSectionChange(value: string) {
    const nextSection = value || undefined;
    const nextQueue = filterQuizStaffQueueBySection(queue, nextSection);
    const keep = findQuizStaffStudent(nextQueue, selectedKey)?.key ?? null;
    go(keep, nextSection);
  }

  function apply(input: {
    questionId: string;
    scope: "student" | "all_students";
    kind: "correct" | "wrong" | "points" | "clear";
    points?: string;
  }) {
    if (!selectedKey && input.scope === "student") return;
    if (
      input.scope === "all_students" &&
      input.kind !== "clear" &&
      !window.confirm(
        `Apply “${input.kind}” to every student who drew this question? Scores will recalculate.`,
      )
    ) {
      return;
    }
    const pending = `${input.questionId}:${input.scope}:${input.kind}`;
    setPendingId(pending);
    setError(null);
    startTransition(async () => {
      const result = await saveQuizQuestionOverride({
        quizId,
        questionId: input.questionId,
        studentKey: selectedKey ?? "",
        scope: input.scope,
        kind: input.kind,
        points: input.points,
      });
      setPendingId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setNote(
        input.scope === "all_students"
          ? `Updated ${result.updatedCount} attempt${result.updatedCount === 1 ? "" : "s"}.`
          : `Saved override. Score is now ${result.score} / ${result.maxScore}.`,
      );
      router.refresh();
    });
  }

  if (queue.length === 0) {
    return (
      <section className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Student submissions</h2>
        <p className="mb-0 text-sm text-neutral-700">
          No roster students or submitted attempts are available yet.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-sky-300 bg-sky-50 p-4 shadow-sm">
        <h2 className="mt-0 mb-1 text-lg font-semibold text-sky-950">
          Student submissions
        </h2>
        <p className="mt-0 mb-3 text-sm text-sky-950">
          {submitted} of {visible.length} students have a submitted attempt.
          {selectedKey && index >= 0
            ? ` Viewing ${index + 1} of ${visible.length}.`
            : " Select a student to review their answers."}
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[12rem] text-sm font-semibold">
            Section
            <select
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
              value={section ?? ""}
              onChange={(event) => onSectionChange(event.target.value)}
            >
              <option value="">All sections</option>
              {sections.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[16rem] flex-1 text-sm font-semibold">
            Student
            <select
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
              value={selectedKey ?? ""}
              onChange={(event) => go(event.target.value || null)}
            >
              <option value="">Select a student</option>
              {visible.map((row) => (
                <option key={row.key} value={row.key}>
                  {row.name}
                  {row.email && row.email !== row.name ? ` · ${row.email}` : ""}
                  {row.section ? ` · ${row.section}` : ""}
                  {row.hasAttempt
                    ? row.score != null
                      ? ` · ${row.score} / ${row.maxScore}`
                      : ""
                    : " · no attempt"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
            disabled={!previous}
            onClick={() => go(previous)}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
            disabled={!next}
            onClick={() => go(next)}
          >
            Next
          </button>
        </div>
      </section>

      {note ? (
        <p className="mb-0 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          {note}
        </p>
      ) : null}
      {error ? (
        <p className="mb-0 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </p>
      ) : null}

      {selected && !selected.hasAttempt ? (
        <p className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {selected.name} has not submitted this quiz yet.
        </p>
      ) : null}

      {selected && selected.hasAttempt && !review ? (
        <p className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          An attempt is stored, but the drawn questions could not be rebuilt
          from the bank.
        </p>
      ) : null}

      {review ? (
        <>
          <AttemptScore
            title={`${title} — ${selected?.name ?? "Student"}`}
            score={review.score}
            maxScore={review.maxScore}
            submittedAt={review.submittedAt}
          />
          <p className="mb-0 text-sm text-neutral-700">
            Preview matches the student review (correct / wrong / partial), with
            staff override controls under each question.
          </p>
          <GradedQuestionList
            questions={review.questions}
            graded={review.graded}
            revealAnswers
            showGroupTitle
            renderExtra={(item) => {
              const classWide = classOverrides.find(
                (row) => row.questionId === item.questionId,
              );
              const busy = pendingId?.startsWith(`${item.questionId}:`) ?? false;
              return (
                <div className="mt-3 rounded border border-neutral-300 bg-white px-3 py-3">
                  <p className="m-0 text-sm font-semibold text-neutral-800">
                    Staff override
                    {item.override
                      ? ` — ${item.override.scope === "student" ? "this student" : "all students"} (${item.override.kind})`
                      : " — auto-grade"}
                  </p>
                  {classWide ? (
                    <p className="mb-0 mt-1 text-xs text-neutral-600">
                      Class-wide mark: {classWide.kind}
                      {classWide.updatedBy ? ` · ${classWide.updatedBy}` : ""}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-neutral-800 bg-white px-2 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50"
                      disabled={busy}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "student",
                          kind: "correct",
                        })
                      }
                    >
                      Mark correct
                    </button>
                    <button
                      type="button"
                      className="rounded border border-neutral-800 bg-white px-2 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50"
                      disabled={busy}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "student",
                          kind: "wrong",
                        })
                      }
                    >
                      Mark wrong
                    </button>
                    <button
                      type="button"
                      className="rounded border border-neutral-800 bg-white px-2 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50"
                      disabled={busy || item.override?.scope !== "student"}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "student",
                          kind: "clear",
                        })
                      }
                    >
                      Clear student override
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <label className="text-sm">
                      Custom points
                      <input
                        type="number"
                        min={0}
                        max={item.maxPoints}
                        step="0.25"
                        className="mt-1 w-24 rounded border border-neutral-400 px-2 py-1"
                        value={pointsByQuestion[item.questionId] ?? String(item.points)}
                        onChange={(event) =>
                          setPointsByQuestion((current) => ({
                            ...current,
                            [item.questionId]: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="rounded border border-neutral-800 bg-neutral-800 px-2 py-1 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
                      disabled={busy}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "student",
                          kind: "points",
                          points: pointsByQuestion[item.questionId],
                        })
                      }
                    >
                      Save points
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-sky-800 bg-sky-50 px-2 py-1 text-sm text-sky-950 hover:bg-sky-100 disabled:opacity-50"
                      disabled={busy}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "all_students",
                          kind: "correct",
                        })
                      }
                    >
                      Correct for all students
                    </button>
                    <button
                      type="button"
                      className="rounded border border-sky-800 bg-sky-50 px-2 py-1 text-sm text-sky-950 hover:bg-sky-100 disabled:opacity-50"
                      disabled={busy}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "all_students",
                          kind: "wrong",
                        })
                      }
                    >
                      Wrong for all students
                    </button>
                    <button
                      type="button"
                      className="rounded border border-sky-800 bg-white px-2 py-1 text-sm text-sky-950 hover:bg-sky-50 disabled:opacity-50"
                      disabled={busy || !classWide}
                      onClick={() =>
                        apply({
                          questionId: item.questionId,
                          scope: "all_students",
                          kind: "clear",
                        })
                      }
                    >
                      Clear class-wide
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </>
      ) : null}
    </div>
  );
}
