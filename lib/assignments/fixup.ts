/**
 * Fix-up rounds: a student may fix items they lost points on in an
 * already-graded assignment and earn back half of what they fix.
 *
 * Pure logic only (no Mongo, no Clerk) so every rule is unit-tested.
 *
 *   - The original grade is frozen in a snapshot (per-criterion points, the
 *     score, and the staff grade if one was saved). Later re-runs or fix-up
 *     runs never change it.
 *   - One round per student per assignment. The window is one week from the
 *     open date staff set for the assignment and section, and only the most
 *     recently opened assignment for a section is open at any time.
 *   - Only criteria that lost points originally are evaluated. Credit is
 *     original + 0.5 × (new − original), never below the original. Criteria
 *     that earned full points originally stay locked, so a regression never
 *     lowers a score.
 *   - Items the checker can't decide (TA review, re-check, not checked,
 *     manual) count only after staff approve them.
 *   - A staff override of the fix-up total wins.
 *
 * The feature is off unless `ASSIGNMENT_FIXUPS_ENABLED=1` (see config.ts).
 */
import { criterionCoverage } from "./checkers";
import { checkRunStatus } from "./check-status";
import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import { listRubricCriteria, rubricPointTotal } from "./catalog";
import type { FinalGrade, FinalGradeStaffInput } from "./final-grade";
import { staffGradeRows } from "./final-grade";
import { formatPointsPercent, pointsPercent } from "./grade";
import type { AssignmentRubric } from "./types";

export const FIXUP_CREDIT_RATE = 0.5;
export const FIXUP_WINDOW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export type FixupCriterionOriginal = {
  criterionId: string;
  maxPoints: number;
  points: number;
};

/** The frozen original grade. Never rewritten once stored. */
export type FixupSnapshot = {
  capturedAt: string;
  source: "staff" | "auto";
  points: number;
  maxPoints: number;
  criteria: FixupCriterionOriginal[];
  /** The check run the original grade was judged against. */
  checkResults: AssignmentCheckResult[];
  /** The saved staff grade at the time, if any (stored as-is). */
  staffGrade?: unknown;
};

/** Staff open date for one assignment + section. Closes 7 days later. */
export type FixupWindow = {
  assignmentId: string;
  section: string;
  opensAt: string;
};

/** Staff decision on one fix-up item: the new raw points (0..max). */
export type FixupApproval = {
  points: number;
  approvedBy?: string;
  approvedAt: string;
};

/** Staff override of the whole fix-up result. Wins over everything. */
export type FixupStaffOverride = {
  points: number;
  by?: string;
  at: string;
  note?: string;
};

export type FixupRound = {
  openedAt: string;
  submittedAt?: string;
  githubUrl?: string;
  vercelUrl?: string;
  checkResults?: AssignmentCheckResult[];
  approvals?: Record<string, FixupApproval>;
  staffOverride?: FixupStaffOverride;
};

export type FixupRecord = {
  clerkUserId: string;
  assignmentId: string;
  email?: string;
  canvasUserId?: string;
  section?: string;
  original: FixupSnapshot;
  round: FixupRound;
};

/** Mongo-safe key for a criterion in `round.approvals`. */
export function fixupApprovalKey(criterionId: string): string {
  return criterionId.replace(/[.$]/g, "_");
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, max), Math.max(0, value));
}

/* ------------------------------------------------------------------ */
/* Snapshot                                                            */
/* ------------------------------------------------------------------ */

/**
 * Freeze the original grade. Returns null unless the grade is final
 * (ready for Canvas): a student can't fix up a grade that isn't posted.
 */
