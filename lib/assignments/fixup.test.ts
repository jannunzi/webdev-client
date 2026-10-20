import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import { listRubricCriteria } from "./catalog";
import type { AssignmentCheckResult } from "./check-types";
import { criterionCoverage } from "./checkers";
import { finalGrade } from "./final-grade";
import {
  FIXUP_COPY,
  FIXUP_RUN_UNSET,
  applyFixupRun,
  fixupSectionWarning,
  fixupWindowClosed,
  mainSaveBlockedByFixup,
  resolveFixupSection,
  sectionFromMetadata,
  FIXUP_EXPORT_HEADERS,
  buildFixupExportRows,
  buildFixupSnapshot,
  evaluateFixup,
  fixableCriterionIds,
  fixupClosesAt,
  fixupCredit,
  fixupExportCsv,
  fixupWindowState,
  type FixupRecord,
  type FixupRound,
  type FixupSnapshot,
} from "./fixup";
import { staffGradeRecordFromRows, gradeRowsFromResults } from "./grade-rows";

const CRITERIA = listRubricCriteria(A1_RUBRIC);
const AUTO = CRITERIA.filter((c) => criterionCoverage("a1", c.id) === "auto");
const MANUAL = CRITERIA.filter((c) => criterionCoverage("a1", c.id) === "manual");
const TOTAL = CRITERIA.reduce((sum, c) => sum + c.points, 0);
const NOW = new Date("2026-10-20T12:00:00.000Z");

function run(overrides: Record<string, Partial<AssignmentCheckResult>> = {}): AssignmentCheckResult[] {
  return AUTO.map((c) => ({
    id: c.id,
    criterionId: c.id,
    label: c.label,
    passed: true,
    message: "",
    ...overrides[c.id],
  }));
}

/** A frozen original built directly: every criterion full except `lost`. */
function original(lost: Record<string, number> = {}): FixupSnapshot {
  const criteria = CRITERIA.map((c) => ({
    criterionId: c.id,
    maxPoints: c.points,
    points: c.id in lost ? lost[c.id] : c.points,
  }));
  return {
    capturedAt: NOW.toISOString(),
    source: "staff",
    points: criteria.reduce((sum, row) => sum + row.points, 0),
    maxPoints: TOTAL,
    criteria,
    checkResults: [],
  };
}

function round(results: AssignmentCheckResult[] | undefined, extra: Partial<FixupRound> = {}): FixupRound {
  return {
    openedAt: NOW.toISOString(),
    ...(results ? { submittedAt: NOW.toISOString(), checkResults: results } : {}),
    ...extra,
  };
}

const A = AUTO[0]; // 3 pts
const B = AUTO.find((c) => c.points === 5)!; // 5 pts
const M = MANUAL[0];

describe("fix-up: 50% credit math", () => {
  it("original + 0.5 × (new − original)", () => {
    assert.equal(fixupCredit(0, 3, 3), 1.5);
    assert.equal(fixupCredit(0, 5, 5), 2.5);
    assert.equal(fixupCredit(2, 5, 5), 3.5);
    assert.equal(fixupCredit(1, 2, 2), 1.5);
  });
  it("never below the original, never above max", () => {
    assert.equal(fixupCredit(2, 0, 5), 2);
    assert.equal(fixupCredit(2, 2, 5), 2);
    assert.equal(fixupCredit(0, 99, 3), 1.5);
    assert.equal(fixupCredit(0, Number.NaN, 3), 0);
  });
  it("a fixed criterion regains half its lost points", () => {
    const res = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0, [B.id]: 0 }), round: round(run()) });
    assert.equal(res.originalPoints, TOTAL - 8);
    assert.equal(res.regained, 4);
    assert.equal(res.newPoints, TOTAL - 4);
    assert.equal(res.resolved, true);
    assert.equal(res.items.find((i) => i.criterionId === A.id)!.status, "fixed");
  });
  it("a still-failing criterion keeps original points", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
      round: round(run({ [A.id]: { passed: false } })),
    });
    assert.equal(res.regained, 0);
    assert.equal(res.items.find((i) => i.criterionId === A.id)!.status, "not_fixed");
    assert.equal(res.resolved, true);
  });
  it("partial staff points earned originally count as the base", () => {
    const res = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [B.id]: 2 }), round: round(run()) });
    assert.equal(res.regained, 1.5);
  });
});

