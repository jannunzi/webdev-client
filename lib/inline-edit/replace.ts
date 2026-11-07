import ts from "typescript";
import { hasStructure, type ParagraphStructure } from "./blocks";
import { sanitizedToJsx, sanitizedToSlideText, toJsStringLiteral } from "./jsx-emit";
import { findEditable, type JsxParagraph } from "./locate";
import { sanitizeEditedHtml } from "./sanitize";
import { repoRelativePath } from "./source-hash";
import { applyParagraphStructure } from "./structure";

export type ReplaceResult =
  | { ok: true; source: string; unchanged: boolean }
  | { ok: false; error: string };

/**
 * Replace one located paragraph or slide string. The hash is recomputed from
 * the file the server just fetched, so a drifted or generated paragraph is
 * refused instead of being guessed.
 */
export function replaceEditableSource(
  source: string,
  file: string,
  hash: string,
  html: string,
  structure?: ParagraphStructure,
): ReplaceResult {
  const relative = repoRelativePath(file);
  if (!relative) {
    return { ok: false, error: "That file can't be edited from the book or slides." };
  }
  const located = findEditable(source, relative, hash);
  if (!located.ok) return located;
  const next = hasStructure(structure)
    ? located.node.kind === "jsx"
      ? applyParagraphStructure(source, located.node, html, structure ?? {})
      : { ok: false as const, error: "Only a paragraph can be added or removed." }
    : located.node.kind === "jsx"
      ? replaceParagraph(source, located.node, html)
      : replaceLiteral(source, located.node.start, located.node.end, html);
  if (!next.ok) return next;
  if (!parses(next.source, relative)) {
    return {
      ok: false,
      error: "The edited text couldn't be written back as valid source.",
    };
  }
  return {
    ok: true,
    source: next.source,
    unchanged: next.source === source,
  };
}

function replaceParagraph(
  source: string,
  node: JsxParagraph,
  html: string,
): ReplaceResult {
  const sanitized = sanitizeEditedHtml(html, "jsx");
  const slotSources = node.slots.map((slot) => source.slice(slot.start, slot.end));
  const jsx = sanitizedToJsx(sanitized, slotSources);
  if (!jsx.ok) return jsx;
  let updated: string;
  if (node.closeStart == null) {
    const open = source.slice(node.start, node.end).replace(/\s*\/\s*>$/, ">");
    updated = `${source.slice(0, node.start)}${open}${jsx.value}</${node.tag}>${source.slice(node.end)}`;
  } else {
    updated = `${source.slice(0, node.openEnd)}${jsx.value}${source.slice(node.closeStart)}`;
  }
  return { ok: true, source: updated, unchanged: updated === source };
}

function replaceLiteral(
  source: string,
  start: number,
  end: number,
  html: string,
): ReplaceResult {
  const text = sanitizedToSlideText(sanitizeEditedHtml(html, "text"));
  const original = source.slice(start, end);
  const prefer = original.startsWith("'")
    ? "'"
    : original.startsWith("`")
      ? "`"
      : "\"";
  const literal = toJsStringLiteral(text, prefer);
  const updated = source.slice(0, start) + literal + source.slice(end);
  return { ok: true, source: updated, unchanged: updated === source };
}

function parses(source: string, file: string): boolean {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const diagnostics =
    (sourceFile as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] })
      .parseDiagnostics ?? [];
  return diagnostics.length === 0;
}
