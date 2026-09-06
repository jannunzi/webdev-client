"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  describeTakeAccess,
  overrideKey,
  type QuizAccessOverrideView,
} from "@/lib/quiz-exam/access-override";
import {
  formatEasternDateTime,
  scheduleFromIso,
  type QuizScheduleIso,
  type QuizTakeOverrideMode,
} from "@/lib/quiz-exam/schedule";
import { setQuizAccessOverride } from "../override-actions";

const MODES: { id: QuizTakeOverrideMode; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
  { id: "schedule", label: "Schedule" },
];

export type OverrideQuizRow = {
  quizId: string;
  title: string;
  schedule: QuizScheduleIso;
};

export default function QuizAccessOverridePanel({
  quizzes,
  sections,
  overrides,
  now,
}: {
  quizzes: OverrideQuizRow[];
  sections: readonly string[];
  overrides: QuizAccessOverrideView[];
  now: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(overrides);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const clock = useMemo(() => new Date(now), [now]);
  const byKey = useMemo(() => {
    const map = new Map<string, QuizAccessOverrideView>();
    for (const row of rows) {
      map.set(overrideKey(row.quizId, row.sectionId), row);
    }
    return map;
  }, [rows]);

  function currentMode(quizId: string, sectionId: string): QuizTakeOverrideMode {
    return byKey.get(overrideKey(quizId, sectionId))?.mode ?? "schedule";
  }

  function setMode(quizId: string, sectionId: string, mode: QuizTakeOverrideMode) {
    const key = overrideKey(quizId, sectionId);
    const previous = byKey.get(key);
    setError(null);
    setPendingKey(key);
    setRows((current) => {
      const next = current.filter(
        (row) => !(row.quizId === quizId && row.sectionId === sectionId),
      );
      next.push({
        quizId,
        sectionId,
        mode,
        updatedAt: new Date().toISOString(),
        updatedBy: previous?.updatedBy,
      });
      return next;
    });
    startTransition(async () => {
      const result = await setQuizAccessOverride({ quizId, sectionId, mode });
      if (!result.ok) {
        setRows((current) => {
          const next = current.filter(
            (row) => !(row.quizId === quizId && row.sectionId === sectionId),
          );
          if (previous) next.push(previous);
          return next;
        });
        setError(result.message);
        setPendingKey(null);
        return;
      }
      setRows((current) => {
        const next = current.filter(
          (row) => !(row.quizId === quizId && row.sectionId === sectionId),
        );
        next.push(result.override);
        return next;
      });
      setPendingKey(null);
      router.refresh();
    });
  }

  return (
    <section
      className="mt-6 rounded-lg border border-neutral-300 bg-neutral-50 p-4"
      aria-label="Quiz take overrides"
    >
      <h2 className="mt-0 mb-1 text-lg font-semibold tracking-tight">
        Section take overrides
      </h2>
      <p className="mt-0 mb-3 text-sm text-neutral-700">
        Force one section open or closed right now. Other sections keep their
        date windows. Schedule clears the override. Practice quizzes are
        unchanged.
      </p>
      {error ? (
        <p role="alert" className="mb-3 rounded border border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        {quizzes.map((quiz) => {
          const schedule = scheduleFromIso(quiz.schedule);
          return (
            <div key={quiz.quizId}>
              <h3 className="mt-0 mb-2 text-base font-semibold">{quiz.title}</h3>
              <ul className="m-0 list-none space-y-2 p-0">
                {sections.map((sectionId) => {
                  const saved = byKey.get(overrideKey(quiz.quizId, sectionId));
                  const mode = currentMode(quiz.quizId, sectionId);
                  const effective = describeTakeAccess(schedule, mode, clock);
                  const key = overrideKey(quiz.quizId, sectionId);
                  return (
                    <li
                      key={sectionId}
                      className="rounded border border-neutral-200 bg-white px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="m-0 font-medium">{sectionId}</p>
                        <div
                          role="group"
                          aria-label={`${quiz.title} ${sectionId} take access`}
                          className="flex flex-wrap gap-1.5"
                        >
                          {MODES.map((item) => {
                            const pressed = mode === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                aria-pressed={pressed}
                                disabled={pending && pendingKey === key}
                                onClick={() => setMode(quiz.quizId, sectionId, item.id)}
                                className={`rounded border px-2.5 py-1 text-sm ${
                                  pressed
                                    ? item.id === "open"
                                      ? "border-emerald-800 bg-emerald-800 text-white"
                                      : item.id === "closed"
                                        ? "border-amber-800 bg-amber-800 text-white"
                                        : "border-neutral-800 bg-neutral-800 text-white"
                                    : "border-neutral-400 bg-white hover:bg-neutral-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <p className="mb-0 mt-1 text-xs text-neutral-600">
                        Effective:{" "}
                        <strong>
                          {effective.open ? "open" : "closed"}
                        </strong>
                        {effective.mode === "schedule"
                          ? " (schedule)"
                          : effective.mode === "open"
                            ? " (forced open)"
                            : " (forced closed)"}
                        {saved?.updatedBy || saved?.updatedAt
                          ? ` · last ${saved.updatedBy ?? "staff"} ${formatEasternDateTime(saved.updatedAt)}`
                          : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
