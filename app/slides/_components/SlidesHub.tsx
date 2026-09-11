"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createStarterDeckSlides } from "@/lib/lectures/blocks";
import {
  applyHubOverlay,
  flattenHubDecks,
  overlayThumb,
} from "@/lib/lectures/hub-overlay";
import {
  browserSlidesStorage,
  clearDeckDraft,
  clearHubDraft,
  emptyHubDraft,
  HUB_DRAFT_THUMB,
  HUB_DRAFT_TOPIC_ID,
  readHubDraft,
  slugifyDeckTitle,
  uniqueDraftSlug,
  writeDeckDraft,
  writeHubDraft,
  type SlidesHubDraft,
} from "@/lib/lectures/draft-storage";
import {
  lectureChapterLabel,
  type LectureChapterGroup,
  type LectureHubItem,
} from "@/lib/lectures";
import LectureChapterLink from "./LectureChapterLink";
import LectureHubNav from "./LectureHubNav";

function DeckCard({
  deck,
  editMode,
  onTitle,
  onMove,
  canUp,
  canDown,
}: {
  deck: LectureHubItem;
  editMode: boolean;
  onTitle?: (title: string) => void;
  onMove?: (delta: -1 | 1) => void;
  canUp?: boolean;
  canDown?: boolean;
}) {
  const thumb = overlayThumb(deck);
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
      {editMode ? (
        <div className="flex items-center justify-between gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-1 font-sans text-xs">
          <button
            type="button"
            className="rounded border border-neutral-400 bg-white px-1.5 py-0.5 disabled:opacity-40"
            disabled={!canUp}
            onClick={() => onMove?.(-1)}
          >
            Up
          </button>
          <button
            type="button"
            className="rounded border border-neutral-400 bg-white px-1.5 py-0.5 disabled:opacity-40"
            disabled={!canDown}
            onClick={() => onMove?.(1)}
          >
            Down
          </button>
        </div>
      ) : null}
      <Link
        href={editMode ? `/slides/${deck.slug}?edit=1` : `/slides/${deck.slug}`}
        className="group block no-underline"
      >
        <div className="aspect-video overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="px-4 py-3">
        {editMode ? (
          <input
            className="mt-0 mb-1 w-full border-0 bg-transparent font-sans text-lg font-semibold text-neutral-900 outline-none ring-1 ring-neutral-300 px-1"
            value={deck.title}
            aria-label={`Title for ${deck.slug}`}
            onChange={(event) => onTitle?.(event.target.value)}
          />
        ) : (
          <h3 className="mt-0 mb-1 font-sans text-lg font-semibold text-neutral-900">
            <Link href={`/slides/${deck.slug}`}>{deck.title}</Link>
          </h3>
        )}
        <p className="mb-0 line-clamp-2 font-sans text-sm leading-6 text-neutral-700">
          {deck.summary}
        </p>
      </div>
    </div>
  );
}

function useHubDraft(): {
  draft: SlidesHubDraft;
  setDraft: (next: SlidesHubDraft) => void;
} {
  const [draft, setDraftState] = useState<SlidesHubDraft>(emptyHubDraft);
  useEffect(() => {
    const storage = browserSlidesStorage();
    if (storage) setDraftState(readHubDraft(storage));
  }, []);
  function setDraft(next: SlidesHubDraft) {
    setDraftState(next);
    const storage = browserSlidesStorage();
    if (storage) writeHubDraft(storage, next);
  }
  return { draft, setDraft };
}

