import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectClerkEmails,
  normalizeEmail,
  parseRosterEmailsEnv,
  preferredRosterEmail,
} from "./emails";

describe("roster emails", () => {
  it("normalizes and parses env allowlists", () => {
    assert.equal(normalizeEmail("  A@Edu "), "a@edu");
    assert.deepEqual(
      parseRosterEmailsEnv("jane@northeastern.edu, Alex@Northeastern.edu; skip"),
      ["jane@northeastern.edu", "alex@northeastern.edu"],
    );
  });

  it("prefers primary then verified Clerk emails", () => {
    const emails = collectClerkEmails({
      id: "user_1",
      primaryEmailAddressId: "idn_primary",
      emailAddresses: [
        {
          id: "idn_other",
          emailAddress: "other@northeastern.edu",
          verification: { status: "verified" },
        },
        {
          id: "idn_primary",
          emailAddress: "Jane.Doe@northeastern.edu",
          verification: { status: "verified" },
        },
        {
          id: "idn_unverified",
          emailAddress: "alias@gmail.com",
          verification: { status: "unverified" },
        },
      ],
    });
    assert.deepEqual(emails, [
      "jane.doe@northeastern.edu",
      "other@northeastern.edu",
      "alias@gmail.com",
    ]);
    assert.equal(
      preferredRosterEmail(
        { id: "user_1", emailAddresses: [] },
        "Jane.Doe@northeastern.edu",
      ),
      "jane.doe@northeastern.edu",
    );
  });
});
