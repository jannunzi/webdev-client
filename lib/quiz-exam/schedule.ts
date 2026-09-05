/**
 * Class-wide Fall 2026 quiz take + answer-review windows.
 *
 * Civil times are America/New_York (ET). Stored values are ISO UTC.
 * Unlock is the same instant for every student — not “one week after you
 * submitted”.
 *
 * Answer windows (package-14 / NOTE-package-13): answers open the Monday
 * 00:00 ET after the due-week Sunday, and close +7d.
 *
 * Take windows follow the same weekly pattern as Q1
 * (unlock Monday 00:00 ET → due Sunday 23:59 ET).
 */

export type ExamName = "midterm" | "final";

export type QuizPhase =
  | "take_open"
  | "take_closed"
  | "submitted_waiting"
  | "answers_open"
  | "answers_closed"
  | "answers_reopen";

export type QuizSchedule = {
  quizId: string;
  takeUnlockAt: Date;
  takeLockAt: Date;
  answersOpenAt: Date;
  answersCloseAt: Date;
  examPrepOpenAt: Date;
  examPrepCloseAt: Date;
  examName: ExamName;
};

export type AnswerWindowInfo = {
  phase: QuizPhase;
  answersOpenAt: string;
  answersCloseAt: string;
  examPrepOpenAt: string;
  examPrepCloseAt: string;
  examName: ExamName;
  revealAnswers: boolean;
};

export type QuizScheduleIso = {
  quizId: string;
  takeUnlockAt: string;
  takeLockAt: string;
  answersOpenAt: string;
  answersCloseAt: string;
  examPrepOpenAt: string;
  examPrepCloseAt: string;
  examName: ExamName;
};

export function scheduleToIso(schedule: QuizSchedule): QuizScheduleIso {
  return {
    quizId: schedule.quizId,
    takeUnlockAt: schedule.takeUnlockAt.toISOString(),
    takeLockAt: schedule.takeLockAt.toISOString(),
    answersOpenAt: schedule.answersOpenAt.toISOString(),
    answersCloseAt: schedule.answersCloseAt.toISOString(),
    examPrepOpenAt: schedule.examPrepOpenAt.toISOString(),
    examPrepCloseAt: schedule.examPrepCloseAt.toISOString(),
    examName: schedule.examName,
  };
}

export function scheduleFromIso(iso: QuizScheduleIso): QuizSchedule {
  return {
    quizId: iso.quizId,
    takeUnlockAt: new Date(iso.takeUnlockAt),
    takeLockAt: new Date(iso.takeLockAt),
    answersOpenAt: new Date(iso.answersOpenAt),
    answersCloseAt: new Date(iso.answersCloseAt),
    examPrepOpenAt: new Date(iso.examPrepOpenAt),
    examPrepCloseAt: new Date(iso.examPrepCloseAt),
    examName: iso.examName,
  };
}

/**
 * Course exam instants (00:00 America/New_York), stored as ISO UTC.
 *
 * The published syllabus has no midterm. It lists one course “Exam” on
 * 2026-12-03 (`app/syllabus/data/deadlines.ts`) and a university final-exam
 * period of 2026-12-14–2026-12-20 (`app/syllabus/data/course.ts`).
 *
 * - `midtermAt` — assumed placeholder (not on the syllabus): Thursday
 *   2026-11-05 00:00 ET, the first weekday after Q3’s Sunday due.
 * - `finalAt` — syllabus Exam date: 2026-12-03 00:00 ET.
 *
 * Edit these two strings when Jose publishes a midterm (or moves the exam).
 * Q1–Q3 reopen `[midtermAt − 7d, midtermAt)`. Q4–Q6 reopen
 * `[finalAt − 7d, finalAt)`.
 */
export const COURSE_EXAMS = {
  midtermAt: "2026-11-05T05:00:00.000Z",
  finalAt: "2026-12-03T05:00:00.000Z",
} as const;

const PRE_MIDTERM_QUIZZES = new Set(["q1", "q2", "q3"]);

/** Q1–Q6 take + first answer windows (ISO UTC). */
const QUIZ_WINDOW_ISO: Record<
  string,
  {
    takeUnlockAt: string;
    takeLockAt: string;
    answersOpenAt: string;
    answersCloseAt: string;
  }
