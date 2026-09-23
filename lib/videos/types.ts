/** Derived lecture-clip map. Source archives are never stored here. */

export const CLIP_CONFIDENCE = ["high", "medium", "low", "placeholder"] as const;

export type ClipConfidence = (typeof CLIP_CONFIDENCE)[number];

/** Curator label, or a 0–1 score (pilot rows use a score, and only scores ≥ 0.7 are included). */
export type ClipConfidenceValue = ClipConfidence | number;

/**
 * One YouTube clip that can stand in for a book section.
 * Provide `youtubeVideoId` or a YouTube `url` (or both, if they name the same video).
 */
export type LectureClip = {
  youtubeVideoId?: string;
  /** youtube.com / youtu.be / youtube-nocookie.com URL. Playback stays on YouTube. */
  url?: string;
  /** Inclusive start, seconds from the beginning of the YouTube video (VTT time). */
  startSec: number;
  /** Exclusive end, seconds from the beginning of the YouTube video. */
  endSec: number;
  /** Course section the recording belongs to, e.g. `CS4550`, `CS5610-02`. */
  sourceCourse: string;
  /** Season + 2-digit year: `SP26`, `SU26`, `FA26`. */
  semester: string;
  confidence: ClipConfidenceValue;
  /** Curator note. Not shown to students. */
  note?: string;
};

/**
 * `bookSectionId` → clips. Keys are book TOC anchors (`sec-1-3-1`, `sec-2-1-10`).
 * `titles` are optional UI labels for those ids. When omitted, the page shows the section number.
 */
export type LectureClipMap = {
  description?: string;
  titles?: Record<string, string>;
  sections: Record<string, LectureClip[]>;
};

export type FallbackTier = "same-section" | "same-semester" | "prior-semester";

export type ResolvedLectureClip = {
  bookSectionId: string;
  clip: LectureClip;
  youtubeVideoId: string;
  tier: FallbackTier;
};

export type ResolveLectureClipInput = {
  bookSectionId: string;
  preferredCourse: string;
  preferredSemester: string;
};
