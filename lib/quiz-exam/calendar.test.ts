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
};

const QUIZ_WINDOWS: Record<string, { unlock: string; due: string }> = {
  Q1: { unlock: "2026-09-21", due: "2026-09-27" },
  Q2: { unlock: "2026-10-05", due: "2026-10-11" },
  Q3: { unlock: "2026-10-19", due: "2026-10-25" },
  Q4: { unlock: "2026-11-02", due: "2026-11-08" },
  Q5: { unlock: "2026-11-16", due: "2026-11-22" },
  Q6: { unlock: "2026-11-30", due: "2026-12-06" },
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
    for (const id of ["A4", "A5", "A6"]) {
      assert.equal(
        deadlines.some(
          (deadline) =>
            deadline.kind === "assignment" && deadline.label.includes(`${id} due`),
        ),
        false,
        `${id} Sunday due should stay unset until Canvas is settled`,
      );
    }
  });

  it("keeps exam and project dates on the published syllabus days", () => {
    const x1 = deadlines.find(
      (deadline) => deadline.kind === "exam" && deadline.label.startsWith("X1"),
    );
    const examWeek = deadlines.find(
      (deadline) =>
        deadline.kind === "exam" && deadline.label.includes("X2"),
    );
    const project = deadlines.find((deadline) => deadline.kind === "project");
    assert.equal(x1?.date, "2026-11-01");
    assert.match(x1?.label ?? "", /unlock Oct 26/);
    assert.equal(examWeek?.date, "2026-12-20");
    assert.match(examWeek?.label ?? "", /X2 due/);
    assert.match(examWeek?.label ?? "", /unlock Dec 14/);
    assert.equal(project?.date, "2026-12-06");
  });

  it("labels quizzes as end of each chapter’s lecture, not Sunday dues", () => {
    const expected: Record<string, { label: string; date: string }> = {
      Q1: {
        label: "Q1 — HTML (end of Chapter 1 lecture)",
        date: "2026-09-21",
      },
      Q2: {
        label: "Q2 — CSS & Tailwind (end of Chapter 2 lecture)",
        date: "2026-10-05",
      },
      Q3: {
        label: "Q3 — JavaScript (end of Chapter 3 lecture)",
        date: "2026-10-19",
      },
      Q4: {
        label: "Q4 — Client state (end of Chapter 4 lecture)",
        date: "2026-11-02",
      },
      Q5: {
        label: "Q5 — REST APIs (end of Chapter 5 lecture)",
        date: "2026-11-16",
      },
      Q6: {
        label: "Q6 — MongoDB (end of Chapter 6 lecture)",
        date: "2026-11-30",
      },
    };
    const quizRows = deadlines.filter((deadline) => deadline.kind === "quiz");
    assert.equal(quizRows.length, 6);
    for (const [id, want] of Object.entries(expected)) {
      const row = quizRows.find((deadline) => deadline.label.startsWith(`${id} `));
      assert.ok(row, `${id} is missing from syllabus deadlines`);
      assert.equal(row.label, want.label);
      assert.equal(row.date, want.date);
      assert.match(row.label, /end of Chapter \d lecture/);
      assert.doesNotMatch(row.label, /\bdue\b/i);
      assert.doesNotMatch(row.label, /unlock/i);
      assert.doesNotMatch(row.label, /Sunday/i);
    }
  });

  it("starts the shared deadlines calendar on 2026-09-14", () => {
    const dated = deadlines.filter((deadline) => deadline.date);
    assert.ok(dated[0]?.date);
    assert.ok(dated[0].date >= "2026-09-14");
    assert.equal(
      deadlines.find((deadline) => deadline.label.startsWith("A1 assigned"))
        ?.date,
      "2026-09-14",
    );
    assert.equal(
      deadlines.some((deadline) => deadline.date && deadline.date < "2026-09-14"),
      false,
    );
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
    assert.match(quiz.description, /end of each chapter/i);
    assert.match(quiz.description, /10 questions/);
    assert.doesNotMatch(quiz.description, /unlocks Monday/);
    assert.doesNotMatch(quiz.description, /locks Sunday/);
    assert.match(exams.description, /~90 minutes/);
    assert.doesNotMatch(exams.description, /36 questions/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-10-26/);
    assert.doesNotMatch(exams.description, /due Sunday 2026-11-01/);
    assert.doesNotMatch(exams.description, /unlock Monday 2026-11-30/);
    assert.doesNotMatch(exams.description, /due Thursday 2026-12-03/);
    assert.doesNotMatch(exams.description, /due Sunday 2026-12-20/);

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
    assert.match(deadlinesNote, /Quizzes \(Q1–Q6\) are taken at the end of lecture at the end of each chapter/);
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

  it("names X2’s weekday as Sunday to match 2026-12-20", () => {
    assert.equal(weekdayName(isoWeekday("2026-12-20")), "Sunday");
    const exams = evaluationItems.find((item) => item.label.includes("X1"));
    assert.ok(exams, "Exams (X1–X2) evaluation item is missing");
    assert.doesNotMatch(exams.description, /Thursday 2026-12-03/);
    assert.match(deadlinesNote, /X2 is due Sunday 11:59pm ET/);
    assert.doesNotMatch(deadlinesNote, /X2 is due Thursday/);
  });
});
