import { normalizeSemesterCode } from "./semester";
import {
  CLIP_CONFIDENCE,
  type ClipConfidence,
  type ClipConfidenceValue,
  type LectureClip,
  type LectureClipMap,
} from "./types";
import { YOUTUBE_VIDEO_ID, isYoutubeHost, youtubeVideoIdFromUrl } from "./youtube";

const ROOT_KEYS = new Set(["$schema", "description", "titles", "sections"]);
const CLIP_KEYS = new Set([
  "youtubeVideoId",
  "url",
  "startSec",
  "endSec",
  "sourceCourse",
  "semester",
  "confidence",
  "note",
  "parentLectureYoutubeId",
  "fullLectureUrl",
  "playlistUrl",
]);

const SECTION_ENTRY_KEYS = new Set([
  "clips",
  "parentLectureYoutubeId",
  "fullLectureUrl",
  "playlistUrl",
]);

type LecturePointers = {
  parentLectureYoutubeId?: string;
  fullLectureUrl?: string;
  playlistUrl?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new Error(message);
}

function parseConfidence(value: unknown, where: string): ClipConfidenceValue {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1) {
    return value;
  }
  if (
    typeof value === "string" &&
    CLIP_CONFIDENCE.includes(value as ClipConfidence)
  ) {
    return value as ClipConfidence;
  }
  fail(
    `${where}.confidence must be a score from 0 to 1, or high, medium, low, or placeholder.`,
  );
}

function parseOptionalVideoId(value: unknown, where: string): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== "string" || !YOUTUBE_VIDEO_ID.test(value)) {
    fail(`${where} must be an 11-character YouTube id.`);
  }
  return value;
}

function parseYoutubePageUrl(
  value: unknown,
  where: string,
  kind: "lecture" | "playlist",
): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    fail(`${where} must be a YouTube URL.`);
  }
  const raw = value.trim();
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    fail(`${where} must be a YouTube URL.`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    fail(`${where} must be a YouTube URL.`);
  }
  if (!isYoutubeHost(url.hostname)) {
    fail(`${where} must be a YouTube URL.`);
  }
  const list = url.searchParams.get("list");
  const playlistPath = url.pathname === "/playlist" || url.pathname.startsWith("/playlist/");
  if (kind === "playlist") {
    if (!list && !playlistPath) {
      fail(`${where} must be a YouTube playlist URL.`);
    }
    return raw;
  }
  if (!youtubeVideoIdFromUrl(raw) && !list && !playlistPath) {
    fail(`${where} must be a YouTube watch, embed, youtu.be, or playlist URL.`);
  }
  return raw;
}

function parseLecturePointers(value: Record<string, unknown>, where: string): LecturePointers {
  return {
    parentLectureYoutubeId: parseOptionalVideoId(
      value.parentLectureYoutubeId,
      `${where}.parentLectureYoutubeId`,
    ),
    fullLectureUrl: parseYoutubePageUrl(value.fullLectureUrl, `${where}.fullLectureUrl`, "lecture"),
    playlistUrl: parseYoutubePageUrl(value.playlistUrl, `${where}.playlistUrl`, "playlist"),
  };
}

function withSectionPointers(clip: LectureClip, section: LecturePointers): LectureClip {
  return {
    ...clip,
    parentLectureYoutubeId: clip.parentLectureYoutubeId ?? section.parentLectureYoutubeId,
    fullLectureUrl: clip.fullLectureUrl ?? section.fullLectureUrl,
    playlistUrl: clip.playlistUrl ?? section.playlistUrl,
  };
}