describe("fix-up: locked passes", () => {
  it("only lost criteria are fixable", () => {
    assert.deepEqual(fixableCriterionIds(original({ [A.id]: 0 })), [A.id]);
  });
  it("a regression on an originally passed criterion never lowers the score", () => {
    const failing = Object.fromEntries(AUTO.map((c) => [c.id, { passed: false }]));
    const res = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }), round: round(run(failing)) });
    assert.equal(res.newPoints, res.originalPoints);
    for (const item of res.items) {
      if (item.criterionId !== A.id) assert.equal(item.status, "locked");
    }
  });
});

describe("fix-up: TA review gating", () => {
  for (const flag of ["needsReview", "needsRecheck", "skipped"] as const) {
    it(`${flag} on a fixable item waits for staff`, () => {
      const res = evaluateFixup({
        assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
        round: round(run({ [A.id]: { [flag]: true } })),
      });
      assert.equal(res.resolved, false);
      assert.deepEqual(res.pendingItems, [A.id]);
      assert.equal(res.regained, 0);
    });
  }
  it("a missing result waits for staff", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
      round: round(run().filter((r) => r.criterionId !== A.id)),
    });
    assert.deepEqual(res.pendingItems, [A.id]);
  });
  it("manual items wait for staff, then count at 50%", () => {
    const pending = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [M.id]: 0 }), round: round(run()) });
    assert.deepEqual(pending.pendingItems, [M.id]);
    const approved = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [M.id]: 0 }),
      round: round(run(), { approvals: { [M.id]: { points: M.points, approvedAt: NOW.toISOString() } } }),
    });
    assert.equal(approved.resolved, true);
    assert.equal(approved.regained, M.points / 2);
    assert.equal(approved.items.find((i) => i.criterionId === M.id)!.approvedByStaff, true);
  });
  it("staff can approve a TA-review item at 0 (no credit, resolved)", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
      round: round(run({ [A.id]: { needsReview: true } }), { approvals: { [A.id]: { points: 0, approvedAt: NOW.toISOString() } } }),
    });
    assert.equal(res.resolved, true);
    assert.equal(res.regained, 0);
  });
  it("a run that couldn't open the deploy waits for staff", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
      round: round([{ id: "open", label: "open", passed: false, message: "401", needsRecheck: true }]),
    });
    assert.equal(res.resolved, false);
  });
  it("not submitted is not resolved", () => {
    const res = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }), round: round(undefined) });
    assert.equal(res.submitted, false);
    assert.equal(res.resolved, false);
    assert.equal(res.newPoints, res.originalPoints);
  });
});

describe("fix-up: staff override wins", () => {
  it("override replaces the computed total and resolves pending items", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0, [M.id]: 0 }),
      round: round(run({ [A.id]: { needsReview: true } }), { staffOverride: { points: TOTAL - 1, at: NOW.toISOString() } }),
    });
    assert.equal(res.source, "override");
    assert.equal(res.newPoints, TOTAL - 1);
    assert.equal(res.resolved, true);
  });
  it("override is clamped to the rubric max", () => {
    const res = evaluateFixup({
      assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }),
      round: round(run(), { staffOverride: { points: 999, at: NOW.toISOString() } }),
    });
    assert.equal(res.newPoints, TOTAL);
  });
});

describe("fix-up: window", () => {
  const w = (assignmentId: string, opensAt: string, section = "CS5610-02") => ({ assignmentId, section, opensAt });
  it("open for 7 days from the open date", () => {
    const windows = [w("a2", "2026-10-15T12:00:00.000Z")];
    assert.equal(fixupClosesAt("2026-10-15T12:00:00.000Z"), "2026-10-22T12:00:00.000Z");
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS5610-02", now: NOW }).status, "open");
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS5610-02", now: new Date("2026-10-22T12:00:00.000Z") }).status, "closed");
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS5610-02", now: new Date("2026-10-14T00:00:00.000Z") }).status, "not_open");
  });
  it("per section", () => {
    const windows = [w("a2", "2026-10-15T12:00:00.000Z")];
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS4550-01", now: NOW }).status, "none");
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "", now: NOW }).status, "none");
  });
  it("only the most recently graded assignment is open", () => {
    const windows = [w("a1", "2026-10-14T12:00:00.000Z"), w("a2", "2026-10-18T12:00:00.000Z")];
    const a1 = fixupWindowState({ windows, assignmentId: "a1", section: "CS5610-02", now: NOW });
    assert.equal(a1.status, "superseded");
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS5610-02", now: NOW }).status, "open");
  });
  it("a future window for a later assignment doesn't close the current one", () => {
    const windows = [w("a2", "2026-10-18T12:00:00.000Z"), w("a3", "2026-11-01T12:00:00.000Z")];
    assert.equal(fixupWindowState({ windows, assignmentId: "a2", section: "CS5610-02", now: NOW }).status, "open");
  });
});

