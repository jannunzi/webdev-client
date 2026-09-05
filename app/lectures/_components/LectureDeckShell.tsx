"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  lectureSlideCodeBlocks,
  type LectureHubItem,
  type LectureSlide,
} from "@/lib/lectures/types";
import LectureCodeBlock from "./LectureCodeBlock";
import LectureFilmstrip from "./LectureFilmstrip";
import LectureSlideImage from "./LectureSlideImage";
import SlideText from "./SlideText";

const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown", "PageDown", " ", "n", "N"]);
const PREV_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p", "P"]);

function kindLabel(kind: LectureSlide["kind"]): string {
  if (kind === "demo") return "Demo";
  if (kind === "break") return "Break";
  if (kind === "title") return "Title";
  return "Slide";
}

function kindFrame(kind: LectureSlide["kind"]): string {
  if (kind === "demo") {
    return "border-amber-400 bg-amber-50";
  }
  if (kind === "break") {
    return "border-sky-300 bg-sky-50";
  }
  if (kind === "title") {
    return "border-neutral-800 bg-neutral-900 text-white";
  }
  return "border-neutral-300 bg-white";
}

function fullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
  };
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function requestFs(el: HTMLElement): Promise<void> {
  if (el.requestFullscreen) return el.requestFullscreen();
  const webkit = (
    el as HTMLElement & { webkitRequestFullscreen?: () => void }
  ).webkitRequestFullscreen;
  if (webkit) {
    webkit.call(el);
    return Promise.resolve();
  }
  return Promise.reject(new Error("Fullscreen API is not available"));
}

function exitFs(): Promise<void> {
  if (document.exitFullscreen && document.fullscreenElement) {
    return document.exitFullscreen();
  }
  const webkit = (
    document as Document & { webkitExitFullscreen?: () => void }
  ).webkitExitFullscreen;
  if (webkit) {
    webkit.call(document);
    return Promise.resolve();
  }
  return Promise.resolve();
}

function replaceLocation({
  fullscreenQuery,
  slideNumber,
}: {
  fullscreenQuery?: boolean;
  slideNumber: number;
}) {
  const url = new URL(window.location.href);
  if (fullscreenQuery === true) url.searchParams.set("fullscreen", "1");
  if (fullscreenQuery === false) url.searchParams.delete("fullscreen");
  url.hash = `slide-${slideNumber}`;
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    history.replaceState(null, "", next);
  }
}

