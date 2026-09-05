"use client";

import { useState } from "react";

export default function LectureSlideImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
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

  return (
    <figure className="my-4 max-h-[min(42vh,24rem)] w-full max-w-full overflow-hidden rounded border border-neutral-300 bg-white shadow-sm">
      {/* Public lecture exports live under /public/lectures/<slug>/. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="mx-auto max-h-[min(42vh,24rem)] w-auto max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </figure>
  );
}
