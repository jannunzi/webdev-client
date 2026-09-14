import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rosterEntriesFromCsv, rosterEntriesFromJson } from "./csv";
import { matchRoster, rosterEmailMatchFilter } from "./match";

const csv = `Student,ID,SIS User ID,SIS Login ID,Email,Section
Points Possible,,,,,
Jane Doe,12345,jane.doe,jane.doe@northeastern.edu,jane.doe@northeastern.edu,CS4550
`;

describe("roster matching", () => {
  it("matches a Clerk email against Mongo roster rows", () => {
    const result = matchRoster({
      emails: ["JANE.DOE@northeastern.edu"],
      mongoEntries: rosterEntriesFromCsv(csv),
      envEmails: [],
      mongoCount: 1,
    });
    assert.equal(result.status, "matched");
    if (result.status === "matched") {
      assert.equal(result.entry.email, "jane.doe@northeastern.edu");
      assert.equal(result.entry.canvasUserId, "12345");
    }
  });

  it("matches roster emails that still have Canvas casing or padding", () => {
    const result = matchRoster({
      emails: ["bhatti.t@northeastern.edu"],
      mongoEntries: [
        {
          email: "  Bhatti.T@northeastern.edu ",
          section: "CS4550 CRN 11464",
          sisUserId: "002587545",
        },
      ],
      envEmails: [],
      mongoCount: 1,
    });
    assert.equal(result.status, "matched");
    if (result.status === "matched") {
      assert.equal(result.entry.email, "bhatti.t@northeastern.edu");
    }
  });

  it("builds a case-insensitive Mongo email filter", () => {
    const filter = rosterEmailMatchFilter([
      "  Bhatti.T@northeastern.edu ",
      "bhatti.t@northeastern.edu",
    ]);
    assert.ok(filter);
    const expr = filter.$expr as {
      $in: [unknown, string[]];
    };
    assert.deepEqual(expr.$in[1], ["bhatti.t@northeastern.edu"]);
    assert.equal(rosterEmailMatchFilter(["", "   "]), null);
  });

  it("matches optional Canvas user ids", () => {
    const result = matchRoster({
      emails: ["someone@northeastern.edu"],
      canvasUserIds: ["12345"],
      mongoEntries: rosterEntriesFromCsv(csv),
      envEmails: [],
      mongoCount: 1,
    });
    assert.equal(result.status, "matched");
  });

  it("falls back to CANVAS_ROSTER_EMAILS", () => {
    const result = matchRoster({
      emails: ["ta@northeastern.edu"],
      mongoEntries: [],
      envEmails: ["ta@northeastern.edu"],
      mongoCount: 0,
    });
    assert.equal(result.status, "matched");
    if (result.status === "matched") {
      assert.equal(result.entry.source, "env");
    }
  });

  it("reports an empty roster versus a miss", () => {
    assert.equal(
      matchRoster({
        emails: ["x@northeastern.edu"],
        mongoEntries: [],
        envEmails: [],
        mongoCount: 0,
      }).status,
      "empty",
    );
    assert.equal(
      matchRoster({
        emails: ["x@northeastern.edu"],
        mongoEntries: [],
        envEmails: [],
        mongoCount: 12,
      }).status,
      "not_on_roster",
    );
  });

  it("parses JSON roster files", () => {
    const entries = rosterEntriesFromJson(
      JSON.stringify([{ email: "Pat@Northeastern.edu", canvasUserId: "9", name: "Pat" }]),
    );
    assert.equal(entries[0]?.email, "pat@northeastern.edu");
    assert.equal(entries[0]?.canvasUserId, "9");
  });
});
