"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import ClerkAuthBar from "@/app/quizzes/components/ClerkAuthBar";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";
import type { QueueLineItem, QueueView } from "@/lib/office-hours/queue";
import {
  closeQueueAction,
  doneQueueAction,
  joinQueueAction,
  leaveQueueAction,
  openQueueAction,
  removeQueueAction,
  reorderQueueAction,
  serveQueueAction,
} from "../../queue-actions";

function statusLabel(status: QueueLineItem["status"]): string {
  if (status === "serving") return "Now serving";
  if (status === "waiting") return "Waiting";
  return status;
}

function LineList({
  line,
  staff,
  busy,
  onServe,
  onDone,
  onRemove,
  onMove,
}: {
  line: QueueLineItem[];
  staff: boolean;
  busy: boolean;
  onServe?: (id: string) => void;
  onDone?: (id: string) => void;
  onRemove?: (id: string) => void;
  onMove?: (id: string, direction: "up" | "down") => void;
}) {
  if (line.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-700">
        No one is in line right now.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {line.map((item, index) => (
        <li
          key={item.id}
          className={
            item.status === "serving"
              ? "rounded-lg border-2 border-emerald-700 bg-emerald-50 px-3 py-2"
              : "rounded-lg border border-neutral-200 bg-white px-3 py-2"
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="mb-0 font-sans text-sm font-semibold">
                {item.position}. {item.displayName}
                {item.isYou ? " (you)" : ""}
              </p>
              <p className="mb-0 text-sm text-neutral-600">
                {statusLabel(item.status)}
                {staff && item.studentEmail ? ` · ${item.studentEmail}` : ""}
              </p>
            </div>
            {staff ? (
              <div className="flex flex-wrap gap-1.5 font-sans text-sm">
                {item.status === "waiting" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onServe?.(item.id)}
                    className="rounded border border-neutral-800 bg-neutral-800 px-2 py-1 text-white hover:bg-neutral-700 disabled:opacity-50"
                  >
                    Now serving
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onDone?.(item.id)}
                  className="rounded border border-neutral-400 bg-white px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Done
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRemove?.(item.id)}
                  className="rounded border border-neutral-400 bg-white px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Remove
                </button>
                {item.status === "waiting" ? (
                  <>
                    <button
                      type="button"
                      disabled={busy || index === 0}
                      onClick={() => onMove?.(item.id, "up")}
                      className="rounded border border-neutral-400 bg-white px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={busy || index === line.length - 1}
                      onClick={() => onMove?.(item.id, "down")}
                      className="rounded border border-neutral-400 bg-white px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Down
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function QueueClient({
  taId,
  taName,
  sectionId,
  sectionLabel,
  hoursSummary,
  teams,
  initialView,
  canJoin,
  canManage,
  joinBlockedReason,
  showAuthBar,
  preview,
}: {
  taId: string;
  taName: string;
  sectionId: string;
  sectionLabel: string;
  hoursSummary: string;
  teams?: string;
  initialView: QueueView;
  canJoin: boolean;
  canManage: boolean;
  joinBlockedReason?: string;
  showAuthBar: boolean;
  preview?: boolean;
}) {
  const [view, setView] = useState(initialView);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    if (preview) return;
    const response = await fetch(
      `/api/office-hours/queue/${encodeURIComponent(taId)}?section=${encodeURIComponent(sectionId)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return;
    const data = (await response.json()) as { ok?: boolean; view?: QueueView };
    if (data.ok && data.view) setView(data.view);
  }, [preview, sectionId, taId]);

  useEffect(() => {
    if (preview) return;
    const id = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => window.clearInterval(id);
  }, [preview, refresh]);

  function run(
    action: () => Promise<{ ok: true; view: QueueView } | { ok: false; message: string }>,
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setView(result.view);
        setError(null);
        return;
      }
      setError(result.message);
    });
  }

  const inLine = Boolean(view.myEntryId);

  return (
    <div className="space-y-5 font-sans">
      {showAuthBar ? (
        <ClerkAuthBar
          title="Office-hour line"
          fallbackRedirect={`/office-hours/queue/${taId}?section=${sectionId}`}
          signInLabel={COURSE_WEBSITE_ACCOUNT_COPY.signInWithCanvasEmail}
          signUpLabel={COURSE_WEBSITE_ACCOUNT_COPY.signUpWithCanvasEmail}
          hint={COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint}
        />
      ) : null}

      <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
        This is a live walk-up / Microsoft Teams check-in line so everyone can
        see who is next. It is not a calendar booking tool. Approximate wait is
        ~10 minutes × your position.
      </p>

      <header>
        <p className="mb-1 text-sm text-neutral-600">{sectionLabel}</p>
        <h2 className="mt-0 mb-1 text-2xl font-semibold tracking-tight">
          {taName}
        </h2>
        <p className="mb-0 text-sm text-neutral-700">{hoursSummary}</p>
        {teams ? (
          <p className="mb-0 mt-1 text-sm text-neutral-700">Teams: {teams}</p>
        ) : null}
      </header>

      <p
        className={
          view.open
            ? "rounded-md border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm text-emerald-950"
            : "rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-950"
        }
      >
        {view.open
          ? "The line is open. Join if you are here for office hours."
          : "The line is closed. The TA opens it at the start of office hours."}
      </p>

      {view.myPosition != null ? (
        <p className="rounded-md border border-neutral-800 bg-white px-3 py-2 text-sm">
          You are <strong>#{view.myPosition}</strong> in line. Estimated wait
          about <strong>{view.myEstimateMinutes} minutes</strong> (rough
          estimate).
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-950">
          {error}
        </p>
      ) : null}

      {canManage ? (
        <div className="flex flex-wrap gap-2">
          {view.open ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(() => closeQueueAction({ taId, sectionId }))
              }
              className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
            >
              Close session
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => openQueueAction({ taId, sectionId }))}
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              Open session
            </button>
          )}
        </div>
      ) : null}

      {canJoin ? (
        <div className="flex flex-wrap gap-2">
          {inLine ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => leaveQueueAction({ taId, sectionId }))}
              className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
            >
              Leave line
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || !view.open}
              onClick={() => run(() => joinQueueAction({ taId, sectionId }))}
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              Join line
            </button>
          )}
        </div>
      ) : joinBlockedReason ? (
        <p className="text-sm text-neutral-700">{joinBlockedReason}</p>
      ) : null}

      <section aria-labelledby="live-line-heading">
        <h3
          id="live-line-heading"
          className="mb-2 text-lg font-semibold tracking-tight"
        >
          Live line
        </h3>
        <LineList
          line={view.line}
          staff={canManage}
          busy={pending}
          onServe={(entryId) =>
            run(() => serveQueueAction({ taId, sectionId, entryId }))
          }
          onDone={(entryId) =>
            run(() => doneQueueAction({ taId, sectionId, entryId }))
          }
          onRemove={(entryId) =>
            run(() => removeQueueAction({ taId, sectionId, entryId }))
          }
          onMove={(entryId, direction) =>
            run(() =>
              reorderQueueAction({ taId, sectionId, entryId, direction }),
            )
          }
        />
      </section>
    </div>
  );
}
