import { lectureDemoSourceLabel } from "@/lib/lectures/blocks";

export default function LectureDemoFrame({
  label,
  url,
  children,
}: {
  label: string;
  url?: string;
  children: React.ReactNode;
}) {
  const source = lectureDemoSourceLabel(label);

  return (
    <figure className="lecture-demo-frame my-3 w-full max-w-full overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm">
      <figcaption className="lecture-demo-frame-caption m-0 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5 font-sans text-neutral-600">
        <span className="min-w-0">
          <span className="block truncate font-mono font-semibold text-neutral-800">
            {source.file}
          </span>
          {source.path || source.note ? (
            <span className="mt-0.5 block truncate font-mono text-[0.85em] text-neutral-500">
              {source.path ?? source.note}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 font-semibold uppercase tracking-wide">
          Live demo
        </span>
        {url ? (
          <span className="w-full font-mono text-neutral-500 sm:w-auto">
            {url}
          </span>
        ) : null}
      </figcaption>
      <div className="lecture-demo-frame-body px-3 py-3 sm:px-4 sm:py-3">
        {children}
      </div>
    </figure>
  );
}
