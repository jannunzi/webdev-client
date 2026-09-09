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
    start: "2026-11-22",
    end: "2026-11-29",
    label: "Thanksgiving week",
  },
];

export const thanksgivingBlackout = holidays[holidays.length - 1];

export const holidayMeetingNote =
  "University holidays — including Indigenous Peoples’ Day, Veterans Day, and Thanksgiving week (November 22–29) — do not skip a lecture week. If a holiday falls on your meeting day, class meets online that week so the chapter sequence stays on track.";
