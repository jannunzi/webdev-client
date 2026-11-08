import { bracketCommandAt, unescapeLiteralBrackets } from "@/lib/inline-edit/bracket-instruction";
import type { InsertSpec } from "@/lib/inline-edit/blocks";
import type { GeneratedBlock, SanitizedNode } from "@/lib/inline-edit/sanitize";
import { sanitizeEditedHtml } from "@/lib/inline-edit/sanitize";

export type SessionSave = {
  html: string;
  remove: boolean;
  insertsBefore: InsertSpec[];
  insertsAfter: InsertSpec[];
};

export type SessionSnap = {
  v: 1;
  anchorHtml: string;
  removed: boolean;
  beforeHtml: string[];
  afterHtml: string[];
};

let instructionCount = 0;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isChrome(el: HTMLElement): boolean {
  return (
    el.dataset.aiInstruction != null ||
    el.dataset.inlineMeta != null ||
    el.dataset.inlineGhost != null ||
    el.dataset.inlineRemovedNote != null ||
    el.dataset.inlineDraft != null
  );
}

/** Walk an edited element. Editor chrome is omitted. JSX slots stay as placeholders. */
export function serializeEditable(root: HTMLElement): string {
  const kind = root.dataset.editKind === "jsx" ? "jsx" : "text";
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(unescapeLiteralBrackets(node.textContent ?? ""));
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    if (isChrome(el)) return "";
    if (kind === "jsx" && el.dataset.editSlot != null) {
      const index = Number(el.dataset.editSlot);
      return Number.isInteger(index) ? `<slot data-i="${index}"></slot>` : "";
    }
    const tag = el.tagName.toLowerCase();
    const inner = () => Array.from(el.childNodes).map(walk).join("");
    if (tag === "br") return " ";
    if (tag === "b" || tag === "strong") return `<strong>${inner()}</strong>`;
    if (tag === "i" || tag === "em") return `<em>${inner()}</em>`;
    if (tag === "code") return `<code>${escapeHtml(el.textContent ?? "")}</code>`;
    if (tag === "a") {
      return `<a href="${escapeHtml(el.getAttribute("href") ?? "")}">${inner()}</a>`;
    }
    const style = el.getAttribute("style") ?? "";
    if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) return `<strong>${inner()}</strong>`;
    if (/font-style\s*:\s*italic/i.test(style)) return `<em>${inner()}</em>`;
    return inner();
  };
  return Array.from(root.childNodes).map(walk).join("");
}

export function sessionHash(anchor: HTMLElement): string {
  return anchor.dataset.srcHash ?? "";
}

export function sessionNodes(anchor: HTMLElement, direction: "before" | "after"): HTMLElement[] {
  const hash = sessionHash(anchor);
  const nodes: HTMLElement[] = [];
  let node = direction === "after" ? anchor.nextElementSibling : anchor.previousElementSibling;
  while (node instanceof HTMLElement && node.dataset.inlineSession === hash) {
    nodes.push(node);
    node = direction === "after" ? node.nextElementSibling : node.previousElementSibling;
  }
  if (direction === "before") nodes.reverse();
  return nodes;
}

export function clearSessionNodes(anchor: HTMLElement) {
  for (const node of [...sessionNodes(anchor, "before"), ...sessionNodes(anchor, "after")]) {
    node.remove();
  }
}

export function captureSession(anchor: HTMLElement): string {
  const snap: SessionSnap = {
    v: 1,
    anchorHtml: currentAnchorHtml(anchor),
    removed: anchor.dataset.inlineRemoved === "1",
    beforeHtml: sessionNodes(anchor, "before")
      .filter((node) => node.dataset.inlineToolbar == null)
      .map((node) => node.outerHTML),
    afterHtml: sessionNodes(anchor, "after")
      .filter((node) => node.dataset.inlineToolbar == null)
      .map((node) => node.outerHTML),
  };
  return JSON.stringify(snap);
}

export function decodeSnap(value: string): SessionSnap | null {
  if (!value.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(value) as Partial<SessionSnap>;
    if (parsed.v !== 1 || typeof parsed.anchorHtml !== "string" || !Array.isArray(parsed.afterHtml)) {
      return null;
    }
    return {
      v: 1,
      anchorHtml: parsed.anchorHtml,
      removed: parsed.removed === true,
      beforeHtml: parsed.beforeHtml?.filter((item) => typeof item === "string") ?? [],
      afterHtml: parsed.afterHtml.filter((item) => typeof item === "string"),
    };
  } catch {
    return null;
  }
}

