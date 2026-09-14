import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import OfficeHoursView from "./OfficeHoursView";

export default function OfficeHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Staff and office hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Choose your section. Each view shows only that section’s instructor
            and TAs. Jose appears in every section. Giuseppe is Piazza-only
            (no live line). Confirmed Teams hours and phones are listed; Zoom
            links are not invented. The live line is walk-up / Teams check-in,
            not calendar booking.
          </p>
        }
      />
      <OfficeHoursView />
      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