> = {
  q1: {
    takeUnlockAt: "2026-09-28T04:00:00.000Z",
    takeLockAt: "2026-10-05T03:59:00.000Z",
    answersOpenAt: "2026-10-05T04:00:00.000Z",
    answersCloseAt: "2026-10-12T04:00:00.000Z",
  },
  q2: {
    takeUnlockAt: "2026-10-12T04:00:00.000Z",
    takeLockAt: "2026-10-19T03:59:00.000Z",
    answersOpenAt: "2026-10-19T04:00:00.000Z",
    answersCloseAt: "2026-10-26T04:00:00.000Z",
  },
  q3: {
    takeUnlockAt: "2026-10-26T04:00:00.000Z",
    takeLockAt: "2026-11-02T04:59:00.000Z",
    answersOpenAt: "2026-11-02T05:00:00.000Z",
    answersCloseAt: "2026-11-09T05:00:00.000Z",
  },
  q4: {
    takeUnlockAt: "2026-11-09T05:00:00.000Z",
    takeLockAt: "2026-11-16T04:59:00.000Z",
    answersOpenAt: "2026-11-16T05:00:00.000Z",
    answersCloseAt: "2026-11-23T05:00:00.000Z",
  },
  q5: {
    takeUnlockAt: "2026-11-23T05:00:00.000Z",
    takeLockAt: "2026-11-30T04:59:00.000Z",
    answersOpenAt: "2026-11-30T05:00:00.000Z",
    answersCloseAt: "2026-12-07T05:00:00.000Z",
  },
  q6: {
    takeUnlockAt: "2026-12-07T05:00:00.000Z",
    takeLockAt: "2026-12-14T04:59:00.000Z",
    answersOpenAt: "2026-12-14T05:00:00.000Z",
    answersCloseAt: "2026-12-21T05:00:00.000Z",
  },
};

/** nth Sunday of a month (1-based month). Used for US DST bounds. */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number,
): number {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = first.getUTCDay();
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7;
  return day;
}

/**
 * Whether a civil America/New_York wall time is in Eastern Daylight Time
 * (UTC−4). US DST: 2nd Sunday of March 02:00 → 1st Sunday of November 02:00.
 */
export function isEasternDaylightTime(
  year: number,
  month: number,
  day: number,
  hour = 0,
): boolean {
  const startDay = nthWeekdayOfMonth(year, 3, 0, 2);
  const endDay = nthWeekdayOfMonth(year, 11, 0, 1);
  if (month < 3 || month > 11) return false;
  if (month > 3 && month < 11) return true;
  if (month === 3) {
    if (day < startDay) return false;
    if (day > startDay) return true;
    return hour >= 2;
  }
  if (day < endDay) return true;
  if (day > endDay) return false;
  return hour < 2;
}

/** Convert an America/New_York civil time to a UTC `Date`. */
export function etWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const offsetHours = isEasternDaylightTime(year, month, day, hour) ? 4 : 5;
  return new Date(
    Date.UTC(year, month - 1, day, hour + offsetHours, minute, second),
  );
}

function examNameForQuiz(quizId: string): ExamName {
  return PRE_MIDTERM_QUIZZES.has(quizId) ? "midterm" : "final";
}

function examAtForQuiz(quizId: string): Date {
  return new Date(
    examNameForQuiz(quizId) === "midterm"
      ? COURSE_EXAMS.midtermAt
      : COURSE_EXAMS.finalAt,
  );
}

/** One week before an ET midnight, as the same clock time seven calendar days earlier. */
export function examPrepOpenAt(examAt: Date): Date {
  const parts = easternCivilParts(examAt);
  const prior = new Date(Date.UTC(parts.year, parts.month - 1, parts.day - 7));
  return etWallTimeToUtc(
    prior.getUTCFullYear(),
    prior.getUTCMonth() + 1,
    prior.getUTCDate(),
    parts.hour,
    parts.minute,
    parts.second,
  );
}

function easternCivilParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

export function getQuizSchedule(quizId: string): QuizSchedule | undefined {
  const windows = QUIZ_WINDOW_ISO[quizId];
  if (!windows) return undefined;
  const examName = examNameForQuiz(quizId);
  const examPrepCloseAt = examAtForQuiz(quizId);
  return {
    quizId,
    takeUnlockAt: new Date(windows.takeUnlockAt),
    takeLockAt: new Date(windows.takeLockAt),
    answersOpenAt: new Date(windows.answersOpenAt),
    answersCloseAt: new Date(windows.answersCloseAt),
    examPrepOpenAt: examPrepOpenAt(examPrepCloseAt),
    examPrepCloseAt,
    examName,
  };
}

export function listQuizSchedules(): QuizSchedule[] {
  return Object.keys(QUIZ_WINDOW_ISO)
    .map((quizId) => getQuizSchedule(quizId))
    .filter((schedule): schedule is QuizSchedule => Boolean(schedule));
}

export function isTakeWindowOpen(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return t >= schedule.takeUnlockAt.getTime() && t <= schedule.takeLockAt.getTime();
}

export function isInFirstAnswerWindow(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return (
    t >= schedule.answersOpenAt.getTime() && t < schedule.answersCloseAt.getTime()
  );
}

export function isInExamPrepWindow(
  schedule: QuizSchedule,
  now: Date = new Date(),
): boolean {
  const t = now.getTime();
  return (
    t >= schedule.examPrepOpenAt.getTime() &&
    t < schedule.examPrepCloseAt.getTime()
  );
}

