import type { Holiday } from "./types";

/**
 * University holidays that may close campus. Fall 2026 sections still
 * follow the chapter sequence that week and meet online if the meeting
 * day falls in one of these ranges.
 */
export const holidays: Holiday[] = [
  {
    start: "2026-09-07",
    end: "2026-09-07",
    label: "Labor Day",
  },
  {
    start: "2026-10-12",
    end: "2026-10-12",
    label: "Indigenous Peoples’ Day",
  },
  {
    start: "2026-11-11",
    end: "2026-11-11",
    label: "Veterans Day",
  },
  {
    start: "2026-11-25",
    end: "2026-11-29",
    label: "Fall break",
  },
];

export const thanksgivingBlackout = holidays[holidays.length - 1];

export const holidayMeetingNote =
  "University holidays — including Labor Day, Indigenous Peoples’ Day, Veterans Day, and fall break (November 25–29; classes resume November 30) — do not skip a lecture week. Fall break sits in Chapter 6 week 1 (week of Nov 23); Veterans Day sits in Chapter 5 week 1 (week of Nov 9). If a holiday falls on your meeting day, that section meets online so the chapter sequence stays on track.";
