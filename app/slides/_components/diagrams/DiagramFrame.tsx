import type { ReactNode } from "react";

export default function DiagramFrame({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: ReactNode;
  /** Shorter chrome so a diagram can sit under existing bullets and still fit. */
  compact?: boolean;
}) {
  return (
    <figure
      className={
        compact
          ? "my-1 overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm"
          : "my-5 overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm"
      }
    >
      {label ? (
        <figcaption
          className={
            compact
              ? "m-0 border-b border-neutral-200 bg-neutral-100 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600"
              : "m-0 border-b border-neutral-200 bg-neutral-100 px-3 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-neutral-600"
          }
        >
          {label}
        </figcaption>
      ) : null}
      <div className={compact ? "px-1.5 py-1" : "px-4 py-5 sm:px-6 sm:py-6"}>{children}</div>
    </figure>
  );
}
