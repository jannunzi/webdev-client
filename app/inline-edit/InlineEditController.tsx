"use client";

import { useUser } from "@clerk/nextjs";
import { HiSparkles } from "react-icons/hi2";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createHistory,
  discardUntil,
  pushHistory,
  redoHistory,
  undoHistory,
  type EditHistory,
} from "@/lib/inline-edit/edit-history";
import {
  applyChoices,
  acceptAllChoices,
  buildDiff,
  consumeGhost,
  maskPreservedHtml,
  renderReview,
  splitGhostWord,
  type DiffPart,
  type HunkChoice,
} from "@/lib/inline-edit/suggest-diff";
import type { GeneratedBlock } from "@/lib/inline-edit/sanitize";
import {
  buildSavePayload,
  captureSession,
  clearSessionNodes,
  discardEmptyDrafts,
  editableHost,
  insertInstruction,
  insertParagraphBelow,
  instructionText,
  paragraphHtmlUnchanged,
  markParagraphRemoved,
  paragraphEditable,
  renderGeneratedBlocks,
  restoreSession,
  sectionContext,
  serializeEditable,
  setInstructionError,
  stripInstructionNodes,
} from "./session-dom";

type SavePayload = {
  file: string;
  hash: string;
  html: string;
  remove?: boolean;
  insertsBefore?: { kind: string; html?: string; items?: string[] }[];
  insertsAfter?: { kind: string; html?: string; items?: string[] }[];
};
type SaveState = {
  el: HTMLElement;
  phase: "saving" | "committed" | "error";
  message: string;
  payload: SavePayload;
};

export { serializeEditable };

function lockFixed(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-edit-slot], [data-edit-lock]").forEach((node) => {
    node.contentEditable = "false";
    node.querySelectorAll<HTMLElement>("*").forEach((child) => {
      child.contentEditable = "false";
    });
  });
}

function holdHtml(el: HTMLElement, html: string): () => void {
  const hash = el.dataset.srcHash ?? "";
  let applying = false;
  if (el.innerHTML !== html) el.innerHTML = html;
  const observer = new MutationObserver(() => {
    if (applying) return;
    if (!el.isConnected || el.dataset.srcHash !== hash) {
      observer.disconnect();
      return;
    }
    if (el.innerHTML !== html) {
      applying = true;
      el.innerHTML = html;
      applying = false;
    }
  });
  observer.observe(el, { childList: true, subtree: true, characterData: true });
  return () => observer.disconnect();
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.1 1.3a1.5 1.5 0 0 1 2.1 2.1l-8.2 8.2-2.8.6.6-2.8 8.3-8.1zM2 13.5h8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function currentHtml(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-inline-ghost]").forEach((node) => node.remove());
  return clone.innerHTML;
}

function findGhost(anchor: HTMLElement): HTMLElement | null {
  const inside = anchor.querySelector("[data-inline-ghost]");
  if (inside instanceof HTMLElement) return inside;
  const hash = anchor.dataset.srcHash ?? "";
  const outer = anchor.parentElement?.querySelector(
    `[data-inline-session="${hash}"] [data-inline-ghost]`,
  );
  return outer instanceof HTMLElement ? outer : null;
}

function removeGhost(el: HTMLElement) {
  el.querySelectorAll("[data-inline-ghost]").forEach((node) => node.remove());
  const hash = el.dataset.srcHash ?? "";
  el.parentElement
    ?.querySelectorAll(`[data-inline-session="${hash}"] [data-inline-ghost]`)
    .forEach((node) => node.remove());
}

function serializeFragment(root: HTMLElement, fragment: DocumentFragment): string {
  const holder = document.createElement(root.tagName);
  if (root.dataset.editKind) holder.dataset.editKind = root.dataset.editKind;
  holder.append(fragment);
  return serializeEditable(holder);
}