export function restoreSession(anchor: HTMLElement, encoded: string) {
  const snap = decodeSnap(encoded);
  clearSessionNodes(anchor);
  if (!snap) {
    anchor.innerHTML = encoded;
    anchor.removeAttribute("data-inline-removed");
    return;
  }
  anchor.innerHTML = snap.anchorHtml;
  if (snap.removed) anchor.dataset.inlineRemoved = "1";
  else anchor.removeAttribute("data-inline-removed");
  for (const html of snap.beforeHtml) {
    const el = htmlToElement(html);
    if (el) anchor.before(el);
  }
  let prev: Element = anchor;
  for (const html of snap.afterHtml) {
    const el = htmlToElement(html);
    if (!el) continue;
    prev.after(el);
    prev = el;
  }
}

function currentAnchorHtml(anchor: HTMLElement): string {
  const clone = anchor.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-inline-ghost]").forEach((node) => node.remove());
  return clone.innerHTML;
}

function htmlToElement(html: string): HTMLElement | null {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const node = template.content.firstElementChild;
  return node instanceof HTMLElement ? node : null;
}

export function buildSavePayload(anchor: HTMLElement): SessionSave {
  const remove = anchor.dataset.inlineRemoved === "1";
  return {
    html: remove ? "" : serializeEditable(anchor),
    remove,
    insertsBefore: sessionNodes(anchor, "before").flatMap(nodeToInserts),
    insertsAfter: sessionNodes(anchor, "after").flatMap(nodeToInserts),
  };
}

function nodeToInserts(node: HTMLElement): InsertSpec[] {
  if (
    node.dataset.aiInstruction != null ||
    node.dataset.inlineRemovedNote != null ||
    node.dataset.inlineToolbar != null ||
    node.dataset.inlineBoundary != null
  ) {
    return [];
  }
  if (node.dataset.inlineDraft == null) return [];
  const kind = node.dataset.draftKind;
  if (kind === "ul" || kind === "ol") {
    const items = [...node.querySelectorAll("li")]
      .map((item) => serializeEditable(item))
      .filter((item) => item.trim().length > 0);
    if (items.length === 0) return [];
    return [{ kind, items }];
  }
  const paragraph = node.matches("p") ? node : node.querySelector("p");
  if (!paragraph) return [];
  return [{ kind: "p", html: serializeEditable(paragraph) }];
}

export function stripInstructionNodes(anchor: HTMLElement) {
  for (const node of [...sessionNodes(anchor, "before"), ...sessionNodes(anchor, "after")]) {
    if (node.dataset.aiInstruction != null || node.dataset.inlineRemovedNote != null) node.remove();
    node.querySelectorAll("[data-inline-meta]").forEach((meta) => meta.remove());
  }
  anchor.querySelectorAll("[data-ai-instruction], [data-inline-meta], [data-inline-ghost]").forEach((node) => {
    node.remove();
  });
  const hash = sessionHash(anchor);
  anchor.parentElement
    ?.querySelectorAll(`[data-inline-boundary][data-inline-session="${hash}"], [data-inline-toolbar][data-inline-session="${hash}"]`)
    .forEach((node) => node.remove());
}

export function markParagraphRemoved(anchor: HTMLElement) {
  anchor.dataset.inlineRemoved = "1";
  anchor.contentEditable = "false";
  anchor.style.outline = "2px solid #b91c1c";
  const hash = sessionHash(anchor);
  const existing = anchor.parentElement?.querySelector(
    `[data-inline-removed-note][data-inline-session="${hash}"]`,
  );
  if (existing) return;
  const note = document.createElement("p");
  note.dataset.inlineRemovedNote = "1";
  note.dataset.inlineMeta = "1";
  note.dataset.inlineSession = hash;
  note.className = "my-1 font-sans text-xs text-red-800";
  note.textContent = "Paragraph removed — undo or Esc restores it before save.";
  anchor.after(note);
}

export function paragraphEditable(anchor: HTMLElement): boolean {
  return anchor.tagName === "P" && anchor.dataset.editKind === "jsx";
}

