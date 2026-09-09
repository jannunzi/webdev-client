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
      "Short checks after each chapter. Each quiz draws 10 questions (~30 minutes), unlocks Monday 00:00 ET after the corresponding assignment due, and locks Sunday 23:59 ET. Quizzes cannot be submitted late.",
  },
  {
    label: "Exams (X1–X2)",
    weight: 30,
    description:
      "X1 is the week after A3. X2 is exam week. Each exam draws 36 questions (~90 minutes).",
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
  "Weights sum to 100%. The category weights above are what enter the final average.",
  "Graded quizzes and exams are taken online on this course website. Canvas is a staff-approved fallback if the site is unavailable — ask your instructor or TA before using it.",
  "You must submit every assignment and the project to be eligible for a passing grade, even if a late penalty applies.",
];
