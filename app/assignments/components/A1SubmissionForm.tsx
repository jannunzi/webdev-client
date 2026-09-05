"use client";

import { useState, useTransition } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import {
  runAssignmentChecks,
  saveAssignmentSubmission,
} from "../submission-actions";
import { runStaffAssignmentChecks } from "../staff-actions";

export type SubmissionGateReason =
  | "sign_in"
  | "not_on_roster"
  | "roster_empty"
  | "not_configured"
  | null;

function gateCopy(reason: SubmissionGateReason): { title: string; body: string } {
  switch (reason) {
    case "sign_in":
      return {
        title: "Sign in to submit URLs",
        body: ASSIGNMENT_STUDENT_COPY.signInHint,
      };
    case "not_on_roster":
      return {
        title: ASSIGNMENT_STUDENT_COPY.notOnRosterTitle,
        body: ASSIGNMENT_STUDENT_COPY.notOnRoster,
      };
    case "roster_empty":
      return {
        title: "Course roster has not been loaded",
        body: ASSIGNMENT_STUDENT_COPY.rosterEmpty,
      };
    case "not_configured":
      return {
        title: "URL submit is not available yet",
        body: ASSIGNMENT_STUDENT_COPY.notConfigured,
      };
    default:
      return { title: "", body: "" };
  }
}

function formatSavedAt(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
}

export default function A1SubmissionForm({
  initialSubmission,
  canSubmit,
  impersonating = false,
  gateReason = null,
  staffStudentKey,
  onResults,
  onSubmission,
}: {
  initialSubmission: AssignmentSubmissionView | null;
  canSubmit: boolean;
  impersonating?: boolean;
  gateReason?: SubmissionGateReason;
  staffStudentKey?: string;
  onResults?: (results: AssignmentCheckResult[]) => void;
  onSubmission?: (submission: AssignmentSubmissionView) => void;
}) {
  const [githubUrl, setGithubUrl] = useState(initialSubmission?.githubUrl ?? "");
  const [vercelUrl, setVercelUrl] = useState(initialSubmission?.vercelUrl ?? "");
  const [submission, setSubmission] = useState(initialSubmission);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"save" | "check" | null>(
    null,
  );
  const [, startTransition] = useTransition();
  const staffReview = Boolean(staffStudentKey);

  const savedAt = formatSavedAt(submission?.updatedAt);
  const checkedAt = formatSavedAt(submission?.lastCheckedAt);

  function applyResult(
    result:
      | Awaited<ReturnType<typeof saveAssignmentSubmission>>
      | Awaited<ReturnType<typeof runStaffAssignmentChecks>>,
    kind: "save" | "check",
  ) {
    if (!result.ok) {
      setError(result.message);
      setNote(null);
      return;
    }
    setError(null);
    setGithubUrl(result.submission.githubUrl);
    setVercelUrl(result.submission.vercelUrl);
    setSubmission(result.submission);
    onResults?.(result.submission.checkResults ?? []);
    onSubmission?.(result.submission);
    if (result.impersonation || !result.persisted) {
      setNote(ASSIGNMENT_STUDENT_COPY.savedButNotPersisted);
    } else {
      setNote(
        kind === "save"
          ? ASSIGNMENT_STUDENT_COPY.saved
          : "Checks finished. Pass/fail colors are on the checklist below.",
      );
    }
  }

  function onSave() {
    setPendingAction("save");
    setError(null);
    startTransition(async () => {
      const result = await saveAssignmentSubmission({
        assignmentId: "a1",
        githubUrl,
        vercelUrl,
      });
      applyResult(result, "save");
      setPendingAction(null);
    });
  }

  function onRunChecks() {
    setPendingAction("check");
    setError(null);
    startTransition(async () => {
      const result = staffStudentKey
        ? await runStaffAssignmentChecks({
            assignmentId: "a1",
            studentKey: staffStudentKey,
            githubUrl,
            vercelUrl,
          })
        : await runAssignmentChecks({
            assignmentId: "a1",
            githubUrl,
            vercelUrl,
          });
      applyResult(result, "check");
      setPendingAction(null);
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
      <h2 className="mt-0 mb-1 font-sans text-xl font-semibold tracking-tight">
        {staffReview ? "Student URLs" : "Submit URLs"}
      </h2>
      <p className="mt-0 text-neutral-800">
        {ASSIGNMENT_STUDENT_COPY.checkInstructions}
      </p>

      {impersonating ? (
        <p className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          {ASSIGNMENT_STUDENT_COPY.impersonationBanner}
        </p>
      ) : null}

      {!canSubmit && gateReason ? (
        <div className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          <p className="m-0 font-semibold">{gateCopy(gateReason).title}</p>
          <p className="mb-0 mt-1">{gateCopy(gateReason).body}</p>
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (staffReview) onRunChecks();
            else onSave();
          }}
        >
          <div>
            <label
              htmlFor="a1-github-url"
              className="font-sans text-sm font-semibold"
            >
              Public GitHub repository URL (optional)
            </label>
            <input
              id="a1-github-url"
              name="githubUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://github.com/yourname/webdev-client"
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-sans text-sm"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              disabled={pendingAction !== null}
            />
            {githubUrl ? (
              <p className="mb-0 mt-1 font-sans text-sm">
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  Open GitHub
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="a1-vercel-url"
              className="font-sans text-sm font-semibold"
            >
              Public Vercel deployment URL
            </label>
            <input
              id="a1-vercel-url"
              name="vercelUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://your-app.vercel.app"
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-sans text-sm"
              value={vercelUrl}
              onChange={(event) => setVercelUrl(event.target.value)}
              disabled={pendingAction !== null}
            />
            {vercelUrl ? (
              <p className="mb-0 mt-1 font-sans text-sm">
                <a href={vercelUrl} target="_blank" rel="noreferrer">
                  Open Vercel deploy
                </a>
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {staffReview ? null : (
              <button
                type="submit"
                className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
                disabled={pendingAction !== null}
              >
                {pendingAction === "save" ? "Saving…" : "Save URLs and run checks"}
              </button>
            )}
            <button
              type={staffReview ? "submit" : "button"}
              className={
                staffReview
                  ? "rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
                  : "rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm hover:bg-neutral-50 disabled:opacity-60"
              }
              disabled={pendingAction !== null}
              onClick={staffReview ? undefined : onRunChecks}
            >
              {pendingAction === "check" ? "Checking…" : "Run checks"}
            </button>
          </div>
        </form>
      )}

      {savedAt ? (
        <p className="mb-1 mt-3 font-sans text-sm text-neutral-700">
          Last saved {savedAt}
          {checkedAt ? ` · Last checked ${checkedAt}` : null}
        </p>
      ) : null}
      {note ? (
        <p className="mb-2 mt-2 font-sans text-sm text-emerald-800">{note}</p>
      ) : null}
      {error ? (
        <p className="mb-2 mt-2 font-sans text-sm text-amber-800">{error}</p>
      ) : null}
    </section>
  );
}
