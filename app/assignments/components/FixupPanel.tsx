"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { openFixupRoundAction, submitFixupAction } from "../submission-actions";
import { FIXUP_COPY, type FixupResult, type FixupWindowState } from "@/lib/assignments/fixup";
import { formatPointsPercent } from "@/lib/assignments/grade";

export type FixupPanelProps = {
  assignmentId: string;
  window: FixupWindowState;
  result: FixupResult | null;
  labels: Record<string, string>;
  githubUrl: string;
  vercelUrl: string;
};

const STATUS_TEXT: Record<string, string> = {
  fixed: "Fixed (half credit)",
  not_fixed: "Not fixed yet",
  pending_staff: "Waiting for staff review",
  not_submitted: "Can be fixed",
};

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
}

/** Student fix-up round. Rendered only when the feature flag is on. */
export default function FixupPanel(props: FixupPanelProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");
  const [githubUrl, setGithubUrl] = useState(props.githubUrl);
  const [vercelUrl, setVercelUrl] = useState(props.vercelUrl);
  const { window: w, result } = props;
  if (w.status === "none" && !result) return null;
  const open = w.status === "open";
  const fixable = result?.items.filter((item) => item.status !== "locked") ?? [];

  const act = (fn: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      const res = await fn();
      setMessage(res.message);
      if (res.ok) router.refresh();
    });

  return (
    <section className="my-6 rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950" aria-labelledby="fixup-heading">
      <h2 id="fixup-heading" className="mt-0 text-lg font-semibold">Fix-up round</h2>
      <p>
        Fix items you lost points on and earn back half of those points. Items you got full credit on stay
        locked, so your score can&apos;t go down. You get one round per assignment.
      </p>
      <p>{FIXUP_COPY.approvalsCleared}</p>
      {"closesAt" in w ? (
        <p>
          {w.status === "not_open" ? `Opens ${when(w.opensAt)}. ` : null}
          {open ? `Open until ${when(w.closesAt)}.` : null}
          {w.status === "closed" ? `Closed ${when(w.closesAt)}.` : null}
          {w.status === "superseded" ? "Fix-ups are only open for the most recently graded assignment." : null}
        </p>
      ) : null}

      {!result && open ? (
        <button type="button" disabled={pending} className="rounded bg-amber-700 px-3 py-1.5 font-semibold text-white" onClick={() => act(() => openFixupRoundAction({ assignmentId: props.assignmentId }))}>
          Start my fix-up round
        </button>
      ) : null}

      {result ? (
        <>
          <p>
            <span className="font-semibold">Original score:</span> {formatPointsPercent(result.originalPoints, result.maxPoints)}
            {result.submitted ? (
              <>
                {" · "}
                <span className="font-semibold">After fix-up:</span>{" "}
                {result.resolved ? formatPointsPercent(result.newPoints, result.maxPoints) : `${result.newPoints} / ${result.maxPoints} so far (waiting for staff review)`}
              </>
            ) : null}
          </p>
          {!result.submitted && result.resolved ? <p>No fix-up was submitted, so your original grade stands.</p> : null}
          {result.source === "override" ? <p>Your fix-up score was set by course staff.</p> : null}
          <table className="w-full text-left">
            <thead>
              <tr><th>Item</th><th>Original</th><th>Fix-up credit</th><th>Status</th></tr>
            </thead>
            <tbody>
              {fixable.map((item) => (
                <tr key={item.criterionId}>
                  <td>{props.labels[item.criterionId] ?? item.criterionId}</td>
                  <td>{item.originalPoints} / {item.maxPoints}</td>
                  <td>{item.credit}</td>
                  <td>{STATUS_TEXT[item.status] ?? item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {open ? (
            <form
              className="mt-3 grid gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                act(() => submitFixupAction({ assignmentId: props.assignmentId, githubUrl, vercelUrl }));
              }}
            >
              <label>GitHub URL <input className="w-full rounded border px-2 py-1" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} /></label>
              <label>Vercel URL <input className="w-full rounded border px-2 py-1" value={vercelUrl} onChange={(e) => setVercelUrl(e.target.value)} /></label>
              <button type="submit" disabled={pending} className="w-fit rounded bg-amber-700 px-3 py-1.5 font-semibold text-white">
                {pending ? "Checking…" : result.submitted ? "Re-submit fix-up" : "Submit fix-up"}
              </button>
            </form>
          ) : null}
        </>
      ) : null}
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}
