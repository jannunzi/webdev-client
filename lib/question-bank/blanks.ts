/**
 * Shared FIB markers for prompts, coding templates, and the take UI.
 *
 * Prefer numbered tokens (`___1___`) so the stem, the snippet, and the
 * numbered answer list use the same labels. Plain `_____` still works.
 */
export const BLANK_MARK = /_{3,}\d+_{3,}|_{3,}/g;

export function countBlanks(template: string): number {
  return template.match(BLANK_MARK)?.length ?? 0;
}

export function fillTemplate(template: string, blanks: string[]): string {
  let index = 0;
  return template.replace(BLANK_MARK, () => blanks[index++]?.trim() ?? "");
}

export function numberedBlank(index: number): string {
  return `___${index + 1}___`;
}

export function numberedBlankSequence(count: number): string {
  return Array.from({ length: count }, (_, index) => numberedBlank(index)).join(
    " ",
  );
}

export function replaceBlankMarkers(
  template: string,
  replaceWith: (index: number, token: string) => string,
): string {
  let index = 0;
  return template.replace(BLANK_MARK, (token) => replaceWith(index++, token));
}
