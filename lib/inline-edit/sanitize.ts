/**
 * Staff edits arrive as contentEditable HTML. The saved tree may contain
 * text, `<strong>`, `<em>`, slide `<code>` / links, and slot placeholders
 * for JSX the author did not type (glossary links, components, code spans).
 */

export type SanitizedNode =
  | { type: "text"; text: string }
  | { type: "strong"; children: SanitizedNode[] }
  | { type: "em"; children: SanitizedNode[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: SanitizedNode[] }
  | { type: "slot"; index: number };

export type SanitizeMode = "jsx" | "text";

type RawNode =
  | { type: "text"; text: string }
  | {
      type: "element";
      tag: string;
      attrs: Record<string, string>;
      children: RawNode[];
    };

const DROP_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "template",
  "svg",
  "math",
]);

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "slot",
]);

export function sanitizeEditedHtml(
  html: string,
  mode: SanitizeMode,
): SanitizedNode[] {
  const folded = foldNodes(parseHtml(html), mode);
  return trimEdges(mergeText(folded));
}

export function plainText(nodes: SanitizedNode[]): string {
  return nodes.map(plainNode).join("");
}

function plainNode(node: SanitizedNode): string {
  switch (node.type) {
    case "text":
    case "code":
      return node.text;
    case "slot":
      return "";
    case "link":
    case "strong":
    case "em":
      return node.children.map(plainNode).join("");
    default:
      return "";
  }
}

function parseHtml(html: string): RawNode[] {
  const root: RawNode[] = [];
  const stack: Array<{
    tag: string;
    attrs: Record<string, string>;
    children: RawNode[];
  }> = [];
  const current = () => (stack.length > 0 ? stack[stack.length - 1]!.children : root);
  let index = 0;
  while (index < html.length) {
    if (html.startsWith("<!--", index)) {
      const end = html.indexOf("-->", index + 4);
      index = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html[index] !== "<") {
      const next = html.indexOf("<", index);
      const raw = html.slice(index, next === -1 ? html.length : next);
      current().push({ type: "text", text: raw });
      index = next === -1 ? html.length : next;
      continue;
    }
    const nextChar = html[index + 1] ?? "";
    const looksLikeTag =
      nextChar === "/" || nextChar === "!" || /[A-Za-z]/.test(nextChar);
    if (!looksLikeTag) {
      current().push({ type: "text", text: "<" });
      index += 1;
      continue;
    }
    if (html.startsWith("</", index)) {
      const close = html.indexOf(">", index + 2);
      if (close === -1) break;
      const name = html.slice(index + 2, close).trim().toLowerCase().split(/\s+/)[0] ?? "";
      index = close + 1;
      for (let depth = stack.length - 1; depth >= 0; depth -= 1) {
        if (stack[depth]!.tag === name) {
          stack.length = depth;
          break;
        }
      }
      continue;
    }
    const close = html.indexOf(">", index + 1);
    if (close === -1) {
      current().push({ type: "text", text: html.slice(index) });
      break;
    }
    const rawTag = html.slice(index + 1, close).trim();
    index = close + 1;
    const selfClosing = rawTag.endsWith("/");
    const body = selfClosing ? rawTag.slice(0, -1).trim() : rawTag;
    const space = body.search(/\s/);
    const tag = (space === -1 ? body : body.slice(0, space)).toLowerCase();
    const attrSource = space === -1 ? "" : body.slice(space);
    if (!tag || !/^[a-z][\w:-]*$/.test(tag)) {
      current().push({ type: "text", text: html.slice(close - rawTag.length - 1, index) });
      continue;
    }
    const attrs = parseAttrs(attrSource);
    if (selfClosing || VOID_TAGS.has(tag)) {
      current().push({ type: "element", tag, attrs, children: [] });
      continue;
    }
    const element = { tag, attrs, children: [] as RawNode[] };
    current().push({ type: "element", tag, attrs, children: element.children });
    stack.push(element);
  }
  return root;
}

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    const name = match[1]?.toLowerCase();
    if (!name || name === "/") continue;
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