describe("fix-up: snapshot", () => {
  it("freezes per-criterion auto points and the final total", () => {
    const results = run({ [A.id]: { passed: false } });
    const staffRows = gradeRowsFromResults(
      CRITERIA.map((c) => ({ id: c.id, points: c.points })),
      results,
    ).map((row) => ({ ...row, decided: true, overridePassed: row.criterionId === A.id ? false : true, points: row.criterionId === A.id ? 0 : row.maxPoints }));
    const staff = staffGradeRecordFromRows({ rows: staffRows, checkResults: results, gradedAt: NOW });
    const final = finalGrade({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff });
    assert.equal(final.ready, true);
    const snap = buildFixupSnapshot({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff, final, now: NOW })!;
    assert.equal(snap.points, TOTAL - A.points);
    assert.deepEqual(fixableCriterionIds(snap), [A.id]);
    assert.equal(snap.source, "staff");
  });
  it("no snapshot until the grade is final", () => {
    const results = run();
    const final = finalGrade({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff: null });
    assert.equal(final.ready, false); // manual items ungraded
    assert.equal(buildFixupSnapshot({ assignmentId: "a1", rubric: A1_RUBRIC, results, staff: null, final, now: NOW }), null);
  });
});

describe("fix-up: export", () => {
  const record = (email: string, r: FixupRound, lost: Record<string, number>, section = "CS5610-02"): FixupRecord => ({
    clerkUserId: email, assignmentId: "a1", email, canvasUserId: `c-${email}`, section, original: original(lost), round: r,
  });
  const records = [
    record("b@x.edu", round(run()), { [A.id]: 0, [B.id]: 0 }),
    record("a@x.edu", round(run({ [A.id]: { needsReview: true } })), { [A.id]: 0 }),
    record("c@x.edu", round(undefined), { [A.id]: 0 }),
    record("d@x.edu", round(run()), { [A.id]: 0 }, "CS4550-01"),
  ];
  const rows = buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records, section: "CS5610-02" });

  it("filters by section and puts ready rows first", () => {
    assert.deepEqual(rows.map((r) => r.email), ["b@x.edu", "a@x.edu", "c@x.edu"]);
  });
  it("ready row: points and truncated percent via formatPointsPercent", () => {
    const b = rows[0];
    assert.equal(b.readyForCanvas, true);
    assert.equal(b.originalPoints, TOTAL - 8);
    assert.equal(b.regainedPoints, 4);
    assert.equal(b.newPoints, TOTAL - 4);
    assert.equal(b.newScore, `${TOTAL - 4} / ${TOTAL} (96.8%)`); // 121/125 = 96.8
    assert.equal(b.newPercent, "96.8");
    assert.equal(b.originalScore, `${TOTAL - 8} / ${TOTAL} (93.6%)`);
    assert.equal(b.canvasUserId, "c-b@x.edu");
  });
  it("half points format through formatPointsPercent", () => {
    const one = buildFixupExportRows({
      assignmentId: "a1", rubric: A1_RUBRIC,
      records: [record("e@x.edu", round(run()), { [A.id]: 0, [B.id]: 0, [AUTO[1].id]: 0 })],
    })[0];
    // lost 3+5+3 = 11, regained 5.5 → 119.5 / 125 = 95.6%
    assert.equal(one.newPoints, TOTAL - 5.5);
    assert.equal(one.newScore, `${TOTAL - 5.5} / ${TOTAL} (95.6%)`);
    const frac = buildFixupExportRows({
      assignmentId: "a1", rubric: A1_RUBRIC, records: [record("f@x.edu", round(run()), { [A.id]: 0 })],
    })[0];
    assert.equal(frac.newPoints, TOTAL - 1.5);
    assert.equal(frac.newScore, `${TOTAL - 1.5} / ${TOTAL} (98.8%)`); // 98.8 exactly
  });
  it("pending TA review and not-submitted rows are flagged, not ready", () => {
    assert.equal(rows[1].readyForCanvas, false);
    assert.equal(rows[1].status, "pending_staff");
    assert.equal(rows[1].newPercent, "");
    assert.match(rows[1].reasons, /need staff approval/);
    assert.equal(rows[2].status, "not_submitted");
    assert.equal(rows[2].readyForCanvas, false);
  });
  it("CSV has the header and escapes reasons", () => {
    const csv = fixupExportCsv(rows);
    const lines = csv.trim().split("\n");
    assert.equal(lines[0], FIXUP_EXPORT_HEADERS.join(","));
    assert.equal(lines.length, 4);
    assert.match(lines[1], /^b@x\.edu,c-b@x\.edu,CS5610-02,117,93\.6,/);
    assert.match(lines[1], /,yes,ready,/);
    assert.match(lines[2], /,no,pending_staff,/);
  });
});

