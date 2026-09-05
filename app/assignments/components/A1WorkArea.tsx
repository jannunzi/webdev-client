"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import {
  proposedGradeFromResults,
  type CriterionPassMap,
} from "@/lib/assignments/grade";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";
import type { StaffStudentRow } from "@/lib/assignments/staff";
import type { AssignmentHubItem } from "@/lib/assignments/types";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import { saveStaffAssignmentGrade } from "../staff-actions";
import A1SubmissionForm, { type SubmissionGateReason } from "./A1SubmissionForm";
import AssignmentChecklist from "./AssignmentChecklist";
import AssignmentGradeSummary from "./AssignmentGradeSummary";
import StaffGraderNav from "./StaffGraderNav";

export default function A1WorkArea({
  assignment,
  initialSubmission,
  initialCompletedIds,
  signedIn,
  mongoReady,
  canSubmit,
  impersonating,
  gateReason,
  staffQueue,
  selectedStudent,
}: {
  assignment: AssignmentHubItem;
  initialSubmission: AssignmentSubmissionView | null;
  initialCompletedIds: string[];
  signedIn: boolean;
  mongoReady: boolean;
  canSubmit: boolean;
  impersonating: boolean;
  gateReason: SubmissionGateReason;
  staffQueue?: StaffStudentRow[];
  selectedStudent?: StaffStudentRow | null;
}) {
  const staffMode = Boolean(selectedStudent);
  const [submission, setSubmission] = useState<AssignmentSubmissionView | null>(
    initialSubmission,
  );
  const [autoResults, setAutoResults] = useState<AssignmentCheckResult[]>(
    initialSubmission?.checkResults ?? [],
  );
  const [overrides, setOverrides] = useState<CriterionPassMap>(
    initialSubmission?.staffGrade?.criterionOverrides ?? {},
  );
  const [comments, setComments] = useState<Record<string, string>>(
    initialSubmission?.staffGrade?.comments ?? {},
  );
  const [gradeNote, setGradeNote] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [pendingGrade, setPendingGrade] = useState<"accept" | "override" | null>(
    null,
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    setSubmission(initialSubmission);
    setAutoResults(initialSubmission?.checkResults ?? []);
    setOverrides(initialSubmission?.staffGrade?.criterionOverrides ?? {});
    setComments(initialSubmission?.staffGrade?.comments ?? {});
    setGradeNote(null);
    setGradeError(null);
  }, [initialSubmission, selectedStudent?.key]);

  const proposed = useMemo(() => {
    if (!assignment.rubric || autoResults.length === 0) return null;
    return proposedGradeFromResults(assignment.rubric, autoResults);
  }, [assignment.rubric, autoResults]);

  const staffGrade = useMemo(() => {
    const saved = submission?.staffGrade;
    if (!saved) return null;
    return {
      earnedPoints: saved.earnedPoints,
      totalPoints: saved.totalPoints,
      percent: saved.percent,
      passedCount: 0,
      totalCount: 0,
      passedIds: [],
    };
  }, [submission]);

  function onStaffOverride(criterionId: string, passed: boolean | null) {
    setOverrides((current) => {
      const next = { ...current };
      if (passed == null) delete next[criterionId];
      else next[criterionId] = passed;
      return next;
    });
  }

  function onStaffComment(criterionId: string, comment: string) {
    setComments((current) => ({ ...current, [criterionId]: comment }));
  }

  function persistGrade(acceptProposed: boolean) {
    if (!selectedStudent) return;
    setPendingGrade(acceptProposed ? "accept" : "override");
    setGradeError(null);
    startTransition(async () => {
      const result = await saveStaffAssignmentGrade({
        assignmentId: assignment.id,
        studentKey: selectedStudent.key,
        acceptProposed,
        overrides: acceptProposed ? undefined : overrides,
        comments,
      });
      setPendingGrade(null);
      if (!result.ok) {
        setGradeError(result.message);
        return;
      }
      setSubmission(result.submission);
      setAutoResults(result.submission.checkResults ?? autoResults);
      setOverrides(result.submission.staffGrade?.criterionOverrides ?? {});
      setComments(result.submission.staffGrade?.comments ?? comments);
      setGradeNote(
        result.persisted
          ? acceptProposed
            ? "Accepted the proposed grade."
            : "Saved the override grade and comments."
          : ASSIGNMENT_STUDENT_COPY.savedButNotPersisted,
      );
    });
  }

  return (
    <>
      {staffQueue ? (
        <StaffGraderNav
          assignmentId={assignment.id}
          queue={staffQueue}
          selectedKey={selectedStudent?.key}
        />
      ) : null}

      {staffMode && selectedStudent && !selectedStudent.hasSubmission ? (
        <p className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          {ASSIGNMENT_STUDENT_COPY.noSubmission}
        </p>
      ) : (
        <A1SubmissionForm
          initialSubmission={submission}
          canSubmit={canSubmit || staffMode}
          impersonating={impersonating}
          gateReason={canSubmit || staffMode ? null : gateReason}
          staffStudentKey={selectedStudent?.key}
          onResults={setAutoResults}
          onSubmission={(next) => {
            setSubmission(next);
            setOverrides(next.staffGrade?.criterionOverrides ?? overrides);
            setComments(next.staffGrade?.comments ?? comments);
          }}
        />
      )}

      <AssignmentGradeSummary proposed={proposed} staff={staffGrade} />

      {staffMode && selectedStudent?.hasSubmission ? (
        <div className="mb-6 rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans">
          <p className="mt-0 mb-2 text-sm text-neutral-800">
            Accept the proposed all-or-nothing total, or save per-criterion
            overrides and comments. Students see the staff grade and comments
            as read-only.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
              disabled={pendingGrade !== null || !proposed}
              onClick={() => persistGrade(true)}
            >
              {pendingGrade === "accept"
                ? "Saving…"
                : ASSIGNMENT_STUDENT_COPY.acceptProposed}
            </button>
            <button
              type="button"
              className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-60"
              disabled={pendingGrade !== null}
              onClick={() => persistGrade(false)}
            >
              {pendingGrade === "override"
                ? "Saving…"
                : ASSIGNMENT_STUDENT_COPY.overrideGrade}
            </button>
          </div>
          {gradeNote ? (
            <p className="mb-0 mt-2 text-sm text-emerald-800">{gradeNote}</p>
          ) : null}
          {gradeError ? (
            <p className="mb-0 mt-2 text-sm text-amber-800">{gradeError}</p>
          ) : null}
        </div>
      ) : null}

      <AssignmentChecklist
        assignment={assignment}
        initialCompletedIds={
          staffMode ? autoPassedCriterionIdsOrEmpty(autoResults) : initialCompletedIds
        }
        signedIn={signedIn}
        mongoReady={mongoReady}
        autoResults={autoResults}
        vercelUrl={submission?.vercelUrl}
        persistProgress={!staffMode}
        staffMode={staffMode}
        staffOverrides={staffMode ? overrides : {}}
        staffComments={comments}
        onStaffOverride={staffMode ? onStaffOverride : undefined}
        onStaffComment={staffMode ? onStaffComment : undefined}
      />
    </>
  );
}

function autoPassedCriterionIdsOrEmpty(
  results: AssignmentCheckResult[],
): string[] {
  return results
    .filter((row) => row.criterionId && row.passed && !row.skipped)
    .map((row) => row.criterionId as string);
}
