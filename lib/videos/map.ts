import raw from "@/data/videos/lecture-clips.json";
import { parseLectureClipMap } from "./validate";
import type { LectureClipMap } from "./types";

export const lectureClipMap: LectureClipMap = parseLectureClipMap(raw);

export function bookSectionHasClip(
  bookSectionId: string,
  map: LectureClipMap = lectureClipMap,
): boolean {
  return (map.sections[bookSectionId]?.length ?? 0) > 0;
}

export function listBookSectionIds(map: LectureClipMap = lectureClipMap): string[] {
  return Object.keys(map.sections).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}

export function defaultBookSectionId(
  map: LectureClipMap = lectureClipMap,
): string | null {
  return listBookSectionIds(map)[0] ?? null;
}
