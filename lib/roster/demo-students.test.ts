import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEMO_ROSTER_STUDENTS,
  demoRosterStudentByEmail,
  isDemoRosterEmail,
  mergeDemoRosterEntries,
} from "./demo-students";
import { canonicalEmailKey, normalizeEmail } from "./emails";
import { upsertDemoRosterStudents } from "./ensure-demo";
import { matchRoster } from "./match";
import type { CanvasRosterEntry } from "./types";

describe("demo roster students", () => {
  it("normalizes dummy Canvas emails used for staff A1 testing", () => {
    const ada = DEMO_ROSTER_STUDENTS[0];
    const bob = DEMO_ROSTER_STUDENTS[1];
    assert.equal(ada?.name, "Ada Lovelace");
    assert.equal(bob?.name, "Bob Marley");
    assert.equal(ada?.email, "ada@ada.com");
    assert.equal(bob?.email, "bob@bob.com");
    assert.equal(ada?.section, "CS4550 CRN 11464");
    assert.equal(bob?.section, "CS4550 CRN 11464");

    assert.equal(normalizeEmail("  ADA@ADA.COM "), "ada@ada.com");
    assert.equal(normalizeEmail(" Bob@Bob.com\u00a0"), "bob@bob.com");
    assert.equal(canonicalEmailKey("ADA@ADA.COM"), "ada@ada.com");
    assert.equal(canonicalEmailKey("bob+a1@bob.com"), "bob@bob.com");
    assert.equal(isDemoRosterEmail("Ada@Ada.com"), true);
    assert.equal(isDemoRosterEmail("ada.lovelace@northeastern.edu"), false);
    assert.equal(demoRosterStudentByEmail(" BOB@BOB.COM ")?.name, "Bob Marley");
  });

  it("matches Ada and Bob with no Atlas rows and no env allowlist", () => {
    const ada = matchRoster({
      emails: ["ADA@ADA.COM"],
      mongoEntries: [],
      envEmails: [],
      mongoCount: 0,
    });
    assert.equal(ada.status, "matched");
    if (ada.status === "matched") {
      assert.equal(ada.entry.name, "Ada Lovelace");
      assert.equal(ada.entry.email, "ada@ada.com");
      assert.equal(ada.entry.source, "demo");
    }

    const bob = matchRoster({
      emails: ["bob+staff@bob.com"],
      mongoEntries: [],
      envEmails: [],
      mongoCount: 0,
    });
    assert.equal(bob.status, "matched");
    if (bob.status === "matched") {
      assert.equal(bob.entry.name, "Bob Marley");
    }
  });

  it("still reports empty for a non-demo email when Atlas has no rows", () => {
    assert.equal(
      matchRoster({
        emails: ["stranger@northeastern.edu"],
        mongoEntries: [],
        envEmails: [],
        mongoCount: 0,
      }).status,
      "empty",
    );
  });

  it("merges missing demo students into a People roster list", () => {
    const merged = mergeDemoRosterEntries([
      { email: "jane.doe@northeastern.edu", name: "Jane Doe" },
    ]);
    assert.equal(merged.length, 3);
    assert.ok(merged.some((row) => row.email === "ada@ada.com"));
    assert.ok(merged.some((row) => row.email === "bob@bob.com"));
    assert.equal(
      mergeDemoRosterEntries([...DEMO_ROSTER_STUDENTS]).length,
      DEMO_ROSTER_STUDENTS.length,
    );
  });

  it("matches dummy emails against canvas_roster rows after normalize", () => {
    const result = matchRoster({
      emails: ["  Ada@Ada.COM "],
      mongoEntries: [...DEMO_ROSTER_STUDENTS],
      envEmails: [],
      mongoCount: 2,
    });
    assert.equal(result.status, "matched");
    if (result.status === "matched") {
      assert.equal(result.entry.name, "Ada Lovelace");
      assert.equal(result.entry.email, "ada@ada.com");
    }
  });

  it("upserts demo students by case-insensitive email", async () => {
    const docs: CanvasRosterEntry[] = [
      {
        email: "  Ada@Ada.com ",
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
    assert.deepEqual(result.emails, ["ada@ada.com", "bob@bob.com"]);
    assert.equal(docs.length, 2);
    assert.equal(docs[0]?.name, "Ada Lovelace");
    assert.equal(docs[0]?.email, "ada@ada.com");
    assert.equal(docs[1]?.email, "bob@bob.com");
    assert.equal(docs[1]?.section, "CS4550 CRN 11464");
  });
});
