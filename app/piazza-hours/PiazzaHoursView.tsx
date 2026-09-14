"use client";

import Link from "next/link";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import { PiazzaBoardLinks } from "@/app/syllabus/components/OfficeHours";
import SectionTabs from "@/app/syllabus/components/SectionTabs";
import { useCourseSection } from "@/app/syllabus/components/useCourseSection";
import {
  staffMembersForSection,
} from "@/app/syllabus/data/officeHours";

export default function PiazzaHoursView() {
  const { section, sections, selectSection } = useCourseSection();
  const staff = staffMembersForSection(section.id);
  const jose = staff.find((member) => member.id === "jose-annunziato");
  const giuseppe = staff.find((member) => member.id === "giuseppe-marotta");
  const sectionTas = staff.filter(
    (member) => member.role === "TA" && member.sectionIds.length === 1,
  );

  return (
    <>
      <SectionTabs
        sections={sections}
        activeId={section.id}
        onSelect={selectSection}
        controlsId="piazza-hours-panel"
      />
      <div id="piazza-hours-panel" role="tabpanel">
        <CourseInfoSection id="boards" title="Class board">
          <PiazzaBoardLinks sectionId={section.id} />
          <p>
            Staff contacts and office hours for this section are on{" "}
            <Link href="/office-hours">Staff and office hours</Link> and the{" "}
            <Link href="/syllabus#office-hours">syllabus</Link>.
          </p>
        </CourseInfoSection>

        <CourseInfoSection id="about" title="What Piazza hours are">
          <p>
            Piazza is the course question-and-answer forum. Use it for homework,
            labs, the book, and the project — not for grade disputes or private
            academic-integrity matters, which belong in email to the instructor.
          </p>
          <p>
            <strong>Piazza hours</strong> are the windows when course staff
            actively monitor the forum and aim to reply. A same-day reply is more
            likely when someone is watching; students may still post at any time.
          </p>
        </CourseInfoSection>

        <CourseInfoSection id="coverage" title="Who is monitoring">
          <p>
            A fixed day-by-day Piazza monitoring grid has not been posted for{" "}
            {section.code}-{section.sectionNumber}. Until one appears on Piazza,
            treat coverage as follows — do not assume Zoom rooms or clock
            windows that are not listed.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>{jose?.name}</strong> (instructor): {jose?.piazzaNote}
            </li>
            <li>
              <strong>{giuseppe?.name}</strong> (course-wide TA):{" "}
              {giuseppe?.piazzaNote} Fixed office hours: TBD.
            </li>
            {sectionTas.length === 0 ? (
              <li>
                Section-specific TA Piazza coverage is{" "}
                <span className="italic text-amber-900">TBD</span> until posted
                on Piazza.
              </li>
            ) : (
              sectionTas.map((member) => (
                <li key={member.id}>
                  <strong>{member.name}</strong> ({section.code}-
                  {section.sectionNumber} TA):{" "}
                  {member.piazzaNote ?? "Piazza hours TBD."}
                </li>
              ))
            )}
          </ul>
        </CourseInfoSection>

        <CourseInfoSection id="how-to-post" title="How to post a useful question">
          <p>
            A short, specific post is easier to answer than a screenshot with no
            context. Include:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              The route or screen (for example{" "}
              <code>/courses/1234/modules</code>).
            </li>
            <li>The exact error message or unexpected behavior.</li>
            <li>
              What you already tried, and which assignment or chapter you are
              on.
            </li>
          </ul>
          <p>
            Search existing threads before opening a new one. If you solve your
            own question, post the fix so others can learn from it.
          </p>
        </CourseInfoSection>
      </div>
    </>
  );
}
