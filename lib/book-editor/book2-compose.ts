import type { JSONContent } from "@tiptap/core";
import type { Supplement } from "./source-catalog";

export type SupplementPlacement = "matched" | "section" | "appendix";

export type DraftPiece =
  | { kind: "node"; node: JSONContent }
  | { kind: "supplement"; item: Supplement; placement: SupplementPlacement };

/**
 * Place published source blocks beside a saved draft without changing the document.
 * Exact table rows replace their flattened copy. Edited rows stay. Placeholders
 * for practice cards and async demos become the real blocks. Links the draft
 * never stored sit at the matching heading, or in an appendix when that heading is gone.
 */
const STORED_PUBLISHED_BLOCKS = new Set([
  "bookSlides",
  "bookVideos",
  "bookPractice",
  "bookTable",
  "bookAsync",
]);

function storesPublishedBlocks(node: JSONContent): boolean {
  if (node.type && STORED_PUBLISHED_BLOCKS.has(node.type)) return true;
  return (node.content ?? []).some(storesPublishedBlocks);
}

export function composeDraft(doc: JSONContent, supplements: readonly Supplement[]): DraftPiece[] {
  if (storesPublishedBlocks(doc)) {
    return (doc.content ?? []).map((node) => ({ kind: "node" as const, node }));
  }
  const content = doc.content ?? [];
  const used = new Set<string>();
  const pieces: DraftPiece[] = [];
  let sectionId = "";
  let index = 0;
  while (index < content.length) {
    const node = content[index]!;
    if (node.type === "heading") {
      sectionId = headingId(node);
      pieces.push({ kind: "node", node });
      index += 1;
      continue;
    }
    const replaced = replacementFor(node, supplements, used);
    if (replaced) {
      used.add(replaced.id);
      pieces.push({ kind: "supplement", item: replaced, placement: "matched" });
      index += 1;
      continue;
    }
    const table = matchTable(content, index, sectionId, supplements, used);
    if (table) {
      used.add(table.item.id);
      pieces.push({ kind: "supplement", item: table.item, placement: "matched" });
      index += table.width;
      continue;
    }
    pieces.push({ kind: "node", node });
    index += 1;
  }
  const headingIds = new Set(
    pieces.flatMap((piece) =>
      piece.kind === "node" && piece.node.type === "heading" && headingId(piece.node)
        ? [headingId(piece.node)]
        : [],
    ),
  );
  const withSections: DraftPiece[] = [];
  for (const piece of pieces) {
    withSections.push(piece);
    if (piece.kind !== "node" || piece.node.type !== "heading") continue;
    const id = headingId(piece.node);
    if (!id) continue;
    for (const item of supplements) {
      if (used.has(item.id) || item.sectionId !== id) continue;
      used.add(item.id);
      withSections.push({ kind: "supplement", item, placement: "section" });
    }
  }
  for (const item of supplements) {
    if (!used.has(item.id) && !headingIds.has(item.sectionId)) {
      withSections.push({ kind: "supplement", item, placement: "appendix" });
    }
  }
  return withSections;
}

function replacementFor(node: JSONContent, supplements: readonly Supplement[], used: Set<string>): Supplement | null {
  if (node.type !== "unsupported") return null;
  const name = typeof node.attrs?.name === "string" ? node.attrs.name : "";
  if (name === "PracticeCard") {
    return supplements.find((item) => item.kind === "practice" && !used.has(item.id)) ?? null;
  }
  if (name === "table") {
    return supplements.find((item) => item.kind === "table" && item.lines.length === 0 && !used.has(item.id)) ?? null;
  }
  if (name === "AssignmentsStep" || name === "AssignmentsFinished") {
    return (
      supplements.find((item) => item.kind === "async-demo" && item.component === name && !used.has(item.id)) ?? null
    );
  }
  return null;
}

function matchTable(
  content: JSONContent[],
  index: number,
  sectionId: string,
  supplements: readonly Supplement[],
  used: Set<string>,
): { item: Supplement; width: number } | null {
  const tables = supplements.filter((item): item is Extract<Supplement, { kind: "table" }> => item.kind === "table" && !used.has(item.id));
  const ordered = [...tables.filter((item) => item.sectionId === sectionId), ...tables.filter((item) => item.sectionId !== sectionId)];
  for (const item of ordered) {
    if (item.lines.length === 0 || index + item.lines.length > content.length) continue;
    const window = content.slice(index, index + item.lines.length);
    if (window.every((node, offset) => paragraphText(node) === item.lines[offset])) {
      return { item, width: item.lines.length };
    }
  }
  return null;
}

function headingId(node: JSONContent): string {
  return typeof node.attrs?.id === "string" ? node.attrs.id : "";
}

function paragraphText(node: JSONContent): string | null {
  if (node.type !== "paragraph") return null;
  const text = (node.content ?? [])
    .map((child) => (child.type === "text" ? child.text ?? "" : ""))
    .join("");
  return text.replace(/\s+/g, " ").trim();
}