export function buildFixupSnapshot(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  results: readonly AssignmentCheckResult[];
  staff: FinalGradeStaffInput | null;
  final: FinalGrade;
  now: Date;
}): FixupSnapshot | null {
  const { rubric, staff, final } = input;
  if (!final.ready || final.points == null) return null;
  const results = (staff ? staff.checkResults ?? input.results : input.results) ?? [];
  const byStaff = new Map<string, number>();
  if (staff) {
    for (const row of staffGradeRows(rubric, staff, results)) byStaff.set(row.criterionId, row.points);
  }
  const scored = checkRunStatus(results) === "scored";
  const latest = latestResultByCriterion(results);
  const criteria = listRubricCriteria(rubric).map((criterion) => {
    let points: number;
    if (staff) points = byStaff.get(criterion.id) ?? 0;
    else {
      const result = latest.get(criterion.id);
      points = scored && result && !result.skipped && result.passed ? criterion.points : 0;
    }
    return { criterionId: criterion.id, maxPoints: criterion.points, points: clamp(points, criterion.points) };
  });
  return {
    capturedAt: input.now.toISOString(),
    source: staff ? "staff" : "auto",
    points: final.points,
    maxPoints: final.maxPoints,
    criteria,
    checkResults: [...results],
    staffGrade: staff ?? undefined,
  };
}

/** Criteria that lost points in the original (the only ones that can be fixed). */
export function fixableCriterionIds(original: FixupSnapshot): string[] {
  return original.criteria.filter((row) => row.points < row.maxPoints).map((row) => row.criterionId);
}

/* ------------------------------------------------------------------ */
/* Window                                                              */
/* ------------------------------------------------------------------ */

export type FixupWindowState =
  | { status: "none" }
  | { status: "not_open"; opensAt: string; closesAt: string }
  | { status: "open"; opensAt: string; closesAt: string }
  | { status: "closed"; opensAt: string; closesAt: string }
  /** Another assignment's window opened later: only the latest graded one is open. */
  | { status: "superseded"; opensAt: string; closesAt: string; latestAssignmentId: string };

export function fixupClosesAt(opensAt: string): string {
  return new Date(new Date(opensAt).getTime() + FIXUP_WINDOW_DAYS * DAY_MS).toISOString();
}

function validMs(iso: string): number | null {
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? ms : null;
}

export function fixupWindowState(input: {
  windows: readonly FixupWindow[];
  assignmentId: string;
  section: string | undefined | null;
  now: Date;
}): FixupWindowState {
  const section = input.section?.trim();
  if (!section) return { status: "none" };
  const forSection = input.windows.filter(
    (w) => w.section.trim() === section && validMs(w.opensAt) != null,
  );
  const mine = forSection.find((w) => w.assignmentId === input.assignmentId);
  if (!mine) return { status: "none" };
  const now = input.now.getTime();
  const opens = validMs(mine.opensAt)!;
  const closesAt = fixupClosesAt(mine.opensAt);
  const base = { opensAt: new Date(opens).toISOString(), closesAt };
  if (now < opens) return { status: "not_open", ...base };
  // Most recently graded = the latest window that has already opened.
  const latest = forSection
    .filter((w) => validMs(w.opensAt)! <= now)
    .sort((a, b) => validMs(b.opensAt)! - validMs(a.opensAt)!)[0];
  if (latest && latest.assignmentId !== input.assignmentId && validMs(latest.opensAt)! > opens) {
    return { status: "superseded", ...base, latestAssignmentId: latest.assignmentId };
  }
  if (now >= validMs(closesAt)!) return { status: "closed", ...base };
  return { status: "open", ...base };
}

/* ------------------------------------------------------------------ */
/* Credit                                                              */
/* ------------------------------------------------------------------ */

/** original + 0.5 × (new − original), never below original or above max. */
export function fixupCredit(originalPoints: number, newPoints: number, maxPoints: number): number {
  const original = clamp(originalPoints, maxPoints);
  const next = clamp(newPoints, maxPoints);
  if (next <= original) return original;
  return round2(original + FIXUP_CREDIT_RATE * (next - original));
}

export type FixupItemStatus =
  /** Full points originally: locked, not re-evaluated. */
  | "locked"
  /** No fix-up run yet. */
  | "not_submitted"
  /** The new run earned more points (credit is half the gain). */
  | "fixed"
  /** The new run earned nothing more: original points kept. */
  | "not_fixed"
  /** TA review / re-check / not checked / manual: waits for staff. */
  | "pending_staff";

