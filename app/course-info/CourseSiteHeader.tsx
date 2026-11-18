import { headers } from "next/headers";
import Link from "next/link";
import { isClerkPublishableKeySet } from "@/lib/config";
import { isMinimalCourseHeader, parseCoursePath } from "@/lib/courses/routes";
import CourseAuthButtons from "./CourseAuthButtons";
import CourseAuthFallback from "./CourseAuthFallback";
import CourseSiteNav from "./CourseSiteNav";

export default async function CourseSiteHeader({
  constrain = true,
  variant = "auto",
}: {
  /**
   * Match the shared `.page-content` reading column. Default on so course
   * chrome lines up with syllabus, book, blog, assignments, and the rest.
   */
  constrain?: boolean;
  /** `home` is the landing wordmark. `full` keeps nav and account controls. */
  variant?: "auto" | "home" | "full";
}) {
  const coursePath = (await headers()).get("x-course-path") ?? "";
  const minimal =
    variant === "home" || (variant !== "full" && isMinimalCourseHeader(coursePath));
  const context = parseCoursePath(coursePath);
  return (
    <header className="course-site-header sticky top-0 z-50 border-b border-neutral-200 bg-white/95 font-sans text-sm backdrop-blur">
      <div className="course-site-header-align">
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6${
            constrain ? " page-content" : ""
          }`}
        >
          {minimal ? (
            <Link
              href="/"
              id="wd-site-home"
              className="font-semibold text-neutral-900 no-underline"
            >
              Khoury
            </Link>
          ) : (
            <>
              <CourseSiteNav context={context} pathname={coursePath} />
              {isClerkPublishableKeySet() ? (
                <CourseAuthButtons />
              ) : (
                <CourseAuthFallback />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
