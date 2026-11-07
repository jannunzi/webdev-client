import type { InsertSpec } from "@/lib/inline-edit/blocks";
import type { GeneratedBlock } from "@/lib/inline-edit/sanitize";
import { sanitizeEditedHtml } from "@/lib/inline-edit/sanitize";
import type { SanitizedNode } from "@/lib/inline-edit/sanitize";

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
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? "");
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
    beforeHtml: sessionNodes(anchor, "before").map((node) => node.outerHTML),
    afterHtml: sessionNodes(anchor, "after").map((node) => node.outerHTML),
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
  if (node.dataset.aiInstruction != null || node.dataset.inlineRemovedNote != null) return [];
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

export function insertInstruction(anchor: HTMLElement): HTMLElement {
  const hash = sessionHash(anchor);
  instructionCount += 1;
  const id = `ai-${instructionCount}`;
  const split = takeAfterCaret(anchor);
  const block = document.createElement("div");
  block.dataset.aiInstruction = "1";
  block.dataset.aiId = id;
  block.dataset.inlineSession = hash;
  block.contentEditable = "false";
  block.className =
    "my-2 rounded border border-amber-500 bg-amber-50 px-2 py-1.5 font-sans text-sm text-amber-950";
  block.setAttribute("role", "group");
  block.setAttribute("aria-label", "AI instruction");

  const label = document.createElement("div");
  label.dataset.inlineMeta = "1";
  label.className = "mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800";
  label.textContent = "AI instruction — not saved";

  const field = document.createElement("div");
  field.dataset.aiInstructionText = "1";
  field.contentEditable = "true";
  field.className = "min-h-[1.25em] rounded bg-white px-1 py-0.5 text-neutral-900 outline-none";
  field.textContent = "Create a list of terms introduced in this section";

  const controls = document.createElement("div");
  controls.dataset.inlineMeta = "1";
  controls.className = "mt-1 flex flex-wrap gap-1";
  controls.append(
    actionButton("generate", "Generate"),
    actionButton("retry", "Retry"),
    actionButton("remove-instruction", "Remove instruction"),
  );
  const retry = controls.querySelector<HTMLButtonElement>('[data-ai-action="retry"]');
  if (retry) retry.hidden = true;

  const error = document.createElement("p");
  error.dataset.aiError = "1";
  error.dataset.inlineMeta = "1";
  error.className = "mt-1 hidden text-[11px] text-red-800";
  error.setAttribute("role", "status");

  block.append(label, field, controls, error);
  const firstAfter = sessionNodes(anchor, "after")[0];
  if (firstAfter) firstAfter.before(block);
  else anchor.after(block);
  if (split) block.after(split);
  field.focus();
  placeCaretAtEnd(field);
  return block;
}

export function renderGeneratedBlocks(instruction: HTMLElement, blocks: GeneratedBlock[]) {
  const id = instruction.dataset.aiId ?? "";
  const anchor = instructionAnchor(instruction);
  const hash = anchor ? sessionHash(anchor) : instruction.dataset.inlineSession ?? "";
  instruction.parentElement
    ?.querySelectorAll(`[data-ai-for="${CSS.escape(id)}"]`)
    .forEach((node) => node.remove());
  let cursor: Element = instruction;
  for (const block of blocks) {
    const draft = block.kind === "p" ? draftParagraph(hash, block.html) : draftList(hash, block);
    draft.dataset.aiOutput = "1";
    draft.dataset.aiFor = id;
    cursor.after(draft);
    cursor = draft;
  }
  const retry = instruction.querySelector<HTMLButtonElement>('[data-ai-action="retry"]');
  const generate = instruction.querySelector<HTMLButtonElement>('[data-ai-action="generate"]');
  if (retry) retry.hidden = false;
  if (generate) generate.hidden = true;
}

export function setInstructionError(instruction: HTMLElement, message: string) {
  const error = instruction.querySelector<HTMLElement>("[data-ai-error]");
  if (!error) return;
  error.textContent = message;
  error.classList.toggle("hidden", !message);
}

export function instructionText(instruction: HTMLElement): string {
  return instruction.querySelector("[data-ai-instruction-text]")?.textContent?.trim() ?? "";
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

function instructionAnchor(instruction: HTMLElement): HTMLElement | null {
  const hash = instruction.dataset.inlineSession ?? "";
  let node: Element | null = instruction.previousElementSibling;
  while (node instanceof HTMLElement) {
    if (node.dataset.srcHash === hash) return node;
    if (node.dataset.inlineSession !== hash) break;
    node = node.previousElementSibling;
  }
  node = instruction.nextElementSibling;
  while (node instanceof HTMLElement) {
    if (node.dataset.srcHash === hash) return node;
    if (node.dataset.inlineSession !== hash) break;
    node = node.nextElementSibling;
  }
  return null;
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

function actionButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.aiAction = action;
  button.className =
    "rounded border border-amber-700 bg-white px-1.5 py-0.5 text-[11px] font-sans text-amber-950";
  button.textContent = label;
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

function takeAfterCaret(anchor: HTMLElement): HTMLElement | null {
  if (anchor.querySelector("[data-edit-slot], a, code")) return null;
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!anchor.contains(range.endContainer)) return null;
  const after = range.cloneRange();
  after.selectNodeContents(anchor);
  after.setStart(range.endContainer, range.endOffset);
  const before = range.cloneRange();
  before.selectNodeContents(anchor);
  before.setEnd(range.endContainer, range.endOffset);
  const beforeText = before.toString().trim();
  const afterText = after.toString().trim();
  if (!beforeText || !afterText) return null;
  const fragment = after.extractContents();
  const wrap = document.createElement("div");
  wrap.dataset.inlineDraft = "1";
  wrap.dataset.draftKind = "p";
  wrap.dataset.draftRole = "split";
  wrap.dataset.inlineSession = sessionHash(anchor);
  wrap.className = "my-2";
  const paragraph = document.createElement("p");
  paragraph.contentEditable = "true";
  paragraph.append(fragment);
  wrap.append(paragraph, removeDraftButton());
  return wrap;
}

function placeCaretAtEnd(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
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
