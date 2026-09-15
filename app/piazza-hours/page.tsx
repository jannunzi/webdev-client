import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import PiazzaHoursView from "./PiazzaHoursView";

export default function PiazzaHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Piazza Hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Choose your section. Piazza is the primary Q&A forum — use it for
            homework, labs, the book, and the project, not email. All times,
            when posted, are America/New_York (Eastern Time).
          </p>
        }
      />
      <PiazzaHoursView />
      <CourseInfoFooter current="/piazza-hours" />
    </article>
  );
}
