"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveFixupItemAction, setFixupOverrideAction, setFixupWindowAction } from "../staff-actions";
import { FIXUP_COPY, type FixupResult, type FixupWindow } from "@/lib/assignments/fixup";
import { formatPointsPercent } from "@/lib/assignments/grade";

export type StaffFixupPanelProps = {
  assignmentId: string;
  section?: string;
  windows: FixupWindow[];
  student?: { clerkUserId: string; result: FixupResult | null; sectionWarning?: string | null };
  labels: Record<string, string>;
};

/** Staff fix-up tools: open date per section, CSV export, approvals, override. */
export default function StaffFixupPanel(props: StaffFixupPanelProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");
  const current = props.windows.find((w) => w.assignmentId === props.assignmentId && w.section === props.section);
  const [opensAt, setOpensAt] = useState(current ? current.opensAt.slice(0, 16) : "");
  const [override, setOverride] = useState("");
  const [note, setNote] = useState("");
  const act = (fn: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      const res = await fn();
      setMessage(res.message);
      if (res.ok) router.refresh();
    });
  const result = props.student?.result ?? null;
  const exportHref = `/assignments/${props.assignmentId}/fixup-export${props.section ? `?section=${encodeURIComponent(props.section)}` : ""}`;

  return (
    <section className="my-6 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm" aria-labelledby="staff-fixup-heading">
      <h2 id="staff-fixup-heading" className="mt-0 text-lg font-semibold">Fix-up rounds (staff)</h2>
      {props.section ? (
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); act(() => setFixupWindowAction({ assignmentId: props.assignmentId, section: props.section!, opensAt: opensAt ? new Date(opensAt).toISOString() : "" })); }}>
          <label>Open date for {props.section} (closes 7 days later)
            <input type="datetime-local" className="ml-2 rounded border px-2 py-1" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
          </label>
          <button type="submit" disabled={pending} className="rounded bg-amber-700 px-3 py-1 text-white">Save</button>
          {current ? <span>Closes {new Date(new Date(current.opensAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString("en-US", { timeZone: "America/New_York" })} (ET)</span> : null}
        </form>
      ) : <p>Pick a section to set its fix-up open date.</p>}
      <p>{FIXUP_COPY.approvalsCleared}</p>
      {props.student?.sectionWarning ? <p role="alert" className="font-semibold text-red-800">{props.student.sectionWarning}</p> : null}
      <p><a href={exportHref}>Download fix-up CSV{props.section ? ` for ${props.section}` : " (all sections)"}</a></p>

      {props.student ? (
        result ? (
          <div>
            <p>
              Original {formatPointsPercent(result.originalPoints, result.maxPoints)} · regained {result.regained} · new{" "}
              {formatPointsPercent(result.newPoints, result.maxPoints)} · {result.resolved ? "ready for Canvas" : result.reasons.join("; ")}
            </p>
            <ul>
              {result.items.filter((i) => i.status !== "locked").map((item) => (
                <li key={item.criterionId}>
                  {props.labels[item.criterionId] ?? item.criterionId}: {item.originalPoints}/{item.maxPoints} → credit {item.credit} ({item.status}{item.approvedByStaff ? ", staff" : ""}; {item.reason})
                  {result.submitted ? (
                    <span className="ml-2">
                      <button type="button" disabled={pending} className="underline" onClick={() => act(() => approveFixupItemAction({ assignmentId: props.assignmentId, clerkUserId: props.student!.clerkUserId, criterionId: item.criterionId, points: item.maxPoints }))}>Approve fixed</button>{" "}
                      <button type="button" disabled={pending} className="underline" onClick={() => act(() => approveFixupItemAction({ assignmentId: props.assignmentId, clerkUserId: props.student!.clerkUserId, criterionId: item.criterionId, points: 0 }))}>Not fixed</button>{" "}
                      {item.approvedByStaff ? <button type="button" disabled={pending} className="underline" onClick={() => act(() => approveFixupItemAction({ assignmentId: props.assignmentId, clerkUserId: props.student!.clerkUserId, criterionId: item.criterionId, points: null }))}>Clear</button> : null}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); act(() => setFixupOverrideAction({ assignmentId: props.assignmentId, clerkUserId: props.student!.clerkUserId, points: override.trim() === "" ? null : Number(override), note })); }}>
              <label>Override new total <input className="ml-1 w-20 rounded border px-2 py-1" value={override} onChange={(e) => setOverride(e.target.value)} placeholder="blank clears" /></label>
              <label>Note <input className="ml-1 rounded border px-2 py-1" value={note} onChange={(e) => setNote(e.target.value)} /></label>
              <button type="submit" disabled={pending} className="rounded bg-amber-700 px-3 py-1 text-white">Save override</button>
            </form>
          </div>
        ) : <p>This student hasn&apos;t opened a fix-up round.</p>
      ) : null}
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}
