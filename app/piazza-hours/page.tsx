import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import { PiazzaBoardLinks } from "@/app/syllabus/components/OfficeHours";
import { staffMembers } from "@/app/syllabus/data/officeHours";

const giuseppe = staffMembers.find((member) => member.id === "giuseppe-marotta");
const jose = staffMembers.find((member) => member.id === "jose-annunziato");

export default function PiazzaHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Piazza Hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Piazza is the primary Q&A forum. Use it for homework, labs, the
            book, and the project — not email. All times, when posted, are
            America/New_York (Eastern Time).
          </p>
        }
      />

      <CourseInfoSection id="boards" title="Class boards">
        <PiazzaBoardLinks />
        <p>
          Staff contacts and Khoury office hours are on{" "}
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
          A fixed day-by-day Piazza monitoring grid has not been posted. Until
          one appears, treat coverage as follows — do not assume Zoom rooms or
          clock windows that are not listed.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>{giuseppe?.name}</strong> (all sections):{" "}
            {giuseppe?.piazzaNote} Fixed office hours: TBD.
          </li>
          <li>
            <strong>{jose?.name}</strong> (instructor): {jose?.piazzaNote}
          </li>
          <li>
            Section TAs answer on their boards when they can. Posted Khoury
            hours are on the{" "}
            <Link href="/office-hours">staff page</Link>, not a Piazza clock
            grid.
          </li>
        </ul>
      </CourseInfoSection>

      <CourseInfoSection id="how-to-post" title="How to post a useful question">
        <p>
          A short, specific post is easier to answer than a screenshot with no
          context. Include:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>The route or screen (for example <code>/courses/1234/modules</code>).</li>
          <li>The exact error message or unexpected behavior.</li>
          <li>What you already tried, and which assignment or chapter you are on.</li>
        </ul>
        <p>
          Search existing threads before opening a new one. If you solve your
          own question, post the fix so others can learn from it.
        </p>
      </CourseInfoSection>

      <CourseInfoFooter current="/piazza-hours" />
    </article>
  );
}