export function insertParagraphBelow(anchor: HTMLElement): HTMLElement {
  const hash = sessionHash(anchor);
  const wrap = document.createElement("div");
  wrap.dataset.inlineDraft = "1";
  wrap.dataset.draftKind = "p";
  wrap.dataset.inlineSession = hash;
  wrap.className = "my-2 rounded-sm outline outline-2 outline-dashed outline-blue-600";
  const paragraph = document.createElement("p");
  paragraph.contentEditable = "true";
  paragraph.append(document.createElement("br"));
  wrap.append(paragraph, removeDraftButton());
  let cursor: Element = anchor;
  let next = cursor.nextElementSibling;
  while (
    next instanceof HTMLElement &&
    next.dataset.inlineSession === hash &&
    next.dataset.draftKind === "p" &&
    next.dataset.aiInstruction == null &&
    next.dataset.aiOutput == null
  ) {
    cursor = next;
    next = cursor.nextElementSibling;
  }
  cursor.after(wrap);
  paragraph.focus();
  return wrap;
}

export function ensureToolbarHost(anchor: HTMLElement): HTMLElement {
  const hash = sessionHash(anchor);
  const previous = anchor.previousElementSibling;
  if (
    previous instanceof HTMLElement &&
    previous.dataset.inlineToolbar === "1" &&
    previous.dataset.inlineSession === hash
  ) {
    return previous;
  }
  document.querySelectorAll("[data-inline-toolbar]").forEach((node) => {
    if (node instanceof HTMLElement && node.dataset.inlineSession !== hash) node.remove();
  });
  const host = document.createElement("div");
  host.dataset.inlineToolbar = "1";
  host.dataset.inlineMeta = "1";
  host.dataset.inlineSession = hash;
  host.dataset.inlineEditUi = "";
  host.style.cssText =
    "display:flex;flex-wrap:wrap;align-items:center;gap:4px;max-width:100%;margin:0 0 6px;box-sizing:border-box;";
  anchor.before(host);
  return host;
}

/**
 * Mark the `[instruction]` around the caret. Other brackets, including those
 * in code, links, and escaped pairs, stay ordinary text.
 */
export function prepareBracketInstruction(
  anchor: HTMLElement,
  mode: "generate" | "retry" = "generate",
): { ok: true; text: string; span: HTMLElement } | { ok: false; error: string } {
  const marked = markedInstruction(anchor, mode);
  if (marked) {
    const raw = marked.textContent ?? "";
    const wrapped = raw.match(/^\s*\[([\s\S]*)\]\s*$/);
    const text = (wrapped?.[1] ?? raw).trim();
    if (!text) return { ok: false, error: "Write the instruction inside [square brackets]." };
    return { ok: true, text, span: marked };
  }
  const eligible = eligibleText(anchor);
  if (!eligible) {
    return {
      ok: false,
      error: "Type [instruction] in the paragraph, not inside code or a link.",
    };
  }
  const command = bracketCommandAt(eligible.text, eligible.caret);
  if (!command) {
    return {
      ok: false,
      error: "Type [instruction] in the paragraph, then Generate. A backslash keeps brackets literal.",
    };
  }
  if (!command.instruction) {
    return { ok: false, error: "Write the instruction inside [square brackets]." };
  }
  const start = positionAt(eligible.pieces, command.start);
  const end = positionAt(eligible.pieces, command.end);
  if (!start || !end) {
    return { ok: false, error: "Type [instruction] in the paragraph, then Generate." };
  }
  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  const span = document.createElement("span");
  instructionCount += 1;
  span.dataset.aiInstruction = "1";
  span.dataset.aiId = `ai-${instructionCount}`;
  span.dataset.inlineSession = sessionHash(anchor);
  try {
    range.surroundContents(span);
  } catch {
    span.append(range.extractContents());
    range.insertNode(span);
  }
  return { ok: true, text: command.instruction, span };
}

