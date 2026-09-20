/** Inline code spans (`backticks`) and numbered FIB tokens (`___1___`). */

export type PromptPart =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "blank"; value: string; index: number };

const CODE_SPAN = /`([^`]+)`/g;
const NUMBERED_BLANK = /_{3,}\d+_{3,}/g;

function splitNumberedBlanks(text: string): PromptPart[] {
  const parts: PromptPart[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(NUMBERED_BLANK)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    const number = Number(match[0].replace(/_/g, ""));
    parts.push({ type: "blank", value: match[0], index: number });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

export function parsePromptMarkup(prompt: string): PromptPart[] {
  const parts: PromptPart[] = [];
  let lastIndex = 0;
  for (const match of prompt.matchAll(CODE_SPAN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(...splitNumberedBlanks(prompt.slice(lastIndex, index)));
    }
    parts.push({ type: "code", value: match[1] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < prompt.length) {
    parts.push(...splitNumberedBlanks(prompt.slice(lastIndex)));
  }
  return parts.length > 0 ? parts : [{ type: "text", value: prompt }];
}