export default function SlidesHub({
  editMode,
  chapters,
}: {
  editMode: boolean;
  chapters: LectureChapterGroup[];
}) {
  const router = useRouter();
  const { draft, setDraft } = useHubDraft();
  const [newTitle, setNewTitle] = useState("");
  const [status, setStatus] = useState("");

  const grouped = useMemo(
    () => applyHubOverlay(chapters, draft),
    [chapters, draft],
  );

  function takenSlugs(): Set<string> {
    return new Set([
      ...flattenHubDecks(grouped).map((deck) => deck.slug),
      ...Object.keys(draft.extraDecks),
    ]);
  }

  function rename(slug: string, title: string) {
    setDraft({
      ...draft,
      titles: { ...draft.titles, [slug]: title },
      extraDecks: draft.extraDecks[slug]
        ? {
            ...draft.extraDecks,
            [slug]: { ...draft.extraDecks[slug], title },
          }
        : draft.extraDecks,
    });
  }

  function moveDeck(topicDecks: LectureHubItem[], slug: string, delta: -1 | 1) {
    const index = topicDecks.findIndex((deck) => deck.slug === slug);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= topicDecks.length) return;
    const copy = topicDecks.slice();
    const [row] = copy.splice(index, 1);
    copy.splice(next, 0, row);
    const topicSlugs = new Set(topicDecks.map((deck) => deck.slug));
    let cursor = 0;
    const order = flattenHubDecks(grouped).map((deck) => {
      if (topicSlugs.has(deck.slug)) {
        const slug = copy[cursor]?.slug ?? deck.slug;
        cursor += 1;
        return slug;
      }
      return deck.slug;
    });
    setDraft({
      ...draft,
      order,
    });
  }

  function createDeck() {
    const title = newTitle.trim() || "Untitled deck";
    const slug = uniqueDraftSlug(slugifyDeckTitle(title), takenSlugs());
    const createdAt = new Date().toISOString();
    const store = browserSlidesStorage();
    if (!store) {
      setStatus("localStorage is not available in this browser.");
      return;
    }
    const slides = createStarterDeckSlides(title);
    writeDeckDraft(store, { version: 1, slug, title, slides });
    setDraft({
      ...draft,
      titles: { ...draft.titles, [slug]: title },
      order: [...draft.order, slug],
      extraDecks: {
        ...draft.extraDecks,
        [slug]: {
          slug,
          title,
          summary: "Instructor draft deck (this browser only).",
          chapter: 1,
          topicId: HUB_DRAFT_TOPIC_ID,
          thumbnailSrc: HUB_DRAFT_THUMB,
          createdAt,
        },
      },
    });
    setNewTitle("");
    setStatus(`Created ${slug}. Opening editor…`);
    router.push(`/slides/${slug}?edit=1`);
  }

  function resetHub() {
    const store = browserSlidesStorage();
    if (!store) return;
    for (const slug of Object.keys(draft.extraDecks)) {
      clearDeckDraft(store, slug);
    }
    clearHubDraft(store);
    setDraft(emptyHubDraft());
    setStatus("Hub drafts cleared in this browser.");
  }

  return (
    <div className="px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <LectureHubNav current="index" editMode={editMode} />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
            Slides
          </h1>
          <p className="mb-0 font-sans text-sm">
            <Link
              href={editMode ? "/slides" : "/slides?edit=1"}
              className="text-neutral-500 no-underline hover:underline"
            >
              {editMode ? "Done" : "Edit"}
            </Link>
          </p>
        </div>
        <p className="max-w-3xl">
          Classroom version of the book, grouped by chapter and numbered book
          section. Open a deck to present slides on a wide stage. Keyboard: Left/Right or
          space change slides; Up/Down scroll the slide when content overflows
          (otherwise they also change slides). <kbd>f</kbd> or Present for
          fullscreen (phones use a viewport present mode). Esc or Back exits.
        </p>
        <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
          These slides are the classroom version of the matching book chapter.
          They are not a substitute for labs or the checklists on{" "}
          <Link href="/assignments">Assignments</Link>.
        </p>

        {editMode ? (
          <div className="mt-4 rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans text-sm">
            <p className="mt-0 mb-2 font-semibold">Instructor edit mode</p>
            <p className="mt-0 mb-3 text-neutral-600">
              New decks land in Chapter 1 → Draft decks (overlay topic, not a
              book section). Order and titles save to localStorage. Commit to
              the repo is a follow-up.
            </p>
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500">New deck title</span>
                <input
                  className="rounded border border-neutral-400 px-2 py-1"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Untitled deck"
                />
              </label>
              <button
                type="button"
                className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-white"
                onClick={createDeck}
              >
                New deck
              </button>
              <button
                type="button"
                className="rounded border border-neutral-400 bg-white px-3 py-1.5"
                onClick={resetHub}
              >
                Reset hub drafts
              </button>
              <span className="text-neutral-500">{status}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-10 space-y-14">
          {grouped.map((group) => {
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
                      {group.chapter === 1
                        ? "Lecture 1 setup first: Intro, Node.js, Next.js, GitHub, then Vercel. HTML and Kambaz follow."
                        : group.topics.map((topic) => topic.title).join(" · ")}
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
                          {topic.bookSectionId && topic.bookHref ? (
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
                          {topic.decks.map((deck, index) => (
                            <li key={deck.slug}>
                              <DeckCard
                                deck={deck}
                                editMode={editMode}
                                onTitle={(title) => rename(deck.slug, title)}
                                onMove={(delta) =>
                                  moveDeck(topic.decks, deck.slug, delta)
                                }
                                canUp={index > 0}
                                canDown={index < topic.decks.length - 1}
                              />
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
