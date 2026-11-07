import { isSemanticallyEmptyParagraph } from "./sanitize";

/** A sibling block inserted around one paragraph. Editor chrome is never a block. */
export type InsertSpec =
  | { kind: "p"; html: string }
  | { kind: "ul" | "ol"; items: string[] };

export type ParagraphStructure = {
  remove?: boolean;
  insertsBefore?: InsertSpec[];
  insertsAfter?: InsertSpec[];
};

const MAX_BLOCKS = 12;
const MAX_ITEMS = 24;
const MAX_INLINE = 8_000;

export function parseInsertList(
  value: unknown,
): { ok: true; items: InsertSpec[] } | { ok: false; error: string } {
  if (value == null) return { ok: true, items: [] };
  if (!Array.isArray(value)) {
    return { ok: false, error: "New paragraphs have to be a list of blocks." };
  }
  if (value.length > MAX_BLOCKS) {
    return { ok: false, error: "Too many new blocks." };
  }
  const items: InsertSpec[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "A new block is missing its text." };
    }
    const record = entry as { kind?: unknown; html?: unknown; items?: unknown };
    if (record.kind === "p") {
      if (typeof record.html !== "string" || record.html.length > MAX_INLINE) {
        return { ok: false, error: "A new paragraph is empty or too long." };
      }
      items.push({ kind: "p", html: record.html });
      continue;
    }
    if (record.kind === "ul" || record.kind === "ol") {
      if (!Array.isArray(record.items) || record.items.length > MAX_ITEMS) {
        return { ok: false, error: "A new list is missing its items." };
      }
      const lines: string[] = [];
      for (const item of record.items) {
        if (typeof item !== "string" || item.length > MAX_INLINE) {
          return { ok: false, error: "A list item is empty or too long." };
        }
        lines.push(item);
      }
      items.push({ kind: record.kind, items: lines });
      continue;
    }
    return { ok: false, error: "A new block has to be a paragraph or a list." };
  }
  return { ok: true, items };
}

/** Drop inserted paragraphs that have no text, link, code, or slot. Lists stay. */
export function withoutEmptyParagraphs(items: readonly InsertSpec[]): InsertSpec[] {
  return items.filter((item) => item.kind !== "p" || !isSemanticallyEmptyParagraph(item.html));
}

export function hasStructure(structure: ParagraphStructure | undefined): boolean {
  if (!structure) return false;
  return Boolean(
    structure.remove ||
      structure.insertsBefore?.length ||
      structure.insertsAfter?.length,
  );
}
