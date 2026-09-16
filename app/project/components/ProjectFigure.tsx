import Image from "next/image";
import type { ProjectDocImage } from "../types";

export default function ProjectFigure({
  src,
  alt,
  width,
  height,
}: ProjectDocImage) {
  const compact = height > 0 && width / height > 4;

  return (
    <figure className="my-4 overflow-hidden rounded border border-neutral-300 bg-white shadow-sm">
      <div className="bg-neutral-50 p-2">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 64rem) 100vw, 56rem"
          className={
            compact
              ? "mx-auto h-auto w-auto max-w-full bg-white object-contain"
              : "mx-auto h-auto w-auto max-w-full rounded border border-neutral-200 bg-white object-contain"
          }
        />
      </div>
    </figure>
  );
}
