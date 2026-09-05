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
      <div className="flex h-full w-full items-center justify-center px-6 text-center font-sans text-sm text-neutral-600">
        {alt}
      </div>
    );
  }

  return (
    // Public lecture exports live under /public/lectures/<slug>/.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}
