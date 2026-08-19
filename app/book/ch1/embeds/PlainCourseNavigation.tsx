import Link from "next/link";

/**
 * Plain Chapter 1 Course Navigation — browser-default links + &lt;br /&gt;.
 * Keep this for book demos so Ch1 figures stay unstyled after Ch2 styles
 * the live `app/(kambaz)/courses/[cid]/Navigation.tsx`.
 */
export default function PlainCourseNavigation({
  cid = "1234",
}: {
  cid?: string;
}) {
  return (
    <div id="wd-courses-navigation">
      <Link href={`/courses/${cid}/home`} id="wd-course-home-link">
        Home
      </Link>
      <br />
      <Link href={`/courses/${cid}/modules`} id="wd-course-modules-link">
        Modules
      </Link>
      <br />
      <Link href={`/courses/${cid}/piazza`} id="wd-course-piazza-link">
        Piazza
      </Link>
      <br />
      <Link href={`/courses/${cid}/zoom`} id="wd-course-zoom-link">
        Zoom
      </Link>
      <br />
      <Link href={`/courses/${cid}/assignments`} id="wd-course-assignments-link">
        Assignments
      </Link>
      <br />
      <Link href={`/courses/${cid}/quizzes`} id="wd-course-quizzes-link">
        Quizzes
      </Link>
      <br />
      <Link href={`/courses/${cid}/grades`} id="wd-course-grades-link">
        Grades
      </Link>
      <br />
      <Link href={`/courses/${cid}/people/table`} id="wd-course-people-link">
        People
      </Link>
      <br />
    </div>
  );
}
