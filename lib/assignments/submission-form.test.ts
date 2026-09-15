import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentSubmitAccess } from "./access";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  a1SubmissionFormState,
  gateReasonFromAccess,
  submissionGateCopy,
} from "./submission-form";
import { DEMO_ROSTER_STUDENTS } from "../roster/demo-students";
import { matchRoster } from "../roster/match";
import { normalizeEmail } from "../roster/emails";

describe("A1 submission form visibility", () => {
  it("shows GitHub and Vercel fields for a signed-in rostered student", () => {
    const ada = DEMO_ROSTER_STUDENTS[0];
    const roster = matchRoster({
      emails: ["  ADA@ADA.COM "],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: DEMO_ROSTER_STUDENTS.length,
    });
    assert.equal(roster.status, "matched");
    if (roster.status === "matched") {
      assert.equal(roster.entry.email, normalizeEmail(ada.email));
    }

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: true,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, true);
    assert.deepEqual(a1SubmissionFormState({ canSubmit: true, gateReason: null }), {
      mode: "fields",
      gateReason: null,
    });
  });

  it("shows an explicit off-roster message instead of a blank form", () => {
    const roster = matchRoster({
      emails: ["stranger@northeastern.edu"],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: DEMO_ROSTER_STUDENTS.length,
    });
    assert.equal(roster.status, "not_on_roster");

    const access = assignmentSubmitAccess({
      signedIn: true,
      configured: true,
      isActualStaff: false,
      roster,
    });
    assert.equal(access.ok, false);
    if (!access.ok) assert.equal(access.code, "not_on_roster");

    const state = a1SubmissionFormState({
      canSubmit: false,
      gateReason: gateReasonFromAccess(access),
    });
    assert.equal(state.mode, "gate");
    if (state.mode === "gate") {
      assert.equal(state.gateReason, "not_on_roster");
      const copy = submissionGateCopy(state.gateReason);
      assert.equal(copy.title, ASSIGNMENT_STUDENT_COPY.notOnRosterTitle);
      assert.match(copy.body, /isn.t on the Canvas course roster/i);
    }
  });

  it("never leaves the URL fields as a blank section when gated", () => {
    const missingReason = a1SubmissionFormState({
      canSubmit: false,
      gateReason: null,
    });
    assert.equal(missingReason.mode, "gate");
    if (missingReason.mode === "gate") {
      assert.equal(missingReason.gateReason, "not_configured");
      assert.ok(submissionGateCopy(missingReason.gateReason).title);
    }
  });
});