function foldNodes(nodes: RawNode[], mode: SanitizeMode): SanitizedNode[] {
  const out: SanitizedNode[] = [];
  for (const node of nodes) {
    if (node.type === "text") {
      const text = collapse(decodeEntities(node.text));
      if (text) out.push({ type: "text", text });
      continue;
    }
    const tag = node.tag;
    if (DROP_TAGS.has(tag)) continue;
    if (tag === "slot" && mode === "jsx") {
      const index = Number(node.attrs["data-i"] ?? "");
      if (Number.isInteger(index) && index >= 0 && index < 1000) {
        out.push({ type: "slot", index });
      }
      continue;
    }
    if (tag === "br" || tag === "hr") {
      out.push({ type: "text", text: " " });
      continue;
    }
    if (tag === "b" || tag === "strong") {
      out.push({ type: "strong", children: foldNodes(node.children, mode) });
      continue;
    }
    if (tag === "i" || tag === "em") {
      out.push({ type: "em", children: foldNodes(node.children, mode) });
      continue;
    }
    if (tag === "span") {
      out.push(...wrapStyle(foldNodes(node.children, mode), node.attrs.style ?? ""));
      continue;
    }
    if (tag === "code" && mode === "text") {
      out.push({ type: "code", text: rawText(node.children) });
      continue;
    }
    if (tag === "a" && mode === "text") {
      const href = safeHref(decodeEntities(node.attrs.href ?? ""));
      const children = foldNodes(node.children, mode);
      if (!href) {
        out.push(...children);
      } else {
        out.push({ type: "link", href, children });
      }
      continue;
    }
    const inner = foldNodes(node.children, mode);
    out.push(...inner);
    if (tag === "div" || tag === "p" || tag === "li") {
      out.push({ type: "text", text: " " });
    }
  }
  return out;
}

function wrapStyle(children: SanitizedNode[], style: string): SanitizedNode[] {
  let wrapped = children;
  if (/font-style\s*:\s*italic/i.test(style)) {
    wrapped = [{ type: "em", children: wrapped }];
  }
  if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) {
    wrapped = [{ type: "strong", children: wrapped }];
  }
  return wrapped;
}

function rawText(nodes: RawNode[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.type === "text") text += decodeEntities(node.text);
    else text += rawText(node.children);
  }
  return text.replace(/\u00a0/g, " ");
}

function mergeText(nodes: SanitizedNode[]): SanitizedNode[] {
  const out: SanitizedNode[] = [];
  for (const node of nodes) {
    const normalized = normalizeNode(node);
    if (!normalized) continue;
    const prev = out[out.length - 1];
    if (normalized.type === "text" && prev?.type === "text") {
      prev.text += normalized.text;
      continue;
    }
    out.push(normalized);
  }
  return out;
}

function normalizeNode(node: SanitizedNode): SanitizedNode | null {
  if (node.type === "text") {
    const text = collapse(node.text);
    return text ? { type: "text", text } : null;
  }
  if (node.type === "strong" || node.type === "em" || node.type === "link") {
    const children = mergeText(node.children);
    if (children.length === 0) return null;
    if (node.type === "link") return { ...node, children };
    return { type: node.type, children };
  }
  return node;
}

function trimEdges(nodes: SanitizedNode[]): SanitizedNode[] {
  const copy = nodes.map((node) => ({ ...node }));
  const first = copy[0];
  if (first?.type === "text") {
    first.text = first.text.trimStart();
    if (!first.text) copy.shift();
  }
  const last = copy[copy.length - 1];
  if (last?.type === "text") {
    last.text = last.text.trimEnd();
    if (!last.text) copy.pop();
  }
  return copy;
}

function collapse(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => fromCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => fromCode(Number.parseInt(dec, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function fromCode(code: number): string {
  if (!Number.isInteger(code) || code <= 0 || code > 0x10ffff) return "";
  return String.fromCodePoint(code);
}

function safeHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?")) {
    return trimmed;
  }
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) && !/^javascript:/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}
