"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import type { LectureHubItem, LectureSlide } from "@/lib/lectures/types";
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
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;
  const slide = slides[index] ?? slides[0];
  const kind = slide?.kind ?? "content";

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(last, Math.max(0, next)));
    },
    [last],
  );

  useEffect(() => {
    const raw = window.location.hash.replace(/^#slide-/, "");
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= slides.length) {
      setIndex(parsed - 1);
    }
  }, [slides.length]);

  useEffect(() => {
    const hash = `slide-${index + 1}`;
    if (window.location.hash !== `#${hash}`) {
      history.replaceState(null, "", `#${hash}`);
    }
  }, [index]);

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
  }, [goTo, index, last]);

  if (!slide) return null;

  const percent = slides.length === 0 ? 0 : ((index + 1) / slides.length) * 100;
  const titleClass =
    kind === "title"
      ? "mt-0 font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl"
      : "mt-0 font-sans text-3xl font-semibold tracking-tight";

  return (
    <section
      aria-labelledby={labelId}
      className="font-sans"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600">
        <p className="m-0" id={labelId}>
          {deckTitle}
        </p>
        <p className="m-0 tabular-nums" aria-live="polite">
          {index + 1} / {slides.length}
        </p>
      </div>
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-200"
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

      <article
        className={`min-h-[22rem] rounded-lg border-2 px-5 py-6 shadow-sm sm:px-8 sm:py-8 ${kindFrame(kind)} ${
          kind === "title" || kind === "break" ? "flex flex-col justify-center" : ""
        }`}
      >
        <p
          className={`m-0 text-xs font-semibold uppercase tracking-wide ${
            kind === "title" ? "text-neutral-300" : "text-neutral-500"
          }`}
        >
          {kindLabel(kind)}
        </p>
        <h2 className={`${titleClass} mb-4`}>{slide.title}</h2>
        {slide.bullets && slide.bullets.length > 0 ? (
          <ul
            className={`m-0 space-y-2 pl-5 text-[1.05rem] leading-relaxed ${
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
        {slide.interactiveHint ? (
          <p
            className={`mt-6 rounded-md border px-3 py-2 text-sm ${
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          Previous slide
        </button>
        <p className="m-0 text-xs text-neutral-500">
          ← → or space · Home / End
        </p>
        <button
          type="button"
          className="book-practice-cta rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => goTo(index + 1)}
          disabled={index === last}
        >
          Next slide
        </button>
      </div>

      <nav
        aria-label="Other Lecture 1 decks"
        className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-200 pt-4 text-sm"
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
    </section>
  );
}
