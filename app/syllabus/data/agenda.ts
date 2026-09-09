import {
  addDays,
  compareIso,
  dateInInclusiveRange,
  eachDateInclusive,
  isoWeekday,
  mondayOfWeek,
  startOfWeekMonday,
  wholeWeeksBetween,
} from "./dates";
import { deadlines } from "./deadlines";
import { holidays } from "./holidays";
import { sections } from "./sections";
import {
  ORIENTATION_TOPIC,
  PROJECT_GRADING_HEADING,
  SHARED_CURRICULUM_END,
  SHARED_CURRICULUM_START,
  bookChapterHeading,
  examModuleHeading,
  lectureTopics,
} from "./topics";
import type {
  AgendaGroup,
  AgendaRow,
  CourseSection,
  Deadline,
  Holiday,
  IsoDate,
} from "./types";

function holidayOn(iso: IsoDate, list: Holiday[]): Holiday | undefined {
  return list.find((holiday) =>
    dateInInclusiveRange(iso, holiday.start, holiday.end),
  );
}

function deadlinesInWeek(iso: IsoDate): Deadline[] {
  const monday = mondayOfWeek(iso);
  return deadlines.filter(
    (deadline) => deadline.date && mondayOfWeek(deadline.date) === monday,
  );
}

/** Last meeting date so the week of Dec 14 (X2) is included. */
export function agendaLastMeeting(section: CourseSection): IsoDate {
  const endMonday = startOfWeekMonday(SHARED_CURRICULUM_END);
  const meetingDow = section.daysOfWeek[0] ?? 1;
  const offset = meetingDow === 0 ? 6 : meetingDow - 1;
  const meetingInFinalWeek = addDays(endMonday, offset);
  return compareIso(meetingInFinalWeek, section.lastClass) > 0
    ? meetingInFinalWeek
    : section.lastClass;
}

function onlineNoteFor(iso: IsoDate): string | undefined {
  const holiday = holidayOn(iso, holidays);
  return holiday
    ? `${holiday.label} — class meets online if campus is closed`
    : undefined;
}

/**
 * Meeting dates for one section: firstClass through the later of
 * lastClass and the section weekday in the week of SHARED_CURRICULUM_END.
 * firstClass is always included.
 */
export function collectMeetingDates(section: CourseSection): IsoDate[] {
  const patterned = eachDateInclusive(section.firstClass, agendaLastMeeting(section))
    .filter((iso) => section.daysOfWeek.includes(isoWeekday(iso)));

  const dates = new Set(patterned);
  dates.add(section.firstClass);
  return [...dates].sort(compareIso);
}

/**
 * Projects the shared book sequence onto one section’s weekday.
 * All sections use the same chapter week from the week of Sep 14.
 * Meetings before that date are orientation and do not start Chapter 1.
 * Holidays still consume the week’s topic; class meets online if needed.
 */
export function buildAgenda(section: CourseSection): AgendaRow[] {
  const rows: AgendaRow[] = [];

  for (const date of collectMeetingDates(section)) {
    const onlineNote = onlineNoteFor(date);

    if (compareIso(date, SHARED_CURRICULUM_START) < 0) {
      rows.push({
        date,
        kind: "orientation",
        topic: ORIENTATION_TOPIC,
        deadlines: deadlinesInWeek(date),
        onlineNote,
      });
      continue;
    }

    const topicIndex = wholeWeeksBetween(
      SHARED_CURRICULUM_START,
      mondayOfWeek(date),
    );
    const topic = lectureTopics[topicIndex];

    rows.push({
      date,
      kind: "lecture",
      lectureNumber: topicIndex + 1,
      topic: topic?.topic ?? "Project workshop / catch-up",
      deadlines: deadlinesInWeek(date),
      onlineNote,
    });
  }

  return rows;
}

function topicMetaForRow(row: AgendaRow) {
  if (row.kind === "orientation" || row.lectureNumber == null) return undefined;
  return lectureTopics[row.lectureNumber - 1];
}

/**
 * Groups a section’s rows under book chapter headings. X1 shares Chapter 4
 * week 1 (grouped under Chapter 4). Project grading is its own week. X2 is
 * the last-week exam group. Date cells still use the shared Monday
 * (“Week of …”).
 */
export function buildAgendaGroups(section: CourseSection): AgendaGroup[] {
  const groups: AgendaGroup[] = [];

  for (const row of buildAgenda(section)) {
    if (row.kind === "orientation") {
      const last = groups[groups.length - 1];
      if (last?.kind === "orientation") {
        last.rows.push(row);
      } else {
        groups.push({
          id: `orientation-${section.id}`,
          kind: "orientation",
          heading: "Orientation",
          rows: [row],
        });
      }
      continue;
    }

    const meta = topicMetaForRow(row);
    if (meta?.project) {
      const last = groups[groups.length - 1];
      if (last?.kind === "project") {
        last.rows.push(row);
      } else {
        groups.push({
          id: "project-grading",
          kind: "project",
          heading: PROJECT_GRADING_HEADING,
          rows: [row],
        });
      }
      continue;
    }

    // Exam-only weeks (X2). X1 is merged into Chapter 4 week 1.
    if (meta?.exam && !meta.chapter) {
      const last = groups[groups.length - 1];
      if (last?.kind === "exam" && last.id === meta.exam.toLowerCase()) {
        last.rows.push(row);
      } else {
        groups.push({
          id: meta.exam.toLowerCase(),
          kind: "exam",
          heading: examModuleHeading(meta.exam),
          rows: [row],
        });
      }
      continue;
    }

    const chapter = meta?.chapter;
    const last = groups[groups.length - 1];
    if (chapter && last?.kind === "chapter" && last.chapter === chapter) {
      last.rows.push(row);
      continue;
    }

    groups.push({
      id: `chapter-${chapter ?? "other"}`,
      kind: "chapter",
      chapter,
      heading: chapter ? bookChapterHeading(chapter) : row.topic,
      rows: [row],
    });
  }

  return groups;
}

export function flattenAgendaGroups(groups: AgendaGroup[]): AgendaRow[] {
  return groups.flatMap((group) => group.rows);
}

export const agendaGroupsBySection: Record<string, AgendaGroup[]> =
  Object.fromEntries(
    sections.map((section) => [section.id, buildAgendaGroups(section)]),
  );

export const agendasBySection: Record<string, AgendaRow[]> = Object.fromEntries(
  sections.map((section) => [section.id, buildAgenda(section)]),
);
