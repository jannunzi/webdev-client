import { formatLongDate } from "../data/dates";
import type { MeetingInfo as MeetingInfoData, SemesterDates } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function MeetingInfo({
  meetings,
  semester,
}: {
  meetings: MeetingInfoData;
  semester: SemesterDates;
}) {
  return (
    <SyllabusSection id="meetings" title="Meeting information">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Pattern
          </dt>
          <dd>{meetings.pattern}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Time
          </dt>
          <dd>{meetings.time}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Location
          </dt>
          <dd>{meetings.location}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Modality
          </dt>
          <dd>{meetings.modality}</dd>
        </div>
        <div>
          <dt className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            First / last meeting
          </dt>
          <dd>
            {formatLongDate(meetings.firstMeeting)} —{" "}
            {formatLongDate(meetings.lastMeeting)}
          </dd>
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
      {meetings.extraMeetings.length > 0 ? (
        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Extra sessions
          </p>
          <ul className="mt-1 list-disc pl-6">
            {meetings.extraMeetings.map((session) => (
              <li key={session.date}>
                {formatLongDate(session.date)} — {session.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {meetings.notes.map((note) => (
        <p key={note.slice(0, 40)}>{note}</p>
      ))}
    </SyllabusSection>
  );
}
