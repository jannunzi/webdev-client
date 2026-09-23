/** Derived lecture-clip map. Source archives are never stored here. */

export const CLIP_CONFIDENCE = ["high", "medium", "low", "placeholder"] as const;

export type ClipConfidence = (typeof CLIP_CONFIDENCE)[number];

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
  confidence: ClipConfidence;
  /** Curator note. Not shown to students; use `placeholder` confidence for fake rows. */
  note?: string;
};

/** `bookSectionId` → clips. Keys are book TOC anchors (`sec-1-2-1`, `intro`). */
export type LectureClipMap = {
  description?: string;
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
