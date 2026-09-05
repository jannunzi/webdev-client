/** Inline code spans in bank prompts, marked with `backticks`. */

export type PromptPart =
  | { type: "text"; value: string }
  | { type: "code"; value: string };

const CODE_SPAN = /`([^`]+)`/g;

export function parsePromptMarkup(prompt: string): PromptPart[] {
  const parts: PromptPart[] = [];
  let lastIndex = 0;
  for (const match of prompt.matchAll(CODE_SPAN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: "text", value: prompt.slice(lastIndex, index) });
    }
    parts.push({ type: "code", value: match[1] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < prompt.length) {
    parts.push({ type: "text", value: prompt.slice(lastIndex) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: prompt }];
}