/**
 * Class-wide phase for `/quizzes/take/[quizId]`.
 * `now` must be the server clock when deciding whether to leak answers.
 */
export function getAnswerRevealPhase(
  quizIdOrSchedule: string | QuizSchedule,
  now: Date = new Date(),
  hasAttempt = false,
): QuizPhase | null {
  const schedule =
    typeof quizIdOrSchedule === "string"
      ? getQuizSchedule(quizIdOrSchedule)
      : quizIdOrSchedule;
  if (!schedule) return null;

  if (hasAttempt) {
    if (isInFirstAnswerWindow(schedule, now)) return "answers_open";
    if (isInExamPrepWindow(schedule, now)) return "answers_reopen";
    if (now.getTime() < schedule.answersOpenAt.getTime()) {
      return "submitted_waiting";
    }
    return "answers_closed";
  }

  return isTakeWindowOpen(schedule, now) ? "take_open" : "take_closed";
}

export function canRevealAnswers(phase: QuizPhase | null): boolean {
  return phase === "answers_open" || phase === "answers_reopen";
}

export function toAnswerWindowInfo(
  schedule: QuizSchedule,
  phase: QuizPhase,
): AnswerWindowInfo {
  return {
    phase,
    answersOpenAt: schedule.answersOpenAt.toISOString(),
    answersCloseAt: schedule.answersCloseAt.toISOString(),
    examPrepOpenAt: schedule.examPrepOpenAt.toISOString(),
    examPrepCloseAt: schedule.examPrepCloseAt.toISOString(),
    examName: schedule.examName,
    revealAnswers: canRevealAnswers(phase),
  };
}

export function formatEasternDateTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(value);
}

export function examLabel(name: ExamName): string {
  return name === "midterm" ? "midterm" : "final";
}

export type AnswerWindowCopy = {
  title: string;
  paragraphs: string[];
  tone: "ok" | "warn" | "neutral";
};

export function answerWindowCopy(
  schedule: QuizSchedule,
  phase: QuizPhase,
  now: Date = new Date(),
): AnswerWindowCopy {
  const open = formatEasternDateTime(schedule.answersOpenAt);
  const close = formatEasternDateTime(schedule.answersCloseAt);
  const prepOpen = formatEasternDateTime(schedule.examPrepOpenAt);
  const prepClose = formatEasternDateTime(schedule.examPrepCloseAt);
  const exam = examLabel(schedule.examName);
  const prepAgain = `They will be available again one week before the ${exam}, from ${prepOpen} until ${prepClose}.`;

  if (phase === "submitted_waiting") {
    return {
      title: "Answers are not open yet",
      paragraphs: [
        `Correct answers will be available starting ${open}, only for one week, until ${close}.`,
        prepAgain,
      ],
      tone: "warn",
    };
  }

  if (phase === "answers_open") {
    return {
      title: "Answers are available this week",
      paragraphs: [
        `Answers are available only for one week, until ${close}.`,
        prepAgain,
      ],
      tone: "ok",
    };
  }

  if (phase === "answers_reopen") {
    return {
      title: `Answers are available for ${exam} prep`,
      paragraphs: [
        `This is the one-week prep window before the ${exam}. Answers stay visible until ${prepClose}.`,
      ],
      tone: "ok",
    };
  }

  if (phase === "answers_closed") {
    const prepStillAhead = now.getTime() < schedule.examPrepOpenAt.getTime();
    return {
      title: "The answer review window has ended",
      paragraphs: prepStillAhead
        ? [
            `The class review window ended on ${close}.`,
            `Answers will be available again one week before the ${exam}, from ${prepOpen} until ${prepClose}.`,
          ]
        : [
            `The class review window ended on ${close}.`,
            `The ${exam} prep window (${prepOpen} until ${prepClose}) has also ended.`,
          ],
      tone: "warn",
    };
  }

  if (phase === "take_closed") {
    if (now.getTime() < schedule.takeUnlockAt.getTime()) {
      return {
        title: "This quiz is not open yet",
        paragraphs: [
          `New attempts open ${formatEasternDateTime(schedule.takeUnlockAt)} and are due ${formatEasternDateTime(schedule.takeLockAt)}.`,
        ],
        tone: "warn",
      };
    }
    return {
      title: "The take window has closed",
      paragraphs: [
        `New attempts were due ${formatEasternDateTime(schedule.takeLockAt)}. This page is the same URL you will use later to review answers, once the class-wide window opens.`,
      ],
      tone: "warn",
    };
  }

  return {
    title: "Graded quiz",
    paragraphs: [
      `This attempt is open until ${formatEasternDateTime(schedule.takeLockAt)}. Correct answers stay hidden until the class review window.`,
    ],
    tone: "neutral",
  };
}
