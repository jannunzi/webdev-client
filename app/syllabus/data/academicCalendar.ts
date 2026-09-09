import { formatMonthDayYear, isoWeekday, weekdayName } from "./dates";
import type { AcademicCalendarEvent } from "./types";

/**
 * Fall 2026 dates students need from the Northeastern registrar calendar.
 * Omits Session A/B, third-of-term, I Am Here, and faculty grade deadlines.
 */
export const academicCalendarEvents: AcademicCalendarEvent[] = [
  {
    date: "2026-09-07",
    kind: "holiday",
    noClasses: true,
    label: "USA: Labor Day, no classes",
  },
  {
    date: "2026-09-09",
    kind: "term",
    label: "First day of full-semester fall classes",
  },
  {
    date: "2026-09-22",
    kind: "deadline",
    label: "Last day of add/drop period for full-semester fall classes",
  },
  {
    date: "2026-10-12",
    kind: "holiday",
    noClasses: true,
    label: "USA: Indigenous Peoples Day, no classes",
  },
  {
    date: "2026-11-11",
    kind: "holiday",
    noClasses: true,
    label: "USA: Veterans Day, no classes",
  },
  {
    date: "2026-11-25",
    endDate: "2026-11-29",
    kind: "break",
    noClasses: true,
    label: "Fall break, no classes (first day November 25)",
  },
  {
    date: "2026-11-30",
    kind: "term",
    label: "Fall classes resume",
  },
  {
    date: "2026-12-13",
    kind: "term",
    label: "Last day of full-semester fall classes with final exams",
  },
  {
    date: "2026-12-14",
    kind: "exams",
    label: "First day of fall final exam period (if applicable)",
  },
  {
    date: "2026-12-20",
    kind: "exams",
    label: "Last day of fall final exam period (if applicable)",
  },
];

export const academicCalendarIntro =
  "Course-relevant Fall 2026 dates from the university registrar — holidays, the start of classes, add/drop, fall break, and the final exam window. Session A/B and third-of-term rows are omitted.";

export function academicCalendarDateLabel(event: AcademicCalendarEvent): string {
  if (event.endDate && event.endDate !== event.date) {
    return `${formatMonthDayYear(event.date)} – ${formatMonthDayYear(event.endDate)}`;
  }
  return formatMonthDayYear(event.date);
}

export function academicCalendarDayLabel(event: AcademicCalendarEvent): string {
  const start = weekdayName(isoWeekday(event.date));
  if (event.endDate && event.endDate !== event.date) {
    return `${start}–${weekdayName(isoWeekday(event.endDate))}`;
  }
  return start;
}

export const academicCalendarSource = {
  label: "Northeastern University Registrar academic calendar",
  href: "https://registrar.northeastern.edu/article/academic-calendar/",
  pdfHref:
    "https://registrar.northeastern.edu/wp-content/uploads/sites/9/2026-2027-Academic-Calendar.pdf",
  pdfLabel: "2026–2027 Academic Calendar (PDF)",
};
