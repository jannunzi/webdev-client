/**
 * Shared FIB markers for coding templates and the take UI.
 *
 * Prefer numbered tokens (`____1____`) so the prompt list, the snippet,
 * and the answer fields use the same label. Plain `_____` still works.
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
  return `____${index + 1}____`;
}
