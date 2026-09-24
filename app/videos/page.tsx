import { redirect } from "next/navigation";
import {
  defaultVideoCourseId,
  defaultVideoSemester,
  videoCourseOptions,
} from "@/lib/videos/courses";
import { listVideoHubChapters } from "@/lib/videos/hub";
import { lectureClipMap } from "@/lib/videos/map";
import { publishedCoursePlaylists } from "@/lib/videos/playlists";
import { parseVideosQuery, videosHref, videosHubHref } from "@/lib/videos/query";
import VideosHub from "./components/VideosHub";

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

  if (!query.canonical) {
    const preference = {
      course: courseSet ? query.course : undefined,
      semester: semesterSet ? query.semester : undefined,
    };
    redirect(
      query.section
        ? videosHref(query.section, preference)
        : videosHubHref(preference),
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
    />
  );
}
