import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deadlines } from "@/app/syllabus/data/deadlines";
import { etWallTimeToUtc, getQuizSchedule } from "./schedule";

const CANVAS_ASSIGNMENT_DUES: Record<string, string> = {
  A1: "2026-09-27",
  A2: "2026-10-11",
  A3: "2026-10-25",
  A4: "2026-11-08",
  A5: "2026-11-22",
  A6: "2026-12-06",
};

const QUIZ_WINDOWS: Record<string, { unlock: string; due: string }> = {
  Q1: { unlock: "2026-09-28", due: "2026-10-04" },
  Q2: { unlock: "2026-10-12", due: "2026-10-18" },
  Q3: { unlock: "2026-10-26", due: "2026-11-01" },
  Q4: { unlock: "2026-11-09", due: "2026-11-15" },
  Q5: { unlock: "2026-11-23", due: "2026-11-29" },
  Q6: { unlock: "2026-12-07", due: "2026-12-13" },
};

function easternIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

describe("Fall 2026 Canvas calendar", () => {
  it("keeps assignment dues on the Canvas Sunday all_day_date", () => {
    for (const [id, due] of Object.entries(CANVAS_ASSIGNMENT_DUES)) {
      const row = deadlines.find(
        (deadline) =>
          deadline.kind === "assignment" && deadline.label.includes(`${id} due`),
      );
      assert.ok(row, `${id} due is missing from syllabus deadlines`);
      assert.equal(row.date, due);
    }
  });

  it("keeps exam and project dates on the published syllabus days", () => {
    const exam = deadlines.find((deadline) => deadline.kind === "exam");
    const project = deadlines.find((deadline) => deadline.kind === "project");
    assert.equal(exam?.date, "2026-12-03");
    assert.equal(project?.date, "2026-12-10");
  });

  it("labels each quiz on its Sunday due and mentions the Monday unlock", () => {
    for (const [id, window] of Object.entries(QUIZ_WINDOWS)) {
      const row = deadlines.find(
        (deadline) =>
          deadline.kind === "quiz" && deadline.label.startsWith(`${id} due`),
      );
      assert.ok(row, `${id} due is missing from syllabus deadlines`);
      assert.equal(row.date, window.due);
      const unlock = new Date(`${window.unlock}T12:00:00`);
      const unlockLabel = unlock.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      assert.match(row.label, new RegExp(`unlock ${unlockLabel}`));
    }
  });

  it("keeps syllabus quiz dues aligned with schedule.ts take windows", () => {
    for (const [id, window] of Object.entries(QUIZ_WINDOWS)) {
      const schedule = getQuizSchedule(id.toLowerCase());
      assert.ok(schedule, `${id} is missing from quiz schedule`);
      const [uy, um, ud] = window.unlock.split("-").map(Number);
      const [dy, dm, dd] = window.due.split("-").map(Number);
      assert.equal(
        schedule.takeUnlockAt.toISOString(),
        etWallTimeToUtc(uy, um, ud).toISOString(),
      );
      assert.equal(
        schedule.takeLockAt.toISOString(),
        etWallTimeToUtc(dy, dm, dd, 23, 59).toISOString(),
      );
      assert.equal(easternIsoDate(schedule.takeUnlockAt), window.unlock);
      assert.equal(easternIsoDate(schedule.takeLockAt), window.due);
    }
  });
});
