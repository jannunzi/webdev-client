import {
  academicCalendarDateLabel,
  academicCalendarDayLabel,
  academicCalendarEvents,
  academicCalendarSource,
} from "../data/academicCalendar";
import type { AcademicCalendarEvent } from "../data/types";

function rowClass(event: AcademicCalendarEvent, index: number): string {
  if (event.noClasses) {
    return "border-b border-amber-200 bg-amber-50 text-neutral-800";
  }
  if (event.kind === "exams") {
    return "border-b border-neutral-200 bg-sky-50";
  }
  return index % 2 === 1
    ? "border-b border-neutral-200 bg-[#f5efe6]"
    : "border-b border-neutral-200 bg-white";
}

export default function AcademicCalendarTable() {
  return (
    <>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Day</th>
              <th className="px-3 py-2 font-semibold">Event</th>
            </tr>
          </thead>
          <tbody>
            {academicCalendarEvents.map((event, index) => (
              <tr
                key={`${event.date}-${event.label}`}
                className={rowClass(event, index)}
              >
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  {academicCalendarDateLabel(event)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  {academicCalendarDayLabel(event)}
                </td>
                <td className="px-3 py-2">
                  {event.noClasses ? (
                    <span className="font-medium">{event.label}</span>
                  ) : (
                    event.label
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-sm text-neutral-600">
        Source:{" "}
        <a href={academicCalendarSource.href} target="_blank" rel="noreferrer">
          {academicCalendarSource.label}
        </a>
        {" · "}
        <a href={academicCalendarSource.pdfHref} target="_blank" rel="noreferrer">
          {academicCalendarSource.pdfLabel}
        </a>
        . Dates are subject to change.
      </p>
    </>
  );
}
