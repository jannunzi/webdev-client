import { eachDateInclusive, dateInInclusiveRange, compareIso } from "./dates";
import { holidays } from "./holidays";
import { meetings } from "./meetings";
import { lectureTopics } from "./topics";
import type { AgendaRow, Holiday, IsoDate } from "./types";

function holidayOn(iso: IsoDate, list: Holiday[]): Holiday | undefined {
  return list.find((holiday) =>
    dateInInclusiveRange(iso, holiday.start, holiday.end),
  );
}

function collectMeetingDates(): { date: IsoDate; intro: boolean }[] {
  const regular = eachDateInclusive(meetings.firstMeeting, meetings.lastMeeting)
    .filter((iso) => {
      const day = new Date(
        Number(iso.slice(0, 4)),
        Number(iso.slice(5, 7)) - 1,
        Number(iso.slice(8, 10)),
      ).getDay();
      return meetings.daysOfWeek.includes(day as 0 | 1 | 2 | 3 | 4 | 5 | 6);
    })
    .map((date) => ({ date, intro: false }));

  const extras = meetings.extraMeetings.map((meeting) => ({
    date: meeting.date,
    intro: true,
  }));

  const byDate = new Map<IsoDate, { date: IsoDate; intro: boolean }>();
  for (const row of [...regular, ...extras]) {
    const existing = byDate.get(row.date);
    if (!existing) byDate.set(row.date, row);
    else if (row.intro) byDate.set(row.date, row);
  }

  return [...byDate.values()].sort((a, b) => compareIso(a.date, b.date));
}

/**
 * Builds dated agenda rows from the meeting pattern, extra sessions,
 * holiday list, and ordered lecture topics. Holiday dates are labeled
 * (not skipped silently) and do not consume a lecture topic.
 */
export function buildAgenda(): AgendaRow[] {
  const dates = collectMeetingDates();
  const rows: AgendaRow[] = [];
  let topicIndex = 0;
  let lectureNumber = 0;

  for (const { date, intro } of dates) {
    const holiday = holidayOn(date, holidays);
    if (holiday) {
      rows.push({
        date,
        kind: "holiday",
        topic: holiday.label,
      });
      continue;
    }

    const topic = lectureTopics[topicIndex];
    topicIndex += 1;
    lectureNumber += 1;

    rows.push({
      date,
      kind: intro ? "intro" : "lecture",
      lectureNumber,
      topic: topic?.topic ?? "TBA",
      assignment: topic?.assignment,
      quiz: topic?.quiz,
      exam: topic?.exam,
    });
  }

  return rows;
}

export const agenda: AgendaRow[] = buildAgenda();
