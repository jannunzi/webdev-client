import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STUDENT_COPY } from "./student-copy";

describe("student-facing quiz copy", () => {
  it("never names Clerk in strings shown to students", () => {
    for (const [key, value] of Object.entries(STUDENT_COPY)) {
      assert.equal(/\bClerk\b/i.test(value), false, key);
    }
  });

  it("tells students to use their school email and the course roster", () => {
    assert.match(STUDENT_COPY.signInWithSchoolEmail, /school email/i);
    assert.match(STUDENT_COPY.useRosterEmail, /email on the course roster/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /school email/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /course roster/i);
  });

  it("keeps Sign up first separate from roster match for taking a quiz", () => {
    assert.match(STUDENT_COPY.takeIndexLead, /Sign up first/i);
    assert.match(STUDENT_COPY.takeIndexLead, /not pre-provisioned/i);
    assert.match(STUDENT_COPY.takeIndexLead, /this site is not Canvas/i);
    assert.match(STUDENT_COPY.takeIndexLead, /email on the course roster/i);
    assert.match(STUDENT_COPY.takeMetaDescription, /Sign up if you don['’]t have/i);
    assert.match(STUDENT_COPY.signInPageHint, /Sign up first/i);
    assert.doesNotMatch(
      STUDENT_COPY.signInPageHint,
      /email on the course roster/i,
    );
    assert.match(
      STUDENT_COPY.signUpPageHint,
      /taking a graded quiz still requires your Canvas roster email/i,
    );
  });
});
