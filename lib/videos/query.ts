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

/** Hub URL. Course and semester are included only when the visitor set them. */
export function videosHubHref(query?: {
  course?: string;
  semester?: string;
}): string {
  const params = new URLSearchParams();
  if (query?.course) params.set("course", query.course);
  if (query?.semester) params.set("semester", query.semester);
  const search = params.toString();
  return search ? `/videos?${search}` : "/videos";
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
): VideosQuery & { semesterValid: boolean; canonical: boolean; hub: boolean } {
  const requested =
    raw.section?.trim() || raw.bookSectionId?.trim() || "";
  const hub = requested.length === 0;
  const section = hub ? "" : requested;
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
  const courseCanonical = !courseInput || raw.course === course;
  const semesterCanonical = !semesterInput || raw.semester === semester;
  const canonical =
    (hub
      ? raw.section == null && raw.bookSectionId == null
      : raw.section === section && raw.bookSectionId == null) &&
    courseCanonical &&
    semesterCanonical;

  return {
    section,
    course,
    semester,
    semesterValid: normalizedSemester != null || !semesterInput,
    canonical,
    hub,
  };
}