export type FixupItem = {
  criterionId: string;
  maxPoints: number;
  originalPoints: number;
  /** Raw points on the new run (or staff-approved), null while undetermined. */
  newPoints: number | null;
  credit: number;
  regained: number;
  status: FixupItemStatus;
  approvedByStaff: boolean;
  reason: string;
};

export type FixupResult = {
  items: FixupItem[];
  originalPoints: number;
  maxPoints: number;
  regained: number;
  newPoints: number;
  /** "override" when a staff override of the total sets newPoints. */
  source: "fixup" | "override";
  submitted: boolean;
  /** No item still waits for staff (or a staff override is set). */
  resolved: boolean;
  pendingItems: string[];
  reasons: string[];
};

function undeterminedReason(result: AssignmentCheckResult | undefined, scored: boolean): string | null {
  if (!scored) return "the fix-up run couldn't be scored";
  if (!result || result.skipped) return "not checked";
  if (result.needsRecheck) return "needs a re-check";
  if (result.needsReview) return "needs TA review";
  return null;
}

export function evaluateFixup(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  original: FixupSnapshot;
  round: FixupRound | null | undefined;
}): FixupResult {
  const { assignmentId, rubric, original } = input;
  const round = input.round ?? null;
  const submitted = Boolean(round?.submittedAt && round.checkResults);
  const results = round?.checkResults ?? [];
  const scored = checkRunStatus(results) === "scored";
  const latest = latestResultByCriterion(results);
  const approvals = round?.approvals ?? {};
  const originalById = new Map(original.criteria.map((row) => [row.criterionId, row]));

  const items: FixupItem[] = listRubricCriteria(rubric).map((criterion) => {
    const prior = originalById.get(criterion.id);
    const maxPoints = criterion.points;
    const originalPoints = clamp(prior?.points ?? 0, maxPoints);
    const base = { criterionId: criterion.id, maxPoints, originalPoints, approvedByStaff: false };
    if (originalPoints >= maxPoints) {
      return { ...base, newPoints: null, credit: originalPoints, regained: 0, status: "locked", reason: "full points originally" };
    }
    const approval = approvals[fixupApprovalKey(criterion.id)];
    if (approval && submitted) {
      const newPoints = clamp(approval.points, maxPoints);
      const credit = fixupCredit(originalPoints, newPoints, maxPoints);
      return {
        ...base,
        approvedByStaff: true,
        newPoints,
        credit,
        regained: round2(credit - originalPoints),
        status: credit > originalPoints ? "fixed" : "not_fixed",
        reason: "staff decision",
      };
    }
    if (!submitted) {
      return { ...base, newPoints: null, credit: originalPoints, regained: 0, status: "not_submitted", reason: "fix-up not submitted yet" };
    }
    if (criterionCoverage(assignmentId, criterion.id) === "manual") {
      return { ...base, newPoints: null, credit: originalPoints, regained: 0, status: "pending_staff", reason: "graded by staff" };
    }
    const result = latest.get(criterion.id);
    const pending = undeterminedReason(result, scored);
    if (pending) {
      return { ...base, newPoints: null, credit: originalPoints, regained: 0, status: "pending_staff", reason: pending };
    }
    const newPoints = result!.passed ? maxPoints : 0;
    const credit = fixupCredit(originalPoints, newPoints, maxPoints);
    return {
      ...base,
      newPoints,
      credit,
      regained: round2(credit - originalPoints),
      status: credit > originalPoints ? "fixed" : "not_fixed",
      reason: credit > originalPoints ? "fixed on the fix-up run" : "still missing on the fix-up run",
    };
  });

  const maxPoints = rubricPointTotal(rubric);
  // The frozen total is authoritative for the original score.
  const originalPoints = original.points;
  const regained = round2(items.reduce((sum, item) => sum + item.regained, 0));
  const pendingItems = items.filter((item) => item.status === "pending_staff").map((item) => item.criterionId);
  const override = round?.staffOverride;
  const reasons: string[] = [];
  if (override) {
    const newPoints = round2(clamp(override.points, maxPoints));
    return {
      items,
      originalPoints,
      maxPoints,
      regained: round2(newPoints - originalPoints),
      newPoints,
      source: "override",
      submitted,
      resolved: true,
      pendingItems: [],
      reasons: [override.note ? `staff override: ${override.note}` : "staff override"],
    };
  }
  if (!submitted) reasons.push("fix-up not submitted");
  if (pendingItems.length) reasons.push(`${pendingItems.length} item(s) need staff approval`);
  return {
    items,
    originalPoints,
    maxPoints,
    regained,
    newPoints: round2(Math.min(maxPoints, originalPoints + regained)),
    source: "fixup",
    submitted,
    resolved: submitted && pendingItems.length === 0,
    pendingItems,
    reasons,
  };
}

