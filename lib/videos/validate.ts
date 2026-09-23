import { normalizeSemesterCode } from "./semester";
import {
  CLIP_CONFIDENCE,
  type ClipConfidence,
  type LectureClip,
  type LectureClipMap,
} from "./types";
import { YOUTUBE_VIDEO_ID, youtubeVideoIdFromUrl } from "./youtube";

const ROOT_KEYS = new Set(["$schema", "description", "sections"]);
const CLIP_KEYS = new Set([
  "youtubeVideoId",
  "url",
  "startSec",
  "endSec",
  "sourceCourse",
  "semester",
  "confidence",
  "note",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new Error(message);
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

  if (
    typeof value.confidence !== "string" ||
    !CLIP_CONFIDENCE.includes(value.confidence as ClipConfidence)
  ) {
    fail(
      `${where}.confidence must be high, medium, low, or placeholder.`,
    );
  }
  if (value.note != null && typeof value.note !== "string") {
    fail(`${where}.note must be a string.`);
  }

  return {
    youtubeVideoId: youtubeVideoId ?? urlId ?? undefined,
    url,
    startSec: value.startSec,
    endSec: value.endSec,
    sourceCourse: value.sourceCourse.trim(),
    semester,
    confidence: value.confidence as ClipConfidence,
    note: typeof value.note === "string" ? value.note : undefined,
  };
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
    if (!Array.isArray(clips) || clips.length === 0) {
      fail(`Section "${bookSectionId}" needs at least one clip.`);
    }
    sections[bookSectionId] = clips.map((clip, index) =>
      parseClip(bookSectionId, index, clip),
    );
  }

  return {
    description: typeof value.description === "string" ? value.description : undefined,
    sections,
  };
}
