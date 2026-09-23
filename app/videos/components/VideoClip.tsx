import Link from "next/link";
import { bookPathForSection, bookSectionNumberLabel } from "@/lib/videos/book-section";
import {
  describeClipFallback,
  fallbackTierLabel,
} from "@/lib/videos/resolve";
import type { ResolvedLectureClip } from "@/lib/videos/types";
import {
  formatClipClock,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/videos/youtube";

export default function VideoClip({
  resolved,
  title,
  preferredCourse,
  preferredSemester,
}: {
  resolved: ResolvedLectureClip;
  title: string;
  preferredCourse: string;
  preferredSemester: string;
}) {
  const label = title || bookSectionNumberLabel(resolved.bookSectionId);
  const bookHref = bookPathForSection(resolved.bookSectionId);
  const watchUrl = youtubeWatchUrl(resolved.youtubeVideoId, resolved.clip.startSec);
  const embedUrl = youtubeEmbedUrl(
    resolved.youtubeVideoId,
    resolved.clip.startSec,
    resolved.clip.endSec,
  );
  const placeholder = resolved.clip.confidence === "placeholder";
  const range = `${formatClipClock(resolved.clip.startSec)}–${formatClipClock(resolved.clip.endSec)}`;

  return (
    <article className="mt-6" aria-labelledby="video-clip-heading">
      <h2
        id="video-clip-heading"
        className="mb-2 font-sans text-2xl font-semibold tracking-tight"
      >
        {label}
      </h2>
      <p className="mt-0">
        <Link href={bookHref}>Open in the book</Link>
        <span className="font-sans text-sm text-neutral-600"> {bookHref}</span>
      </p>
      <p className="text-neutral-800">
        {describeClipFallback(resolved, {
          course: preferredCourse,
          semester: preferredSemester,
        })}{" "}
        <span className="font-sans text-sm text-neutral-600">
          {fallbackTierLabel(resolved.tier)}
        </span>
      </p>
      {placeholder ? (
        <aside
          role="note"
          className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[1.05rem] text-amber-950"
        >
          <p className="m-0 font-sans text-sm font-semibold">Placeholder clip</p>
          <p className="mb-0 mt-1">
            YouTube id <code>{resolved.youtubeVideoId}</code> and the times{" "}
            {range} ({Math.floor(resolved.clip.startSec)}s–
            {Math.floor(resolved.clip.endSec)}s) are fake. This row is only here
            so the page can be demoed before real Fall 2026 and Spring 2026 maps
            are added.
          </p>
        </aside>
      ) : null}
      <div className="mt-4 overflow-hidden rounded border border-neutral-300 bg-neutral-900">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={`YouTube lecture clip for book section ${label}`}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-3 mb-0">
        Clip {range} ({Math.floor(resolved.clip.startSec)}s–
        {Math.floor(resolved.clip.endSec)}s).{" "}
        <a href={watchUrl} target="_blank" rel="noreferrer">
          Open on YouTube at the start time
        </a>
        .
      </p>
      <p className="mt-2 mb-0 font-sans text-sm text-neutral-600">
        {resolved.clip.sourceCourse} · {resolved.clip.semester} · confidence{" "}
        {resolved.clip.confidence}
      </p>
    </article>
  );
}
