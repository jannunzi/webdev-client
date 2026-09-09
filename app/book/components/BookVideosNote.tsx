import { BOOK_VIDEOS_HEADING, BOOK_VIDEOS_NOTE } from "../videosOptional";

export default function BookVideosNote({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <aside
      role="note"
      aria-label={BOOK_VIDEOS_HEADING}
      className={
        compact
          ? `rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[1.05rem] text-amber-950 ${className}`
          : `rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-[1.05rem] text-amber-950 ${className}`
      }
    >
      <p
        className={`m-0 font-sans font-semibold text-amber-950 ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {BOOK_VIDEOS_HEADING}
      </p>
      <p className="mb-0 mt-1">{BOOK_VIDEOS_NOTE}</p>
    </aside>
  );
}
