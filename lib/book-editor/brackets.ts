export type BracketSpot =
  | { state: "ready"; prompt: string; end: number }
  | { state: "composing" };

/** Innermost unescaped [instruction] containing the caret, if the brackets are a command. */
export function bracketInstruction(text: string, caret: number): string | null {
  return commandAt(text, caret)?.inner ?? null;
}

/**
 * Ready when the caret is in a complete instruction. Composing when an
 * unfinished `[` is already a command rather than a citation. Code is ignored.
 */
export function bracketSpot(text: string, caret: number, inCode = false): BracketSpot | null {
  if (inCode) return null;
  const command = commandAt(text, caret);
  if (command) return { state: "ready", prompt: command.inner, end: command.end };
  if (composingCommand(text, caret)) return { state: "composing" };
  return null;
}

function commandAt(text: string, caret: number): { start: number; end: number; inner: string } | null {
  let match: { start: number; end: number; inner: string } | null = null;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "[") continue;
    if (isEscaped(text, index)) continue;
    const close = findClose(text, index + 1);
    if (close == null) continue;
    if (caret < index || caret > close + 1) continue;
    const inner = unescapeBrackets(text.slice(index + 1, close)).trim();
    if (!isCommandText(inner)) continue;
    match = { start: index, end: close, inner };
  }
  return match;
}

function composingCommand(text: string, caret: number): boolean {
  let open: number | null = null;
  const limit = Math.min(caret, text.length);
  for (let index = 0; index < limit; index += 1) {
    if (text[index] === "[" && !isEscaped(text, index)) open = index;
    if (text[index] === "]" && !isEscaped(text, index)) open = null;
  }
  if (open == null) return false;
  for (let index = open + 1; index < limit; index += 1) {
    if (text[index] === "]" && !isEscaped(text, index)) return false;
  }
  const inner = unescapeBrackets(text.slice(open + 1, limit)).trim();
  if (/^\d+[a-zA-Z]?$/.test(inner)) return false;
  return isCommandText(inner);
}

function isCommandText(inner: string): boolean {
  return Boolean(inner) && (inner.length >= 12 || /\s/.test(inner));
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
