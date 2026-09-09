import type { Deadline } from "./types";

/**
 * Shared calendar dates for every section. Do not shift assignment, exam, or
 * project dates per section.
 *
 * Assignment dues are Canvas Sunday 23:59 ET (`all_day_date`). A2–A6 are
 * assigned on the previous assignment’s due day.
 *
 * Student syllabus copy: quizzes are taken at the end of lecture, not as
 * Sunday dues. Website take windows stay in `lib/quiz-exam/schedule.ts`.
 *
 * X1/X2 match Canvas package -20 (ET): X1 locks the Sunday after A3; X2
 * locks Thursday with the published Exam.
 */
export const deadlines: Deadline[] = [
  { date: "2026-09-09", kind: "assignment", label: "A1 assigned — HTML" },
  {
    date: "2026-09-27",
    kind: "assignment",
    label: "A1 due · A2 assigned — CSS & Tailwind",
  },
  {
    kind: "quiz",
    label: "Q1 — HTML (taken at end of lecture)",
  },
  {
    date: "2026-10-11",
    kind: "assignment",
    label: "A2 due · A3 assigned — JavaScript",
  },
  {
    kind: "quiz",
    label: "Q2 — CSS & Tailwind (taken at end of lecture)",
  },
  {
    date: "2026-10-25",
    kind: "assignment",
    label: "A3 due · A4 assigned — Client state",
  },
  {
    kind: "quiz",
    label: "Q3 — JavaScript (taken at end of lecture)",
  },
  {
    date: "2026-11-01",
    kind: "exam",
    label: "X1 due (unlock Oct 26)",
  },
  {
    date: "2026-11-08",
    kind: "assignment",
    label: "A4 due · A5 assigned — REST APIs",
  },
  {
    kind: "quiz",
    label: "Q4 — Client state (taken at end of lecture)",
  },
  {
    date: "2026-11-22",
    kind: "assignment",
    label: "A5 due · A6 assigned — MongoDB",
  },
  {
    kind: "quiz",
    label: "Q5 — REST APIs (taken at end of lecture)",
  },
  {
    date: "2026-12-03",
    kind: "exam",
    label: "Exam · X2 due (unlock Nov 30)",
  },
  { date: "2026-12-06", kind: "assignment", label: "A6 due" },
  { date: "2026-12-10", kind: "project", label: "Project due" },
  {
    kind: "quiz",
    label: "Q6 — MongoDB (taken at end of lecture)",
  },
];

export const deadlinesNote =
  "Assignment, exam, and project dates are one Canvas calendar for every section. Assignments are due Sunday 11:59pm ET. Quizzes (Q1–Q6) are taken at the end of lecture. X1 is due Sunday 11:59pm ET the week after A3. X2 is due Thursday 11:59pm ET of exam week (same day as the published Exam).";
