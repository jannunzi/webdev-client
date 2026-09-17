import { NORTHEASTERN_EMAIL_DOMAINS } from "../roster/emails";
import type { RosterLookupResult } from "../roster/types";
import { assignmentSubmitAccess } from "./access";
import {
  resolveA1SubmitVisibility,
  type SubmissionGateReason,
} from "./submission-form";

export type A1GateDiagnostics = {
  signedIn: boolean;
  mongoConfigured: boolean;
  assignmentConfigured: boolean;
  clerkEmailCount: number;
  clerkEmails: string[];
  hasNortheasternEmail: boolean;
  rosterStatus: RosterLookupResult["status"];
  rosterEmail?: string;
  rosterSource?: string;
  rosterDb: string;
  rosterCollection: string;
  rosterCount: number | null;
  canSubmit: boolean;
  gateReason: SubmissionGateReason;
  accessBypass: "staff" | "matched" | null;
};

function hasNortheasternMailbox(emails: readonly string[]): boolean {
  return emails.some((email) =>
    NORTHEASTERN_EMAIL_DOMAINS.some((domain) =>
      email.endsWith(`@${domain}`),
    ),
  );
}

/**
 * Staff-only A1 gate breakdown. Distinguishes “Mongo env missing”
 * (Ada still works via the built-in demo match) from “signed-in email
 * is not on canvas_roster.”
 */
export function buildA1GateDiagnostics(input: {
  assignmentId: string;
  signedIn: boolean;
  mongoConfigured: boolean;
  assignmentConfigured: boolean;
  isActualStaff: boolean;
  clerkEmails: string[];
  roster: RosterLookupResult;
  rosterDb: string;
  rosterCollection: string;
  rosterCount: number | null;
}): A1GateDiagnostics {
  const access = assignmentSubmitAccess({
    signedIn: input.signedIn,
    configured: input.assignmentConfigured,
    isActualStaff: input.isActualStaff,
    roster: input.roster,
  });
  const visibility = resolveA1SubmitVisibility({
    assignmentId: input.assignmentId,
    access,
  });
  const matched =
    input.roster.status === "matched" ? input.roster.entry : undefined;
  return {
    signedIn: input.signedIn,
    mongoConfigured: input.mongoConfigured,
    assignmentConfigured: input.assignmentConfigured,
    clerkEmailCount: input.clerkEmails.length,
    clerkEmails: [...input.clerkEmails],
    hasNortheasternEmail: hasNortheasternMailbox(input.clerkEmails),
    rosterStatus: input.roster.status,
    rosterEmail: matched?.email,
    rosterSource: matched?.source,
    rosterDb: input.rosterDb,
    rosterCollection: input.rosterCollection,
    rosterCount: input.rosterCount,
    canSubmit: visibility.canSubmit,
    gateReason: visibility.gateReason,
    accessBypass: input.isActualStaff
      ? "staff"
      : input.roster.status === "matched"
        ? "matched"
        : null,
  };
}