describe("fix-up: off by default", () => {
  it("flag is off unless set to 1", async () => {
    const { isAssignmentFixupsEnabled } = await import("../config");
    const prev = process.env.ASSIGNMENT_FIXUPS_ENABLED;
    delete process.env.ASSIGNMENT_FIXUPS_ENABLED;
    assert.equal(isAssignmentFixupsEnabled(), false);
    process.env.ASSIGNMENT_FIXUPS_ENABLED = "true";
    assert.equal(isAssignmentFixupsEnabled(), false);
    process.env.ASSIGNMENT_FIXUPS_ENABLED = "1";
    assert.equal(isAssignmentFixupsEnabled(), true);
    if (prev == null) delete process.env.ASSIGNMENT_FIXUPS_ENABLED;
    else process.env.ASSIGNMENT_FIXUPS_ENABLED = prev;
  });
});

describe("fix-up: export percent truncates (83-point rubric)", () => {
  it("76.5 / 83 is 92.1%, not 92.2%", async () => {
    const { A2_RUBRIC } = await import("./a2");
    const crit = listRubricCriteria(A2_RUBRIC);
    assert.equal(crit.reduce((sum, c) => sum + c.points, 0), 83);
    const auto = crit.filter((c) => criterionCoverage("a2", c.id) === "auto");
    const fixed = auto.find((c) => c.points === 3)!;
    // Frozen total 75; the fixed 3-point item regains 1.5.
    const criteria = crit.map((c) => ({ criterionId: c.id, maxPoints: c.points, points: c.id === fixed.id ? 0 : c.points }));
    const results: AssignmentCheckResult[] = auto.map((c) => ({ id: c.id, criterionId: c.id, label: c.label, message: "", passed: true }));
    const rec: FixupRecord = {
      clerkUserId: "u", assignmentId: "a2", email: "u@x.edu",
      original: { capturedAt: NOW.toISOString(), source: "staff", points: 75, maxPoints: 83, criteria, checkResults: [] },
      round: round(results),
    };
    const [row] = buildFixupExportRows({ assignmentId: "a2", rubric: A2_RUBRIC, records: [rec] });
    assert.equal(row.readyForCanvas, true);
    assert.equal(row.newPoints, 76.5);
    assert.equal(row.newPercent, "92.1");
    assert.equal(row.newScore, "76.5 / 83 (92.1%)");
    assert.equal(row.originalScore, "75 / 83 (90.3%)");
  });
});

