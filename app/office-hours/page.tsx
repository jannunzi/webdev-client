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
            and TAs. Shared staff appear in every section. Phone numbers and
            Zoom links were not posted — none are listed here.
          </p>
        }
      />
      <OfficeHoursView />
      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
