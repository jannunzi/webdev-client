import type { ReactNode } from "react";

export default function UiMockFrame({
  product,
  url,
  children,
}: {
  product: string;
  url?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm">
      <figcaption className="m-0 flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-2 font-sans text-sm text-neutral-600">
        <span className="font-semibold uppercase tracking-wide">Walkthrough</span>
        <span>{product}</span>
      </figcaption>
      <div className="bg-neutral-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="sr-only">Browser window</span>
          <span aria-hidden className="size-3 rounded-full bg-red-500" />
          <span aria-hidden className="size-3 rounded-full bg-amber-400" />
          <span aria-hidden className="size-3 rounded-full bg-emerald-500" />
          {url ? (
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md border border-neutral-400 bg-white px-3 py-1 font-mono text-sm text-neutral-700">
              {url}
            </span>
          ) : null}
        </div>
      </div>
      <div className="bg-neutral-50 px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </figure>
  );
}
