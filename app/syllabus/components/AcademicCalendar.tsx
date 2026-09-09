import Link from "next/link";
import { academicCalendarIntro } from "../data/academicCalendar";
import { holidayMeetingNote } from "../data/holidays";
import AcademicCalendarTable from "./AcademicCalendarTable";
import SyllabusSection from "./SyllabusSection";

export default function AcademicCalendar() {
  return (
    <SyllabusSection id="academic-calendar" title="Academic calendar">
      <p>{academicCalendarIntro}</p>
      <p>{holidayMeetingNote}</p>
      <p className="font-sans text-sm text-neutral-600">
        Dedicated page: <Link href="/calendar">Academic Calendar</Link>.
        Chapter weeks stay on the{" "}
        <a href="#agenda">agenda</a> — holidays do not skip a slot.
      </p>
      <AcademicCalendarTable />
    </SyllabusSection>
  );
}