function parseClip(bookSectionId: string, index: number, value: unknown): LectureClip {
  const where = `sections["${bookSectionId}"][${index}]`;
  if (!isRecord(value)) fail(`${where} must be an object.`);
  for (const key of Object.keys(value)) {
    if (!CLIP_KEYS.has(key)) fail(`${where} has unknown field "${key}".`);
  }

  const youtubeVideoId =
    value.youtubeVideoId == null ? undefined : String(value.youtubeVideoId);
  if (youtubeVideoId != null && !YOUTUBE_VIDEO_ID.test(youtubeVideoId)) {
    fail(`${where}.youtubeVideoId must be an 11-character YouTube id.`);
  }

  const url = value.url == null ? undefined : String(value.url);
  if (value.url != null && typeof value.url !== "string") {
    fail(`${where}.url must be a string.`);
  }
  const urlId = url == null ? null : youtubeVideoIdFromUrl(url);
  if (url != null && !urlId) {
    fail(
      `${where}.url must be a YouTube watch, embed, shorts, or youtu.be URL.`,
    );
  }
  if (!youtubeVideoId && !urlId) {
    fail(`${where} needs youtubeVideoId or a YouTube url.`);
  }
  if (youtubeVideoId && urlId && youtubeVideoId !== urlId) {
    fail(`${where} youtubeVideoId and url name different videos.`);
  }

  if (typeof value.startSec !== "number" || !Number.isFinite(value.startSec)) {
    fail(`${where}.startSec must be a finite number of seconds.`);
  }
  if (typeof value.endSec !== "number" || !Number.isFinite(value.endSec)) {
    fail(`${where}.endSec must be a finite number of seconds.`);
  }
  if (value.startSec < 0 || value.endSec <= value.startSec) {
    fail(`${where}.endSec must be greater than startSec, and startSec must be ≥ 0.`);
  }

  if (typeof value.sourceCourse !== "string" || !value.sourceCourse.trim()) {
    fail(`${where}.sourceCourse must be a non-empty course section id.`);
  }
  if (typeof value.semester !== "string") {
    fail(`${where}.semester must be a string like FA26.`);
  }
  const semester = normalizeSemesterCode(value.semester);
  if (!semester) {
    fail(`${where}.semester must look like SP26, SU26, or FA26.`);
  }

  const confidence = parseConfidence(value.confidence, where);
  if (value.note != null && typeof value.note !== "string") {
    fail(`${where}.note must be a string.`);
  }
  const pointers = parseLecturePointers(value, where);

  return {
    youtubeVideoId: youtubeVideoId ?? urlId ?? undefined,
    url,
    startSec: value.startSec,
    endSec: value.endSec,
    sourceCourse: value.sourceCourse.trim(),
    semester,
    confidence,
    note: typeof value.note === "string" ? value.note : undefined,
    ...pointers,
  };
}

function parseSectionClips(bookSectionId: string, value: unknown): LectureClip[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      fail(`Section "${bookSectionId}" needs at least one clip.`);
    }
    return value.map((clip, index) => parseClip(bookSectionId, index, clip));
  }
  if (!isRecord(value)) {
    fail(
      `Section "${bookSectionId}" must be a clip list, or an object with clips and optional full-lecture fields.`,
    );
  }
  for (const key of Object.keys(value)) {
    if (!SECTION_ENTRY_KEYS.has(key)) {
      fail(`sections["${bookSectionId}"] has unknown field "${key}".`);
    }
  }
  if (!Array.isArray(value.clips) || value.clips.length === 0) {
    fail(`Section "${bookSectionId}" needs at least one clip.`);
  }
  const pointers = parseLecturePointers(value, `sections["${bookSectionId}"]`);
  return value.clips.map((clip, index) =>
    withSectionPointers(parseClip(bookSectionId, index, clip), pointers),
  );
}

/** Validate the on-disk map. Throws a message that names the bad field. */
export function parseLectureClipMap(value: unknown): LectureClipMap {
  if (!isRecord(value)) fail("Lecture clip map must be a JSON object.");
  for (const key of Object.keys(value)) {
    if (!ROOT_KEYS.has(key)) fail(`Unknown lecture clip map field "${key}".`);
  }
  if (value.description != null && typeof value.description !== "string") {
    fail("Lecture clip map description must be a string.");
  }
  if (!isRecord(value.sections)) {
    fail("Lecture clip map needs a sections object keyed by bookSectionId.");
  }

  const sections: LectureClipMap["sections"] = {};
  for (const [bookSectionId, clips] of Object.entries(value.sections)) {
    if (!bookSectionId.trim() || bookSectionId !== bookSectionId.trim()) {
      fail(`Book section id "${bookSectionId}" must be a non-empty TOC anchor.`);
    }
    sections[bookSectionId] = parseSectionClips(bookSectionId, clips);
  }

  const titles: Record<string, string> = {};
  if (value.titles != null) {
    if (!isRecord(value.titles)) fail("titles must be an object of UI labels.");
    for (const [bookSectionId, title] of Object.entries(value.titles)) {
      if (!(bookSectionId in sections)) {
        fail(`titles["${bookSectionId}"] has no clip list.`);
      }
      if (typeof title !== "string" || !title.trim()) {
        fail(`titles["${bookSectionId}"] must be a non-empty UI label.`);
      }
      titles[bookSectionId] = title;
    }
  }

  return {
    description: typeof value.description === "string" ? value.description : undefined,
    titles: value.titles == null ? undefined : titles,
    sections,
  };
}
