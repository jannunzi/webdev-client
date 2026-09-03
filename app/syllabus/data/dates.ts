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
