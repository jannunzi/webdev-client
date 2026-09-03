"use client";

import { useId, useState } from "react";
import {
  youtubeEmbedUrl,
  youtubeSearchPageUrl,
  youtubeWatchUrl,
} from "../termSlug";
import type { YouTubeSearchResult } from "../youtubeSearch";

export default function TermVideos({
  term,
  searchQuery,
  result,
}: {
  term: string;
  searchQuery: string;
  result: YouTubeSearchResult;
}) {
  const headingId = useId();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const searchUrl = youtubeSearchPageUrl(searchQuery);

  return (
    <section className="mt-8" aria-labelledby={headingId}>
      <h2 id={headingId} className="font-sans text-xl font-semibold">
        Videos that explain {term}
      </h2>
      <p className="mt-2 text-[1.05rem] text-neutral-700">
        Click a thumbnail to play it here. Use{" "}
        <span className="whitespace-nowrap">Open on YouTube</span> to watch on
        youtube.com.
      </p>

      {result.videos.length === 0 ? (
        <div
          className="mt-4 rounded border border-neutral-300 bg-white px-4 py-3 text-[1.05rem]"
          role="status"
        >
          {result.configured ? (
            <p className="m-0">
              No YouTube results are available right now
              {result.error ? " (the search request did not succeed)" : ""}. You
              can still{" "}
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium"
              >
                search YouTube for “{searchQuery}”
              </a>
              .
            </p>
          ) : (
            <p className="m-0">
              Video search is not configured on this server (no{" "}
              <code>YOUTUBE_API_KEY</code>).{" "}
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium"
              >
                Search YouTube for “{searchQuery}”
              </a>{" "}
              instead.
            </p>
          )}
        </div>
      ) : (
        <ul className="mt-4 m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {result.videos.map((video) => {
            const playing = playingId === video.id;
            const watchUrl = youtubeWatchUrl(video.id);
            return (
              <li
                key={video.id}
                className="overflow-hidden rounded border border-neutral-300 bg-white"
              >
                <div className="aspect-video bg-neutral-900">
                  {playing ? (
                    <iframe
                      src={youtubeEmbedUrl(video.id)}
                      title={`YouTube video: ${video.title}`}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingId(video.id)}
                      className="group relative block h-full w-full cursor-pointer border-0 bg-neutral-900 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                      aria-label={`Play ${video.title}`}
                    >
                      {/* External YouTube thumbs; next/image needs a remote host allowlist. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnailUrl}
                        alt=""
                        width={480}
                        height={360}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35"
                        aria-hidden
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow">
                          ▶
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="px-3 py-3">
                  <p className="m-0 font-sans text-sm font-semibold leading-snug text-neutral-900">
                    {video.title}
                  </p>
                  <p className="mt-1 mb-0 text-sm text-neutral-600">
                    {video.channel}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {playing ? (
                      <button
                        type="button"
                        onClick={() => setPlayingId(null)}
                        className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 font-sans text-neutral-800 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                      >
                        Close player
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlayingId(video.id)}
                        className="rounded border border-neutral-300 bg-neutral-50 px-2 py-1 font-sans text-neutral-800 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                      >
                        Play here
                      </button>
                    )}
                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans"
                    >
                      Open on YouTube
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
