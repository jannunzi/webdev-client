import type { QuestionType } from "../question-bank";
import type { AnswerWindowInfo } from "./schedule";

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
  language?: "html";
  placeholder?: string;
};

export type StudentAnswer =
  | { type: "multiple_choice"; choiceId: string }
  | { type: "true_false"; value: boolean }
  | { type: "fill_in_blank"; blanks: string[] }
  | { type: "coding"; code: string };

export type GradedAnswer = {
  questionId: string;
  groupId: string;
  type: QuestionType;
  response: StudentAnswer | null;
  correct: boolean;
  points: number;
  maxPoints: number;
  correctReveal?: string;
  /** 0–1 model score for coding items; omitted for binary items. */
  scoreRatio?: number;
  /** Short model note. Hidden until the class answer window. */
  feedback?: string;
  /**
   * Staff-visible grader failure (missing XAI_API_KEY, timeout, bad
   * payload). Safe generic copy is shown to students.
   */
  gradingError?: string;
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
    scoreRatio?: number;
    feedback?: string;
    gradingError?: string;
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
  impersonation?: boolean;
  graded: GradedAnswer[];
  window?: AnswerWindowInfo;
};

export type SubmitExamFailure = {
  ok: false;
  code:
    | "not_configured"
    | "unauthenticated"
    | "not_on_roster"
    | "roster_empty"
    | "invalid"
    | "unknown_quiz"
    | "take_closed"
    | "already_submitted";
  message: string;
};

export type SubmitExamResult = SubmitExamSuccess | SubmitExamFailure;
