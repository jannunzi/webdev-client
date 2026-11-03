"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const originals = useRef(new Map<HTMLElement, string>());
  const outlines = useRef(new Map<HTMLElement, string>());
  const holds = useRef(new Map<string, () => void>());
  const pencilEl = editing ?? hover;

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
    release(el);
    if (original !== undefined) el.innerHTML = original;
    originals.current.delete(el);
    setEditing(null);
    setSave(null);
  }, [release]);

  function begin(el: HTMLElement) {
    if (editing && editing !== el) return;
    originals.current.set(el, el.innerHTML);
    outlines.current.set(el, el.style.outline);
    el.style.outline = "2px solid #2563eb";
    el.contentEditable = "true";
    lockFixed(el);
    setEditing(el);
    setHover(el);
    setSave(null);
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
    if (!editing) return;
    const onKey = (event: KeyboardEvent) => {
      if (!editing.contains(document.activeElement) && event.key !== "Escape") return;
      if (event.key === "Escape") {
        event.preventDefault();
        cancel(editing);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        return;
      }
      const mod = event.metaKey || event.ctrlKey;
      if (!mod || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "b" || key === "i") {
        event.preventDefault();
        document.execCommand(key === "b" ? "bold" : "italic");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cancel, editing]);

  const checking = Boolean(editing);
  const showPencil = Boolean(pencilEl && box && box.width > 0 && box.height > 0);
  return (
    <>
      {showPencil && box ? (
        <div
          data-inline-edit-ui=""
          className="pointer-events-none fixed z-40"
          style={{ top: Math.max(8, box.top - 6), left: Math.max(8, box.right - 28) }}
        >
          <button
            type="button"
            className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:border-neutral-800"
            aria-label={checking ? "Save edit" : "Edit text"}
            title={
              checking
                ? "Save edit"
                : "Edit this text. Esc cancels. Ctrl or Cmd B is bold, I is italic."
            }
            disabled={save?.phase === "saving"}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!pencilEl) return;
              if (editing) {
                void commit(editing);
                return;
              }
              begin(pencilEl);
            }}
          >
            {checking ? <CheckIcon /> : <PencilIcon />}
          </button>
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
