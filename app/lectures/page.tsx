import type { Metadata } from "next";
import Link from "next/link";
import {
  lectureDeckThumbnail,
  listCanvasLectureGroups,
} from "@/lib/lectures";
import LectureChapterLink from "./_components/LectureChapterLink";
import LectureHubNav from "./_components/LectureHubNav";

export const metadata: Metadata = {
  title: "Lectures — CS 4550 / CS 5610",
};

export default function LecturesIndexPage() {
  const groups = listCanvasLectureGroups();

  return (
    <div className="px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <LectureHubNav current="index" />
        <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
          Lectures
        </h1>
        <p className="max-w-3xl">
          Canvas-style lecture folders for Fall 2026. Open a deck to present
          slides on a wide stage. Keyboard shortcuts on each deck: next /
          previous with the arrow keys or space, <kbd>f</kbd> for fullscreen,
          Esc to exit.
        </p>
        <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
          These slides are the classroom version of the matching book chapter.
          They are not a substitute for labs or the checklists on{" "}
          <Link href="/assignments">Assignments</Link>.
        </p>

        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section
              key={group.canvasLecture}
              aria-labelledby={`lecture-${group.canvasLecture}-heading`}
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-3">
                <div>
                  <h2
                    id={`lecture-${group.canvasLecture}-heading`}
                    className="mt-0 mb-1 font-sans text-2xl font-semibold tracking-tight"
                  >
                    {group.title}
                  </h2>
                  {group.topic ? (
                    <p className="mb-0 font-sans text-sm text-neutral-600">
                      {group.topic}
                    </p>
                  ) : null}
                </div>
                <p className="mb-0 font-sans text-sm text-neutral-500">
                  {group.decks.length === 0
                    ? "Coming soon"
                    : `${group.decks.length} deck${group.decks.length === 1 ? "" : "s"}`}
                </p>
              </div>

              {group.canvasLecture === 1 ? <LectureChapterLink /> : null}

              {group.decks.length === 0 ? (
                <p className="mt-5 rounded-lg border border-dashed border-neutral-300 bg-white px-5 py-8 font-sans text-sm text-neutral-500">
                  No slide decks published for this lecture yet.
                </p>
              ) : (
                <ul className="mt-5 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {group.decks.map((deck) => {
                    const thumb = lectureDeckThumbnail(deck);
                    return (
                      <li key={deck.slug}>
                        <Link
                          href={`/lectures/${deck.slug}`}
                          className="group block overflow-hidden rounded-lg border border-neutral-300 bg-white no-underline shadow-sm transition hover:border-neutral-800"
                        >
                          <div className="aspect-video overflow-hidden bg-neutral-100">
                            {/* Distinctive diagram/screenshot — not the WEB DEV title slide. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div className="px-4 py-3">
                            <h3 className="mt-0 mb-1 font-sans text-lg font-semibold text-neutral-900">
                              {deck.title}
                            </h3>
                            <p className="mb-0 line-clamp-2 font-sans text-sm leading-6 text-neutral-700">
                              {deck.summary}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
