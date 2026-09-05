"use client";

import { useState } from "react";

export default function LectureSlideImage({
  src,
  alt,
  fullscreen,
}: {
  src: string;
  alt: string;
  fullscreen?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <figure className="my-4 rounded border border-dashed border-neutral-400 bg-neutral-50 px-4 py-6 font-sans">
        <figcaption className="m-0 text-center text-sm text-neutral-600">
          Slide image not in the repo yet. Export from Google Slides to{" "}
          <code>{src}</code>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="book-live-figure my-4 flex w-full max-w-full flex-col overflow-hidden rounded border border-neutral-300 bg-white shadow-sm">
      <div
        className={`flex items-center justify-center bg-neutral-50 p-2 ${
          fullscreen ? "min-h-[12rem] flex-1" : ""
        }`}
      >
        {/* Public lecture exports; path may 404 until Jose adds the PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`mx-auto h-auto w-full max-w-full rounded border border-neutral-200 bg-white object-contain ${
            fullscreen ? "max-h-[min(78vh,46rem)]" : "max-h-[min(56vh,32rem)]"
          }`}
          onError={() => setFailed(true)}
        />
      </div>
    </figure>
  );
}
