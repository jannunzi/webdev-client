"use client";

import { useState } from "react";

export default function LectureSlideImage({
  src,
  alt,
  caption,
  stage = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  /** Fill the lecture stage — used for book Canvas/Kambaz target screenshots. */
  stage?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <figure className="my-4 rounded border border-dashed border-neutral-400 bg-neutral-50 px-4 py-4 font-sans">
        <figcaption className="m-0 text-center text-sm text-neutral-600">
          Diagram not in the repo yet. Export to <code>{src}</code>
        </figcaption>
      </figure>
    );
  }

  const frame = stage
    ? "lecture-target-figure my-3 w-full max-h-[min(72vh,46rem)] overflow-hidden rounded border border-neutral-300 bg-white shadow-sm"
    : "my-4 max-h-[min(42vh,24rem)] w-full max-w-full overflow-hidden rounded border border-neutral-300 bg-white shadow-sm";
  const image = stage
    ? "mx-auto max-h-[min(64vh,40rem)] w-auto max-w-full object-contain"
    : "mx-auto max-h-[min(42vh,24rem)] w-auto max-w-full object-contain";

  return (
    <figure className={frame}>
      {/* Public lecture exports live under /public/lectures/<slug>/. */}
      {/* Book Canvas/Kambaz targets live under /public/images/book/kambaz/. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={image}
        onError={() => setFailed(true)}
      />
      {caption ? (
        <figcaption className="m-0 border-t border-neutral-200 bg-neutral-100 px-3 py-2 text-center font-sans text-base text-neutral-700 sm:text-lg">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
