import type { SanitizedNode } from "./sanitize";

export type EmitResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * JSX text is emitted as a string expression so `<`, `{`, and quotes cannot
 * break out of the element. Spaces live inside those strings because SWC
 * drops a bare space after a self-closing tag.
 */
export function sanitizedToJsx(
  nodes: SanitizedNode[],
  slotSources: readonly string[],
): EmitResult {
  const seen = new Set<number>();
  const parts: string[] = [];
  const emitted = emitNodes(nodes, slotSources, seen, parts);
  if (!emitted.ok) return emitted;
  if (seen.size !== slotSources.length) {
    return {
      ok: false,
      error:
        "A link or code span was dropped from this paragraph. Press Esc and edit it again.",
    };
  }
  if (parts.length === 0) return { ok: true, value: "" };
  return { ok: true, value: `\n${parts.join("\n")}\n` };
}

function emitNodes(
  nodes: SanitizedNode[],
  slotSources: readonly string[],
  seen: Set<number>,
  parts: string[],
): EmitResult {
  for (const node of nodes) {
    if (node.type === "text") {
      if (node.text) parts.push(`{${JSON.stringify(node.text)}}`);
      continue;
    }
    if (node.type === "slot") {
      if (seen.has(node.index) || node.index < 0 || node.index >= slotSources.length) {
        return {
          ok: false,
          error: "This paragraph's links or code spans no longer match the source file.",
        };
      }
      seen.add(node.index);
      parts.push(slotSources[node.index] ?? "");
      continue;
    }
    if (node.type === "code" || node.type === "link") {
      const text = node.type === "code" ? node.text : node.children.map(textOf).join("");
      if (text) parts.push(`{${JSON.stringify(text)}}`);
      continue;
    }
    const inner: string[] = [];
    const nested = emitNodes(node.children, slotSources, seen, inner);
    if (!nested.ok) return nested;
    const tag = node.type === "strong" ? "strong" : "em";
    parts.push(`<${tag}>${inner.join("")}</${tag}>`);
  }
  return { ok: true, value: "" };
}

/** JSX for a new paragraph or list item. Slots are refused; code and links are real elements. */
export function freshNodesToJsx(nodes: readonly SanitizedNode[]): EmitResult {
  if (nodes.some(containsSlot)) {
    return { ok: false, error: "A new paragraph can't include an editor placeholder." };
  }
  const parts: string[] = [];
  const emitted = emitFresh(nodes, parts);
  if (!emitted.ok) return emitted;
  return { ok: true, value: parts.join("") };
}

function containsSlot(node: SanitizedNode): boolean {
  if (node.type === "slot") return true;
  if (node.type === "strong" || node.type === "em" || node.type === "link") {
    return node.children.some(containsSlot);
  }
  return false;
}

function emitFresh(nodes: readonly SanitizedNode[], parts: string[]): EmitResult {
  for (const node of nodes) {
    if (node.type === "text") {
      if (node.text) parts.push(`{${JSON.stringify(node.text)}}`);
      continue;
    }
    if (node.type === "slot") {
      return { ok: false, error: "A new paragraph can't include an editor placeholder." };
    }
    if (node.type === "code") {
      parts.push(`<code>{${JSON.stringify(node.text)}}</code>`);
      continue;
    }
    if (node.type === "link") {
      const inner: string[] = [];
      const nested = emitFresh(node.children, inner);
      if (!nested.ok) return nested;
      parts.push(`<a href={${JSON.stringify(node.href)}}>${inner.join("")}</a>`);
      continue;
    }
    const inner: string[] = [];
    const nested = emitFresh(node.children, inner);
    if (!nested.ok) return nested;
    const tag = node.type === "strong" ? "strong" : "em";
    parts.push(`<${tag}>${inner.join("")}</${tag}>`);
  }
  return { ok: true, value: "" };
}

function textOf(node: SanitizedNode): string {
  if (node.type === "text" || node.type === "code") return node.text;
  if (node.type === "slot") return "";
  if (node.type === "link" || node.type === "strong" || node.type === "em") {
    return node.children.map(textOf).join("");
  }
  return "";
}

/** Slide deck strings keep the existing markdown dialect, plus `<em>` for italic. */
export function sanitizedToSlideText(nodes: SanitizedNode[]): string {
  return nodes.map(slideNode).join("");
}

function slideNode(node: SanitizedNode): string {
  if (node.type === "text") return node.text;
  if (node.type === "slot") return "";
  if (node.type === "code") {
    return node.text.includes("`") ? node.text : `\`${node.text}\``;
  }
  if (node.type === "link") {
    const label = sanitizedToSlideText(node.children);
    if (!label.includes("]") && !label.includes("[") && !node.href.includes(")")) {
      return `[${label}](${node.href})`;
    }
    return label;
  }
  const inner = sanitizedToSlideText(node.children);
  if (node.type === "em") return `<em>${inner}</em>`;
  const plain = node.children.every((child) => child.type === "text");
  if (plain && inner && !/[*`]/.test(inner)) return `**${inner}**`;
  return `<strong>${inner}</strong>`;
}

export function toJsStringLiteral(
  value: string,
  prefer: "\"" | "'" | "`" = "\"",
): string {
  if (
    prefer === "`" &&
    !value.includes("`") &&
    !value.includes("${") &&
    !value.includes("\n") &&
    !value.includes("\r") &&
    !value.includes("\\")
  ) {
    return `\`${value}\``;
  }
  if (prefer === "'" && isPlainQuoted(value, "'")) return `'${value}'`;
  if (prefer === '"' && isPlainQuoted(value, '"')) return `"${value}"`;
  return JSON.stringify(value);
}

function isPlainQuoted(value: string, quote: "'" | '"'): boolean {
  return !value.includes(quote) && !value.includes("\\") && !value.includes("\n") && !value.includes("\r");
}
