import type { ReactNode } from "react";

type FigureSource = {
  src: string;
  alt: string;
  /** Caption rendered under this image, e.g. "Figure 2a — Dashboard Screen". */
  caption?: ReactNode;
  id?: string;
};

function FigureFrame({
  src,
  alt,
  caption,
  id,
  imageClassName,
  className = "my-4",
}: FigureSource & { imageClassName?: string; className?: string }) {
  return (
    <figure
      id={id}
      className={`book-live-figure scroll-mt-6 flex h-full w-full max-w-full flex-col overflow-hidden rounded border border-neutral-300 bg-white shadow-sm ${className}`}
    >
      <div className="flex min-h-0 flex-1 items-start bg-neutral-50 p-2">
        <img
          src={src}
          alt={alt}
          className={
            imageClassName ??
            "mx-auto h-auto w-full max-w-full rounded border border-neutral-200 bg-white object-contain"
          }
        />
      </div>
      {caption ? (
        <figcaption className="mt-auto border-t border-neutral-300 bg-neutral-100 px-3 py-2 text-center font-sans text-sm text-neutral-700">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Static screenshot / diagram figure for the book (PDF assets, etc.). */
export default function BookFigure({
  src,
  alt,
  caption,
  id,
  sources,
  imageClassName,
}: {
  /** Single image path under /public */
  src?: string;
  alt?: string;
  caption?: ReactNode;
  id?: string;
  /** Optional set of images, each with its own caption underneath */
  sources?: FigureSource[];
  /** Override default full-width image sizing (e.g. narrow sidebars). */
  imageClassName?: string;
}) {
  const images: FigureSource[] =
    sources ??
    (src ? [{ src, alt: alt ?? "", caption, id }] : []);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return <FigureFrame {...images[0]} imageClassName={imageClassName} />;
  }

  return (
    <div className="my-4 grid items-stretch gap-4 sm:grid-cols-2">
      {images.map((img) => (
        <FigureFrame
          key={img.src}
          {...img}
          className="my-0"
          imageClassName={imageClassName}
        />
      ))}
    </div>
  );
}
