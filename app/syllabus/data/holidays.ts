import type { Holiday } from "./types";

/**
 * University no-class dates that should appear on (or suppress) the agenda.
 * Thanksgiving week is the one that lands on Tue/Thu in Fall 2026.
 */
export const holidays: Holiday[] = [
  {
    start: "2026-09-07",
    end: "2026-09-07",
    label: "Labor Day — no class",
  },
  {
    start: "2026-10-12",
    end: "2026-10-12",
    label: "Indigenous Peoples’ Day — no class",
  },
  {
    start: "2026-11-11",
    end: "2026-11-11",
    label: "Veterans Day — no class",
  },
  {
    start: "2026-11-24",
    end: "2026-11-29",
    label: "Thanksgiving week — no class",
  },
];
