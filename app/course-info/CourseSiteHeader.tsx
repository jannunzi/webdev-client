import { isClerkPublishableKeySet } from "@/lib/config";
import CourseAuthButtons from "./CourseAuthButtons";
import CourseAuthFallback from "./CourseAuthFallback";
import CourseSiteNav from "./CourseSiteNav";

export default function CourseSiteHeader({
  constrain = false,
}: {
  /** Match the shared `.page-content` reading column (assignments, etc.). */
  constrain?: boolean;
}) {
  return (
    <header className="course-site-header sticky top-0 z-50 border-b border-neutral-200 bg-white/95 font-sans text-sm backdrop-blur">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6${
          constrain ? " page-content" : ""
        }`}
      >
        <CourseSiteNav />
        {isClerkPublishableKeySet() ? (
          <CourseAuthButtons />
        ) : (
          <CourseAuthFallback />
        )}
      </div>
    </header>
  );
}
