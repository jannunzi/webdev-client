import type { Deadline } from "./types";

/**
 * Absolute Canvas dates shared by every section. Do not shift these when a
 * section starts later — later sections simply have less runway.
 *
 * Assignment dues are Canvas Sunday 23:59 ET (`all_day_date`). Quizzes unlock
 * Monday 00:00 ET after the corresponding assignment due and lock the
 * following Sunday 23:59 ET (same windows as `lib/quiz-exam/schedule.ts`).
 * A2–A6 are assigned on the previous assignment’s due day.
 *
 * X1/X2 match Canvas package -20 (ET): X1 unlocks the Monday after A3 due
 * and locks that Sunday; X2 unlocks exam-week Monday and locks Wednesday
 * with the published Exam. Canvas shells are 100 points; the site scores
 * as a percent and exports to Canvas /100.
 */
export const deadlines: Deadline[] = [
  { date: "2026-09-09", kind: "assignment", label: "A1 assigned — HTML" },
  {
    date: "2026-09-27",
    kind: "assignment",
    label: "A1 due · A2 assigned — CSS & Tailwind",
  },
  {
    date: "2026-10-04",
    kind: "quiz",
    label: "Q1 due — HTML (unlock Sep 28)",
  },
  {
    date: "2026-10-11",
    kind: "assignment",
    label: "A2 due · A3 assigned — JavaScript",
  },
  {
    date: "2026-10-18",
    kind: "quiz",
    label: "Q2 due — CSS & Tailwind (unlock Oct 12)",
  },
  {
    date: "2026-10-25",
    kind: "assignment",
    label: "A3 due · A4 assigned — Client state",
  },
  {
    date: "2026-11-01",
    kind: "quiz",
    label: "Q3 due — JavaScript (unlock Oct 26)",
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
    date: "2026-11-15",
    kind: "quiz",
    label: "Q4 due — Client state (unlock Nov 9)",
  },
  {
    date: "2026-11-22",
    kind: "assignment",
    label: "A5 due · A6 assigned — MongoDB",
  },
  {
    date: "2026-11-29",
    kind: "quiz",
    label: "Q5 due — REST APIs (unlock Nov 23)",
  },
  {
    date: "2026-12-03",
    kind: "exam",
    label: "Exam · X2 due (unlock Nov 30)",
  },
  { date: "2026-12-06", kind: "assignment", label: "A6 due" },
  { date: "2026-12-10", kind: "project", label: "Project due" },
  {
    date: "2026-12-13",
    kind: "quiz",
    label: "Q6 due — MongoDB (unlock Dec 7)",
  },
];

export const deadlinesNote =
  "Assignment, quiz, exam, and project dates are one Canvas calendar for every section. Assignments and chapter quizzes (Q1–Q6) are due Sunday 11:59pm ET. X1 is due Sunday 11:59pm ET the week after A3. X2 is due Wednesday 11:59pm ET of exam week (same day as the published Exam). Canvas quiz and exam shells (Q1–Q6, X1/X2) are 100 points each; the website scores as a percent and exports to Canvas out of 100. CS 5610-02 starts September 14, so it has less runway before A1.";
