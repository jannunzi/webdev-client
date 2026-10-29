"use client";

import { useState } from "react";
import {
  lectureClipEmbedUrl,
  lectureHeading,
  type LectureClipSet,
} from "@/lib/videos/lectures";
import { formatClipClock, youtubeThumbUrl } from "@/lib/videos/youtube";

export default function LectureClipRows({ lectures }: { lectures: LectureClipSet[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (lectures.length === 0) return null;
  return (
    <section aria-labelledby="lecture-clips-heading" className="mt-10">
      <h2
        id="lecture-clips-heading"
        className="mt-0 mb-1 border-b border-neutral-200 pb-3 font-sans text-2xl font-semibold tracking-tight"
      >
        Recent lectures
      </h2>
      <div className="mt-6 space-y-10">
        {lectures.map((lecture) => (
          <section key={lecture.lectureId} id={`lecture-${lecture.lectureId}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="mt-0 mb-0 font-sans text-xl font-semibold tracking-tight">
                {lectureHeading(lecture)}
              </h3>
              <p className="mb-0 font-sans text-sm text-neutral-500">
                {lecture.clips.filter((c) => c.youtubeVideoId).length} of {lecture.clips.length} clips posted
              </p>
            </div>
            <ul className="mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {lecture.clips.map((clip) => {
                const key = `${lecture.lectureId}-${clip.part}`;
                const embed = lectureClipEmbedUrl(clip);
                const playing = openId === key && embed != null;
                const heading = `Part ${clip.part}${clip.topic ? ` · ${clip.topic}` : ""}`;
                return (
                  <li key={key}>
                    <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
                      <div className="aspect-video overflow-hidden bg-neutral-100">
                        {playing ? (
                          <iframe
                            src={embed!}
                            title={clip.title}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : !clip.youtubeVideoId ? (
                          <span className="flex h-full items-center justify-center font-sans text-sm font-medium text-neutral-500">
                            Coming soon
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="group relative block h-full w-full cursor-pointer border-0 p-0"
                            onClick={() => setOpenId(key)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={youtubeThumbUrl(clip.youtubeVideoId)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            <span className="sr-only">Play {heading}</span>
                          </button>
                        )}
                      </div>
                      <div className="px-4 py-3">
                        <h4 className="mt-0 mb-1 font-sans text-lg font-semibold text-neutral-900">
                          {heading}
                        </h4>
                        <p className="mb-0 line-clamp-2 font-sans text-sm leading-6 text-neutral-700">
                          {clip.durationSec ? `${formatClipClock(clip.durationSec)} · ` : ""}
                          {clip.summary}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
