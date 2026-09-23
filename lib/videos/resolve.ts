import { semesterRank } from "./semester";
import type {
  ClipConfidenceValue,
  FallbackTier,
  LectureClip,
  LectureClipMap,
  ResolveLectureClipInput,
  ResolvedLectureClip,
} from "./types";
import { youtubeVideoIdFromUrl } from "./youtube";

/** Labels sit on the same 0–1 scale as curator scores. Higher wins a tie. */
function confidenceRank(confidence: ClipConfidenceValue): number {
  if (typeof confidence === "number") return confidence;
  switch (confidence) {
    case "high":
      return 0.9;
    case "medium":
      return 0.75;
    case "low":
      return 0.5;
    case "placeholder":
      return 0;
  }
}

type PlayableClip = LectureClip & { youtubeVideoId: string };

function playbackId(clip: LectureClip): string | null {
  if (clip.youtubeVideoId) return clip.youtubeVideoId;
  if (clip.url) return youtubeVideoIdFromUrl(clip.url);
  return null;
}

function sameCourse(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}

function compareClips(a: PlayableClip, b: PlayableClip): number {
  const byConfidence = confidenceRank(b.confidence) - confidenceRank(a.confidence);
  if (byConfidence !== 0) return byConfidence;
  const byCourse = a.sourceCourse.localeCompare(b.sourceCourse);
  if (byCourse !== 0) return byCourse;
  if (a.startSec !== b.startSec) return a.startSec - b.startSec;
  return a.youtubeVideoId.localeCompare(b.youtubeVideoId);
}

function pickBest(clips: PlayableClip[]): PlayableClip {
  return [...clips].sort(compareClips)[0]!;
}

function playableClips(clips: LectureClip[]): PlayableClip[] {
  const playable: PlayableClip[] = [];
  for (const clip of clips) {
    const youtubeVideoId = playbackId(clip);
    if (!youtubeVideoId) continue;
    playable.push({ ...clip, youtubeVideoId });
  }
  return playable;
}

/**
 * Pick the lecture clip for a book section.
 *
 * 1. Preferred course section in the preferred semester.
 * 2. Any other section in that same semester.
 * 3. The latest semester strictly before the preferred one.
 *    Within that semester, the preferred section wins when it has a clip.
 *
 * A later semester is never used. Within a pool, higher confidence wins,
 * then `sourceCourse` A–Z, then earlier `startSec`.
 */
export function resolveLectureClip(
  map: LectureClipMap,
  input: ResolveLectureClipInput,
): ResolvedLectureClip | null {
  const bookSectionId = input.bookSectionId.trim();
  const preferredCourse = input.preferredCourse.trim();
  const preferredSemester = input.preferredSemester.trim().toUpperCase();
  const preferredRank = semesterRank(preferredSemester);
  if (!bookSectionId || !preferredCourse || preferredRank == null) return null;

  const clips = playableClips(map.sections[bookSectionId] ?? []);
  if (clips.length === 0) return null;

  const sameSemester = clips.filter(
    (clip) => semesterRank(clip.semester) === preferredRank,
  );
  const exact = sameSemester.filter((clip) =>
    sameCourse(clip.sourceCourse, preferredCourse),
  );
  if (exact.length > 0) {
    return pack(bookSectionId, pickBest(exact), "same-section");
  }
  if (sameSemester.length > 0) {
    return pack(bookSectionId, pickBest(sameSemester), "same-semester");
  }

  const priorRanks = clips
    .map((clip) => semesterRank(clip.semester))
    .filter((rank): rank is number => rank != null && rank < preferredRank);
  const bestPrior = priorRanks.length === 0 ? null : Math.max(...priorRanks);
  if (bestPrior == null) return null;

  const prior = clips.filter((clip) => semesterRank(clip.semester) === bestPrior);
  const priorExact = prior.filter((clip) =>
    sameCourse(clip.sourceCourse, preferredCourse),
  );
  const pool = priorExact.length > 0 ? priorExact : prior;
  return pack(bookSectionId, pickBest(pool), "prior-semester");
}

function pack(
  bookSectionId: string,
  clip: PlayableClip,
  tier: FallbackTier,
): ResolvedLectureClip {
  return {
    bookSectionId,
    clip,
    youtubeVideoId: clip.youtubeVideoId,
    tier,
  };
}

export function fallbackTierLabel(tier: FallbackTier): string {
  switch (tier) {
    case "same-section":
      return "Your section";
    case "same-semester":
      return "Other section, same semester";
    case "prior-semester":
      return "Prior semester";
  }
}

export function describeClipFallback(
  resolved: ResolvedLectureClip,
  preferred: { course: string; semester: string },
): string {
  const where = `${resolved.clip.sourceCourse} · ${resolved.clip.semester}`;
  if (resolved.tier === "same-section") {
    return `Matched ${where}, the same section and semester.`;
  }
  if (resolved.tier === "same-semester") {
    return `No ${preferred.semester} clip for ${preferred.course}. Showing another ${preferred.semester} section (${where}).`;
  }
  return `No ${preferred.semester} clip for ${preferred.course}. Showing the latest prior semester (${where}).`;
}
