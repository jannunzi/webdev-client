import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_INSTRUCTOR_EMAIL,
  instructorEmailsFromEnv,
  isInstructorEmail,
  isInstructorUser,
} from "./instructors";

describe("instructor email allowlist", () => {
  it("defaults to Jose when INSTRUCTOR_EMAILS is unset or empty", () => {
    assert.deepEqual(instructorEmailsFromEnv(undefined), [
      DEFAULT_INSTRUCTOR_EMAIL,
    ]);
    assert.deepEqual(instructorEmailsFromEnv(""), [DEFAULT_INSTRUCTOR_EMAIL]);
    assert.deepEqual(instructorEmailsFromEnv("  , ; "), [
      DEFAULT_INSTRUCTOR_EMAIL,
    ]);
  });

  it("parses a comma-separated allowlist the same way as roster emails", () => {
    assert.deepEqual(
      instructorEmailsFromEnv(
        "jannunzi@gmail.com, TA@Northeastern.edu; skip not-an-email",
      ),
      ["jannunzi@gmail.com", "ta@northeastern.edu"],
    );
  });

  it("does not inject the default when the env list is non-empty", () => {
    assert.deepEqual(instructorEmailsFromEnv("ta@northeastern.edu"), [
      "ta@northeastern.edu",
    ]);
  });

  it("matches instructor emails case-insensitively", () => {
    const allowlist = ["jannunzi@gmail.com"];
    assert.equal(isInstructorEmail("Jannunzi@Gmail.com", allowlist), true);
    assert.equal(isInstructorEmail("  jannunzi@gmail.com ", allowlist), true);
    assert.equal(
      isInstructorEmail("jane.doe@northeastern.edu", allowlist),
      false,
    );
  });

  it("allows a Clerk user when any collected email is on the allowlist", () => {
    assert.equal(
      isInstructorUser(
        {
          id: "user_1",
          primaryEmailAddressId: "idn_neu",
          emailAddresses: [
            {
              id: "idn_neu",
              emailAddress: "j.annunziato@northeastern.edu",
              verification: { status: "verified" },
            },
            {
              id: "idn_gmail",
              emailAddress: "Jannunzi@Gmail.com",
              verification: { status: "verified" },
            },
          ],
        },
        ["jannunzi@gmail.com"],
      ),
      true,
    );
    assert.equal(
      isInstructorUser(
        {
          id: "user_2",
          emailAddresses: [
            { emailAddress: "jane.doe@northeastern.edu" },
          ],
        },
        ["jannunzi@gmail.com"],
      ),
      false,
    );
    assert.equal(isInstructorUser(null, ["jannunzi@gmail.com"]), false);
    assert.equal(isInstructorUser(undefined, ["jannunzi@gmail.com"]), false);
  });
});
