"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import ChapterEditor from "@/app/book-editor/chapter-1/editor";
import type { ChapterPayload } from "@/lib/book-editor/handle";
import { nextChapterEdit, UNSAVED_EDIT_MESSAGE } from "@/lib/book-editor/book2-edit";

export default function Book2Chapter1({
  initial,
  children,
}: {
  initial: ChapterPayload;
  children: ReactNode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"reading" | "editing">("reading");
  const [dirty, setDirty] = useState(false);
  const [guard, setGuard] = useState("");

  useEffect(() => {
    if (mode !== "editing" || !dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      event.preventDefault();
      event.stopPropagation();
      setGuard(UNSAVED_EDIT_MESSAGE);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [mode, dirty]);

  function edit() {
    const result = nextChapterEdit({ mode, dirty }, "edit");
    setMode(result.state.mode);
    setDirty(result.state.dirty);
    setGuard("");
  }

  function done() {
    const result = nextChapterEdit({ mode, dirty }, "done");
    if (result.blocked) {
      setGuard(UNSAVED_EDIT_MESSAGE);
      return;
    }
    setGuard("");
    setMode("reading");
    setDirty(false);
    router.refresh();
  }

  return (
    <div data-book2-chapter="1" data-edit-mode={mode}>
      <div className="mb-4 flex flex-wrap items-center gap-3 font-sans">
        {mode === "reading" ? (
          <button
            type="button"
            onClick={edit}
            className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={done}
            className="rounded border border-neutral-400 bg-white px-3 py-2 text-sm text-neutral-900"
          >
            Done
          </button>
        )}
        <p className="m-0 text-sm text-neutral-600">
          {mode === "reading"
            ? "Chapter 1 is read-only until you edit. Other chapters stay published."
            : "Save keeps this chapter. Done returns to reading."}
        </p>
      </div>
      {guard ? (
        <p role="alert" className="mb-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950">
          {guard}
        </p>
      ) : null}
      {mode === "reading" ? (
        children
      ) : (
        <ChapterEditor
          initial={initial}
          manualSave
          onDirtyChange={(next) => {
            setDirty(next);
            if (!next) setGuard("");
          }}
        />
      )}
    </div>
  );
}