/* ------------------------------------------------------------------ */
/* Staff export (Clair loads it into Canvas)                           */
/* ------------------------------------------------------------------ */

export type FixupExportRow = {
  email: string;
  canvasUserId: string;
  section: string;
  originalPoints: number;
  originalScore: string;
  originalPercent: string;
  regainedPoints: number;
  newPoints: number;
  newScore: string;
  newPercent: string;
  maxPoints: number;
  readyForCanvas: boolean;
  status: "ready" | "pending_staff" | "not_submitted";
  reasons: string;
};

export function buildFixupExportRows(input: {
  assignmentId: string;
  rubric: AssignmentRubric;
  records: readonly FixupRecord[];
  section?: string | null;
}): FixupExportRow[] {
  const section = input.section?.trim();
  return input.records
    .filter((record) => record.assignmentId === input.assignmentId)
    .filter((record) => !section || (record.section ?? "").trim() === section)
    .map((record) => {
      const result = evaluateFixup({
        assignmentId: input.assignmentId,
        rubric: input.rubric,
        original: record.original,
        round: record.round,
      });
      const ready = result.resolved;
      const status: FixupExportRow["status"] = ready
        ? "ready"
        : result.submitted
          ? "pending_staff"
          : "not_submitted";
      const detail = result.items
        .filter((item) => item.status === "fixed" || item.status === "pending_staff")
        .map((item) =>
          item.status === "fixed"
            ? `${item.criterionId} +${item.regained}`
            : `${item.criterionId} (${item.reason})`,
        );
      const reasons = [...result.reasons, ...detail].join("; ") || "no items fixed";
      return {
        email: record.email ?? "",
        canvasUserId: record.canvasUserId ?? "",
        section: record.section ?? "",
        originalPoints: result.originalPoints,
        originalScore: formatPointsPercent(result.originalPoints, result.maxPoints),
        originalPercent: pointsPercent(result.originalPoints, result.maxPoints).toFixed(1),
        regainedPoints: result.regained,
        newPoints: result.newPoints,
        newScore: formatPointsPercent(result.newPoints, result.maxPoints),
        newPercent: ready ? pointsPercent(result.newPoints, result.maxPoints).toFixed(1) : "",
        maxPoints: result.maxPoints,
        readyForCanvas: ready,
        status,
        reasons,
      };
    })
    .sort((a, b) =>
      a.readyForCanvas === b.readyForCanvas
        ? a.email.localeCompare(b.email)
        : a.readyForCanvas
          ? -1
          : 1,
    );
}

function csvCell(value: string | number | boolean): string {
  const text = typeof value === "boolean" ? (value ? "yes" : "no") : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export const FIXUP_EXPORT_HEADERS = [
  "email",
  "canvas_user_id",
  "section",
  "original_points",
  "original_percent",
  "original_score",
  "regained_points",
  "new_points",
  "new_percent",
  "new_score",
  "max_points",
  "ready_for_canvas",
  "status",
  "reasons",
] as const;

export function fixupExportCsv(rows: readonly FixupExportRow[]): string {
  const lines = [FIXUP_EXPORT_HEADERS.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.email,
        row.canvasUserId,
        row.section,
        row.originalPoints,
        row.originalPercent,
        row.originalScore,
        row.regainedPoints,
        row.newPoints,
        row.newPercent,
        row.newScore,
        row.maxPoints,
        row.readyForCanvas,
        row.status,
        row.reasons,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}
