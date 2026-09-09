import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentsIntro } from "@/app/syllabus/data/assignments";
import { deadlines, deadlinesNote } from "@/app/syllabus/data/deadlines";
import { isoWeekday, weekdayName } from "@/app/syllabus/data/dates";
import { evaluationItems, evaluationNotes } from "@/app/syllabus/data/evaluation";
import { projectBlurb } from "@/app/syllabus/data/project";
import { sections } from "@/app/syllabus/data/sections";
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
    const x1 = deadlines.find(
      (deadline) => deadline.kind === "exam" && deadline.label.startsWith("X1"),
    );
    const examWeek = deadlines.find(
      (deadline) =>
        deadline.kind === "exam" && deadline.date === "2026-12-03",
    );
    const project = deadlines.find((deadline) => deadline.kind === "project");
    assert.equal(x1?.date, "2026-11-01");
    assert.match(x1?.label ?? "", /unlock Oct 26/);
    assert.equal(examWeek?.date, "2026-12-03");
    assert.match(examWeek?.label ?? "", /X2 due/);
    assert.match(examWeek?.label ?? "", /unlock Nov 30/);
    assert.equal(project?.date, "2026-12-10");
  });

  it("labels quizzes as end of lecture, not Sunday dues", () => {
    const expected: Record<string, string> = {
      Q1: "Q1 — HTML (taken at end of lecture)",
      Q2: "Q2 — CSS & Tailwind (taken at end of lecture)",
      Q3: "Q3 — JavaScript (taken at end of lecture)",
      Q4: "Q4 — Client state (taken at end of lecture)",
      Q5: "Q5 — REST APIs (taken at end of lecture)",
      Q6: "Q6 — MongoDB (taken at end of lecture)",
    };
    const quizRows = deadlines.filter((deadline) => deadline.kind === "quiz");
    assert.equal(quizRows.length, 6);
    for (const [id, label] of Object.entries(expected)) {
      const row = quizRows.find((deadline) => deadline.label.startsWith(`${id} `));
      assert.ok(row, `${id} is missing from syllabus deadlines`);
      assert.equal(row.label, label);
      assert.equal(row.date, undefined);
      assert.doesNotMatch(row.label, /\bdue\b/i);
      assert.doesNotMatch(row.label, /unlock/i);
      assert.doesNotMatch(row.label, /Sunday/i);
    }
  });

  it("keeps website take windows in schedule.ts", () => {
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

  it("keeps quiz and exam syllabus copy student-facing", () => {
    const quiz = evaluationItems.find((item) => item.label.includes("Q1"));
    const exams = evaluationItems.find((item) => item.label.includes("X1"));
    assert.ok(quiz);
    assert.ok(exams);
    assert.match(quiz.description, /end of lecture/i);
    assert.match(quiz.description, /10 questions/);
    assert.doesNotMatch(quiz.description, /unlocks Monday/);
    assert.doesNotMatch(quiz.description, /locks Sunday/);
    assert.match(exams.description, /~90 minutes/);
    assert.doesNotMatch(exams.description, /36 questions/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-10-26/);
    assert.doesNotMatch(exams.description, /due Sunday 2026-11-01/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-11-30/);
    assert.doesNotMatch(exams.description, /due Thursday 2026-12-03/);

    const studentCopy = [
      quiz.description,
      exams.description,
      ...evaluationNotes,
      deadlinesNote,
      ...assignmentsIntro,
      ...projectBlurb.paragraphs,
      ...sections.flatMap((section) => section.notes),
    ].join(" ");
    assert.doesNotMatch(studentCopy, /grade shell/i);
    assert.doesNotMatch(studentCopy, /empty website-linked/i);
    assert.doesNotMatch(studentCopy, /website-linked quizzes/i);
    assert.doesNotMatch(studentCopy, /100 points each/i);
    assert.doesNotMatch(studentCopy, /exports? (that score )?to Canvas/i);
    assert.doesNotMatch(studentCopy, /less runway/i);
    assert.doesNotMatch(studentCopy, /do not slide/i);
    assert.doesNotMatch(studentCopy, /section starts later/i);
    assert.doesNotMatch(studentCopy, /chapter quizzes \(Q1–Q6\) are due Sunday/);
    assert.match(deadlinesNote, /Quizzes \(Q1–Q6\) are taken at the end of lecture/);
    assert.doesNotMatch(deadlinesNote, /Quizzes \(Q1–Q6\) are due Sunday/);
    assert.match(studentCopy, /course website/i);
    assert.match(studentCopy, /staff-approved fallback/i);
    assert.match(studentCopy, /ask your instructor or TA before using it/i);
    assert.doesNotMatch(studentCopy, /prior written approval/i);
    assert.match(studentCopy, /up to 5 members/);
    assert.match(
      studentCopy,
      /do not need the instructor.s permission to form a team/,
    );
  });

  it("names X2’s weekday as Thursday to match 2026-12-03", () => {
    assert.equal(weekdayName(isoWeekday("2026-12-03")), "Thursday");
    const exams = evaluationItems.find((item) => item.label.includes("X1"));
    assert.ok(exams, "Exams (X1–X2) evaluation item is missing");
    assert.doesNotMatch(exams.description, /Wednesday 2026-12-03/);
    assert.match(deadlinesNote, /X2 is due Thursday 11:59pm ET/);
    assert.doesNotMatch(deadlinesNote, /X2 is due Wednesday/);
  });
});
