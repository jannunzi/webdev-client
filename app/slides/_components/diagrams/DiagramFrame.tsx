import type { ReactNode } from "react";

export default function DiagramFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm">
      <figcaption className="m-0 border-b border-neutral-200 bg-neutral-100 px-3 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-neutral-600">
        {label}
      </figcaption>
      <div className="px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </figure>
  );
}