describe("QA #231 should-fixes", () => {
  const W = [{ assignmentId: "a1", section: "CS5610-02", opensAt: "2026-10-15T12:00:00.000Z" }];
  const AFTER = new Date("2026-10-23T12:00:00.000Z");

  it("1) a new student run clears a staff override (and approvals)", () => {
    const before = round(run({ [A.id]: { needsReview: true } }), {
      staffOverride: { points: 80, at: NOW.toISOString() },
      approvals: { [A.id]: { points: 3, approvedAt: NOW.toISOString() } },
    });
    const after = applyFixupRun(before, { checkResults: run(), submittedAt: AFTER.toISOString(), githubUrl: "g", vercelUrl: "v" });
    assert.equal(after.staffOverride, undefined);
    assert.equal(after.approvals, undefined);
    const res = evaluateFixup({ assignmentId: "a1", rubric: A1_RUBRIC, original: original({ [A.id]: 0 }), round: after });
    assert.equal(res.source, "fixup");
    assert.equal(res.newPoints, TOTAL - 1.5);
    // The Mongo update clears the same two fields.
    assert.deepEqual(Object.keys(FIXUP_RUN_UNSET.$unset).sort(), ["round.approvals", "round.staffOverride"]);
  });

  it("2) never submitted: not ready while open, ready at the original grade once closed", () => {
    const rec: FixupRecord = { clerkUserId: "u", assignmentId: "a1", email: "u@x.edu", section: "CS5610-02", original: original({ [A.id]: 0 }), round: round(undefined) };
    const open = buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records: [rec], windows: W, now: NOW })[0];
    assert.equal(open.readyForCanvas, false);
    assert.equal(open.status, "not_submitted");
    const closed = buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records: [rec], windows: W, now: AFTER })[0];
    assert.equal(closed.readyForCanvas, true);
    assert.equal(closed.newPoints, TOTAL - 3);
    assert.equal(closed.regainedPoints, 0);
    assert.match(closed.reasons, /no fix-up submitted/);
    // A superseded window also counts as closed.
    const sup = [...W, { assignmentId: "a2", section: "CS5610-02", opensAt: "2026-10-18T12:00:00.000Z" }];
    assert.equal(buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records: [rec], windows: sup, now: NOW })[0].readyForCanvas, true);
    // A submitted round with a pending item stays pending after close.
    const pending = { ...rec, round: round(run({ [A.id]: { needsReview: true } })) };
    assert.equal(buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records: [pending], windows: W, now: AFTER })[0].readyForCanvas, false);
    assert.equal(fixupWindowClosed({ status: "closed", opensAt: "", closesAt: "" }), true);
    assert.equal(fixupWindowClosed({ status: "open", opensAt: "", closesAt: "" }), false);
  });

  it("3) the main Save is blocked only while a round exists and the window is open", () => {
    const rec = { round: round(undefined) };
    const state = (now: Date) => fixupWindowState({ windows: W, assignmentId: "a1", section: "CS5610-02", now });
    assert.equal(mainSaveBlockedByFixup(rec, state(NOW)), true);
    assert.equal(mainSaveBlockedByFixup(null, state(NOW)), false);
    assert.equal(mainSaveBlockedByFixup(rec, state(AFTER)), false);
    assert.match(FIXUP_COPY.mainSaveBlocked, /fix-up form/);
    const form = readFileSync(new URL("../../app/assignments/components/A1SubmissionForm.tsx", import.meta.url), "utf8");
    assert.match(form, /disabled=\{pendingAction !== null \|\| fixupLock\}/);
    const actions = readFileSync(new URL("../../app/assignments/submission-actions.ts", import.meta.url), "utf8");
    assert.match(actions, /mainSaveBlockedByFixup\(record, window\)/);
  });

  it("4) both panels say a new run clears staff approvals", () => {
    assert.match(FIXUP_COPY.approvalsCleared, /clears any staff approvals/);
    for (const file of ["FixupPanel.tsx", "StaffFixupPanel.tsx"]) {
      const text = readFileSync(new URL(`../../app/assignments/components/${file}`, import.meta.url), "utf8");
      assert.match(text, /FIXUP_COPY\.approvalsCleared/, file);
    }
  });

  it("5) section falls back to Canvas metadata, then the submission, and is flagged", () => {
    assert.deepEqual(resolveFixupSection({ rosterSection: "CS5610-02", metadataSection: "X" }), { section: "CS5610-02", source: "roster" });
    assert.deepEqual(resolveFixupSection({ rosterSection: " ", metadataSection: "CS5610-09" }), { section: "CS5610-09", source: "canvas_metadata" });
    assert.deepEqual(resolveFixupSection({ submissionSection: "CS4550-01" }), { section: "CS4550-01", source: "submission" });
    assert.deepEqual(resolveFixupSection({}), { section: undefined, source: "none" });
    assert.equal(sectionFromMetadata({ canvasSection: " CS5610-09 " }), "CS5610-09");
    assert.equal(sectionFromMetadata({ section: 5 }), undefined);
    assert.equal(fixupSectionWarning("roster"), null);
    assert.match(fixupSectionWarning("none")!, /can't get a fix-up window/);
    // A fallback section still gets the window, and the export flags it.
    const rec: FixupRecord = {
      clerkUserId: "u", assignmentId: "a1", email: "u@x.edu", section: "CS5610-02", sectionSource: "canvas_metadata",
      original: original({ [A.id]: 0 }), round: round(run()),
    };
    const [row] = buildFixupExportRows({ assignmentId: "a1", rubric: A1_RUBRIC, records: [rec], section: "CS5610-02" });
    assert.equal(row.sectionSource, "canvas_metadata");
    assert.match(row.reasons, /No roster section/);
    assert.match(fixupExportCsv([row]), /,canvas_metadata,/);
    const staff = readFileSync(new URL("../../app/assignments/components/StaffFixupPanel.tsx", import.meta.url), "utf8");
    assert.match(staff, /sectionWarning/);
  });
});

describe("QA #231 nit: save guard fails closed", () => {
  it("a failed fix-up lookup refuses the main save with a try-again message", () => {
    assert.match(FIXUP_COPY.saveGuardUnavailable, /try again/i);
    const actions = readFileSync(new URL("../../app/assignments/submission-actions.ts", import.meta.url), "utf8");
    const guard = actions.slice(actions.indexOf("fix-up save guard failed") - 400, actions.indexOf("fix-up save guard failed") + 300);
    assert.match(guard, /catch \(error\)/);
    assert.match(guard, /return \{ ok: false, code: "persist_failed", message: FIXUP_COPY\.saveGuardUnavailable \}/);
  });
});
