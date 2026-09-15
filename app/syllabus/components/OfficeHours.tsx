import Link from "next/link";
import {
  officeHourColumns,
  officeHourRowsForSection,
  officeHoursIntro,
  officeHoursPlaceholder,
  officeHoursQueueHref,
  piazzaBoardForSection,
  queueEnabledForMember,
  staffGroupsForSection,
} from "../data/officeHours";
import type { PiazzaBoard, StaffMember } from "../data/types";
import SyllabusSection from "./SyllabusSection";

function EmailLink({ email }: { email: string }) {
  return <a href={`mailto:${email}`}>{email}</a>;
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  return `tel:+1${digits}`;
}

function StaffMemberCard({
  member,
  sectionId,
}: {
  member: StaffMember;
  sectionId: string;
}) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <header className="font-sans">
        <h4 className="mt-0 mb-0 text-base font-semibold tracking-tight">
          {member.name}
        </h4>
        <p className="mt-0.5 text-sm text-neutral-600">
          {member.role}
          {" · "}
          {member.sectionLabel}
        </p>
      </header>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Email
          </dt>
          <dd>
            <EmailLink email={member.email} />
          </dd>
        </div>
        {member.alsoEmails && member.alsoEmails.length > 0 ? (
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Also
            </dt>
            <dd className="space-y-0.5">
              {member.alsoEmails.map((email) => (
                <div key={email}>
                  <EmailLink email={email} />
                </div>
              ))}
            </dd>
          </div>
        ) : null}
        {member.altEmails && member.altEmails.length > 0 ? (
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Alternate
            </dt>
            <dd className="space-y-0.5">
              {member.altEmails.map((email) => (
                <div key={email}>
                  <EmailLink email={email} />
                </div>
              ))}
            </dd>
          </div>
        ) : null}
        {member.contactMethod || member.teams ? (
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Contact
            </dt>
            <dd>
              {member.contactMethod}
              {member.teams ? ` · ${member.teams}` : null}
            </dd>
          </div>
        ) : null}
        {member.phone ? (
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Phone
            </dt>
            <dd>
              <a href={phoneHref(member.phone)}>{member.phone}</a>
            </dd>
          </div>
        ) : null}
        <div className={member.hoursStatus === "posted" ? "sm:col-span-2" : ""}>
          <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Office hours
          </dt>
          <dd>
            {member.hoursStatus === "tbd" ? (
              <span className="italic text-amber-900">{member.hoursSummary}</span>
            ) : (
              <>
                {member.location ? (
                  <p className="mb-1">{member.location} (ET)</p>
                ) : null}
                <ul className="list-disc pl-5">
                  {member.hours.map((slot) => (
                    <li key={`${slot.days}-${slot.time}`}>
                      {slot.days}: {slot.time}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {member.hoursNote ? (
              <p className="mt-1 text-neutral-600">{member.hoursNote}</p>
            ) : null}
          </dd>
        </div>
        {member.piazzaHours && member.piazzaHours.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Piazza hours
            </dt>
            <dd>
              <ul className="list-disc pl-5">
                {member.piazzaHours.map((slot) => (
                  <li key={`piazza-${slot.days}-${slot.time}`}>
                    {slot.days}: {slot.time}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      {member.piazzaNote ? (
        <p className="mt-2 text-sm text-neutral-700">{member.piazzaNote}</p>
      ) : null}
      {member.sources && member.sources.length > 0 ? (
        <p className="mt-2 font-sans text-sm text-neutral-600">
          Source:{" "}
          {member.sources.map((source, index) => (
            <span key={source.href}>
              {index > 0 ? " · " : null}
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </span>
          ))}
        </p>
      ) : null}
      {queueEnabledForMember(member) ? (
        <p className="mt-3 font-sans text-sm">
          Live check-in line (walk-up / Teams — not a booking calendar):{" "}
          <Link href={officeHoursQueueHref(member.id, sectionId)}>Join line</Link>
          {" · "}
          <Link href={officeHoursQueueHref(member.id, sectionId)}>View line</Link>
        </p>
      ) : (
        <p className="mt-3 text-sm text-neutral-700">
          Piazza only — no live office-hour line.
        </p>
      )}
    </article>
  );
}

export function PiazzaBoardLinks({ sectionId }: { sectionId: string }) {
  const board: PiazzaBoard = piazzaBoardForSection(sectionId);
  if (!board.href) {
    return (
      <p>
        Piazza is the primary Q&A for this section. The CS 5610-09 class board
        URL is <span className="italic text-amber-900">TBD</span> — use the
        board posted on Canvas/Piazza. Ask course questions there, not email.
      </p>
    );
  }
  return (
    <p>
      Course Q&A for this section:{" "}
      <a href={board.href} target="_blank" rel="noreferrer">
        {board.label}
      </a>
      . Ask course questions on Piazza, not email.
    </p>
  );
}

export function StaffOfficeHoursContent({
  sectionId,
  showPageLinks = true,
}: {
  sectionId: string;
  showPageLinks?: boolean;
}) {
  const groups = staffGroupsForSection(sectionId);
  const rows = officeHourRowsForSection(sectionId);

  return (
    <>
      <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
        {officeHoursIntro}
      </p>
      <PiazzaBoardLinks sectionId={sectionId} />
      {showPageLinks ? (
        <p>
          Dedicated pages: <Link href="/office-hours">Office Hours</Link>
          {" · "}
          <Link href="/piazza-hours">Piazza Hours</Link>.
        </p>
      ) : (
        <p>
          Same contacts on the{" "}
          <Link href="/syllabus#office-hours">syllabus staff section</Link>
          {" · "}
          <Link href="/piazza-hours">Piazza Hours</Link>.
        </p>
      )}
      <p>{officeHoursPlaceholder}</p>

      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`staff-group-${group.id}`}
          className="space-y-3"
        >
          <h3
            id={`staff-group-${group.id}`}
            className="mb-0 font-sans text-lg font-semibold tracking-tight"
          >
            {group.title}
          </h3>
          {group.note ? (
            <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-neutral-900">
              {group.note}
            </p>
          ) : null}
          {group.members.map((member) => (
            <StaffMemberCard
              key={member.id}
              member={member}
              sectionId={sectionId}
            />
          ))}
        </section>
      ))}

      <h3 className="font-sans text-lg font-semibold tracking-tight">
        Summary
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              {officeHourColumns.map((column) => (
                <th key={column} className="px-3 py-2 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-neutral-200 align-top">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.role}</td>
                <td className="px-3 py-2">{row.sections}</td>
                <td className="px-3 py-2">{row.hours}</td>
                <td className="px-3 py-2">{row.location}</td>
                <td className="px-3 py-2">
                  <EmailLink email={row.contact} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function OfficeHours({ sectionId }: { sectionId: string }) {
  return (
    <SyllabusSection id="office-hours" title="Staff and office hours">
      <StaffOfficeHoursContent sectionId={sectionId} />
    </SyllabusSection>
  );
}