export function renderGeneratedBlocks(instruction: HTMLElement, blocks: GeneratedBlock[]) {
  const anchor = instruction.closest<HTMLElement>("[data-src-hash]");
  if (!anchor) return;
  const id = instruction.dataset.aiId ?? "";
  const hash = sessionHash(anchor);
  anchor.parentElement
    ?.querySelectorAll(`[data-ai-for="${CSS.escape(id)}"]`)
    .forEach((node) => node.remove());
  const boundary = document.createElement("div");
  boundary.dataset.inlineBoundary = "1";
  boundary.dataset.inlineMeta = "1";
  boundary.dataset.inlineSession = hash;
  boundary.dataset.aiFor = id;
  boundary.textContent = "Generated draft";
  let cursor: Element = anchor;
  const trailing = takeNodesAfter(instruction);
  cursor.after(boundary);
  cursor = boundary;
  for (const block of blocks) {
    const draft = block.kind === "p" ? draftParagraph(hash, block.html) : draftList(hash, block);
    draft.dataset.aiOutput = "1";
    draft.dataset.aiFor = id;
    cursor.after(draft);
    cursor = draft;
  }
  if (trailing) cursor.after(trailing);
}

function markedInstruction(anchor: HTMLElement, mode: "generate" | "retry"): HTMLElement | null {
  const selection = window.getSelection();
  const node = selection?.anchorNode;
  const element = node instanceof Element ? node : node?.parentElement;
  const span = element?.closest<HTMLElement>("[data-ai-instruction]");
  if (span && anchor.contains(span)) return span;
  if (mode !== "retry") return null;
  const marked = anchor.querySelectorAll<HTMLElement>("[data-ai-instruction]");
  return marked.length > 0 ? marked[marked.length - 1] ?? null : null;
}

function eligibleText(
  anchor: HTMLElement,
): { text: string; caret: number; pieces: { node: Text; start: number }[] } | null {
  const pieces: { node: Text; start: number }[] = [];
  let text = "";
  const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const parent = textNode.parentElement;
    const blocked = parent?.closest("code, a, [data-edit-slot], [data-inline-ghost]");
    if (!blocked) {
      pieces.push({ node: textNode, start: text.length });
      text += textNode.textContent ?? "";
    }
    current = walker.nextNode();
  }
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return null;
  const container = selection.anchorNode;
  if (!(container instanceof Text) || !anchor.contains(container)) return null;
  const piece = pieces.find((item) => item.node === container);
  if (!piece) return null;
  return { text, caret: piece.start + selection.anchorOffset, pieces };
}

function positionAt(
  pieces: { node: Text; start: number }[],
  index: number,
): { node: Text; offset: number } | null {
  for (let cursor = pieces.length - 1; cursor >= 0; cursor -= 1) {
    const piece = pieces[cursor];
    if (!piece) continue;
    const length = piece.node.textContent?.length ?? 0;
    if (index >= piece.start && index <= piece.start + length) {
      return { node: piece.node, offset: index - piece.start };
    }
  }
  return null;
}

/** Move plain text after an instruction into its own paragraph when that does not take a link or code span. */
function takeNodesAfter(instruction: HTMLElement): HTMLElement | null {
  const parent = instruction.parentElement;
  if (!parent) return null;
  const blocked = [...parent.querySelectorAll("code, a, [data-edit-slot]")].some((node) =>
    instruction.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING && parent.contains(node),
  );
  if (blocked) return null;
  const range = document.createRange();
  range.setStartAfter(instruction);
  range.setEnd(parent, parent.childNodes.length);
  if (!range.toString().trim()) return null;
  const fragment = range.extractContents();
  const paragraph = document.createElement("p");
  paragraph.dataset.inlineDraft = "1";
  paragraph.dataset.draftKind = "p";
  paragraph.dataset.inlineSession = instruction.dataset.inlineSession ?? "";
  paragraph.append(fragment);
  return paragraph;
}

export function sectionContext(anchor: HTMLElement): { before: string; after: string; section: string } {
  const before = contextHtml(anchor);
  const afterParts: string[] = [];
  let node = anchor.nextElementSibling;
  while (node instanceof HTMLElement && afterParts.join("\n").length < 4_000) {
    if (node.dataset.inlineSession === sessionHash(anchor)) {
      if (node.dataset.aiInstruction == null && node.dataset.inlineDraft != null) {
        afterParts.push(draftPlain(node));
      }
    } else if (node.matches("p, li, h1, h2, h3, h4, h5, h6, ul, ol")) {
      afterParts.push(node.innerText);
    } else {
      break;
    }
    node = node.nextElementSibling;
  }
  return {
    before,
    after: afterParts.join("\n"),
    section: sectionPlain(anchor),
  };
}

