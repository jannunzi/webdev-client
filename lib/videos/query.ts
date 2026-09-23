import { normalizeSemesterCode } from "./semester";

export type VideosQuery = {
  section: string;
  course: string;
  semester: string;
};

export function videosHref(
  bookSectionId: string,
  query?: { course?: string; semester?: string },
): string {
  const params = new URLSearchParams();
  params.set("section", bookSectionId);
  if (query?.course) params.set("course", query.course);
  if (query?.semester) params.set("semester", query.semester);
  return `/videos?${params.toString()}`;
}

export function parseVideosQuery(
  raw: {
    section?: string;
    bookSectionId?: string;
    course?: string;
    semester?: string;
  },
  defaults: VideosQuery,
  knownCourses: readonly string[],
): VideosQuery & { semesterValid: boolean; canonical: boolean } {
  const section =
    raw.section?.trim() || raw.bookSectionId?.trim() || defaults.section;
  const courseInput = raw.course?.trim();
  const course = !courseInput
    ? defaults.course
    : (knownCourses.find(
        (id) => id.toUpperCase() === courseInput.toUpperCase(),
      ) ?? courseInput);
  const semesterInput = raw.semester?.trim();
  const normalizedSemester = semesterInput
    ? normalizeSemesterCode(semesterInput)
    : null;
  const semester = !semesterInput
    ? defaults.semester
    : (normalizedSemester ?? semesterInput);
  const canonical =
    raw.section === section &&
    raw.bookSectionId == null &&
    raw.course === course &&
    raw.semester === semester;

  return {
    section,
    course,
    semester,
    semesterValid: normalizedSemester != null || !semesterInput,
    canonical,
  };
}
