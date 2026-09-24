import type { LectureClip, ResolvedLectureClip } from "./types";
import { youtubeLectureUrl } from "./youtube";

/**
 * Semesters whose YouTube upload is the full class session.
 * A book-section row is a start/end window into that same video.
 * FA26 public parts are short cuts, so they are not in this set: those rows
 * show Watch full lecture only when a parent id or lecture/playlist URL is set.
 */
export const WHOLE_SESSION_ARCHIVE_SEMESTERS = ["SP26"] as const;

/**
 * URL for “Watch full lecture”, or null when this row is only a section snippet.
 *
 * 1. `fullLectureUrl` as written.
 * 2. `playlistUrl` as written.
 * 3. `parentLectureYoutubeId` as a watch URL with no start time.
 * 4. SP26 whole-session archives: the clip’s own YouTube id, also with no start time.
 */
export function fullLectureHref(
  resolved: Pick<ResolvedLectureClip, "clip" | "youtubeVideoId">,
): string | null {
  const clip = resolved.clip;
  if (clip.fullLectureUrl) return clip.fullLectureUrl;
  if (clip.playlistUrl) return clip.playlistUrl;
  if (clip.parentLectureYoutubeId) return youtubeLectureUrl(clip.parentLectureYoutubeId);
  if (isWholeSessionArchive(clip)) return youtubeLectureUrl(resolved.youtubeVideoId);
  return null;
}

function isWholeSessionArchive(clip: LectureClip): boolean {
  if (!Number.isFinite(clip.startSec) || !Number.isFinite(clip.endSec)) return false;
  if (clip.endSec <= clip.startSec) return false;
  if (clip.parentLectureYoutubeId || clip.fullLectureUrl || clip.playlistUrl) return false;
  return WHOLE_SESSION_ARCHIVE_SEMESTERS.includes(
    clip.semester.trim().toUpperCase() as (typeof WHOLE_SESSION_ARCHIVE_SEMESTERS)[number],
  );
}
