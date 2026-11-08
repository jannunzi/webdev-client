import type { JSONContent } from "@tiptap/core";

export const MAX_CHAPTER_BYTES = 1_500_000;

const NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "text",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "hardBreak",
  "bookEmbed",
  "bookFigure",
  "unsupported",
]);

const MARK_TYPES = new Set(["bold", "italic", "underline", "code", "link"]);

export function validateChapterDoc(
  value: unknown,
  embeds: ReadonlySet<string>,
): { ok: true; doc: JSONContent } | { ok: false; error: string } {
  const encoded = JSON.stringify(value);
  if (encoded.length > MAX_CHAPTER_BYTES) {
    return { ok: false, error: "The chapter is too large to save." };
  }
  if (!value || typeof value !== "object") {
    return { ok: false, error: "The chapter document is missing." };
  }
  const walk = checkNode(value, embeds, 0);
  if (!walk.ok) return walk;
  if ((value as JSONContent).type !== "doc") {
    return { ok: false, error: "The chapter document is missing." };
  }
  return { ok: true, doc: value as JSONContent };
}

function checkNode(
  value: unknown,
  embeds: ReadonlySet<string>,
  depth: number,
): { ok: true } | { ok: false; error: string } {
  if (depth > 40) return { ok: false, error: "The chapter document is too deeply nested." };
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "The chapter document has an invalid node." };
  }
  const node = value as JSONContent;
  if (!node.type || !NODE_TYPES.has(node.type)) {
    return { ok: false, error: "The chapter document has an unsupported block." };
  }
  if (node.type === "text") {
    if (typeof node.text !== "string" || node.text.length > 20_000) {
      return { ok: false, error: "The chapter document has invalid text." };
    }
  }
  if (node.marks) {
    if (!Array.isArray(node.marks) || node.marks.length > 8) {
      return { ok: false, error: "The chapter document has an invalid mark." };
    }
    for (const mark of node.marks) {
      if (!mark || !MARK_TYPES.has(mark.type)) {
        return { ok: false, error: "The chapter document has an unsupported mark." };
      }
      if (mark.type === "link") {
        const href = mark.attrs?.href;
        if (typeof href !== "string" || !safeHref(href)) {
          return { ok: false, error: "A link uses an unsupported address." };
        }
      }
    }
  }
  if (node.type === "bookEmbed") {
    const component = node.attrs?.component;
    if (typeof component !== "string" || !embeds.has(component)) {
      return { ok: false, error: "A demo component is not registered." };
    }
  }
  if (node.type === "bookFigure") {
    const src = node.attrs?.src;
    if (typeof src !== "string" || !src.startsWith("/") || src.startsWith("//") || src.includes("..")) {
      return { ok: false, error: "A figure image path is invalid." };
    }
  }
  if (node.type === "heading") {
    const level = node.attrs?.level;
    if (typeof level !== "number" || level < 1 || level > 6) {
      return { ok: false, error: "A heading level is invalid." };
    }
  }
  if (node.type === "unsupported") {
    const name = node.attrs?.name;
    const reason = node.attrs?.reason;
    if (typeof name !== "string" || typeof reason !== "string" || name.length > 80 || reason.length > 200) {
      return { ok: false, error: "An unsupported block is invalid." };
    }
  }
  if (node.content) {
    if (!Array.isArray(node.content) || node.content.length > 20_000) {
      return { ok: false, error: "The chapter document has too many blocks." };
    }
    for (const child of node.content) {
      const checked = checkNode(child, embeds, depth + 1);
      if (!checked.ok) return checked;
    }
  }
  return { ok: true };
}

export function safeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed.length > 2_000) return false;
  if (/^\s*javascript:/i.test(trimmed) || trimmed.includes("\\")) return false;
  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}
