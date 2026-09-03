import type { EvaluationItem, GradeBand } from "./types";

export const evaluationItems: EvaluationItem[] = [
  {
    label: "Assignments (A1–A6)",
    weight: 30,
    description:
      "Six incremental implementations of Kambaz, one per book chapter. Each assignment is submitted as a GitHub repository and a deployed Vercel URL.",
  },
  {
    label: "Quizzes",
    weight: 10,
    description:
      "Short checks after each chapter. Quizzes are typically released with the corresponding assignment and cannot be submitted late.",
  },
  {
    label: "Exam",
    weight: 30,
    description:
      "One written / practical exam covering HTML through MongoDB. Date is listed on the agenda.",
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
  "Weights sum to 100%. Individual assignment and quiz point values are posted with each handout; the category weight above is what enters the final average.",
  "You must submit every assignment and the project to be eligible for a passing grade, even if a late penalty applies.",
];
