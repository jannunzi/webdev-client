import { redirect } from "next/navigation";
import { defaultSectionId } from "@/app/syllabus/data/sections";
import {
  defaultVideoCourseId,
  defaultVideoSemester,
  videoCourseOptions,
} from "@/lib/videos/courses";
import { listVideoHubChapters } from "@/lib/videos/hub";
import { currentLectureTerm, parseLectureFilterSearch } from "@/lib/videos/lecture-filter";
import { listLectureClipSets } from "@/lib/videos/lectures";
import { lectureClipMap } from "@/lib/videos/map";
import { publishedCoursePlaylists } from "@/lib/videos/playlists";
import { parseVideosQuery, videosHref, videosHubHref, withLectureFilterParams } from "@/lib/videos/query";
import VideosHub from "./components/VideosHub";

type VideosSearchParams = {
  section?: string | string[];
  bookSectionId?: string | string[];
  course?: string | string[];
  semester?: string | string[];
  lectureSection?: string | string[];
  lectureYear?: string | string[];
  lectureSeason?: string | string[];
};

function one(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<VideosSearchParams>;
}) {
  const params = await searchParams;
  const courses = videoCourseOptions();
  const courseSet = one(params.course) != null;
  const semesterSet = one(params.semester) != null;
  const query = parseVideosQuery(
    {
      section: one(params.section),
      bookSectionId: one(params.bookSectionId),
      course: one(params.course),
      semester: one(params.semester),
    },
    {
      section: "",
      course: defaultVideoCourseId(),
      semester: defaultVideoSemester(),
    },
    courses.map((option) => option.id),
  );

  const lectureSearch = {
    lectureSection: one(params.lectureSection),
    lectureYear: one(params.lectureYear),
    lectureSeason: one(params.lectureSeason),
  };

  if (!query.canonical) {
    const preference = {
      course: courseSet ? query.course : undefined,
      semester: semesterSet ? query.semester : undefined,
    };
    redirect(
      withLectureFilterParams(
        query.section ? videosHref(query.section, preference) : videosHubHref(preference),
        lectureSearch,
      ),
    );
  }

  return (
    <VideosHub
      key={query.section || "hub"}
      chapters={listVideoHubChapters(lectureClipMap, {
        course: query.course,
        semester: query.semesterValid ? query.semester : defaultVideoSemester(),
      })}
      activeSection={query.section || null}
      playlists={publishedCoursePlaylists()}
      lectures={listLectureClipSets()}
      lectureTerm={currentLectureTerm(new Date())}
      lectureQuery={parseLectureFilterSearch(lectureSearch)}
      defaultLectureSectionId={defaultSectionId}
    />
  );
}
