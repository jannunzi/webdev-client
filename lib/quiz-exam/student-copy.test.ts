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
});
