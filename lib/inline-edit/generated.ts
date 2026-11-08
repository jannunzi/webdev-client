import { stripModelFence } from "./suggest-diff";
import {
  sanitizeGeneratedMarkup,
  type GeneratedBlock,
} from "./sanitize";

const LIST_REQUEST = /\b(list|lists|terms|bullets|bullet)\b/i;
const HTML_TAG = /<\s*(?:p|ul|ol|li|strong|em|code|a)\b/i;

export function instructionRequestsList(instruction: string): boolean {
  return LIST_REQUEST.test(instruction);
}

/**
 * Turn model text into paragraphs and semantic lists.
 * Markdown bullets become `<ul>` / `<ol>` items. Placeholders are restored
 * only for links, code, and emphasis that were already in the section.
 */
export function blocksFromModelText(
  raw: string,
  masks: readonly string[] = [],
): GeneratedBlock[] {
  const restored = restoreSafeMasks(stripUnsafe(stripModelFence(raw)), masks);
  const html = HTML_TAG.test(restored) ? restored : markdownToHtml(restored);
  return sanitizeGeneratedMarkup(html)
    .slice(0, 8)
    .map((block) =>
      block.kind === "p" ? block : { ...block, items: block.items.slice(0, 24) },
    );
}

export type InsertionBlock = {
  type?: string;
  text?: string;
  ordered?: boolean;
  items?: string[];
};

/** HTML form of an `Output.object` insertion, before sanitizing. */
export function insertionObjectToHtml(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const blocks = (value as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const record = block as InsertionBlock;
      if (
        (record.type === "list" || record.type === "ul" || record.type === "ol") &&
        Array.isArray(record.items)
      ) {
        const tag = record.ordered === true || record.type === "ol" ? "ol" : "ul";
        const items = record.items.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0,
        );
        if (items.length === 0) return "";
        return `<${tag}>${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
      }
      if (record.type === "paragraph" && typeof record.text === "string" && record.text.trim()) {
        return paragraphFieldToHtml(record.text);
      }
      return "";
    })
    .filter(Boolean)
    .join("");
}

/** Structured output when present, otherwise one JSON object in the text, otherwise the text. */
export function htmlFromModelResult(output: unknown, text: string | undefined): string {
  const fromOutput = insertionObjectToHtml(output);
  if (fromOutput) return fromOutput;
  const fromText = insertionObjectToHtml(parseJsonObject(text));
  if (fromText) return fromText;
  return text ?? "";
}

function parseJsonObject(text: string | undefined): unknown {
  if (!text) return null;
  const trimmed = stripModelFence(text).trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function paragraphFieldToHtml(text: string): string {
  if (!/<\s*(?:p|ul|ol|li)\b/i.test(text) && hasMarkdownList(text)) {
    return markdownToHtml(text);
  }
  return `<p>${text}</p>`;
}

function hasMarkdownList(text: string): boolean {
  return /(?:^|\n)\s*(?:[-*]|\d+[.)])\s+\S/.test(text);
}

function stripUnsafe(text: string): string {
  return text
    .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/<\s*(?:script|style|iframe|object|embed)\b[^>]*\/?\s*>/gi, "");
}

function restoreSafeMasks(text: string, masks: readonly string[]): string {
  return text.replace(/⟦(\d+)⟧/g, (_, digits: string) => {
    const mask = masks[Number(digits)] ?? "";
    if (/^<(a|code|strong|em)\b/i.test(mask)) return mask;
    return "";
  });
}

function markdownToHtml(text: string): string {
  const lines = text.split(/\r?\n/);
  const parts: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list || list.items.length === 0) {
      list = null;
      return;
    }
    const tag = list.ordered ? "ol" : "ul";
    parts.push(
      `<${tag}>${list.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${tag}>`,
    );
    list = null;
  };
  for (const line of lines) {
    const unordered = /^\s*[-*]\s+(.+)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.+)$/.exec(line);
    if (unordered || ordered) {
      const nextOrdered = Boolean(ordered);
      if (list && list.ordered !== nextOrdered) flush();
      list ??= { ordered: nextOrdered, items: [] };
      list.items.push((unordered?.[1] ?? ordered?.[1] ?? "").trim());
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    flush();
    parts.push(`<p>${inlineMarkdown(line.trim())}</p>`);
  }
  flush();
  return parts.join("");
}

function inlineMarkdown(text: string): string {
  let escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  escaped = escaped.replace(/`([^`]+)`/g, (_match, code: string) => `<code>${code}</code>`);
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return escaped;
}
