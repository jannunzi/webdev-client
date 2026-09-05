import type { EvaluationItem, GradeBand } from "./types";

export const evaluationItems: EvaluationItem[] = [
  {
    label: "Assignments (A1–A6)",
    weight: 30,
    description:
      "Six incremental implementations of Kambaz, one per book chapter. Each assignment is submitted as a GitHub repository and a deployed Vercel URL.",
  },
  {
    label: "Quizzes (Q1–Q6)",
    weight: 10,
    description:
      "Short checks after each chapter. Each quiz unlocks Monday 00:00 ET after the corresponding assignment due and locks Sunday 23:59 ET. Quizzes cannot be submitted late. Canvas shells are 100 points each; the website scores as a percent and exports to Canvas out of 100.",
  },
  {
    label: "Exams (X1–X2)",
    weight: 30,
    description:
      "X1 is the week after A3 (unlock Monday 2026-10-26, due Sunday 2026-11-01). X2 is exam week (unlock Monday 2026-11-30, due Wednesday 2026-12-03 with the published Exam). Canvas shells are 100 points each; the website scores as a percent and exports to Canvas out of 100.",
  },
  {
    label: "Project",
    weight: 30,
    description:
      "A completed, deployed full-stack application (usually polished Kambaz) with public source and a short written design note.",
  },
];

export const gradeBands: GradeBand[] = [
  { letter: "A", minimum: 93 },
  { letter: "A−", minimum: 90 },
  { letter: "B+", minimum: 87 },
  { letter: "B", minimum: 83 },
  { letter: "B−", minimum: 80 },
  { letter: "C+", minimum: 77 },
  { letter: "C", minimum: 73 },
  { letter: "C−", minimum: 70 },
  { letter: "D+", minimum: 67 },
  { letter: "D", minimum: 63 },
  { letter: "D−", minimum: 60 },
  { letter: "F", minimum: 0 },
];

export const evaluationNotes = [
  "Weights sum to 100%. Canvas grade shells for Q1–Q6 and X1/X2 are 100 points each (empty website-linked quizzes). The website scores as a percent and exports that score to Canvas out of 100; the category weights above are what enter the final average.",
  "You must submit every assignment and the project to be eligible for a passing grade, even if a late penalty applies.",
];
