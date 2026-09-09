import type { Metadata } from "next";
import Link from "next/link";
import {
  lectureDeckThumbnail,
  listChapterTopicGroups,
  slidesHref,
  type LectureHubItem,
} from "@/lib/lectures";
import LectureChapterLink from "./_components/LectureChapterLink";
import LectureHubNav from "./_components/LectureHubNav";

export const metadata: Metadata = {
  title: "Slides — Web Dev",
};

function DeckCard({ deck }: { deck: LectureHubItem }) {
  const thumb = lectureDeckThumbnail(deck);
  return (
    <Link
      href={slidesHref(deck.slug)}
      className="group block overflow-hidden rounded-lg border border-neutral-300 bg-white no-underline shadow-sm transition hover:border-neutral-800"
    >
      <div className="aspect-video overflow-hidden bg-neutral-100">
        {/* Authored logo card — not a Google Slides raster. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt="" className="h-full w-full object-cover" />
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
  );
}

export default function SlidesIndexPage() {
  const chapters = listChapterTopicGroups();

  return (
    <div className="px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <LectureHubNav current="index" />
        <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
          Slides
        </h1>
        <p className="max-w-3xl">
          Classroom version of the book, grouped by chapter and numbered book
          section — the same spine as the course book, not Canvas week folders.
          Open a deck to present slides on a wide stage. Keyboard: Left/Right or
          space change slides; Up/Down scroll the slide when content overflows
          (otherwise they also change slides). <kbd>f</kbd> or Present for
          fullscreen (phones use a viewport present mode). Esc or Back exits.
        </p>
        <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
          These slides are the classroom version of the matching book chapter.
          They are not a substitute for labs or the checklists on{" "}
          <Link href="/assignments">Assignments</Link>.
        </p>

        <div className="mt-10 space-y-14">
          {chapters.map((group) => {
            const deckCount = group.topics.reduce(
              (sum, topic) => sum + topic.decks.length,
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
                      className="mt-0 mb-1 font-sans text-2xl font-semibold tracking-tight"
                    >
                      Chapter {group.chapter} — {group.title}
                    </h2>
                    <p className="mb-0 font-sans text-sm text-neutral-600">
                      {group.topics
                        .map((topic) => topic.title)
                        .join(" · ")}
                    </p>
                  </div>
                  <p className="mb-0 font-sans text-sm text-neutral-500">
                    {deckCount === 0
                      ? "Coming soon"
                      : `${deckCount} deck${deckCount === 1 ? "" : "s"}`}
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
                  {group.topics.map((topic) => (
                    <section
                      key={topic.topicId}
                      aria-labelledby={`chapter-${group.chapter}-${topic.topicId}-heading`}
                    >
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <h3
                          id={`chapter-${group.chapter}-${topic.topicId}-heading`}
                          className="mt-0 mb-0 font-sans text-xl font-semibold tracking-tight"
                        >
                          {topic.bookHref ? (
                            <Link href={topic.bookHref}>{topic.title}</Link>
                          ) : (
                            topic.title
                          )}
                        </h3>
                        <p className="mb-0 font-sans text-sm text-neutral-500">
                          {topic.decks.length === 0
                            ? "Coming soon"
                            : `${topic.decks.length} deck${topic.decks.length === 1 ? "" : "s"}`}
                        </p>
                      </div>
                      {topic.decks.length === 0 ? (
                        <p className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-white px-5 py-8 font-sans text-sm text-neutral-500">
                          No slide decks published for this topic yet.
                        </p>
                      ) : (
                        <ul className="mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                          {topic.decks.map((deck) => (
                            <li key={deck.slug}>
                              <DeckCard deck={deck} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
