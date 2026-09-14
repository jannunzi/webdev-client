"use client";

import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import { StaffOfficeHoursContent } from "@/app/syllabus/components/OfficeHours";
import SectionTabs from "@/app/syllabus/components/SectionTabs";
import { useCourseSection } from "@/app/syllabus/components/useCourseSection";

export default function OfficeHoursView() {
  const { section, sections, selectSection } = useCourseSection();

  return (
    <>
      <SectionTabs
        sections={sections}
        activeId={section.id}
        onSelect={selectSection}
        controlsId="office-hours-panel"
      />
      <CourseInfoSection id="staff" title="Contacts and hours">
        <div id="office-hours-panel" role="tabpanel">
          <StaffOfficeHoursContent
            sectionId={section.id}
            showPageLinks={false}
          />
        </div>
      </CourseInfoSection>
    </>
  );
}
