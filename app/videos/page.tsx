import Link from "next/link";
import { redirect } from "next/navigation";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import { bookSectionNumberLabel } from "@/lib/videos/book-section";
import { defaultVideoCourseId, defaultVideoSemester, videoCourseOptions } from "@/lib/videos/courses";
import {
  defaultBookSectionId,
  lectureClipMap,
  listBookSectionIds,
} from "@/lib/videos/map";
import { parseVideosQuery, videosHref } from "@/lib/videos/query";
import { fallbackTierLabel, resolveLectureClip } from "@/lib/videos/resolve";
import { normalizeSemesterCode, semesterRank } from "@/lib/videos/semester";
import VideoClip from "./components/VideoClip";
import VideoPicker from "./components/VideoPicker";

type VideosSearchParams = {
  section?: string | string[];
  bookSectionId?: string | string[];
  course?: string | string[];
  semester?: string | string[];
};

function one(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function semesterChoices(selected: string): string[] {
  const codes = new Set<string>([defaultVideoSemester()]);
  for (const clips of Object.values(lectureClipMap.sections)) {
    for (const clip of clips) codes.add(clip.semester);
  }
  const normalized = normalizeSemesterCode(selected);
  codes.add(normalized ?? selected);
  return [...codes].sort(
    (a, b) => (semesterRank(b) ?? -1) - (semesterRank(a) ?? -1),
  );
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<VideosSearchParams>;
}) {
  const params = await searchParams;
  const fallbackSection = defaultBookSectionId();
  const courses = videoCourseOptions();
  const defaults = {
    section: fallbackSection ?? "",
    course: defaultVideoCourseId(),
    semester: defaultVideoSemester(),
  };
  const query = parseVideosQuery(
    {
      section: one(params.section),
      bookSectionId: one(params.bookSectionId),
      course: one(params.course),
      semester: one(params.semester),
    },
    defaults,
    courses.map((option) => option.id),
  );

  if (!query.section) {
    return (
      <article className="page-content">
        <CourseInfoHeader
          title="Videos"
          lede={
            <p className="mt-4 text-[1.05rem] text-neutral-800">
              No lecture clips are mapped yet. Curated rows live in{" "}
              <code>data/videos/lecture-clips.json</code>.
            </p>
          }
        />
        <CourseInfoFooter current="/videos" />
      </article>
    );
  }

  if (!query.canonical) {
    redirect(
      videosHref(query.section, {
        course: query.course,
        semester: query.semester,
      }),
    );
  }

  const resolved = query.semesterValid
    ? resolveLectureClip(lectureClipMap, {
        bookSectionId: query.section,
        preferredCourse: query.course,
        preferredSemester: query.semester,
      })
    : null;
  const sectionOptions = listBookSectionIds().map((id) => ({
    id,
    label: `§${bookSectionNumberLabel(id)}`,
  }));

  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Videos"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Pick your course section and a book section. When your section has
            a clip for that semester, that clip plays. Otherwise the page uses
            another section from the same semester, then the latest earlier
            semester. Playback is a YouTube embed or a link that opens at the
            start time.
          </p>
        }
      />

      <VideoPicker
        course={query.course}
        semester={query.semester}
        section={query.section}
        courses={courses}
        semesters={semesterChoices(query.semester)}
        sections={sectionOptions}
      />

      {query.semesterValid ? null : (
        <p className="mt-4 text-amber-950" role="alert">
          Semester must look like FA26 or SP26. {query.semester} is not a
          semester code.
        </p>
      )}

      {query.semesterValid && resolved ? (
        <VideoClip
          resolved={resolved}
          preferredCourse={query.course}
          preferredSemester={query.semester}
        />
      ) : null}

      {query.semesterValid && !resolved ? (
        <p className="mt-6" role="status">
          No YouTube clip is mapped for §{bookSectionNumberLabel(query.section)}{" "}
          in {query.semester}, including other sections and earlier semesters.
        </p>
      ) : null}

      <section className="mt-8" aria-labelledby="mapped-sections-heading">
        <h2
          id="mapped-sections-heading"
          className="font-sans text-xl font-semibold"
        >
          Mapped book sections
        </h2>
        <ul className="m-0 list-none p-0">
          {listBookSectionIds().map((id) => {
            const match = query.semesterValid
              ? resolveLectureClip(lectureClipMap, {
                  bookSectionId: id,
                  preferredCourse: query.course,
                  preferredSemester: query.semester,
                })
              : null;
            const href = videosHref(id, {
              course: query.course,
              semester: query.semester,
            });
            const current = id === query.section;
            return (
              <li key={id} className="border-b border-neutral-200 py-2">
                {current ? (
                  <span className="font-medium">
                    §{bookSectionNumberLabel(id)}
                  </span>
                ) : (
                  <Link href={href}>§{bookSectionNumberLabel(id)}</Link>
                )}
                <span className="font-sans text-sm text-neutral-600">
                  {" "}
                  ·{" "}
                  {match
                    ? `${fallbackTierLabel(match.tier)} · ${match.clip.sourceCourse} ${match.clip.semester}`
                    : "No clip"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <CourseInfoFooter current="/videos" />
    </article>
  );
}
