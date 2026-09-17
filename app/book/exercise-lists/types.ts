import type { LabExerciseKind } from "@/lib/assignments/a1-lab-exercises";

export type BookExerciseTask = {
  id: string;
  kind: LabExerciseKind;
  description: string;
};

/** One recap parent topic with Lab / On your own / With AI (or whatever exists). */
export type BookExerciseParent = {
  id: string;
  parentLabel: string;
  section: string;
  sectionEnd?: string;
  tasks: readonly BookExerciseTask[];
};
