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
  maskPreservedHtml,
  renderReview,
  splitGhostWord,
  type DiffPart,
  type HunkChoice,
} from "@/lib/inline-edit/suggest-diff";

type SavePayload = { file: string; hash: string; html: string };
type SaveState = {
  el: HTMLElement;
  phase: "saving" | "committed" | "error";
  message: string;
  payload: SavePayload;
};

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Walk the edited element. JSX slots stay as placeholders; slide markup stays as tags. */
export function serializeEditable(root: HTMLElement): string {
  const kind = root.dataset.editKind === "jsx" ? "jsx" : "text";
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    if (el.dataset.inlineGhost != null) return "";
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

function removeGhost(el: HTMLElement) {
  el.querySelectorAll("[data-inline-ghost]").forEach((node) => node.remove());
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

export default function InlineEditController() {
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
  const originals = useRef(new Map<HTMLElement, string>());
  const outlines = useRef(new Map<HTMLElement, string>());
  const holds = useRef(new Map<string, () => void>());
  const historyRef = useRef<EditHistory | null>(null);
  const reviewRef = useRef<{ parts: DiffPart[]; baseHtml: string } | null>(null);
  const ghostTimer = useRef<number | null>(null);
  const snapshotTimer = useRef<number | null>(null);
  const continueAbort = useRef<AbortController | null>(null);
  const pencilEl = editing ?? hover;

  const pushSnapshot = useCallback((el: HTMLElement) => {
    const html = currentHtml(el);
    const history = historyRef.current ?? createHistory(html);
    historyRef.current = pushHistory(history, html);
  }, []);

  const restoreHistory = useCallback((el: HTMLElement) => {
    const history = historyRef.current;
    if (!history) return;
    removeGhost(el);
    el.innerHTML = history.present;
    const stillReviewing = Boolean(el.querySelector("[data-diff-hunk]"));
    setReviewing(stillReviewing);
    if (stillReviewing) {
      el.contentEditable = "false";
      return;
    }
    reviewRef.current = null;
    el.contentEditable = "true";
    lockFixed(el);
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
    if (original !== undefined) el.innerHTML = original;
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
    historyRef.current = createHistory(el.innerHTML);
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
    const html = serializeEditable(el);
    const masked = maskPreservedHtml(html);
    let text = masked.prompt;
    let after = "";
    let maskCount = masked.masks.length;
    if (mode === "continue") {
      const halves = caretHalves(el);
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
        const halves = caretHalves(el);
        const again = halves
          ? maskPreservedHtml(`${halves.beforeHtml}\u0001${halves.afterHtml}`).prompt.split("\u0001")[0]
          : null;
        if (!reviewRef.current && again === text) showGhost(el, data.text);
        return;
      }
      const diff = buildDiff(masked.prompt, data.text, masked.masks);
      if (!diff.ok) {
        setSuggestError(diff.error);
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

  async function commit(el: HTMLElement, payload?: SavePayload) {
    const html = payload?.html ?? serializeEditable(el);
    const nextPayload: SavePayload = payload ?? {
      file: el.dataset.srcFile ?? "",
      hash: el.dataset.srcHash ?? "",
      html,
    };
    const visible = el.innerHTML;
    if (!payload) {
      release(el);
      originals.current.delete(el);
      setEditing(null);
      const hash = el.dataset.srcHash ?? "";
      holds.current.set(hash, holdHtml(el, visible));
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
    const armGhost = () => {
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
      if (editing.querySelector("[data-inline-ghost]")) return;
      ghostTimer.current = window.setTimeout(() => {
        void requestSuggestion(editing, "continue");
      }, 600);
    };
    const onBeforeInput = (event: InputEvent) => {
      continueAbort.current?.abort();
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
      const ghost = editing.querySelector("[data-inline-ghost]");
      if (!ghost) return;
      if (event.inputType === "insertText" && event.data && (ghost.textContent ?? "").startsWith(event.data)) {
        const rest = (ghost.textContent ?? "").slice(event.data.length);
        if (rest) ghost.textContent = rest;
        else ghost.remove();
        return;
      }
      ghost.remove();
    };
    const onInput = () => {
      if (snapshotTimer.current != null) window.clearTimeout(snapshotTimer.current);
      snapshotTimer.current = window.setTimeout(() => pushSnapshot(editing), 400);
      armGhost();
    };
    const onSelect = () => {
      if (suppressCaretDismiss) return;
      const ghost = editing.querySelector("[data-inline-ghost]");
      if (ghost && caretIsBefore(ghost)) return;
      continueAbort.current?.abort();
      if (ghost) ghost.remove();
      armGhost();
    };
    editing.addEventListener("beforeinput", onBeforeInput);
    editing.addEventListener("input", onInput);
    document.addEventListener("selectionchange", onSelect);
    return () => {
      editing.removeEventListener("beforeinput", onBeforeInput);
      editing.removeEventListener("input", onInput);
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
      const inField =
        editing.contains(document.activeElement) ||
        (event.target instanceof Element &&
          event.target.closest("[data-inline-edit-ui]") != null);
      if (!inField && event.key !== "Escape") return;
      const mod = event.metaKey || event.ctrlKey;
      if (mod && !event.altKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (!historyRef.current) return;
        historyRef.current = event.shiftKey
          ? redoHistory(historyRef.current)
          : undoHistory(historyRef.current);
        restoreHistory(editing);
        return;
      }
      if (
        mod &&
        event.key === "ArrowRight" &&
        editing.querySelector("[data-inline-ghost]")
      ) {
        event.preventDefault();
        if (acceptGhostWord(editing)) pushSnapshot(editing);
        return;
      }
      if (event.key === "Tab" && editing.querySelector("[data-inline-ghost]")) {
        event.preventDefault();
        if (acceptGhost(editing)) pushSnapshot(editing);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        continueAbort.current?.abort();
        if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
        if (editing.querySelector("[data-inline-ghost]")) {
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
      const button = target.closest("[data-hunk-choice]");
      if (!button || !editing.contains(button)) return;
      event.preventDefault();
      const id = button.getAttribute("data-hunk-id");
      const choice = button.getAttribute("data-hunk-choice");
      if (!id || (choice !== "accept" && choice !== "reject")) return;
      chooseHunk(editing, id, choice);
    };
    document.addEventListener("keydown", onKey);
    editing.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      editing.removeEventListener("click", onClick);
    };
    // Hunk actions read the review ref. Rebinding them would drop keystrokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancel, editing, pushSnapshot, restoreHistory]);

  const checking = Boolean(editing);
  const showPencil = Boolean(pencilEl && box && box.width > 0 && box.height > 0);
  return (
    <>
      {showPencil && box ? (
        <div
          data-inline-edit-ui=""
          className="pointer-events-none fixed z-40 flex items-start gap-1"
          style={{ top: Math.max(8, box.top - 6), left: Math.max(8, box.right - 60) }}
        >
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
      <style>{`[data-diff-hunk] del{background:#fee2e2;text-decoration:line-through}[data-diff-hunk] mark{background:#d1fae5}[data-inline-ghost]{color:#a3a3a3}`}</style>
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
