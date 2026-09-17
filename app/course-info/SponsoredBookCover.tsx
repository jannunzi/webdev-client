"use client";

import { useEffect, useState } from "react";
import {
  affiliateCoverSources,
  isUsableAmazonCover,
} from "@/lib/affiliate/covers";

type SponsoredBookCoverProps = {
  title: string;
  asin: string;
  coverUrl?: string;
  className?: string;
};

const FRAME_CLASS =
  "h-[4.5rem] w-12 rounded border border-neutral-200 bg-neutral-50 object-cover";

export default function SponsoredBookCover({
  title,
  asin,
  coverUrl,
  className = FRAME_CLASS,
}: SponsoredBookCoverProps) {
  const sources = affiliateCoverSources({ asin, coverUrl });
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [asin, coverUrl]);

  const src = sources[sourceIndex];

  if (!src) {
    return (
      <span
        className={`flex items-center justify-center font-sans text-lg text-neutral-500 ${className}`}
        aria-hidden
      >
        {title.slice(0, 1)}
      </span>
    );
  }

  return (
    // Amazon/Open Library covers can 404 or return a 1×1 spacer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      width={48}
      height={72}
      className={className}
      onError={() => setSourceIndex((index) => index + 1)}
      onLoad={(event) => {
        const img = event.currentTarget;
        if (!isUsableAmazonCover(img.naturalWidth, img.naturalHeight)) {
          setSourceIndex((index) => index + 1);
        }
      }}
    />
  );
}
