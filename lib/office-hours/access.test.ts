import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { queueJoinAccess, queueManageAccess, resolveQueueStaff } from "./access.ts";
import { rosterMatchesSyllabusSection } from "./sections.ts";

const roster = {
  status: "matched" as const,
  entry: {
    email: "ada@northeastern.edu",
    name: "Ada",
    section: "CS4550 CRN 11464",
  },
};

describe("office-hour queue access", () => {
  it("resolves queue-enabled staff per section and blocks Giuseppe", () => {
    const shloka = resolveQueueStaff("shloka-trivedi", "cs4550-01");
    assert.equal(shloka.ok, true);
    assert.deepEqual(resolveQueueStaff("giuseppe-marotta", "cs4550-01"), {
      ok: false,
      code: "no_queue",
    });
    assert.deepEqual(resolveQueueStaff("shloka-trivedi", "cs5610-02"), {
      ok: false,
      code: "unknown_staff",
    });
    assert.deepEqual(resolveQueueStaff("tisha-kotadia", "cs4550-01"), {
      ok: false,
      code: "unknown_staff",
    });
    assert.equal(resolveQueueStaff("jose-annunziato", "cs5610-09").ok, true);
  });

  it("lets a rostered student in the same section join, and isolates sections", () => {
    assert.deepEqual(
      queueJoinAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        impersonating: false,
        roster,
        sectionId: "cs4550-01",
        taId: "shloka-trivedi",
      }),
      { ok: true },
    );
    assert.deepEqual(
      queueJoinAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        impersonating: false,
        roster,
        sectionId: "cs5610-02",
        taId: "tisha-kotadia",
      }),
      { ok: false, code: "wrong_section" },
    );
    assert.equal(
      rosterMatchesSyllabusSection("CS5610-02", "cs5610-02"),
      true,
    );
    assert.equal(
      rosterMatchesSyllabusSection("CS5610-09 Online", "cs4550-01"),
      false,
    );
  });

  it("blocks unsigned-in, empty roster, impersonation, and staff joins", () => {
    assert.equal(
      queueJoinAccess({
        signedIn: false,
        configured: true,
        isActualStaff: false,
        impersonating: false,
        roster,
        sectionId: "cs4550-01",
        taId: "shloka-trivedi",
      }).ok,
      false,
    );
    assert.deepEqual(
      queueJoinAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        impersonating: false,
        roster: { status: "not_on_roster" },
        sectionId: "cs4550-01",
        taId: "shloka-trivedi",
      }),
      { ok: false, code: "not_on_roster" },
    );
    assert.deepEqual(
      queueJoinAccess({
        signedIn: true,
        configured: true,
        isActualStaff: true,
        impersonating: false,
        roster,
        sectionId: "cs4550-01",
        taId: "shloka-trivedi",
      }),
      { ok: false, code: "staff_cannot_join" },
    );
    assert.deepEqual(
      queueJoinAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        impersonating: true,
        roster,
        sectionId: "cs4550-01",
        taId: "shloka-trivedi",
      }),
      { ok: false, code: "impersonating" },
    );
  });

  it("lets allowlisted staff manage and blocks impersonation", () => {
    assert.deepEqual(
      queueManageAccess({
        signedIn: true,
        configured: true,
        isActualStaff: true,
        impersonating: false,
      }),
      { ok: true },
    );
    assert.deepEqual(
      queueManageAccess({
        signedIn: true,
        configured: true,
        isActualStaff: true,
        impersonating: true,
      }),
      { ok: false, code: "impersonating" },
    );
    assert.deepEqual(
      queueManageAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        impersonating: false,
      }),
      { ok: false, code: "forbidden" },
    );
  });
});
