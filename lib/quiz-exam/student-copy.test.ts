import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STUDENT_COPY } from "./student-copy";

describe("student-facing quiz copy", () => {
  it("never names Clerk in strings shown to students", () => {
    for (const [key, value] of Object.entries(STUDENT_COPY)) {
      assert.equal(/\bClerk\b/i.test(value), false, key);
    }
  });

  it("tells students to use the Canvas email and the course roster", () => {
    assert.match(STUDENT_COPY.signInWithSchoolEmail, /Canvas email/i);
    assert.match(STUDENT_COPY.useRosterEmail, /same Northeastern email you use on Canvas/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /same Northeastern email you use on Canvas/i);
    assert.match(STUDENT_COPY.notOnRosterSubmit, /course roster/i);
  });

  it("keeps Sign up first and Canvas-email match for taking a quiz", () => {
    assert.match(STUDENT_COPY.takeIndexLead, /Sign up first/i);
    assert.match(STUDENT_COPY.takeIndexLead, /not pre-provisioned/i);
    assert.match(STUDENT_COPY.takeIndexLead, /this site is not Canvas/i);
    assert.match(
      STUDENT_COPY.takeIndexLead,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(STUDENT_COPY.takeIndexLead, /that Canvas email/i);
    assert.match(STUDENT_COPY.takeMetaDescription, /Sign up if you don['’]t have/i);
    assert.match(
      STUDENT_COPY.takeMetaDescription,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(STUDENT_COPY.signInPageHint, /Sign up first/i);
    assert.match(
      STUDENT_COPY.signInPageHint,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      STUDENT_COPY.signUpPageHint,
      /taking a graded quiz still requires your Canvas roster email/i,
    );
  });
});
