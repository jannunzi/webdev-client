/**
 * Build-time marker for a slide string literal.
 *
 * The compiler loader rewrites a unique literal into `inlineEditMark(...)`.
 * The function returns a plain object so the server can pass the locator to
 * the client. Render code unwraps it back to a string before React sees it.
 */
export type InlineLoc = {
  file: string;
  hash: string;
};

export type EditableMark = InlineLoc & {
  __editable: true;
  text: string;
};

export function inlineEditMark(
  text: string,
  file: string,
  hash: string,
): EditableMark {
  return { __editable: true, text, file, hash };
}

export function isEditableMark(value: unknown): value is EditableMark {
  if (!value || typeof value !== "object") return false;
  const mark = value as Partial<EditableMark>;
  return (
    mark.__editable === true &&
    typeof mark.text === "string" &&
    typeof mark.file === "string" &&
    typeof mark.hash === "string"
  );
}

export function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (isEditableMark(value)) return value.text;
  return "";
}

export function locOf(value: unknown): InlineLoc | undefined {
  if (!isEditableMark(value)) return undefined;
  return { file: value.file, hash: value.hash };
}

/** Data attributes for a slide text block. Absent when the string is not a unique literal. */
export function inlineEditDataProps(
  loc: InlineLoc | undefined,
): Record<string, string> | undefined {
  if (!loc) return undefined;
  return {
    "data-src-file": loc.file,
    "data-src-hash": loc.hash,
    "data-edit-kind": "text",
  };
}
