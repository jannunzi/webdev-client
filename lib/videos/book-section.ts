import { toPublicCourseHref } from "@/lib/courses/routes";

/** `sec-1-2-1` → `1.2.1`. `intro` stays Introduction (chapter 1 in this book). */
export function bookSectionNumberLabel(sectionId: string): string {
  if (sectionId === "intro") return "Introduction";
  if (sectionId.startsWith("sec-")) {
    return sectionId.slice(4).replaceAll("-", ".");
  }
  return sectionId;
}

/** Deep link back into the book. Chapter intros share the id `intro` (chapter 1). */
export function bookPathForSection(sectionId: string): string {
  if (sectionId === "intro") return toPublicCourseHref("/book/ch1#intro");
  const match = /^sec-(\d+)/.exec(sectionId);
  if (!match) return toPublicCourseHref("/book");
  const chapter = Number(match[1]);
  if (chapter < 1 || chapter > 6) return toPublicCourseHref("/book");
  return toPublicCourseHref(`/book/ch${chapter}#${sectionId}`);
}
