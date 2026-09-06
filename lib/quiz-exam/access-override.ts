import {
  COURSE_SECTION_IDS,
  courseSectionIdFromRoster,
  isCourseSectionId,
  type CourseSectionId,
} from "../roster/sections";
import {
  getQuizSchedule,
  isTakeWindowOpen,
  listQuizSchedules,
  type QuizSchedule,
  type QuizTakeOverrideMode,
} from "./schedule";

export type { CourseSectionId, QuizTakeOverrideMode };
export { COURSE_SECTION_IDS, courseSectionIdFromRoster, isCourseSectionId };

export type QuizAccessOverrideRecord = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  updatedAt: Date | string;
  updatedBy?: string;
};

export type QuizAccessOverrideView = {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  updatedAt: string;
  updatedBy?: string;
};

export function isOverridableQuizId(quizId: string): boolean {
  return Boolean(getQuizSchedule(quizId));
}

export function listOverridableQuizIds(): string[] {
  return listQuizSchedules().map((schedule) => schedule.quizId);
}

/** `open` / `closed` override the date window; `schedule` or unset follows dates. */
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
    scheduledOpen: isTakeWindowOpen(schedule, now),
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
    updatedAt,
    updatedBy: doc.updatedBy,
  };
}

export function overrideKey(quizId: string, sectionId: string): string {
  return `${quizId}:${sectionId}`;
}
