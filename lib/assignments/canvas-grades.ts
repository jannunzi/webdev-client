import { CANVAS_GRADE_SHELL_POINTS, canvasPostedScore } from "./grade";
import type { StaffStudentRow } from "./staff";

/**
 * Canvas gradebook import column set. Values in the assignment column are
 * percentages for a 100-point shell — never raw website checklist points.
 *
 * For the Canvas teammate packing IMSCC / creating shells:
 * keep A1 (and later A2–A6) at 100 points. Website A1 is 125 checklist
 * points; the CSV posts `percent` so 100/125 becomes 80 in Canvas.
 */
export const CANVAS_GRADEBOOK_HEADERS = [
  "Student",
  "ID",
  "SIS User ID",
  "SIS Login ID",
  "Section",
] as const;

export type CanvasGradeExportRow = {
  student: string;
  canvasUserId?: string;
  sisUserId?: string;
  sisLoginId?: string;
  section?: string;
  /** 0–100 posted score. Omit when the student has no staff grade. */
  postedScore?: number;
};

export function canvasGradeFilename(
  assignmentId: string,
  section?: string | null,
): string {
  const slug = assignmentId.trim().toLowerCase() || "assignment";
  const sectionSlug = section
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return sectionSlug
    ? `${slug}-canvas-grades-${sectionSlug}.csv`
    : `${slug}-canvas-grades.csv`;
}

export function canvasGradeRowsFromStaffQueue(
  queue: readonly StaffStudentRow[],
): CanvasGradeExportRow[] {
  return queue.map((row) => ({
    student: row.name || row.email,
    canvasUserId: row.canvasUserId,
    sisUserId: row.sisUserId,
    sisLoginId: row.email || undefined,
    section: row.section,
    postedScore:
      row.staffGrade != null
        ? canvasPostedScore(row.staffGrade)
        : undefined,
  }));
}

function csvField(value: string | number | undefined): string {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Canvas gradebook-style CSV. The assignment column is the posted
 * percentage. The Points Possible row is 100 so imports match a
 * 100-point shell.
 */
export function buildCanvasGradebookCsv(input: {
  canvasId: string;
  rows: readonly CanvasGradeExportRow[];
}): string {
  const assignmentHeader = input.canvasId;
  const header = [...CANVAS_GRADEBOOK_HEADERS, assignmentHeader]
    .map(csvField)
    .join(",");
  const pointsPossible = [
    "Points Possible",
    "",
    "",
    "",
    "",
    CANVAS_GRADE_SHELL_POINTS,
  ]
    .map(csvField)
    .join(",");
  const body = input.rows.map((row) =>
    [
      row.student,
      row.canvasUserId ?? "",
      row.sisUserId ?? "",
      row.sisLoginId ?? "",
      row.section ?? "",
      row.postedScore == null ? "" : row.postedScore,
    ]
      .map(csvField)
      .join(","),
  );
  return [header, pointsPossible, ...body].join("\n") + "\n";
}
