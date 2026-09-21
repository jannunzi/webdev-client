import {
  COURSE_SECTION_IDS,
  courseSectionIdFromRoster,
  isCourseSectionId,
  type CourseSectionId,
} from "../roster/sections";
import {
  canRevealAnswers,
  getAnswerRevealPhase,
  getQuizSchedule,
  isScheduledTakeWindow,
  isTakeWindowOpen,
  listQuizSchedules,
  type QuizAnswersVisibleMode,
  type QuizSchedule,
  type QuizTakeOverrideMode,
} from "./schedule";

export type { CourseSectionId, QuizAnswersVisibleMode, QuizTakeOverrideMode };
export { COURSE_SECTION_IDS, courseSectionIdFromRoster, isCourseSectionId };

export type QuizAccessOverrideRecord = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  /** Default `schedule` / unset: follow the class review calendar. */
  answersVisible?: QuizAnswersVisibleMode;
  updatedAt: Date | string;
  updatedBy?: string;
};

export type QuizAccessOverrideView = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  answersVisible: QuizAnswersVisibleMode;
  updatedAt: string;
  updatedBy?: string;
};

export function isOverridableQuizId(quizId: string): boolean {
  return Boolean(getQuizSchedule(quizId));
}

export function listOverridableQuizIds(): string[] {
  return listQuizSchedules().map((schedule) => schedule.quizId);
}

/** `open` enables taking. `closed` / `schedule` / unset stay disabled. */
export function activeTakeOverride(
  mode: QuizTakeOverrideMode | undefined | null,
): QuizTakeOverrideMode | undefined {
  return mode === "open" || mode === "closed" ? mode : undefined;
}

export function lookupOverrideMode(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  sectionId: string | undefined,
): QuizTakeOverrideMode | undefined {
  if (!sectionId) return undefined;
  return overrides.find(
    (row) => row.quizId === quizId && row.sectionId === sectionId,
  )?.mode;
}

export function lookupAnswersVisible(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  sectionId: string | undefined,
): QuizAnswersVisibleMode | undefined {
  if (!sectionId) return undefined;
  return overrides.find(
    (row) => row.quizId === quizId && row.sectionId === sectionId,
  )?.answersVisible;
}

export function answersVisibleForRosterSection(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  rosterSection: string | undefined | null,
): QuizAnswersVisibleMode | undefined {
  return lookupAnswersVisible(
    overrides,
    quizId,
    courseSectionIdFromRoster(rosterSection),
  );
}

export function describeAnswersVisible(
  schedule: QuizSchedule,
  override: QuizAnswersVisibleMode | undefined | null,
  now: Date = new Date(),
): {
  visible: boolean;
  mode: QuizAnswersVisibleMode;
  scheduledVisible: boolean;
} {
  const mode: QuizAnswersVisibleMode =
    override === "on" || override === "off" ? override : "schedule";
  const phase = getAnswerRevealPhase(schedule, now, true);
  return {
    visible: canRevealAnswers(phase, mode),
    mode,
    scheduledVisible: canRevealAnswers(phase),
  };
}

export function takeOverrideForRosterSection(
  overrides: readonly QuizAccessOverrideRecord[],
  quizId: string,
  rosterSection: string | undefined | null,
): QuizTakeOverrideMode | undefined {
  return lookupOverrideMode(
    overrides,
    quizId,
    courseSectionIdFromRoster(rosterSection),
  );
}

export function describeTakeAccess(
  schedule: QuizSchedule,
  override: QuizTakeOverrideMode | undefined | null,
  now: Date = new Date(),
): {
  open: boolean;
  mode: QuizTakeOverrideMode;
  scheduledOpen: boolean;
} {
  const mode: QuizTakeOverrideMode = activeTakeOverride(override) ?? "schedule";
  return {
    open: isTakeWindowOpen(schedule, now, mode),
    mode,
    scheduledOpen: isScheduledTakeWindow(schedule, now),
  };
}

export function toOverrideView(
  doc: QuizAccessOverrideRecord,
): QuizAccessOverrideView {
  const updatedAt =
    doc.updatedAt instanceof Date
      ? doc.updatedAt.toISOString()
      : new Date(doc.updatedAt).toISOString();
  return {
    quizId: doc.quizId,
    sectionId: doc.sectionId,
    mode: doc.mode,
    answersVisible:
      doc.answersVisible === "on" || doc.answersVisible === "off"
        ? doc.answersVisible
        : "schedule",
    updatedAt,
    updatedBy: doc.updatedBy,
  };
}

export function overrideKey(quizId: string, sectionId: string): string {
  return `${quizId}:${sectionId}`;
}