function sectionPlain(anchor: HTMLElement): string {
  const section = anchor.closest("section") ?? anchor.parentElement;
  if (!section) return "";
  const parts: string[] = [];
  section.querySelectorAll("h1, h2, h3, p, li").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.closest("[data-inline-session], [data-inline-edit-ui]")) return;
    if (node !== anchor && node.closest("[data-src-hash]") && node !== node.closest("[data-src-hash]")) return;
    parts.push(contextHtml(node));
  });
  return parts.join("\n").trim();
}

function contextHtml(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("[data-inline-ghost], [data-inline-meta], [data-ai-instruction], [data-inline-draft]")
    .forEach((node) => node.remove());
  clone.querySelectorAll("[data-edit-slot]").forEach((slot) => {
    slot.replaceWith(document.createTextNode(slot.textContent ?? ""));
  });
  return serializeEditable(clone);
}

function draftPlain(node: HTMLElement): string {
  if (node.dataset.draftKind === "p") {
    return node.querySelector("p")?.innerText ?? "";
  }
  return [...node.querySelectorAll("li")].map((item) => item.innerText).join("\n");
}

function draftParagraph(hash: string, html: string): HTMLElement {
  const wrap = document.createElement("div");
  wrap.dataset.inlineDraft = "1";
  wrap.dataset.draftKind = "p";
  wrap.dataset.inlineSession = hash;
  wrap.className = "my-2 rounded-sm outline outline-2 outline-dashed outline-blue-600";
  const paragraph = document.createElement("p");
  paragraph.contentEditable = "true";
  fillInline(paragraph, html);
  if (!paragraph.textContent?.trim()) paragraph.append(document.createElement("br"));
  wrap.append(paragraph, removeDraftButton());
  return wrap;
}

function draftList(hash: string, block: Extract<GeneratedBlock, { kind: "ul" | "ol" }>): HTMLElement {
  const wrap = document.createElement("div");
  wrap.dataset.inlineDraft = "1";
  wrap.dataset.draftKind = block.kind;
  wrap.dataset.inlineSession = hash;
  wrap.className = "my-2 rounded-sm bg-white outline outline-2 outline-dashed outline-blue-600";
  const list = document.createElement(block.kind);
  list.className = "list-disc pl-6";
  if (block.kind === "ol") list.className = "list-decimal pl-6";
  for (const item of block.items) {
    const li = document.createElement("li");
    li.contentEditable = "true";
    fillInline(li, item);
    list.append(li);
  }
  wrap.append(list, removeDraftButton());
  return wrap;
}

function removeDraftButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.inlineMeta = "1";
  button.dataset.draftAction = "remove";
  button.className =
    "mt-1 rounded border border-neutral-300 bg-white px-1.5 text-[10px] font-sans text-neutral-800";
  button.textContent = "Remove";
  return button;
}

export function fillInline(parent: HTMLElement, html: string) {
  parent.replaceChildren();
  const nodes = sanitizeEditedHtml(html, "fresh");
  for (const node of nodes) appendSanitized(parent, node);
}

function appendSanitized(parent: HTMLElement, node: SanitizedNode) {
  if (node.type === "text") {
    parent.append(document.createTextNode(node.text));
    return;
  }
  if (node.type === "slot") return;
  if (node.type === "code") {
    const code = document.createElement("code");
    code.textContent = node.text;
    parent.append(code);
    return;
  }
  const el = document.createElement(
    node.type === "link" ? "a" : node.type === "strong" ? "strong" : "em",
  );
  if (node.type === "link") el.setAttribute("href", node.href);
  if (node.type === "link" || node.type === "strong" || node.type === "em") {
    for (const child of node.children) appendSanitized(el, child);
  }
  parent.append(el);
}

export function editableHost(anchor: HTMLElement, node: Node | null): HTMLElement | null {
  const el = node instanceof Element ? node : node?.parentElement;
  if (!el) return null;
  if (el.closest("[data-ai-instruction], [data-inline-meta]")) return null;
  const host = el.closest<HTMLElement>("[contenteditable='true']");
  if (!host) return null;
  if (host === anchor) return host;
  if (host.dataset.inlineSession === sessionHash(anchor)) return host;
  const owner = host.closest<HTMLElement>("[data-inline-session]");
  if (owner?.dataset.inlineSession === sessionHash(anchor)) return host;
  return null;
}
