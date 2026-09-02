import type { Holiday } from "./types";

/**
 * Absolute calendar blackouts. Thanksgiving week is required: no section
 * meets, and skipped days do not consume a lecture number.
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
    start: "2026-11-22",
    end: "2026-11-29",
    label: "Thanksgiving week — no class",
  },
];

export const thanksgivingBlackout = holidays[holidays.length - 1];
