import type { JSONContent } from "@tiptap/core";
import type { GeneratedBlock } from "@/lib/inline-edit/sanitize";
import { safeHref } from "./schema";

const ALLOWED = new Set(["strong", "em", "code", "a"]);

/** Turn sanitized suggestion blocks into editor nodes. Marks stay in the document; no instruction metadata. */
export function blocksToNodes(blocks: readonly GeneratedBlock[]): JSONContent[] {
  return blocks.slice(0, 8).flatMap((block) => {
    if (block.kind === "p") {
      const content = parseInline(block.html.replace(/^<p>/, "").replace(/<\/p>$/, ""));
      return content.length ? [{ type: "paragraph", content }] : [];
    }
    const tag = block.kind === "ol" ? "orderedList" : "bulletList";
    const items = block.items.slice(0, 24).map((item) => {
      const content = parseInline(item);
      return {
        type: "listItem",
        content: [content.length ? { type: "paragraph", content } : { type: "paragraph" }],
      };
    });
    return items.length ? [{ type: tag, content: items }] : [];
  });
}

export function parseInline(html: string): JSONContent[] {
  const pieces = walk(stripUnsafe(html), []);
  return pieces.filter((piece) => piece.type !== "text" || piece.text);
}

function walk(html: string, marks: JSONContent["marks"]): JSONContent[] {
  const out: JSONContent[] = [];
  const pattern = /<\/?([a-zA-Z0-9]+)(\s[^<>]*)?>/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html))) {
    const text = decode(html.slice(cursor, match.index));
    if (text) out.push(textNode(text, marks));
    const tag = match[1].toLowerCase();
    const closing = match[0].startsWith("</");
    cursor = match.index + match[0].length;
    if (closing || !ALLOWED.has(tag)) continue;
    const closeAt = findClose(html, cursor, tag);
    const inner = html.slice(cursor, closeAt);
    if (tag === "a") {
      const href = attr(match[2] ?? "", "href");
      const nextMarks = href && safeHref(href) ? [...(marks ?? []), { type: "link", attrs: { href } }] : marks;
      out.push(...walk(inner, nextMarks));
    } else {
      const type = tag === "strong" ? "bold" : tag === "em" ? "italic" : "code";
      out.push(...walk(inner, [...(marks ?? []), { type }]));
    }
    const closeTag = new RegExp(`^</${tag}\\s*>`, "i").exec(html.slice(closeAt));
    cursor = closeAt + (closeTag?.[0].length ?? 0);
    pattern.lastIndex = cursor;
  }
  const rest = decode(html.slice(cursor));
  if (rest) out.push(textNode(rest, marks));
  return out;
}

function findClose(html: string, from: number, tag: string): number {
  const close = new RegExp(`</${tag}\\s*>`, "i").exec(html.slice(from));
  return close ? from + close.index : html.length;
}

function attr(raw: string, name: string): string | null {
  const match = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(raw);
  return match?.[1] ?? match?.[2] ?? null;
}

function textNode(text: string, marks: JSONContent["marks"]): JSONContent {
  const node: JSONContent = { type: "text", text };
  if (marks?.length) node.marks = marks;
  return node;
}

function stripUnsafe(html: string): string {
  return html
    .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function decode(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
