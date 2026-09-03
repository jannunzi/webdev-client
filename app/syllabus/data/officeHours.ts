import type { OfficeHourRow } from "./types";

/**
 * Teaching assistants and office hours — left empty on purpose.
 * Add rows here when staff are assigned. Do not invent names.
 */
export const officeHoursPlaceholder =
  "Teaching assistants and office hours will be posted here when they are assigned. Until then this table is empty — TBA.";

export const officeHourRows: OfficeHourRow[] = [];

export const officeHourColumns = [
  "Name",
  "Role",
  "Hours",
  "Location",
  "Contact",
] as const;
