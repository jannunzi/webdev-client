import { freshNodesToJsx, sanitizedToJsx } from "./jsx-emit";
import type { JsxParagraph } from "./locate";
import { sanitizeEditedHtml, sanitizeFreshInline } from "./sanitize";
import type { InsertSpec, ParagraphStructure } from "./blocks";

export type StructureResult =
  | { ok: true; source: string }
  | { ok: false; error: string };

/**
 * Replace, delete, or surround one `<p>`. New blocks are siblings. Headings,
 * list items, and slide strings are refused so their anchors stay put.
 */
export function applyParagraphStructure(
  source: string,
  node: JsxParagraph,
  html: string,
  structure: ParagraphStructure,
): StructureResult {
  if (node.tag !== "p") {
    return { ok: false, error: "Only a paragraph can be added or removed." };
  }
  const indent = indentAt(source, node.start);
  const before = emitAll(structure.insertsBefore ?? [], indent);
  if (!before.ok) return before;
  const after = emitAll(structure.insertsAfter ?? [], indent);
  if (!after.ok) return after;

  let nodeText: string | null = null;
  if (!structure.remove) {
    const replaced = paragraphText(source, node, html);
    if (!replaced.ok) return replaced;
    nodeText = replaced.text;
  }
  return {
    ok: true,
    source: spliceRegion(source, node.start, node.end, nodeText, before.value, after.value),
  };
}

function emitAll(blocks: readonly InsertSpec[], indent: string): { ok: true; value: string } | { ok: false; error: string } {
  const lines: string[] = [];
  for (const block of blocks) {
    const emitted = emitBlock(block, indent);
    if (!emitted.ok) return emitted;
    if (emitted.value) lines.push(emitted.value);
  }
  return { ok: true, value: lines.join("\n") };
}

function emitBlock(
  block: InsertSpec,
  indent: string,
): { ok: true; value: string } | { ok: false; error: string } {
  if (block.kind === "p") {
    const fresh = sanitizeFreshInline(block.html);
    if (!fresh.ok) return fresh;
    const inner = freshNodesToJsx(sanitizeEditedHtml(fresh.html, "fresh"));
    if (!inner.ok) return inner;
    if (!inner.value) return { ok: true, value: `${indent}<p></p>` };
    return { ok: true, value: `${indent}<p>${inner.value}</p>` };
  }
  const items: string[] = [];
  for (const item of block.items) {
    const fresh = sanitizeFreshInline(item);
    if (!fresh.ok) return fresh;
    const inner = freshNodesToJsx(sanitizeEditedHtml(fresh.html, "fresh"));
    if (!inner.ok) return inner;
    if (!inner.value) continue;
    items.push(`${indent}  <li>${inner.value}</li>`);
  }
  if (items.length === 0) return { ok: true, value: "" };
  return {
    ok: true,
    value: `${indent}<${block.kind}>\n${items.join("\n")}\n${indent}</${block.kind}>`,
  };
}

function paragraphText(
  source: string,
  node: JsxParagraph,
  html: string,
): { ok: true; text: string } | { ok: false; error: string } {
  const sanitized = sanitizeEditedHtml(html, "jsx");
  const slotSources = node.slots.map((slot) => source.slice(slot.start, slot.end));
  const jsx = sanitizedToJsx(sanitized, slotSources);
  if (!jsx.ok) return jsx;
  if (node.closeStart == null) {
    const open = source.slice(node.start, node.end).replace(/\s*\/\s*>$/, ">");
    return { ok: true, text: `${open}${jsx.value}</${node.tag}>` };
  }
  return {
    ok: true,
    text: `${source.slice(node.start, node.openEnd)}${jsx.value}${source.slice(node.closeStart, node.end)}`,
  };
}

function indentAt(source: string, index: number): string {
  const lineStart = source.lastIndexOf("\n", Math.max(0, index - 1)) + 1;
  const prefix = source.slice(lineStart, index);
  return /^[ \t]*$/.test(prefix) ? prefix : "";
}

function spliceRegion(
  source: string,
  start: number,
  end: number,
  nodeText: string | null,
  before: string,
  after: string,
): string {
  const lineStart = source.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const prefix = source.slice(lineStart, start);
  const ownLine = /^[ \t]*$/.test(prefix);
  const parts: string[] = [];
  if (before) parts.push(before);
  if (nodeText != null) parts.push(ownLine ? `${prefix}${nodeText}` : nodeText);
  if (after) parts.push(after);
  const joined = parts.join("\n");
  if (!ownLine) return source.slice(0, start) + joined + source.slice(end);

  let to = end;
  if (source[to] === "\r") to += 1;
  const hadNewline = source[to] === "\n";
  if (hadNewline) to += 1;
  const head = source.slice(0, lineStart);
  const rest = source.slice(to);
  if (!joined) return head + rest;
  return `${head}${joined}${hadNewline || rest.length > 0 ? "\n" : ""}${rest}`;
}
