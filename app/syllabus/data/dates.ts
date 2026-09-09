import type { DayOfWeek, IsoDate } from "./types";

const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function weekdayName(day: DayOfWeek): string {
  return WEEKDAY_LONG[day];
}

export function formatMeetingPattern(days: DayOfWeek[]): string {
  if (days.length === 0) return "TBA — meeting days not posted";
  return days.map(weekdayName).join(" / ");
}

/** Plural weekday names for copy such as “meets Wednesdays”. */
export function formatMeetingWeekdays(days: DayOfWeek[]): string {
  if (days.length === 0) return "TBA";
  return days.map((day) => `${weekdayName(day)}s`).join(" / ");
}

export function isoWeekday(iso: IsoDate): DayOfWeek {
  return fromIso(iso).getDay() as DayOfWeek;
}

/** Parse `YYYY-MM-DD` as a local calendar date (avoids UTC day-shift). */
export function fromIso(iso: IsoDate): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIso(date: Date): IsoDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatAgendaDate(iso: IsoDate): string {
  return fromIso(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(iso: IsoDate): string {
  return fromIso(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Month D, YYYY — no leading weekday (e.g. September 9, 2026). */
export function formatMonthDayYear(iso: IsoDate): string {
  return fromIso(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSectionMeetsSentence(
  days: DayOfWeek[],
  firstClass: IsoDate,
): string {
  return `This section meets ${formatMeetingWeekdays(days)}, starting ${formatMonthDayYear(firstClass)}.`;
}

export function compareIso(a: IsoDate, b: IsoDate): number {
  return a.localeCompare(b);
}

export function dateInInclusiveRange(
  iso: IsoDate,
  start: IsoDate,
  end: IsoDate,
): boolean {
  return iso >= start && iso <= end;
}

export function eachDateInclusive(start: IsoDate, end: IsoDate): IsoDate[] {
  const dates: IsoDate[] = [];
  const cursor = fromIso(start);
  const last = fromIso(end);
  while (cursor.getTime() <= last.getTime()) {
    dates.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/** Monday of the calendar week containing `iso` (local date, not UTC). */
export function mondayOfWeek(iso: IsoDate): IsoDate {
  const date = fromIso(iso);
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - daysFromMonday);
  return toIso(date);
}

/**
 * Whole weeks between two dates, typically Mondays from `mondayOfWeek`.
 * Negative when `end` is before `start`.
 */
export function wholeWeeksBetween(start: IsoDate, end: IsoDate): number {
  const ms = fromIso(end).getTime() - fromIso(start).getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}
