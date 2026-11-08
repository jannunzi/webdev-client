export type BracketCommand = {
  /** Index of `[`, inclusive. */
  start: number;
  /** Index just after `]`. */
  end: number;
  instruction: string;
};

/**
 * Innermost unescaped `[instruction]` that contains `caret`.
 * A backslash before `[` or `]` keeps that bracket literal.
 * Pairs that do not contain the caret are ignored.
 */
export function bracketCommandAt(text: string, caret: number): BracketCommand | null {
  const opens: number[] = [];
  let match: BracketCommand | null = null;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const escaped = text[index - 1] === "\\";
    if (char === "[" && !escaped) {
      opens.push(index);
      continue;
    }
    if (char !== "]" || escaped) continue;
    const start = opens.pop();
    if (start == null) continue;
    const end = index + 1;
    if (caret < start || caret > end || match) continue;
    match = { start, end, instruction: text.slice(start + 1, index).trim() };
  }
  return match;
}

/** `\[` and `\]` become literal brackets in text that is being saved. */
export function unescapeLiteralBrackets(text: string): string {
  return text.replaceAll("\\[", "[").replaceAll("\\]", "]");
}
