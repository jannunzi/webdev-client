"use client";

import { useEffect, useRef } from "react";
import type { LectureSlide } from "@/lib/lectures/types";

export default function LectureFilmstrip({
  slides,
  currentIndex,
  onSelect,
}: {
  slides: LectureSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [currentIndex]);

  return (
    <nav
      aria-label="Slides"
      className="h-full w-[4.75rem] shrink-0 overflow-y-auto overflow-x-hidden pr-1 sm:w-28 md:w-32"
    >
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {slides.map((slide, index) => {
          const current = index === currentIndex;
          return (
            <li key={slide.id} className="m-0">
              <button
                ref={current ? currentRef : undefined}
                type="button"
                onClick={() => onSelect(index)}
                aria-current={current ? "true" : undefined}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                className={`block w-full overflow-hidden rounded border bg-white p-0 text-left ${
                  current
                    ? "border-neutral-900 ring-2 ring-neutral-900"
                    : "border-neutral-300 hover:border-neutral-600"
                }`}
              >
                <span className="relative block aspect-video w-full bg-neutral-100">
                  {slide.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.imageSrc}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center px-1 text-center font-sans text-[0.65rem] text-neutral-500">
                      {slide.title}
                    </span>
                  )}
                </span>
                <span className="block px-1 py-0.5 font-sans text-[0.65rem] tabular-nums text-neutral-600">
                  {index + 1}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