/** HTML on each side of the caret, so a suggestion can be inserted mid-paragraph. */
function caretHalves(root: HTMLElement): { beforeHtml: string; afterHtml: string } | null {
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return null;
  const anchor = selection.anchorNode;
  if (!anchor || !root.contains(anchor)) return null;
  if (root.querySelector("[data-inline-ghost], [data-diff-hunk]")) return null;
  const range = selection.getRangeAt(0);
  const beforeRange = range.cloneRange();
  beforeRange.selectNodeContents(root);
  beforeRange.setEnd(range.endContainer, range.endOffset);
  const afterRange = range.cloneRange();
  afterRange.selectNodeContents(root);
  afterRange.setStart(range.endContainer, range.endOffset);
  const beforeHtml = serializeFragment(root, beforeRange.cloneContents());
  const afterHtml = serializeFragment(root, afterRange.cloneContents());
  if (!beforeHtml.trim() && !afterHtml.trim()) return null;
  return { beforeHtml, afterHtml };
}

let suppressCaretDismiss = false;

function caretIsBefore(node: Node): boolean {
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);
  if (range.endContainer === node.parentNode) {
    return node.parentNode?.childNodes[range.endOffset] === node;
  }
  return (
    range.endContainer.nodeType === Node.TEXT_NODE &&
    range.endOffset === (range.endContainer.textContent?.length ?? 0) &&
    range.endContainer.nextSibling === node
  );
}

function textBeforeCaret(): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return "";
  const range = selection.getRangeAt(0);
  if (range.endContainer.nodeType !== Node.TEXT_NODE) return "";
  return (range.endContainer.textContent ?? "").slice(0, range.endOffset);
}

