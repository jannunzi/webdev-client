import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import type { AssignmentSubmitGate } from "./access";

export type SubmissionGateReason =
  | "sign_in"
  | "not_on_roster"
  | "roster_empty"
  | "not_configured"
  | null;

export type A1SubmissionFormState =
  | { mode: "fields"; gateReason: null }
  | { mode: "gate"; gateReason: Exclude<SubmissionGateReason, null> };

/**
 * URL fields render only when the student (or staff) may submit.
 * Off-roster and other misses always get an explicit message — never a
 * blank Submit URLs section.
 */
export function a1SubmissionFormState(input: {
  canSubmit: boolean;
  gateReason?: SubmissionGateReason;
}): A1SubmissionFormState {
  if (input.canSubmit) return { mode: "fields", gateReason: null };
  return {
    mode: "gate",
    gateReason: input.gateReason ?? "not_configured",
  };
}

export function gateReasonFromAccess(
  access: AssignmentSubmitGate,
): SubmissionGateReason {
  if (access.ok) return null;
  switch (access.code) {
    case "unauthenticated":
      return "sign_in";
    case "not_on_roster":
      return "not_on_roster";
    case "roster_empty":
      return "roster_empty";
    default:
      return "not_configured";
  }
}

export function submissionGateCopy(
  reason: Exclude<SubmissionGateReason, null>,
): { title: string; body: string } {
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
  }
}
