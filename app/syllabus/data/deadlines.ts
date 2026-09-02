import type { Deadline } from "./types";

/**
 * Absolute Canvas dates shared by every section. Do not shift these when a
 * section starts later — later sections simply have less runway.
 */
export const deadlines: Deadline[] = [
  { date: "2026-09-17", kind: "assignment", label: "A1 assigned — HTML" },
  { date: "2026-09-22", kind: "quiz", label: "Q1 — HTML" },
  { date: "2026-09-29", kind: "assignment", label: "A2 assigned — CSS & Tailwind" },
  { date: "2026-10-01", kind: "assignment", label: "A1 due" },
  { date: "2026-10-06", kind: "quiz", label: "Q2 — CSS & Tailwind" },
  { date: "2026-10-13", kind: "assignment", label: "A2 due · A3 assigned — JavaScript" },
  { date: "2026-10-20", kind: "quiz", label: "Q3 — JavaScript" },
  { date: "2026-10-27", kind: "assignment", label: "A3 due · A4 assigned — Client state" },
  { date: "2026-11-03", kind: "quiz", label: "Q4 — Client state" },
  { date: "2026-11-05", kind: "assignment", label: "A5 assigned — REST APIs" },
  { date: "2026-11-10", kind: "assignment", label: "A4 due" },
  { date: "2026-11-12", kind: "quiz", label: "Q5 — REST APIs" },
  { date: "2026-11-17", kind: "assignment", label: "A5 due · A6 assigned — MongoDB" },
  { date: "2026-11-19", kind: "quiz", label: "Q6 — MongoDB" },
  { date: "2026-12-03", kind: "assignment", label: "A6 due" },
  { date: "2026-12-03", kind: "exam", label: "Exam" },
  { date: "2026-12-10", kind: "project", label: "Project due" },
];

export const deadlinesNote =
  "Assignment, quiz, exam, and project dates are one Canvas calendar for every section. CS 5610-02 starts September 14, so it has less runway before A1.";
