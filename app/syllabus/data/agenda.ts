import {
  compareIso,
  dateInInclusiveRange,
  eachDateInclusive,
  isoWeekday,
} from "./dates";
import { deadlines } from "./deadlines";
import { holidays } from "./holidays";
import { sections } from "./sections";
import { lectureTopics } from "./topics";
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

/**
 * Meeting dates for one section: firstClass through lastClass on the
 * configured weekdays. firstClass is always included even if Jose’s
 * placeholder pattern does not yet list that weekday.
 */
export function collectMeetingDates(section: CourseSection): IsoDate[] {
  const patterned = eachDateInclusive(section.firstClass, section.lastClass)
    .filter((iso) => section.daysOfWeek.includes(isoWeekday(iso)));

  const dates = new Set(patterned);
  dates.add(section.firstClass);
  return [...dates].sort(compareIso);
}

/**
 * Projects the shared lecture sequence onto one section’s calendar.
 * Blackout dates are labeled and do not consume a lecture number.
 * Deadline labels are attached only when the Canvas date equals the row date.
 */
export function buildAgenda(section: CourseSection): AgendaRow[] {
  const rows: AgendaRow[] = [];
  let topicIndex = 0;
  let lectureNumber = 0;

  for (const date of collectMeetingDates(section)) {
    const holiday = holidayOn(date, holidays);
    if (holiday) {
      rows.push({
        date,
        kind: "holiday",
        topic: holiday.label,
        deadlines: deadlinesOn(date),
      });
      continue;
    }

    const topic = lectureTopics[topicIndex];
    topicIndex += 1;
    lectureNumber += 1;

    rows.push({
      date,
      kind: "lecture",
      lectureNumber,
      topic: topic?.topic ?? "Project workshop / catch-up",
      deadlines: deadlinesOn(date),
    });
  }

  return rows;
}

export const agendasBySection: Record<string, AgendaRow[]> = Object.fromEntries(
  sections.map((section) => [section.id, buildAgenda(section)]),
);
