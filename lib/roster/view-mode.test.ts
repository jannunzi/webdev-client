import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { staffAccessFromUser } from "./instructors";
import {
  DEFAULT_IMPERSONATION_STUDENT_EMAIL,
  IMPERSONATION_STUDENT_NAME,
  effectiveStaffAccess,
  impersonationDummyEntry,
  impersonationRosterMatch,
  isEffectiveStaff,
  parseViewMode,
  resolveViewMode,
  shouldImpersonateStudent,
  viewModeCookieUpdate,
} from "./view-mode";

describe("staff view-mode cookie gate", () => {
  it("defaults unknown or missing cookie values to instructor", () => {
    assert.equal(parseViewMode(undefined), "instructor");
    assert.equal(parseViewMode(null), "instructor");
    assert.equal(parseViewMode(""), "instructor");
    assert.equal(parseViewMode("instructor"), "instructor");
    assert.equal(parseViewMode("hacked"), "instructor");
    assert.equal(parseViewMode("student"), "student");
  });

  it("ignores a student cookie unless the user is actually staff", () => {
    assert.equal(
      resolveViewMode({ cookieValue: "student", isActualStaff: false }),
      "instructor",
    );
    assert.equal(
      resolveViewMode({ cookieValue: "student", isActualStaff: true }),
      "student",
    );
    assert.equal(
      resolveViewMode({ cookieValue: "instructor", isActualStaff: true }),
      "instructor",
    );
    assert.equal(
      resolveViewMode({ cookieValue: undefined, isActualStaff: true }),
      "instructor",
    );
    assert.equal(
      resolveViewMode({ cookieValue: "student", isActualStaff: false }),
      "instructor",
    );
  });

  it("refuses to set the cookie when the actor is not staff", () => {
    assert.deepEqual(
      viewModeCookieUpdate({ isActualStaff: false, requested: "student" }),
      { rejected: true },
    );
    assert.deepEqual(
      viewModeCookieUpdate({ isActualStaff: false, requested: "instructor" }),
      { rejected: true },
    );
  });

  it("sets student or clears back to instructor only for staff", () => {
    assert.deepEqual(
      viewModeCookieUpdate({ isActualStaff: true, requested: "student" }),
      { set: "student" },
    );
    assert.deepEqual(
      viewModeCookieUpdate({ isActualStaff: true, requested: "instructor" }),
      { delete: true },
    );
    assert.deepEqual(
      viewModeCookieUpdate({ isActualStaff: true, requested: "nope" }),
      { delete: true },
    );
  });
});

describe("effective staff for review and People", () => {
  it("staff in student mode is not staff for review", () => {
    const staffOk = staffAccessFromUser(true, true, ["jannunzi@gmail.com"]);
    assert.equal(staffOk, "ok");
    assert.equal(effectiveStaffAccess(staffOk, "instructor"), "ok");
    assert.equal(effectiveStaffAccess(staffOk, "student"), "forbidden");
    assert.equal(isEffectiveStaff(staffOk, "instructor"), true);
    assert.equal(isEffectiveStaff(staffOk, "student"), false);
  });

  it("does not elevate a non-staff user who presents a student cookie", () => {
    const student = staffAccessFromUser(true, true, [
      "jane.doe@northeastern.edu",
    ]);
    assert.equal(student, "forbidden");
    assert.equal(effectiveStaffAccess(student, "student"), "forbidden");
    assert.equal(effectiveStaffAccess(student, "instructor"), "forbidden");
    assert.equal(
      shouldImpersonateStudent(false, resolveViewMode({
        cookieValue: "student",
        isActualStaff: false,
      })),
      false,
    );
  });

  it("keeps signed-out and unconfigured statuses unchanged", () => {
    assert.equal(
      effectiveStaffAccess("signed_out", "student"),
      "signed_out",
    );
    assert.equal(
      effectiveStaffAccess("not_configured", "student"),
      "not_configured",
    );
  });
});

describe("impersonation dummy roster", () => {
  it("short-circuits to Demo Student without a Mongo entry", () => {
    assert.equal(impersonationRosterMatch(false), null);
    const matched = impersonationRosterMatch(true);
    assert.ok(matched);
    assert.equal(matched.status, "matched");
    assert.equal(matched.entry.name, IMPERSONATION_STUDENT_NAME);
    assert.equal(matched.entry.email, DEFAULT_IMPERSONATION_STUDENT_EMAIL);
    assert.equal(matched.entry.source, "impersonation");
    assert.equal(matched.entry.canvasUserId, "impersonation-demo");
  });

  it("uses IMPERSONATION_STUDENT_EMAIL when it is a valid address", () => {
    const entry = impersonationDummyEntry("jose.preview@webdev.local");
    assert.equal(entry.email, "jose.preview@webdev.local");
    assert.equal(entry.name, "Demo Student");
    assert.equal(entry.source, "impersonation");
  });

  it("impersonates only when actual staff is in student view", () => {
    assert.equal(shouldImpersonateStudent(true, "student"), true);
    assert.equal(shouldImpersonateStudent(true, "instructor"), false);
    assert.equal(shouldImpersonateStudent(false, "student"), false);
  });
});