export default function LectureDeckShell({
  deckTitle,
  slides,
  prevDeck,
  nextDeck,
}: {
  deckTitle: string;
  slides: LectureSlide[];
  prevDeck?: LectureHubItem;
  nextDeck?: LectureHubItem;
}) {
  const labelId = useId();
  const stageRef = useRef<HTMLElement>(null);
  const pendingFullscreen = useRef(false);
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const last = slides.length - 1;
  const slide = slides[index] ?? slides[0];
  const kind = slide?.kind ?? "content";
  const codeBlocks = slide ? lectureSlideCodeBlocks(slide) : [];

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(last, Math.max(0, next)));
    },
    [last],
  );

  const enterFullscreen = useCallback(async () => {
    const el = stageRef.current;
    if (!el) return;
    try {
      await requestFs(el);
    } catch {
      pendingFullscreen.current = true;
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    pendingFullscreen.current = false;
    try {
      await exitFs();
    } catch {
      /* browser may already have left fullscreen */
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (fullscreenElement()) {
      void exitFullscreen();
      return;
    }
    void enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#slide-/, "");
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= slides.length) {
      setIndex(parsed - 1);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("fullscreen") === "1") {
      pendingFullscreen.current = true;
      const el = stageRef.current;
      if (el) {
        requestFs(el).catch(() => {
          /* needs a later click or key — Fullscreen API requires a gesture */
        });
      }
    }
  }, [slides.length]);

  useEffect(() => {
    replaceLocation({
      slideNumber: index + 1,
      fullscreenQuery: isFullscreen ? true : undefined,
    });
  }, [index, isFullscreen]);

  useEffect(() => {
    function sync() {
      const active = fullscreenElement() === stageRef.current;
      setIsFullscreen(active);
      if (active) pendingFullscreen.current = false;
      if (!active && !pendingFullscreen.current) {
        replaceLocation({ fullscreenQuery: false, slideNumber: index + 1 });
      }
    }
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [index]);

  useEffect(() => {
    function tryPendingGesture() {
      if (!pendingFullscreen.current || fullscreenElement()) return;
      const el = stageRef.current;
      if (el) {
        requestFs(el).catch(() => {});
      }
    }
    window.addEventListener("pointerdown", tryPendingGesture);
    return () => window.removeEventListener("pointerdown", tryPendingGesture);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (!isFullscreen && (event.key === "f" || event.key === "F")) {
        event.preventDefault();
        toggleFullscreen();
        return;
      }
      if (event.key === "Escape") {
        if (fullscreenElement()) {
          event.preventDefault();
          void exitFullscreen();
        }
        return;
      }
      if (NEXT_KEYS.has(event.key)) {
        event.preventDefault();
        goTo(index + 1);
        return;
      }
      if (PREV_KEYS.has(event.key)) {
        event.preventDefault();
        goTo(index - 1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(last);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitFullscreen, goTo, index, isFullscreen, last, toggleFullscreen]);

  if (!slide) return null;

  const percent = slides.length === 0 ? 0 : ((index + 1) / slides.length) * 100;
  const titleClass = isFullscreen
    ? kind === "title"
      ? "mt-0 font-sans text-6xl font-semibold tracking-tight text-white sm:text-7xl"
      : "mt-0 font-sans text-5xl font-semibold leading-tight tracking-tight sm:text-6xl"
    : kind === "title"
      ? "mt-0 font-sans text-5xl font-semibold tracking-tight text-white sm:text-6xl"
      : "mt-0 font-sans text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl";

  return (
    <section
      aria-labelledby={labelId}
      className="flex min-h-0 min-w-0 flex-1 gap-2 overflow-hidden"
    >
      {isFullscreen ? null : (
        <LectureFilmstrip
          slides={slides}
          currentIndex={index}
          onSelect={goTo}
        />
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <p className="sr-only" id={labelId}>
          {deckTitle}
        </p>
        {isFullscreen ? null : (
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 font-sans text-sm text-neutral-600">
            <p className="m-0 tabular-nums" aria-live="polite">
              {index + 1} / {slides.length}
            </p>
            <button
              type="button"
              className="rounded border border-neutral-800 bg-white px-3 py-1.5 text-sm"
              onClick={() => toggleFullscreen()}
            >
              Fullscreen
            </button>
          </div>
        )}

        {isFullscreen ? null : (
          <div
            className="mb-2 h-1.5 shrink-0 overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-valuenow={index + 1}
            aria-label="Deck progress"
          >
            <div
              className="h-full bg-neutral-800 transition-[width] duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}

        <article
          ref={stageRef}
          className={
            isFullscreen
              ? `h-full w-full overflow-auto px-6 py-8 sm:px-10 sm:py-10 ${kindFrame(kind)}`
              : `min-h-0 flex-1 overflow-auto rounded-lg border-2 px-5 py-6 sm:px-8 sm:py-8 ${kindFrame(kind)}`
          }
        >
          <p
            className={`m-0 text-sm font-semibold uppercase tracking-wide sm:text-base ${
              kind === "title" ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            {kindLabel(kind)}
          </p>
          <h2 className={`${titleClass} mb-5`}>{slide.title}</h2>
          {slide.bullets && slide.bullets.length > 0 ? (
            <ul
              className={`m-0 space-y-4 pl-8 text-2xl leading-snug sm:text-[1.75rem] lg:text-3xl ${
                kind === "title" ? "text-neutral-100" : "text-neutral-900"
              }`}
            >
              {slide.bullets.map((bullet, bulletIndex) => (
                <li key={`${slide.id}-${bulletIndex}`}>
                  <SlideText text={bullet} />
                </li>
              ))}
            </ul>
          ) : null}
          {codeBlocks.map((block, blockIndex) => (
            <LectureCodeBlock
              key={`${slide.id}-code-${blockIndex}`}
              block={block}
            />
          ))}
          {slide.imageSrc ? (
            <LectureSlideImage
              src={slide.imageSrc}
              alt={slide.imageAlt ?? slide.title}
            />
          ) : null}
          {slide.interactiveHint ? (
            <p
              className={`mt-6 rounded-md border px-4 py-3 text-lg sm:text-xl ${
                kind === "title"
                  ? "border-neutral-600 bg-neutral-800 text-neutral-100"
                  : "border-neutral-300 bg-white text-neutral-800"
              }`}
            >
              <span className="font-semibold">Try this: </span>
              <SlideText text={slide.interactiveHint} />
            </p>
          ) : null}
        </article>

        {isFullscreen ? null : (
          <>
            <div className="mt-2 flex shrink-0 flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
              >
                Previous slide
              </button>
              <p className="m-0 font-sans text-xs text-neutral-500">
                ← → or space · f fullscreen · Esc exits · Home / End
              </p>
              <button
                type="button"
                className="book-practice-cta rounded border border-neutral-800 bg-neutral-800 px-3 py-2 font-sans text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goTo(index + 1)}
                disabled={index === last}
              >
                Next slide
              </button>
            </div>
            <nav
              aria-label="Other Lecture 1 decks"
              className="mt-2 flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-2 font-sans text-sm"
            >
              {prevDeck ? (
                <Link href={`/lectures/${prevDeck.slug}`}>← {prevDeck.title}</Link>
              ) : (
                <span className="text-neutral-500">Lecture 1 · first deck</span>
              )}
              {nextDeck ? (
                <Link href={`/lectures/${nextDeck.slug}`}>{nextDeck.title} →</Link>
              ) : (
                <span className="text-neutral-500">Lecture 1 · last deck</span>
              )}
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
