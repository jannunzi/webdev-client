"use client";

import { useState } from "react";
import type { AssignmentCheckResult } from "@/lib/assignments/checks";
import type { AssignmentHubItem } from "@/lib/assignments/types";
import type { AssignmentSubmissionView } from "@/lib/assignments/submissions-store";
import A1SubmissionForm, { type SubmissionGateReason } from "./A1SubmissionForm";
import AssignmentChecklist from "./AssignmentChecklist";

export default function A1WorkArea({
  assignment,
  initialSubmission,
  initialCompletedIds,
  signedIn,
  mongoReady,
  canSubmit,
  impersonating,
  gateReason,
}: {
  assignment: AssignmentHubItem;
  initialSubmission: AssignmentSubmissionView | null;
  initialCompletedIds: string[];
  signedIn: boolean;
  mongoReady: boolean;
  canSubmit: boolean;
  impersonating: boolean;
  gateReason: SubmissionGateReason;
}) {
  const [autoResults, setAutoResults] = useState<AssignmentCheckResult[]>(
    initialSubmission?.checkResults ?? [],
  );

  return (
    <>
      <A1SubmissionForm
        initialSubmission={initialSubmission}
        canSubmit={canSubmit}
        impersonating={impersonating}
        gateReason={canSubmit ? null : gateReason}
        onResults={setAutoResults}
      />
      <p className="rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans text-sm text-neutral-800">
        Canvas grades still use Best / Better / Almost / Missing. Auto-checks
        look for Chapter 1 ids on your Vercel deploy. Your own checkmarks stay
        separate.
      </p>
      <AssignmentChecklist
        assignment={assignment}
        initialCompletedIds={initialCompletedIds}
        signedIn={signedIn}
        mongoReady={mongoReady}
        autoResults={autoResults}
      />
    </>
  );
}
