import { LECTURE_EMBED_IDS, type LectureEmbedId } from "./types";

/**
 * Ch1 book live embeds (`app/book/ch1/embeds/*`) plus already-used lecture
 * embed ids. Edit-mode dropdowns may only pick from this list — never an
 * arbitrary component string.
 */
export const BOOK_CH1_COMPONENT_IDS = [
  "ch1-home",
  "ch1-signin",
  "ch1-signup",
  "ch1-profile",
  "ch1-dashboard",
  "ch1-modules",
  "ch1-assignments",
  "ch1-assignment-editor",
  "ch1-account-screens",
  "ch1-plain-kambaz-nav",
  "ch1-plain-course-nav",
] as const;

export type BookCh1ComponentId = (typeof BOOK_CH1_COMPONENT_IDS)[number];

export const SLIDE_COMPONENT_IDS = [
  ...BOOK_CH1_COMPONENT_IDS,
  ...LECTURE_EMBED_IDS,
] as const;

export type SlideComponentId = (typeof SLIDE_COMPONENT_IDS)[number];

const BOOK_CH1_LABELS: Record<BookCh1ComponentId, string> = {
  "ch1-home": "Ch1 · Home (book)",
  "ch1-signin": "Ch1 · Signin (book)",
  "ch1-signup": "Ch1 · Signup (book)",
  "ch1-profile": "Ch1 · Profile (book)",
  "ch1-dashboard": "Ch1 · Dashboard (book)",
  "ch1-modules": "Ch1 · Modules (book)",
  "ch1-assignments": "Ch1 · Assignments (book)",
  "ch1-assignment-editor": "Ch1 · Assignment editor (book)",
  "ch1-account-screens": "Ch1 · Account screens (book)",
  "ch1-plain-kambaz-nav": "Ch1 · Kambaz nav (plain)",
  "ch1-plain-course-nav": "Ch1 · Course nav (plain)",
};

function humanizeEmbedId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isSlideComponentId(value: string): value is SlideComponentId {
  return (SLIDE_COMPONENT_IDS as readonly string[]).includes(value);
}

export function isLectureEmbedComponentId(
  value: string,
): value is LectureEmbedId {
  return (LECTURE_EMBED_IDS as readonly string[]).includes(value);
}

export type SlideComponentOption = {
  id: SlideComponentId;
  label: string;
  group: "Chapter 1 book" | "Lecture embeds";
};

export function listSlideComponentOptions(): SlideComponentOption[] {
  return [
    ...BOOK_CH1_COMPONENT_IDS.map((id) => ({
      id,
      label: BOOK_CH1_LABELS[id],
      group: "Chapter 1 book" as const,
    })),
    ...LECTURE_EMBED_IDS.map((id) => ({
      id,
      label: humanizeEmbedId(id),
      group: "Lecture embeds" as const,
    })),
  ];
}
