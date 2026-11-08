/** Innermost unescaped [instruction] containing the caret, if the brackets are a command. */
export function bracketInstruction(text: string, caret: number): string | null {
  let match: { start: number; end: number; inner: string } | null = null;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "[") continue;
    if (isEscaped(text, index)) continue;
    const close = findClose(text, index + 1);
    if (close == null) continue;
    if (caret < index || caret > close + 1) continue;
    const inner = unescapeBrackets(text.slice(index + 1, close)).trim();
    if (!inner || (inner.length < 12 && !/\s/.test(inner))) continue;
    match = { start: index, end: close, inner };
  }
  return match?.inner ?? null;
}

function findClose(text: string, from: number): number | null {
  for (let index = from; index < text.length; index += 1) {
    if (text[index] === "[" && !isEscaped(text, index)) return null;
    if (text[index] === "]" && !isEscaped(text, index)) return index;
  }
  return null;
}

function isEscaped(text: string, index: number): boolean {
  let slashes = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) slashes += 1;
  return slashes % 2 === 1;
}

function unescapeBrackets(text: string): string {
  return text.replace(/\\([[\]])/g, "$1");
}
