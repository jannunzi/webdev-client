import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";
import CourseWebsiteAccountNote from "./CourseWebsiteAccountNote";
import SyllabusSection from "./SyllabusSection";

export default function CourseWebsiteAccounts() {
  return (
    <SyllabusSection
      id="accounts"
      title={COURSE_WEBSITE_ACCOUNT_COPY.heading}
    >
      <CourseWebsiteAccountNote variant="syllabus" />
    </SyllabusSection>
  );
}
