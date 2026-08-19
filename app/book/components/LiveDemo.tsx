import type { ReactNode } from "react";

export default function LiveDemo({
  name,
  file,
  title,
  mode = "html",
  children,
}: {
  /** Component / function name shown in the caption */
  name?: string;
  /** Short file label, e.g. HeadingTags.tsx (not intermediate slugs) */
  file?: string;
  /** Fallback caption for non-component figures */
  title?: ReactNode;
  /**
   * `html` — browser-default look (Ch1). `styled` — allow stylesheets /
   * Tailwind / plain CSS for CSS labs (Ch2+).
   */
  mode?: "html" | "styled";
  children: ReactNode;
}) {
  const caption =
    name || file ? (
      <span className="flex min-w-0 items-baseline gap-2">
        {name ? (
          <span className="font-medium text-neutral-800">{name}</span>
        ) : null}
        {file ? (
          <span className="truncate font-mono text-xs text-neutral-500">
            {file}
          </span>
        ) : null}
      </span>
    ) : (
      title
    );

  return (
    <figure className="book-live-figure my-4 w-full max-w-full overflow-hidden rounded border border-neutral-300 bg-white shadow-sm">
      {caption ? (
        <figcaption className="border-b border-neutral-300 bg-neutral-100 px-3 py-2 font-sans text-sm text-neutral-700">
          {caption}
        </figcaption>
      ) : null}
      <div
        className={
          mode === "styled" ? "book-live-demo book-live-demo-styled" : "book-live-demo"
        }
      >
        {children}
      </div>
    </figure>
  );
}
