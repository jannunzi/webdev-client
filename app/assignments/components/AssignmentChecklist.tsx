"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import Link from "next/link";
import type { AssignmentHubItem } from "@/lib/assignments/types";
import {
  applyCriterionToggle,
  localProgressKey,
  parseLocalProgress,
  summarizeProgress,
} from "@/lib/assignments/progress-store";
import {
  readMergedProgress,
  serverProgressSnapshot,
  subscribeLocalProgress,
  writeLocalProgress,
} from "@/lib/assignments/local-progress";
import { mergeLocalProgress, setCriterionCompleted } from "../actions";

export default function AssignmentChecklist({
  assignment,
  initialCompletedIds,
  signedIn,
  mongoReady,
}: {
  assignment: AssignmentHubItem;
  initialCompletedIds: string[];
  signedIn: boolean;
  mongoReady: boolean;
}) {
  const serverIds = useMemo(
    () => serverProgressSnapshot(initialCompletedIds),
    [initialCompletedIds],
  );
  const completedIds = useSyncExternalStore(
    subscribeLocalProgress,
    () => readMergedProgress(assignment.id, serverIds),
    () => serverIds,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rubric = assignment.rubric;
  const totals = useMemo(
    () => summarizeProgress(assignment, completedIds),
    [assignment, completedIds],
  );

  useEffect(() => {
    if (!rubric || !signedIn || !mongoReady) return;
    const local = parseLocalProgress(
      window.localStorage.getItem(localProgressKey(assignment.id)),
    );
    if (local.length === 0) return;
    startTransition(async () => {
      const result = await mergeLocalProgress({
        assignmentId: assignment.id,
        completedCriterionIds: local,
      });
      if (result.ok) {
        writeLocalProgress(assignment.id, result.completedCriterionIds);
      }
    });
  }, [assignment.id, mongoReady, rubric, signedIn, startTransition]);

  if (!rubric) return null;

  function onToggle(criterionId: string, completed: boolean) {
    const previous = completedIds;
    const next = applyCriterionToggle(completedIds, criterionId, completed);
    writeLocalProgress(assignment.id, next);
    setSyncNote(null);

    if (!signedIn || !mongoReady) {
      return;
    }

    setPendingId(criterionId);
    startTransition(async () => {
      const result = await setCriterionCompleted({
        assignmentId: assignment.id,
        criterionId,
        completed,
      });
      setPendingId(null);
      if (result.ok) {
        writeLocalProgress(assignment.id, result.completedCriterionIds);
        return;
      }
      writeLocalProgress(assignment.id, previous);
      setSyncNote(
        result.code === "unauthenticated"
          ? "Sign in with your school email to sync progress."
          : "Could not sync that checkmark. It is still saved in this browser.",
      );
    });
  }

  return (
    <div>
      <div className="mb-4 rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans shadow-sm">
        <p className="m-0 text-base font-semibold tracking-tight">
          {totals.completedCount} of {totals.totalCount} items ·{" "}
          {totals.earnedPoints} / {totals.totalPoints} pts
        </p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totals.totalCount}
          aria-valuenow={totals.completedCount}
          aria-label="Assignment checklist progress"
        >
          <div
            className="h-full rounded-full bg-emerald-600"
            style={{
              width:
                totals.totalCount === 0
                  ? "0%"
                  : `${Math.round((totals.completedCount / totals.totalCount) * 100)}%`,
            }}
          />
        </div>
        <p className="mb-0 mt-2 text-sm text-neutral-700">
          {signedIn && mongoReady
            ? "Checkmarks sync to your signed-in account."
            : signedIn
              ? "Checkmarks stay in this browser until progress sync is available."
              : "Checkmarks stay in this browser. Sign in with your school email to sync across devices."}
        </p>
        {syncNote ? (
          <p className="mb-0 mt-2 text-sm text-amber-800">{syncNote}</p>
        ) : null}
      </div>

      {rubric.groups.map((group) => {
        const groupCompleted = group.criteria.filter((row) =>
          completedIds.includes(row.id),
        ).length;
        const groupPoints = group.criteria.reduce(
          (sum, row) => sum + row.points,
          0,
        );
        return (
          <section
            key={group.id}
            className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
          >
            <h2 className="mt-0 mb-1 font-sans text-xl font-semibold tracking-tight">
              {group.title}
            </h2>
            <p className="mt-0 mb-3 font-sans text-sm text-neutral-600">
              {groupCompleted} / {group.criteria.length} · {groupPoints} pts
            </p>
            {group.intro ? <p className="mt-0 text-neutral-800">{group.intro}</p> : null}
            <ul className="m-0 list-none space-y-3 p-0">
              {group.criteria.map((row) => {
                const checked = completedIds.includes(row.id);
                const inputId = `criterion-${row.id}`;
                return (
                  <li
                    key={row.id}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        id={inputId}
                        type="checkbox"
                        className="mt-1 size-4 accent-emerald-700"
                        checked={checked}
                        disabled={pendingId === row.id}
                        onChange={(event) =>
                          onToggle(row.id, event.target.checked)
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor={inputId}
                          className="font-sans text-base font-semibold"
                        >
                          {row.label}
                          {row.onYourOwn ? (
                            <span className="ml-2 font-sans text-xs font-medium uppercase tracking-wide text-amber-800">
                              On your own
                            </span>
                          ) : null}
                        </label>
                        <p className="mb-1 mt-1 text-sm text-neutral-800">
                          {row.description}
                        </p>
                        <p className="mb-0 font-sans text-sm text-neutral-600">
                          <span className="font-medium text-neutral-900">
                            {row.points} pts
                          </span>
                          {row.bookHref ? (
                            <>
                              {" · "}
                              <Link href={row.bookHref}>
                                {row.bookLabel ?? "Book section"}
                              </Link>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
