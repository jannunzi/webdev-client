import type { AssignmentCheckResult } from "./check-types";
import { latestResultByCriterion } from "./checks";
import type { AssignmentId } from "./types";

/**
 * One graded criterion. Auto is the autograder result. Override starts equal
 * to Auto. Points default to full credit when Override is checked and 0 when
 * it is not. Staff may set any point value from 0 through maxPoints.
 */
export type CriterionGradeRow = {
  criterionId: string;
  maxPoints: number;
  autoPassed: boolean;
  overridePassed: boolean;
  points: number;
};

export type GradeAudience = "staff" | "student";

/** Latest staff snapshot passed to the page. Dates are ISO strings. */
export type AssignmentGradeView = {
  studentClerkUserId: string;
  assignmentId: AssignmentId;
  githubUrl: string;
  vercelUrl: string;
  rows: CriterionGradeRow[];
  checkResults: AssignmentCheckResult[];
  earnedPoints: number;
  totalPoints: number;
  percent: number;
  gradedByClerkUserId: string;
  gradedByEmail?: string;
  savedAt: string;
};

export type RowFill = "green" | "red" | "yellow" | "neutral";

export type RowPresentation = {
  fill: RowFill;
  changed: boolean;
  /** Visible text. Color is never the only signal. */
  label: string;
  /** Short mark shown beside the label. */
  mark: "✓" | "✗" | "override" | "";
  className: string;
};

export const GRADE_ROW_COPY = {
  fullCredit: "Full credit",
  noCredit: "No credit",
  override: "Override",
  partialCredit: "Partial credit",
  changed: "changed",
  changedSinceGraded: "changed since last graded",
  checkedByStaff: "Checked by staff at grading",
  auto: "Auto",
} as const;

export function defaultPointsFor(overridePassed: boolean, maxPoints: number): number {
  return overridePassed ? maxPoints : 0;
}

export function clampPoints(value: number, maxPoints: number): number {
  if (!Number.isFinite(value)) return 0;
  const max = Math.max(0, maxPoints);
  return Math.min(max, Math.max(0, Math.round(value)));
}

/**
 * Overridden when the Override checkmark differs from Auto, or when the
 * points differ from the default for that checkmark (full points if checked,
 * otherwise 0).
 */
export function isOverridden(row: CriterionGradeRow): boolean {
  if (row.overridePassed !== row.autoPassed) return true;
  return row.points !== defaultPointsFor(row.overridePassed, row.maxPoints);
}

export function withOverrideChecked(
  row: CriterionGradeRow,
  overridePassed: boolean,
): CriterionGradeRow {
  return {
    ...row,
    overridePassed,
    points: defaultPointsFor(overridePassed, row.maxPoints),
  };
}

export function withCustomPoints(
  row: CriterionGradeRow,
  points: number,
): CriterionGradeRow {
  return {
    ...row,
    points: clampPoints(points, row.maxPoints),
  };
}

export function gradePoints(rows: readonly CriterionGradeRow[]): {
  earnedPoints: number;
  totalPoints: number;
  percent: number;
} {
  const earnedPoints = rows.reduce((sum, row) => sum + row.points, 0);
  const totalPoints = rows.reduce((sum, row) => sum + row.maxPoints, 0);
  const percent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  return { earnedPoints, totalPoints, percent };
}

/** Student-facing auto-check total. Manual rows and override points are excluded. */
export function studentAutoPoints(
  rows: readonly CriterionGradeRow[],
  manualIds: ReadonlySet<string>,
): { earnedPoints: number; totalPoints: number } {
  let earnedPoints = 0;
  let totalPoints = 0;
  for (const row of rows) {
    if (manualIds.has(row.criterionId)) continue;
    totalPoints += row.maxPoints;
    if (row.autoPassed) earnedPoints += row.maxPoints;
  }
  return { earnedPoints, totalPoints };
}

export function sanitizeCheckResults(
  results: readonly AssignmentCheckResult[] | null | undefined,
): AssignmentCheckResult[] {
  if (!results) return [];
  return results.slice(0, 200).flatMap((row) => {
    if (!row || typeof row.id !== "string" || typeof row.label !== "string") {
      return [];
    }
    return [
      {
        id: row.id,
        label: row.label,
        passed: Boolean(row.passed),
        message: typeof row.message === "string" ? row.message.slice(0, 500) : "",
        criterionId: typeof row.criterionId === "string" ? row.criterionId : undefined,
        groupId:
          row.groupId === "delivery" || row.groupId === "lab" || row.groupId === "kambaz"
            ? row.groupId
            : undefined,
        skipped: Boolean(row.skipped),
      },
    ];
  });
}

