export type AssignmentId = "a1" | "a2" | "a3" | "a4" | "a5" | "a6";

export type RubricGroupId = "delivery" | "lab" | "kambaz";

export type RubricCriterion = {
  id: string;
  label: string;
  description: string;
  points: number;
  /** Deep link into the book, e.g. `/book/ch1#sec-1-3-1`. */
  bookHref?: string;
  bookLabel?: string;
  onYourOwn?: boolean;
};

export type RubricGroup = {
  id: RubricGroupId;
  title: string;
  intro?: string;
  criteria: RubricCriterion[];
};

export type AssignmentRubric = {
  assignmentId: AssignmentId;
  groups: RubricGroup[];
};

export type AssignmentStatus = "ready" | "coming_soon";

export type AssignmentHubItem = {
  id: AssignmentId;
  canvasId: string;
  title: string;
  chapter: string;
  chapterTitle: string;
  chapterHref: string;
  publicUrl: string;
  summary: string;
  dueDate?: string;
  assignedDate?: string;
  status: AssignmentStatus;
  rubric?: AssignmentRubric;
};

export type AssignmentProgressDoc = {
  clerkUserId: string;
  assignmentId: AssignmentId;
  criterionId: string;
  completed: boolean;
  updatedAt: Date;
};

export type ProgressSnapshot = {
  assignmentId: AssignmentId;
  completedCriterionIds: string[];
};
