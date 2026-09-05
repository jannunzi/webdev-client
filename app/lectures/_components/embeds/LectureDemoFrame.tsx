export default function LectureDemoFrame({
  label,
  url,
  children,
}: {
  label: string;
  url?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-3 overflow-hidden rounded-lg border-2 border-neutral-800 bg-white text-neutral-900 shadow-sm">
      <figcaption className="m-0 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5 font-sans text-sm text-neutral-600">
        <span className="font-semibold uppercase tracking-wide">Live demo</span>
        <span>{label}</span>
        {url ? (
          <span className="w-full font-mono text-neutral-500 sm:w-auto">{url}</span>
        ) : null}
      </figcaption>
      <div className="px-3 py-3 sm:px-4 sm:py-3">{children}</div>
    </figure>
  );
}
