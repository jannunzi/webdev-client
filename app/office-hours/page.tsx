import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import { StaffOfficeHoursContent } from "@/app/syllabus/components/OfficeHours";

export default function OfficeHoursPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Staff and office hours"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Instructor and teaching-assistant contacts for CS 4550 and CS 5610.
            Posted Khoury hours are America/New_York (Eastern Time). Phone
            numbers and Zoom links were not posted — none are listed here.
          </p>
        }
      />

      <CourseInfoSection id="staff" title="Contacts and hours">
        <StaffOfficeHoursContent showPageLinks={false} />
      </CourseInfoSection>

      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
