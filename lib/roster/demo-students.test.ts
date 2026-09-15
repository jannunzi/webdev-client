import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEMO_ROSTER_STUDENTS,
  demoRosterStudentByEmail,
  isDemoRosterEmail,
} from "./demo-students";
import {
  canonicalEmailKey,
  normalizeEmail,
} from "./emails";
import { upsertDemoRosterStudents } from "./ensure-demo";
import { matchRoster } from "./match";
import type { CanvasRosterEntry } from "./types";

describe("demo roster students", () => {
  it("normalizes dummy Canvas emails used for staff A1 testing", () => {
    const ada = DEMO_ROSTER_STUDENTS[0];
    const bob = DEMO_ROSTER_STUDENTS[1];
    assert.equal(ada?.name, "Ada Lovelace");
    assert.equal(bob?.name, "Bob Marley");
    assert.equal(ada?.section, "CS4550 CRN 11464");
    assert.equal(bob?.section, "CS5610-02 CRN 17395");

    assert.equal(
      normalizeEmail("  Ada.Lovelace@Northeastern.EDU "),
      "ada.lovelace@northeastern.edu",
    );
    assert.equal(
      normalizeEmail(" Bob.Marley@northeastern.edu\u00a0"),
      "bob.marley@northeastern.edu",
    );
    assert.equal(
      canonicalEmailKey("ada.lovelace+a1@husky.neu.edu"),
      "ada.lovelace@northeastern.edu",
    );
    assert.equal(
      canonicalEmailKey("BOB.MARLEY@NEU.EDU"),
      "bob.marley@northeastern.edu",
    );
    assert.equal(isDemoRosterEmail("ADA.LOVELACE@northeastern.edu"), true);
    assert.equal(
      demoRosterStudentByEmail(" bob.marley@northeastern.edu ")?.name,
      "Bob Marley",
    );
  });

  it("matches dummy emails against canvas_roster rows after normalize", () => {
    const result = matchRoster({
      emails: ["Ada.Lovelace+webdev@husky.neu.edu"],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: 2,
    });
    assert.equal(result.status, "matched");
    if (result.status === "matched") {
      assert.equal(result.entry.name, "Ada Lovelace");
      assert.equal(result.entry.email, "ada.lovelace+webdev@husky.neu.edu");
    }
  });

  it("upserts demo students by case-insensitive email", async () => {
    const docs: CanvasRosterEntry[] = [
      {
        email: "  Ada.Lovelace@northeastern.edu ",
        name: "Stale Ada",
        source: "mongo",
      },
    ];
    const collection = {
      async findOne(filter: Record<string, unknown>) {
        const regex = (filter.email as { $regex?: string; $options?: string })
          ?.$regex;
        if (!regex) return null;
        const re = new RegExp(regex, "i");
        const found = docs.find((row) => re.test(row.email));
        return found ? { _id: "ada-1", ...found } : null;
      },
      async updateOne(
        filter: Record<string, unknown>,
        update: Record<string, unknown>,
      ) {
        const set = update.$set as CanvasRosterEntry;
        const index = docs.findIndex(() => filter._id === "ada-1");
        if (index >= 0) docs[index] = { ...docs[index], ...set };
      },
      async insertOne(doc: CanvasRosterEntry) {
        docs.push(doc);
      },
    };

    const result = await upsertDemoRosterStudents(collection, new Date("2026-09-15"));
    assert.equal(result.upserts, 2);
    assert.deepEqual(result.emails, [
      "ada.lovelace@northeastern.edu",
      "bob.marley@northeastern.edu",
    ]);
    assert.equal(docs.length, 2);
    assert.equal(docs[0]?.name, "Ada Lovelace");
    assert.equal(docs[0]?.email, "ada.lovelace@northeastern.edu");
    assert.equal(docs[1]?.email, "bob.marley@northeastern.edu");
    assert.equal(docs[1]?.section, "CS5610-02 CRN 17395");
  });
});
