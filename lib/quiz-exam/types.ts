import type { QuestionType } from "../question-bank";

export type StudentChoice = {
  id: string;
  text: string;
};

export type StudentQuestion = {
  id: string;
  groupId: string;
  groupName: string;
  groupOrder: number;
  type: QuestionType;
  prompt: string;
  code?: string;
  choices?: StudentChoice[];
  blankCount?: number;
};

export type StudentAnswer =
  | { type: "multiple_choice"; choiceId: string }
  | { type: "true_false"; value: boolean }
  | { type: "fill_in_blank"; blanks: string[] };

export type GradedAnswer = {
  questionId: string;
  groupId: string;
  type: QuestionType;
  response: StudentAnswer | null;
  correct: boolean;
  points: number;
  maxPoints: number;
  correctReveal?: string;
};

export type QuizAttemptDoc = {
  clerkUserId: string;
  email?: string;
  canvasUserId?: string;
  quizId: string;
  startedAt: Date;
  submittedAt: Date;
  score: number;
  maxScore: number;
  answers: Array<{
    questionId: string;
    groupId: string;
    type: QuestionType;
    response: unknown;
    correct: boolean;
    points: number;
  }>;
  meta: {
    drawnQuestionIds: string[];
    rosterEmail?: string;
    durationMs?: number;
    source: "student-exam";
  };
};

export type SubmitExamInput = {
  quizId: string;
  drawnQuestionIds: string[];
  answers: Record<string, StudentAnswer>;
  startedAt: string;
};

export type SubmitExamSuccess = {
  ok: true;
  score: number;
  maxScore: number;
  attemptId?: string;
  persisted: boolean;
  graded: GradedAnswer[];
};

export type SubmitExamFailure = {
  ok: false;
  code:
    | "not_configured"
    | "unauthenticated"
    | "not_on_roster"
    | "roster_empty"
    | "invalid"
    | "unknown_quiz";
  message: string;
};

export type SubmitExamResult = SubmitExamSuccess | SubmitExamFailure;
