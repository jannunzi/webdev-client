import type { CodingLanguage, CodingPreview, CodingStyle, QuestionType } from "../question-bank";
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
  language?: CodingLanguage;
  style?: CodingStyle;
  placeholder?: string;
  preview?: CodingPreview;
};

export type StudentAnswer =
  | { type: "multiple_choice"; choiceId: string }
  | { type: "true_false"; value: boolean }
  | { type: "fill_in_blank"; blanks: string[] }
  | { type: "coding"; code: string; blanks?: string[] };

export type QuizQuestionOverrideKind = "correct" | "wrong" | "points";

/** Per-student staff override, stored on `quiz_attempts.overrides[questionId]`. */
export type QuizQuestionOverride = {
  kind: QuizQuestionOverrideKind;
  /** Used when `kind === "points"`. Correct/wrong use maxPoints / 0. */
  points?: number;
  updatedBy?: string;
  updatedAt?: Date | string;
};

/**
 * Class-wide mark for one question id, stored in `quiz_grade_overrides`.
 * Custom points stay per-student only.
 */
export type QuizClassQuestionOverride = {
  quizId: string;
  questionId: string;
  scope: "all_students";
  kind: "correct" | "wrong";
  updatedBy?: string;
  updatedAt: Date | string;
};

export type GradedAnswerOverride = {
  scope: "student" | "all_students";
  kind: QuizQuestionOverrideKind;
  points?: number;
};

export type GradedAnswer = {
  questionId: string;
  groupId: string;
  type: QuestionType;
  response: StudentAnswer | null;
  correct: boolean;
  points: number;
  maxPoints: number;
  correctReveal?: string;
  /** 0–1 score for coding items; omitted for binary items. */
  scoreRatio?: number;
  /** Short grader note. Hidden until the class answer window. */
  feedback?: string;
  /**
   * Staff-visible grader failure (missing XAI_API_KEY, timeout, bad
   * payload). Safe generic copy is shown to students.
   */
  gradingError?: string;
  /** Auto-grade before staff overrides. */
  autoCorrect?: boolean;
  autoPoints?: number;
  autoScoreRatio?: number;
  /** Winning staff override, if any. */
  override?: GradedAnswerOverride;
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
  /**
   * Per-student question overrides. Auto `answers[]` stay as submitted;
   * `score` is the effective total after these and class-wide overrides.
   */
  overrides?: Record<string, QuizQuestionOverride>;
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
