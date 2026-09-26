import { youtubePlaylistUrl } from "./youtube";

/**
 * YouTube playlists for a course, section, year, or term.
 * Set `url` only when a live playlist exists. Leave it unset otherwise —
 * do not invent a `list` id.
 */
export type CourseTermPlaylist = {
  /** What the playlist groups. */
  scope: "course" | "section" | "year" | "term";
  /** Roster section id when the playlist is for one section, e.g. `CS4550`. */
  course?: string;
  /** Season + 2-digit year when the playlist is for one term, e.g. `FA26`. */
  semester?: string;
  /** Student-facing label. */
  label: string;
  /** `https://www.youtube.com/playlist?list=…` once the playlist is published. */
  url?: string;
};

export const courseTermPlaylists: CourseTermPlaylist[] = [
  // No live playlist URL yet. Add `url` when a course, section, year, or term
  // playlist is published on YouTube.
  { scope: "section", course: "CS4550", semester: "FA26", label: "CS 4550 · Fall 2026" },
  { scope: "section", course: "CS5610-02", semester: "FA26", label: "CS 5610-02 · Fall 2026" },
  { scope: "section", course: "CS5610-09", semester: "FA26", label: "CS 5610-09 · Fall 2026" },
];

export type PublishedCoursePlaylist = CourseTermPlaylist & { url: string };

/** Playlists that have a real YouTube playlist URL. Rows without `url` stay hidden. */
export function publishedCoursePlaylists(
  rows: CourseTermPlaylist[] = courseTermPlaylists,
): PublishedCoursePlaylist[] {
  const published: PublishedCoursePlaylist[] = [];
  for (const [index, row] of rows.entries()) {
    if (row.url == null || row.url.trim() === "") continue;
    const url = youtubePlaylistUrl(row.url);
    if (!url) {
      throw new Error(
        `courseTermPlaylists[${index}].url must be a YouTube playlist URL.`,
      );
    }
    published.push({ ...row, url });
  }
  return published;
}
