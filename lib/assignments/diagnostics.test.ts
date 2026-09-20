import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentSubmitAccess } from "./access";
import { buildA1GateDiagnostics } from "./diagnostics";
import { matchRoster } from "../roster/match";
import { mergeClerkRosterEmailSources } from "../roster/emails";
import {
  a1SubmissionFormState,
  resolveA1SubmitVisibility,
  submissionGateCopy,
} from "./submission-form";

const rosterTarget = {
  rosterDb: "web-dev",
  rosterCollection: "canvas_roster",
  rosterCount: 80,
};

describe("A1 submit diagnostics", () => {
  it("marks a matched NEU email as canSubmit with no gate", () => {
    const emails = mergeClerkRosterEmailSources({
      sessionUser: { id: "user_chen", emailAddresses: [] },
      backendUser: {
        id: "user_chen",
        emailAddresses: [
          { emailAddress: "chen.rya@northeastern.edu" },
        ],
      },
    });
    const roster = matchRoster({
      emails,
      mongoEntries: [
        {
          email: "Chen.Rya@northeastern.edu",
          name: "Ryan Chen",
        },
      ],
      envEmails: [],
      mongoCount: 80,
    });
    assert.equal(roster.status, "matched");

    const diagnostics = buildA1GateDiagnostics({
      assignmentId: "a1",
      signedIn: true,
      mongoConfigured: true,
      assignmentConfigured: true,
      isActualStaff: false,
      clerkEmails: emails,
      roster,
      ...rosterTarget,
    });
    assert.equal(diagnostics.canSubmit, true);
    assert.equal(diagnostics.gateReason, null);
    assert.equal(diagnostics.accessBypass, "matched");
    assert.equal(diagnostics.rosterStatus, "matched");
    assert.equal(diagnostics.hasNortheasternEmail, true);
    assert.equal(a1SubmissionFormState(diagnostics).mode, "fields");
  });

  it("keeps Ada fields when Mongo is off, and labels a real student not_configured", () => {
    const ada = matchRoster({
      emails: ["ada@ada.com"],
      mongoEntries: [],
      envEmails: [],
      mongoCount: 0,
    });
    const adaAccess = assignmentSubmitAccess({
      signedIn: true,
      configured: false,
      isActualStaff: false,
      roster: ada,
    });
    assert.equal(adaAccess.ok, true);

    const neuUnconfigured = buildA1GateDiagnostics({
      assignmentId: "a1",
      signedIn: true,
      mongoConfigured: false,
      assignmentConfigured: false,
      isActualStaff: false,
      clerkEmails: ["chen.rya@northeastern.edu"],
      roster: { status: "not_configured" },
      rosterDb: "web-dev",
      rosterCollection: "canvas_roster",
      rosterCount: null,
    });
    assert.equal(neuUnconfigured.canSubmit, false);
    assert.equal(neuUnconfigured.gateReason, "not_configured");
    assert.match(
      submissionGateCopy("not_configured").body,
      /could not read the imported Canvas\/FACT roster/i,
    );
    assert.notEqual(
      submissionGateCopy("not_configured").title,
      submissionGateCopy("not_on_roster").title,
    );
  });

  it("uses not_on_roster when Mongo is configured but the email misses", () => {
    const visibility = resolveA1SubmitVisibility({
      assignmentId: "a1",
      access: assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: { status: "not_on_roster" },
      }),
    });
    assert.equal(visibility.canSubmit, false);
    assert.equal(visibility.gateReason, "not_on_roster");
    assert.equal(
      submissionGateCopy(visibility.gateReason!).title,
      "This email isn’t on the course roster",
    );

    const staff = buildA1GateDiagnostics({
      assignmentId: "a1",
      signedIn: true,
      mongoConfigured: true,
      assignmentConfigured: true,
      isActualStaff: true,
      clerkEmails: ["jannunzi@gmail.com"],
      roster: { status: "not_on_roster" },
      ...rosterTarget,
    });
    assert.equal(staff.canSubmit, true);
    assert.equal(staff.accessBypass, "staff");
  });
});
