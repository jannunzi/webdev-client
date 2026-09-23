"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LectureChapterLink from "@/app/slides/_components/LectureChapterLink";
import { lectureChapterLabel } from "@/lib/lectures/types";
import type { VideoHubCard, VideoHubChapter } from "@/lib/videos/hub";
import { youtubeThumbUrl } from "@/lib/videos/youtube";
import VideosHubNav from "./VideosHubNav";

function PlayGlyph() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-md">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

function ClipCard({
  clip,
  open,
  onPlay,
}: {
  clip: VideoHubCard;
  open: boolean;
  onPlay: (id: string) => void;
}) {
  const playing = open && clip.embedUrl != null;
  return (
    <div
      id={`video-card-${clip.id}`}
      className="overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm"
    >
      <div className="aspect-video overflow-hidden bg-neutral-100">
        {playing ? (
          <iframe
            src={clip.embedUrl!}
            title={`YouTube lecture clip for ${clip.heading}`}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <a
            href={clip.href}
            className="group relative block h-full no-underline"
            onClick={(event) => {
              event.preventDefault();
              onPlay(clip.id);
            }}
          >
            {clip.youtubeVideoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={youtubeThumbUrl(clip.youtubeVideoId)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center font-sans text-sm text-neutral-500">
                No clip
              </span>
            )}
            {clip.embedUrl ? <PlayGlyph /> : null}
            <span className="sr-only">Play {clip.heading}</span>
          </a>
        )}
      </div>
      <div className="px-4 py-3">
        <h3 className="mt-0 mb-1 font-sans text-lg font-semibold text-neutral-900">
          {playing ? (
            clip.heading
          ) : (
            <a
              href={clip.href}
              onClick={(event) => {
                event.preventDefault();
                onPlay(clip.id);
              }}
            >
              {clip.heading}
            </a>
          )}
        </h3>
        <p className="mb-0 line-clamp-2 font-sans text-sm leading-6 text-neutral-700">
          {clip.summary}
        </p>
        {playing ? (
          <p className="mb-0 mt-2 font-sans text-sm leading-6">
            <Link href={clip.bookHref}>Open in the book</Link>
            {clip.fullLectureUrl ? (
              <>
                {" · "}
                <a href={clip.fullLectureUrl} target="_blank" rel="noreferrer">
                  Watch full lecture
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function VideosHub({
  chapters,
  activeSection,
}: {
  chapters: VideoHubChapter[];
  activeSection?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(activeSection ?? null);
  const clipCount = chapters.reduce(
    (sum, chapter) =>
      sum + chapter.sections.reduce((inner, section) => inner + section.clips.length, 0),
    0,
  );
  const known = new Set(
    chapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) => section.clips.map((clip) => clip.id)),
    ),
  );

  useEffect(() => {
    if (!activeSection || !known.has(activeSection)) return;
    document.getElementById(`video-card-${activeSection}`)?.scrollIntoView({
      block: "center",
    });
    // Scroll once for a deep link. Later plays stay where the click was.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  function play(id: string) {
    setOpenId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    url.searchParams.delete("bookSectionId");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  return (
    <div className="px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <VideosHubNav
          current="hub"
          chapters={chapters.map((chapter) => chapter.chapter)}
        />
        <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
          Videos
        </h1>
        <p className="max-w-3xl">
          Lecture clips grouped by chapter and numbered book section. Choose a
          thumbnail to play that section. The player starts at the section;
          Watch full lecture opens the whole recording when one is known.
        </p>
        <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
          These clips follow the book. They are not a substitute for labs or
          the checklists on <Link href="/assignments">Assignments</Link>.
        </p>

        {activeSection && !known.has(activeSection) ? (
          <p className="mt-4" role="status">
            No YouTube clip is mapped for this section. Choose a thumbnail
            below.
          </p>
        ) : null}

        {clipCount === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-white px-5 py-8 font-sans text-sm text-neutral-500">
            No lecture clips are mapped yet. Curated rows live in{" "}
            <code>data/videos/lecture-clips.json</code>.
          </p>
        ) : (
          <div className="mt-10 space-y-14">
            {chapters.map((group) => {
              const count = group.sections.reduce(
                (sum, section) => sum + section.clips.length,
                0,
              );
              return (
                <section
                  key={group.chapter}
                  aria-labelledby={`chapter-${group.chapter}-heading`}
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-3">
                    <div>
                      <h2
                        id={`chapter-${group.chapter}-heading`}
                        className="mt-0 mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-2xl font-semibold tracking-tight"
                      >
                        <span>
                          {lectureChapterLabel(group.chapter)} — {group.title}
                        </span>
                        {group.weeks ? (
                          <span className="text-base font-medium text-neutral-500">
                            {group.weeks}
                          </span>
                        ) : null}
                      </h2>
                      <p className="mb-0 font-sans text-sm text-neutral-600">
                        {group.sections.map((section) => section.title).join(" · ")}
                      </p>
                    </div>
                    <p className="mb-0 font-sans text-sm text-neutral-500">
                      {count} clip{count === 1 ? "" : "s"}
                    </p>
                  </div>

                  <LectureChapterLink
                    lecture={{
                      chapter: group.chapter,
                      chapterHref: group.href,
                      chapterTitle: group.title,
                    }}
                  />

                  <div className="mt-6 space-y-8">
                    {group.sections.map((section) => (
                      <section
                        key={section.id}
                        aria-labelledby={`chapter-${group.chapter}-${section.id}-heading`}
                      >
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <h3
                            id={`chapter-${group.chapter}-${section.id}-heading`}
                            className="mt-0 mb-0 font-sans text-xl font-semibold tracking-tight"
                          >
                            <Link href={section.bookHref}>{section.title}</Link>
                          </h3>
                          <p className="mb-0 font-sans text-sm text-neutral-500">
                            {section.clips.length} clip
                            {section.clips.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <ul className="mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                          {section.clips.map((clip) => (
                            <li key={clip.id}>
                              <ClipCard
                                clip={clip}
                                open={openId === clip.id}
                                onPlay={play}
                              />
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
