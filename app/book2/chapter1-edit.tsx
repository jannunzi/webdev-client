"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const barRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"reading" | "editing">("reading");
  const [dirty, setDirty] = useState(false);
  const [guard, setGuard] = useState("");
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    const header = document.querySelector(".course-site-header");
    const main = document.querySelector(".book-shell main");
    const place = () => {
      if (!bar) return;
      const headerHeight = Math.ceil(header?.getBoundingClientRect().height ?? 0);
      const column = main?.getBoundingClientRect();
      const left = Math.max(0, Math.round(column?.left ?? 0));
      const right = Math.max(0, Math.round(window.innerWidth - (column?.right ?? window.innerWidth)));
      const height = Math.ceil(bar.getBoundingClientRect().height);
      bar.style.position = "fixed";
      bar.style.top = `${headerHeight}px`;
      bar.style.left = `${left}px`;
      bar.style.right = `${right}px`;
      bar.style.width = "auto";
      bar.style.maxWidth = "100%";
      bar.style.boxSizing = "border-box";
      bar.style.zIndex = "40";
      setBarHeight(height);
      document.documentElement.style.scrollPaddingTop = `${headerHeight + height + 8}px`;
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, [mode, guard]);

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
      <div aria-hidden="true" style={{ height: barHeight }} />
      <div
        ref={barRef}
        className="book2-edit-bar z-40 box-border flex max-w-full flex-wrap items-center gap-3 border-b border-neutral-200 bg-white/95 px-4 py-2 font-sans backdrop-blur"
      >
        <p className="m-0 min-w-0 flex-1 text-sm text-neutral-600">
          {mode === "reading"
            ? "Chapter 1 is read-only until you edit. Other chapters stay published."
            : "Save keeps this chapter. Done returns to reading."}
        </p>
        {mode === "reading" ? (
          <button
            type="button"
            onClick={edit}
            aria-label="Edit Chapter 1"
            className="ml-auto shrink-0 rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={done}
            aria-label="Done editing Chapter 1"
            className="ml-auto shrink-0 rounded border border-neutral-400 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Done
          </button>
        )}
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
