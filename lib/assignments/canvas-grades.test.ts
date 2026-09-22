import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCanvasGradebookCsv,
  canvasGradeFilename,
  canvasGradeRowsFromStaffQueue,
} from "./canvas-grades";
import { CANVAS_GRADE_SHELL_POINTS } from "./grade";
import type { StaffStudentRow } from "./staff";

function row(
  partial: Partial<StaffStudentRow> & Pick<StaffStudentRow, "key" | "email" | "name">,
): StaffStudentRow {
  return {
    hasSubmission: true,
    ...partial,
  };
}

describe("Canvas assignment grade CSV", () => {
  it("posts percentage for a 100-point shell, not raw 125-point scores", () => {
    const queue = [
      row({
        key: "jane.doe@northeastern.edu",
        email: "jane.doe@northeastern.edu",
        name: "Jane Doe",
        canvasUserId: "12345",
        sisUserId: "001234567",
        section: "CS4550-01",
        staffGrade: {
          earnedPoints: 100,
          totalPoints: 125,
          percent: 80,
          acceptedProposed: true,
          gradedAt: "2026-09-16T00:00:00.000Z",
        },
      }),
      row({
        key: "pat@northeastern.edu",
        email: "pat@northeastern.edu",
        name: "Pat Lee",
        canvasUserId: "67890",
        hasSubmission: false,
      }),
    ];
    const rows = canvasGradeRowsFromStaffQueue(queue);
    assert.equal(rows[0]?.postedScore, 80);
    assert.notEqual(rows[0]?.postedScore, 100);
    assert.notEqual(rows[0]?.postedScore, 125);
    assert.equal(rows[1]?.postedScore, undefined);

    const csv = buildCanvasGradebookCsv({ canvasId: "A1", rows });
    assert.match(csv, /^Student,ID,SIS User ID,SIS Login ID,Section,A1\n/);
    assert.match(
      csv,
      new RegExp(`^Points Possible,,,,,?${CANVAS_GRADE_SHELL_POINTS}$`, "m"),
    );
    assert.match(
      csv,
      /Jane Doe,12345,001234567,jane.doe@northeastern.edu,CS4550-01,80/,
    );
    assert.match(csv, /Pat Lee,67890,,pat@northeastern.edu,,\n/);
    assert.doesNotMatch(csv, /Jane Doe.*,100/);
    assert.doesNotMatch(csv, /,125\n/);
    assert.equal(canvasGradeFilename("a1"), "a1-canvas-grades.csv");
    assert.equal(
      canvasGradeFilename("a1", "CS5610-02 CRN 17395"),
      "a1-canvas-grades-cs5610-02-crn-17395.csv",
    );
  });

  it("escapes quotes and commas in student names", () => {
    const csv = buildCanvasGradebookCsv({
      canvasId: "A1",
      rows: [
        {
          student: 'Doe, Jane "JJ"',
          postedScore: 0,
        },
      ],
    });
    assert.match(csv, /"Doe, Jane ""JJ""",,,,,0/);
  });
});
