import { formatLongDate, formatMeetingPattern } from "../data/dates";
import type { CourseSection, SemesterDates } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function MeetingInfo({
  section,
  semester,
}: {
  section: CourseSection;
  semester: SemesterDates;
}) {
  return (
    <SyllabusSection id="meetings" title="Meeting information">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
        Meeting days and times are placeholders until Jose confirms the official
        schedule. Location is TBA — no room or Zoom link has been posted.
      </p>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Section
          </dt>
          <dd>
            {section.code}-{section.sectionNumber} · CRN {section.crn}
          </dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Pattern
          </dt>
          <dd>
            {formatMeetingPattern(section.daysOfWeek)}{" "}
            <span className="text-neutral-500">(placeholder)</span>
          </dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Time
          </dt>
          <dd>{section.time}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Location
          </dt>
          <dd>{section.location}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            First class
          </dt>
          <dd>{formatLongDate(section.firstClass)}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Final exam window
          </dt>
          <dd>
            {formatLongDate(semester.finalExamPeriod.start)} —{" "}
            {formatLongDate(semester.finalExamPeriod.end)}
          </dd>
        </div>
      </dl>
      {section.notes.map((note) => (
        <p key={note.slice(0, 40)}>{note}</p>
      ))}
    </SyllabusSection>
  );
}
