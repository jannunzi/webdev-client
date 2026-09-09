import {
  compareIso,
  dateInInclusiveRange,
  eachDateInclusive,
  isoWeekday,
  mondayOfWeek,
  wholeWeeksBetween,
} from "./dates";
import { deadlines } from "./deadlines";
import { holidays } from "./holidays";
import { sections } from "./sections";
import {
  ORIENTATION_TOPIC,
  SHARED_CURRICULUM_START,
  lectureTopics,
} from "./topics";
import type {
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

function deadlinesOn(iso: IsoDate): Deadline[] {
  return deadlines.filter((deadline) => deadline.date === iso);
}

function onlineNoteFor(iso: IsoDate): string | undefined {
  const holiday = holidayOn(iso, holidays);
  return holiday
    ? `${holiday.label} — class meets online if campus is closed`
    : undefined;
}

/**
 * Meeting dates for one section: firstClass through lastClass on the
 * configured weekday (once per week). firstClass is always included.
 */
export function collectMeetingDates(section: CourseSection): IsoDate[] {
  const patterned = eachDateInclusive(section.firstClass, section.lastClass)
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
        deadlines: deadlinesOn(date),
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
      deadlines: deadlinesOn(date),
      onlineNote,
    });
  }

  return rows;
}

export const agendasBySection: Record<string, AgendaRow[]> = Object.fromEntries(
  sections.map((section) => [section.id, buildAgenda(section)]),
);
