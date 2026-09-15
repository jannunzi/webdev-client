import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalEmailKey,
  collectClerkEmails,
  emailMatchKeys,
  normalizeEmail,
  parseRosterEmailsEnv,
  preferredRosterEmail,
} from "./emails";

describe("roster emails", () => {
  it("normalizes and parses env allowlists", () => {
    assert.equal(normalizeEmail("  A@Edu "), "a@edu");
    assert.equal(normalizeEmail("Ada.Lovelace@Northeastern.EDU\u00a0"), "ada.lovelace@northeastern.edu");
    assert.equal(normalizeEmail(undefined), "");
    assert.equal(normalizeEmail(null), "");
    assert.equal(normalizeEmail(12), "");
    assert.equal(
      canonicalEmailKey("ada.lovelace+test@husky.neu.edu"),
      "ada.lovelace@northeastern.edu",
    );
    assert.ok(emailMatchKeys("bob.marley@northeastern.edu").includes("bob.marley@husky.neu.edu"));
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
        {
          id: "idn_empty",
          emailAddress: undefined as unknown as string,
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

  it("reads Clerk backend, paginated, and SSO email shapes", () => {
    assert.deepEqual(
      collectClerkEmails({
        id: "user_2",
        email_addresses: {
          data: [{ id: "idn_1", email_address: "Ada.Lovelace@northeastern.edu" }],
        },
        external_accounts: [{ email_address: "ada.lovelace@husky.neu.edu" }],
        username: "not-an-email",
      }),
      ["ada.lovelace@northeastern.edu", "ada.lovelace@husky.neu.edu"],
    );
  });
});