/** Keep a model-supplied gap, and add one only when the next sentence follows punctuation. */
function ghostText(sentence: string): string {
  if (!sentence || /^\s/.test(sentence) || /^[,.;:!?]/.test(sentence)) return sentence;
  if (/[.!?]["']?$/.test(textBeforeCaret())) return ` ${sentence}`;
  return sentence;
}

function placeCaretAfter(node: Node) {
  const selection = window.getSelection();
  if (!selection) return;
  suppressCaretDismiss = true;
  try {
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } finally {
    suppressCaretDismiss = false;
  }
}

function showGhost(root: HTMLElement, sentence: string) {
  removeGhost(root);
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const span = document.createElement("span");
  span.dataset.inlineGhost = "1";
  span.contentEditable = "false";
  span.className = "text-neutral-400";
  span.textContent = ghostText(sentence);
  suppressCaretDismiss = true;
  try {
    const range = selection.getRangeAt(0);
    range.collapse(false);
    range.insertNode(span);
    const caret = document.createRange();
    caret.setStartBefore(span);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
  } finally {
    suppressCaretDismiss = false;
  }
}

function acceptGhost(root: HTMLElement) {
  const ghost = root.querySelector("[data-inline-ghost]");
  if (!ghost) return false;
  const node = document.createTextNode(ghost.textContent ?? "");
  ghost.replaceWith(node);
  placeCaretAfter(node);
  return true;
}

function acceptGhostWord(root: HTMLElement) {
  const ghost = root.querySelector("[data-inline-ghost]");
  if (!ghost) return false;
  const split = splitGhostWord(ghost.textContent ?? "");
  if (!split) return false;
  const node = document.createTextNode(split.take);
  ghost.before(node);
  if (split.rest) ghost.textContent = split.rest;
  else ghost.remove();
  placeCaretAfter(node);
  return true;
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8.5 6.5 12 13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InlineEditController({
  forceEnabled = false,
}: {
  forceEnabled?: boolean;
} = {}) {
  if (forceEnabled) return <Editor />;
  return <StaffGatedEditor />;
}

function StaffGatedEditor() {
  const { isLoaded, isSignedIn } = useUser();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancel = false;
    fetch("/api/staff/edit-text")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { staff?: boolean } | null) => {
        if (!cancel && data?.staff) setEnabled(true);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, [isLoaded, isSignedIn]);

  if (!enabled) return null;
  return <Editor />;
}

function Editor() {
  const [hover, setHover] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<DOMRect | null>(null);
  const [badgeBox, setBadgeBox] = useState<DOMRect | null>(null);
  const [save, setSave] = useState<SaveState | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [sessionVersion, setSessionVersion] = useState(0);
  const originals = useRef(new Map<HTMLElement, string>());
  const outlines = useRef(new Map<HTMLElement, string>());
  const holds = useRef(new Map<string, () => void>());
  const historyRef = useRef<EditHistory | null>(null);
  const reviewRef = useRef<{ parts: DiffPart[]; baseHtml: string } | null>(null);
  const ghostTimer = useRef<number | null>(null);
  const snapshotTimer = useRef<number | null>(null);
  const continueAbort = useRef<AbortController | null>(null);
  const instructionRunner = useRef<(block: HTMLElement, anchor: HTMLElement) => void>(() => {});
  const pencilEl = editing ?? hover;

  const pushSnapshot = useCallback((el: HTMLElement) => {
    const html = captureSession(el);
    const history = historyRef.current ?? createHistory(html);
    historyRef.current = pushHistory(history, html);
  }, []);

  const restoreHistory = useCallback((el: HTMLElement) => {
    const history = historyRef.current;
    if (!history) return;
    removeGhost(el);
    restoreSession(el, history.present);
    const stillReviewing = Boolean(el.querySelector("[data-diff-hunk]"));
    setReviewing(stillReviewing);
    el.style.outline = el.dataset.inlineRemoved === "1" ? "2px solid #b91c1c" : "2px solid #2563eb";
    if (stillReviewing || el.dataset.inlineRemoved === "1") {
      el.contentEditable = "false";
      return;
    }
    reviewRef.current = null;
    el.contentEditable = "true";
    lockFixed(el);
    setSessionVersion((version) => version + 1);
    el.parentElement
      ?.querySelectorAll<HTMLElement>("[data-ai-instruction-text], [data-inline-draft] [contenteditable='true']")
      .forEach((node) => {
        const owner = node.closest("[data-inline-session]");
        const ownerHash = owner instanceof HTMLElement ? owner.dataset.inlineSession : undefined;
        if (node.dataset.inlineSession === el.dataset.srcHash || ownerHash === el.dataset.srcHash) {
          node.contentEditable = "true";
        }
      });
  }, []);

  const release = useCallback((el: HTMLElement) => {
    const hash = el.dataset.srcHash ?? "";
    holds.current.get(hash)?.();
    holds.current.delete(hash);
    const outline = outlines.current.get(el);
    if (outline !== undefined) {
      el.style.outline = outline;
      outlines.current.delete(el);
    }
    el.contentEditable = "false";
    el.removeAttribute("contenteditable");
  }, []);

  const cancel = useCallback((el: HTMLElement) => {
    const original = originals.current.get(el);
    continueAbort.current?.abort();
    if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
    if (snapshotTimer.current != null) window.clearTimeout(snapshotTimer.current);
    release(el);
    clearSessionNodes(el);
    if (original !== undefined) el.innerHTML = original;
    el.removeAttribute("data-inline-removed");
    el.style.display = "";
    originals.current.delete(el);
    historyRef.current = null;
    reviewRef.current = null;
    setReviewing(false);
    setSuggesting(false);
    setSuggestError("");
    setEditing(null);
    setSave(null);
  }, [release]);

  function begin(el: HTMLElement) {
    if (editing && editing !== el) return;
    originals.current.set(el, el.innerHTML);
    outlines.current.set(el, el.style.outline);
    historyRef.current = createHistory(captureSession(el));
    reviewRef.current = null;
    el.style.outline = "2px solid #2563eb";
    el.contentEditable = "true";
    lockFixed(el);
    setReviewing(false);
    setSuggestError("");
    setEditing(el);
    setHover(el);
    setSave(null);
    el.focus();
  }

  async function requestSuggestion(el: HTMLElement, mode: "improve" | "continue") {
    const target =
      mode === "continue"
        ? editableHost(el, document.getSelection()?.anchorNode ?? null) ?? el
        : el;
    if (mode === "continue" && (el.dataset.inlineRemoved === "1" || target.closest("[data-ai-instruction]"))) {
      return;
    }
    const html = serializeEditable(target);
    const masked = maskPreservedHtml(html);
    let text = masked.prompt;
    let after = "";
    let maskCount = masked.masks.length;
    if (mode === "continue") {
      const halves = caretHalves(target);
      if (!halves) return;
      const joined = maskPreservedHtml(`${halves.beforeHtml}\u0001${halves.afterHtml}`);
      const parts = joined.prompt.split("\u0001");
      text = parts[0] ?? "";
      after = parts[1] ?? "";
      maskCount = 0;
    }
    const controller = new AbortController();
    continueAbort.current?.abort();
    if (mode === "continue") continueAbort.current = controller;
    setSuggesting(mode === "improve");
    setSuggestError("");
    try {
      const response = await fetch("/api/staff/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ mode, text, before: text, after, maskCount }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        text?: string;
        error?: string;
      } | null;
      if (controller.signal.aborted) return;
      if (!response.ok || !data?.ok || !data.text) {
        if (mode === "improve") setSuggestError(data?.error || "No suggestion.");
        return;
      }
      if (mode === "continue") {
        const halves = caretHalves(target);
        const again = halves
          ? maskPreservedHtml(`${halves.beforeHtml}\u0001${halves.afterHtml}`).prompt.split("\u0001")[0]
          : null;
        if (!reviewRef.current && again === text) showGhost(target, data.text);
        return;
      }
      const diff = buildDiff(masked.prompt, data.text, masked.masks);
      if (!diff.ok) {
        setSuggestError(diff.error);
        return;
      }
      if (!diff.parts.some((part) => part.type === "hunk")) {
        setSuggestError("No wording changes.");
        return;
      }
      pushSnapshot(el);
      reviewRef.current = { parts: diff.parts, baseHtml: currentHtml(el) };
      el.contentEditable = "false";
      el.innerHTML = renderReview(diff.parts, {});
      pushSnapshot(el);
      setReviewing(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (mode === "improve") setSuggestError("No suggestion.");
    } finally {
      if (mode === "improve") setSuggesting(false);
    }
  }

  function chooseHunk(el: HTMLElement, id: string, choice: HunkChoice) {
    const review = reviewRef.current;
    const span = el.querySelector(`[data-diff-hunk="${id}"]`);
    const part = review?.parts.find((item) => item.type === "hunk" && item.id === id);
    if (!span || !part || part.type !== "hunk") return;
    const html = choice === "accept" ? part.insertHtml : part.deleteHtml;
    const template = document.createElement("template");
    template.innerHTML = html || "";
    span.replaceWith(template.content);
    pushSnapshot(el);
    if (!el.querySelector("[data-diff-hunk]")) {
      reviewRef.current = null;
      setReviewing(false);
      el.contentEditable = "true";
      lockFixed(el);
      el.focus();
    }
  }

  function acceptAll(el: HTMLElement) {
    const review = reviewRef.current;
    if (!review) return;
    el.innerHTML = applyChoices(review.parts, acceptAllChoices(review.parts));
    reviewRef.current = null;
    setReviewing(false);
    el.contentEditable = "true";
    lockFixed(el);
    pushSnapshot(el);
    el.focus();
  }

  function rejectAll(el: HTMLElement) {
    const review = reviewRef.current;
    if (!review || !historyRef.current) return;
    historyRef.current = discardUntil(historyRef.current, review.baseHtml);
    reviewRef.current = null;
    restoreHistory(el);
    el.focus();
  }

  async function runInstruction(block: HTMLElement, anchor: HTMLElement) {
    const instruction = instructionText(block);
    if (!instruction) {
      setInstructionError(block, "Write an instruction in the instruction block.");
      return;
    }
    const context = sectionContext(anchor);
    const controller = new AbortController();
    continueAbort.current?.abort();
    continueAbort.current = controller;
    setSuggesting(true);
    setSuggestError("");
    setInstructionError(block, "");
    try {
      const response = await fetch("/api/staff/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: "instruct",
          instruction,
          before: context.before,
          after: context.after,
          section: context.section,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        blocks?: GeneratedBlock[];
        error?: string;
      } | null;
      if (controller.signal.aborted) return;
      if (!response.ok || !data?.ok || !data.blocks?.length) {
        setInstructionError(block, data?.error || "No insertion.");
        const retry = block.querySelector<HTMLButtonElement>('[data-ai-action="retry"]');
        if (retry) retry.hidden = false;
        return;
      }
      renderGeneratedBlocks(block, data.blocks);
      pushSnapshot(anchor);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setInstructionError(block, "No insertion.");
    } finally {
      setSuggesting(false);
    }
  }

  useEffect(() => {
    instructionRunner.current = runInstruction;
  });

  async function commit(el: HTMLElement, payload?: SavePayload) {
    const built = buildSavePayload(el);
    const original = originals.current.get(el);
    if (
      !payload &&
      !built.remove &&
      built.insertsBefore.length === 0 &&
      built.insertsAfter.length === 0 &&
      original !== undefined &&
      paragraphHtmlUnchanged(el, original)
    ) {
      clearSessionNodes(el);
      release(el);
      originals.current.delete(el);
      setEditing(null);
      setSave({
        el,
        phase: "committed",
        message: "No change to save",
        payload: {
          file: el.dataset.srcFile ?? "",
          hash: el.dataset.srcHash ?? "",
          html: built.html,
        },
      });
      return;
    }
    const nextPayload: SavePayload = payload ?? {
      file: el.dataset.srcFile ?? "",
      hash: el.dataset.srcHash ?? "",
      html: built.html,
      remove: built.remove,
      insertsBefore: built.insertsBefore,
      insertsAfter: built.insertsAfter,
    };
    const visible = el.innerHTML;
    if (!payload) {
      discardEmptyDrafts(el);
      stripInstructionNodes(el);
      release(el);
      originals.current.delete(el);
      setEditing(null);
      const hash = el.dataset.srcHash ?? "";
      if (!nextPayload.remove) holds.current.set(hash, holdHtml(el, el.innerHTML || visible));
    }
    setSave({ el, phase: "saving", message: "saving…", payload: nextPayload });
    try {
      const response = await fetch("/api/staff/edit-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(nextPayload),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        mode?: string;
      } | null;
      if (!response.ok || !data?.ok) {
        setSave({
          el,
          phase: "error",
          message: data?.error || "The edit could not be saved.",
          payload: nextPayload,
        });
        return;
      }
      if (nextPayload.remove) el.style.display = "none";
      setSave({
        el,
        phase: "committed",
        message: data.mode === "unchanged" ? "No change to save" : "committed",
        payload: nextPayload,
      });
    } catch {
      setSave({
        el,
        phase: "error",
        message: "The edit could not be saved.",
        payload: nextPayload,
      });
    }
  }

  useEffect(() => {
    if (save?.phase !== "committed") return;
    const timer = window.setTimeout(() => setSave(null), 4000);
    return () => window.clearTimeout(timer);
  }, [save]);

  useEffect(() => {
    const onOver = (event: MouseEvent) => {
      if (editing) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-inline-edit-ui]")) return;
      setHover(target.closest<HTMLElement>("[data-src-hash][data-src-file]"));
    };
    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, [editing]);

  useEffect(() => {
    const update = () => {
      setBox(pencilEl ? pencilEl.getBoundingClientRect() : null);
      const saved = save?.el;
      setBadgeBox(saved?.isConnected ? saved.getBoundingClientRect() : null);
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [pencilEl, save]);

  useEffect(() => {
    if (!editing || reviewing) return;
    const hostOf = (node: Node | null) => editableHost(editing, node);
    const armGhost = () => {
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
      if (editing.dataset.inlineRemoved === "1") return;
      const host = hostOf(document.getSelection()?.anchorNode ?? null);
      if (!host || host.querySelector("[data-inline-ghost]")) return;
      ghostTimer.current = window.setTimeout(() => {
        void requestSuggestion(editing, "continue");
      }, 600);
    };
    const onBeforeInput = (event: InputEvent) => {
      const host = hostOf(event.target instanceof Node ? event.target : null);
      if (!host) return;
      continueAbort.current?.abort();
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
      const ghost = host.querySelector("[data-inline-ghost]");
      if (!ghost) return;
      if (event.inputType === "insertText" && event.data) {
        const rest = consumeGhost(ghost.textContent ?? "", event.data);
        if (rest != null) {
          if (rest) ghost.textContent = rest;
          else ghost.remove();
          return;
        }
      }
      ghost.remove();
    };
    const onInput = (event: Event) => {
      if (!hostOf(event.target instanceof Node ? event.target : null)) return;
      if (snapshotTimer.current != null) window.clearTimeout(snapshotTimer.current);
      snapshotTimer.current = window.setTimeout(() => pushSnapshot(editing), 400);
      armGhost();
    };
    const onSelect = () => {
      if (suppressCaretDismiss) return;
      const host = hostOf(document.getSelection()?.anchorNode ?? null);
      const ghost = host?.querySelector("[data-inline-ghost]") ?? editing.querySelector("[data-inline-ghost]");
      if (ghost && caretIsBefore(ghost)) return;
      continueAbort.current?.abort();
      if (ghost) ghost.remove();
      editing.parentElement
        ?.querySelectorAll("[data-inline-ghost]")
        .forEach((node) => {
          if (node !== ghost) node.remove();
        });
      armGhost();
    };
    document.addEventListener("beforeinput", onBeforeInput);
    document.addEventListener("input", onInput);
    document.addEventListener("selectionchange", onSelect);
    return () => {
      document.removeEventListener("beforeinput", onBeforeInput);
      document.removeEventListener("input", onInput);
      document.removeEventListener("selectionchange", onSelect);
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
      if (snapshotTimer.current != null) window.clearTimeout(snapshotTimer.current);
      continueAbort.current?.abort();
    };
    // The pause timer must stay armed across renders. The request reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, pushSnapshot, reviewing]);

  useEffect(() => {
    if (!editing) return;
    const onKey = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const inSession = (node: EventTarget | null) =>
        node instanceof Element &&
        node.closest("[data-inline-session]")?.getAttribute("data-inline-session") ===
          editing.dataset.srcHash;
      const inField =
        editing.contains(active) ||
        inSession(active) ||
        inSession(event.target) ||
        (event.target instanceof Element &&
          event.target.closest("[data-inline-edit-ui]") != null);
      const mod = event.metaKey || event.ctrlKey;
      const undoKey = mod && !event.altKey && event.key.toLowerCase() === "z";
      if (!inField && event.key !== "Escape" && !undoKey) return;
      if (mod && !event.altKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (!historyRef.current) return;
        historyRef.current = event.shiftKey
          ? redoHistory(historyRef.current)
          : undoHistory(historyRef.current);
        restoreHistory(editing);
        return;
      }
      const ghostHost = findGhost(editing)?.parentElement ?? null;
      if (mod && event.key === "ArrowRight" && ghostHost) {
        event.preventDefault();
        if (acceptGhostWord(ghostHost)) pushSnapshot(editing);
        return;
      }
      if (event.key === "Tab" && ghostHost?.querySelector("[data-inline-ghost]")) {
        event.preventDefault();
        if (acceptGhost(ghostHost)) pushSnapshot(editing);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        continueAbort.current?.abort();
        if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
        if (findGhost(editing)) {
          removeGhost(editing);
          return;
        }
        if (reviewRef.current) {
          rejectAll(editing);
          return;
        }
        cancel(editing);
        return;
      }
      if (
        (event.key === "Backspace" || event.key === "Delete") &&
        event.target instanceof Element
      ) {
        const field = event.target.closest("[data-ai-instruction-text]");
        const block = field?.closest("[data-ai-instruction]");
        if (field && block instanceof HTMLElement && !field.textContent?.trim()) {
          event.preventDefault();
          pushSnapshot(editing);
          block.remove();
          pushSnapshot(editing);
          return;
        }
      }
      if (event.key === "Enter") {
        event.preventDefault();
      }
      if (!mod || event.altKey || reviewing) return;
      const key = event.key.toLowerCase();
      if (key === "b" || key === "i") {
        event.preventDefault();
        document.execCommand(key === "b" ? "bold" : "italic");
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const ai = target.closest("[data-ai-action]");
      if (ai instanceof HTMLElement && ai.closest("[data-inline-session]")?.getAttribute("data-inline-session") === editing.dataset.srcHash) {
        event.preventDefault();
        const block = ai.closest("[data-ai-instruction]");
        const action = ai.dataset.aiAction;
        if (!(block instanceof HTMLElement)) return;
        if (action === "remove-instruction") {
          pushSnapshot(editing);
          block.remove();
          pushSnapshot(editing);
          return;
        }
        if (action === "generate" || action === "retry") {
          instructionRunner.current(block, editing);
        }
        return;
      }
      const draftRemove = target.closest("[data-draft-action='remove']");
      if (
        draftRemove instanceof HTMLElement &&
        draftRemove.closest("[data-inline-draft]")?.getAttribute("data-inline-session") === editing.dataset.srcHash
      ) {
        event.preventDefault();
        const draft = draftRemove.closest("[data-inline-draft]");
        if (!draft) return;
        pushSnapshot(editing);
        draft.remove();
        pushSnapshot(editing);
        return;
      }
      const button = target.closest("[data-hunk-choice]");
      if (!button || !editing.contains(button)) return;
      event.preventDefault();
      const id = button.getAttribute("data-hunk-id");
      const choice = button.getAttribute("data-hunk-choice");
      if (!id || (choice !== "accept" && choice !== "reject")) return;
      chooseHunk(editing, id, choice);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
    // Hunk actions read the review ref. Rebinding them would drop keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancel, editing, pushSnapshot, restoreHistory]);

  const checking = Boolean(editing);
  const paragraphRemoved = Boolean(editing?.dataset.inlineRemoved) && sessionVersion >= 0;
  const showPencil = Boolean(pencilEl && box && box.width > 0 && box.height > 0);
  return (
    <>
      {showPencil && box ? (
        <div
          data-inline-edit-ui=""
          className="pointer-events-none fixed z-40 flex max-w-[16rem] flex-wrap items-start gap-1"
          style={{
            top: Math.max(8, box.top),
            left: Math.min(Math.max(8, box.right + 8), Math.max(8, window.innerWidth - 220)),
          }}
        >
          {checking && editing && paragraphEditable(editing) ? (
            <>
              <button
                type="button"
                className="pointer-events-auto h-6 rounded-full border border-amber-600 bg-amber-50 px-2 text-[11px] font-sans text-amber-950 shadow-sm hover:border-amber-800 disabled:opacity-40"
                aria-label="Insert AI instruction"
                title="Insert an AI instruction here. The instruction is not saved."
                disabled={suggesting || reviewing || paragraphRemoved || save?.phase === "saving"}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  pushSnapshot(editing);
                  insertInstruction(editing);
                  pushSnapshot(editing);
                  setSessionVersion((version) => version + 1);
                }}
              >
                AI
              </button>
              <button
                type="button"
                className="pointer-events-auto h-6 rounded-full border border-neutral-300 bg-white px-2 text-[11px] font-sans text-neutral-800 shadow-sm hover:border-neutral-800 disabled:opacity-40"
                aria-label="Insert paragraph below"
                title="Insert a paragraph below this one"
                disabled={suggesting || reviewing || paragraphRemoved || save?.phase === "saving"}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  pushSnapshot(editing);
                  insertParagraphBelow(editing);
                  pushSnapshot(editing);
                  setSessionVersion((version) => version + 1);
                }}
              >
                + Paragraph
              </button>
              <button
                type="button"
                className="pointer-events-auto h-6 rounded-full border border-neutral-300 bg-white px-2 text-[11px] font-sans text-neutral-800 shadow-sm hover:border-neutral-800 disabled:opacity-40"
                aria-label="Remove paragraph"
                title="Remove this paragraph. Undo or Esc restores it before save."
                disabled={suggesting || reviewing || paragraphRemoved || save?.phase === "saving"}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  pushSnapshot(editing);
                  markParagraphRemoved(editing);
                  pushSnapshot(editing);
                  setSessionVersion((version) => version + 1);
                }}
              >
                Remove
              </button>
            </>
          ) : null}
          {checking ? (
            <button
              type="button"
              className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:border-neutral-800 disabled:opacity-40"
              aria-label="Improve writing"
              title="Suggest wording fixes"
              disabled={suggesting || reviewing || save?.phase === "saving"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (editing) void requestSuggestion(editing, "improve");
              }}
            >
              <HiSparkles aria-hidden className="text-sm" />
            </button>
          ) : null}
          <button
            type="button"
            className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:border-neutral-800 disabled:opacity-40"
            aria-label={checking ? "Save edit" : "Edit text"}
            title={
              checking
                ? "Save edit"
                : "Edit this text. Esc cancels. Ctrl or Cmd Z undoes. Ctrl or Cmd B is bold, I is italic."
            }
            disabled={save?.phase === "saving" || reviewing || suggesting}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!pencilEl) return;
              if (editing) {
                removeGhost(editing);
                void commit(editing);
                return;
              }
              begin(pencilEl);
            }}
          >
            {checking ? <CheckIcon /> : <PencilIcon />}
          </button>
          {reviewing && editing ? (
            <span className="pointer-events-auto flex gap-1">
              <button
                type="button"
                className="rounded border border-neutral-300 bg-white px-1.5 text-[10px] font-sans text-neutral-800"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => acceptAll(editing)}
              >
                Accept all
              </button>
              <button
                type="button"
                className="rounded border border-neutral-300 bg-white px-1.5 text-[10px] font-sans text-neutral-800"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => rejectAll(editing)}
              >
                Reject all
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
      <style>{`[data-diff-hunk] del{background:#fee2e2;text-decoration:line-through}[data-diff-hunk] mark{background:#d1fae5}[data-inline-ghost]{color:#a3a3a3}[data-inline-removed]{opacity:.55;text-decoration:line-through;outline-color:#b91c1c}[data-ai-instruction]{box-shadow:inset 4px 0 0 #d97706}`}</style>
      {suggestError && box ? (
        <div
          data-inline-edit-ui=""
          role="status"
          className="pointer-events-auto fixed z-40 max-w-56 rounded border border-red-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-red-800 shadow-sm"
          style={{ top: Math.max(8, box.bottom + 4), left: Math.max(8, box.left) }}
        >
          {suggestError}
        </div>
      ) : null}
      {save && badgeBox ? (
        <div
          data-inline-edit-ui=""
          role="status"
          className="pointer-events-auto fixed z-40 max-w-56 rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-sans text-[11px] leading-snug text-neutral-800 shadow-sm"
          style={{ top: Math.max(8, badgeBox.bottom + 4), left: Math.max(8, badgeBox.left) }}
        >
          {save.message}
          {save.phase === "error" ? (
            <button
              type="button"
              className="ml-1 underline"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void commit(save.el, save.payload)}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