export function gradeRowsFromResults(
  criteria: readonly { id: string; points: number }[],
  results: readonly AssignmentCheckResult[],
): CriterionGradeRow[] {
  const byId = latestResultByCriterion(results);
  return criteria.map((criterion) => {
    const result = byId.get(criterion.id);
    const autoPassed = Boolean(result && result.passed && !result.skipped);
    return {
      criterionId: criterion.id,
      maxPoints: criterion.points,
      autoPassed,
      overridePassed: autoPassed,
      points: defaultPointsFor(autoPassed, criterion.points),
    };
  });
}

export function normalizeGradeRows(
  criteria: readonly { id: string; points: number }[],
  submitted: readonly {
    criterionId: string;
    autoPassed: boolean;
    overridePassed: boolean;
    points: number;
  }[],
): CriterionGradeRow[] {
  const byId = new Map(submitted.map((row) => [row.criterionId, row]));
  return criteria.map((criterion) => {
    const incoming = byId.get(criterion.id);
    const autoPassed = Boolean(incoming?.autoPassed);
    const overridePassed = incoming
      ? Boolean(incoming.overridePassed)
      : autoPassed;
    return {
      criterionId: criterion.id,
      maxPoints: criterion.points,
      autoPassed,
      overridePassed,
      points: clampPoints(
        incoming?.points ?? defaultPointsFor(overridePassed, criterion.points),
        criterion.points,
      ),
    };
  });
}

export function rowDiffersFromSaved(
  current: CriterionGradeRow,
  saved: CriterionGradeRow | undefined,
  audience: GradeAudience,
): boolean {
  if (!saved) return false;
  if (audience === "student") return current.autoPassed !== saved.autoPassed;
  return (
    current.autoPassed !== saved.autoPassed ||
    current.overridePassed !== saved.overridePassed ||
    current.points !== saved.points
  );
}

export function changedCriterionIds(
  current: readonly CriterionGradeRow[],
  saved: readonly CriterionGradeRow[] | null | undefined,
  live: boolean,
  audience: GradeAudience,
): string[] {
  if (!live || !saved?.length) return [];
  const savedById = new Map(saved.map((row) => [row.criterionId, row]));
  return current
    .filter((row) => rowDiffersFromSaved(row, savedById.get(row.criterionId), audience))
    .map((row) => row.criterionId);
}

const FILL_CLASS: Record<RowFill, string> = {
  green: "border-emerald-700 bg-emerald-50 text-emerald-950",
  red: "border-red-700 bg-red-50 text-red-950",
  yellow: "border-amber-700 bg-amber-100 text-amber-950",
  neutral: "border-neutral-300 bg-white text-neutral-950",
};

/**
 * Blue is an edge and a badge, not a fill, so it can sit on green, red, or
 * yellow. Yellow replaces green and red when the row is overridden.
 */
export function rowPresentation(input: {
  row: CriterionGradeRow;
  scored: boolean;
  changed: boolean;
  audience: GradeAudience;
  manual: boolean;
}): RowPresentation {
  const changed = input.scored && input.changed;
  if (!input.scored || (input.audience === "student" && input.manual)) {
    return {
      fill: "neutral",
      changed,
      label:
        input.manual && input.audience === "student"
          ? GRADE_ROW_COPY.checkedByStaff
          : "",
      mark: "",
      className: className("neutral", changed),
    };
  }

  if (input.audience === "staff" && isOverridden(input.row)) {
    const partial =
      input.row.points !== 0 && input.row.points !== input.row.maxPoints;
    return {
      fill: "yellow",
      changed,
      label: partial
        ? `${GRADE_ROW_COPY.override} · ${GRADE_ROW_COPY.partialCredit}`
        : GRADE_ROW_COPY.override,
      mark: "override",
      className: className("yellow", changed),
    };
  }

  const fullCredit =
    input.row.autoPassed &&
    (input.audience === "student" || input.row.points === input.row.maxPoints);
  if (fullCredit && input.row.autoPassed) {
    return {
      fill: "green",
      changed,
      label: GRADE_ROW_COPY.fullCredit,
      mark: "✓",
      className: className("green", changed),
    };
  }

  return {
    fill: "red",
    changed,
    label: GRADE_ROW_COPY.noCredit,
    mark: "✗",
    className: className("red", changed),
  };
}

function className(fill: RowFill, changed: boolean): string {
  const fillClass = FILL_CLASS[fill];
  if (!changed) return fillClass;
  return `${fillClass} shadow-[inset_8px_0_0_0_#075985] ring-2 ring-sky-800`;
}
