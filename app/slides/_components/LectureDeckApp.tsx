"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createBlockSlide,
  createBulletsBlock,
  deckUsesBlockModel,
  toBlockSlides,
  type AuthoredSlide,
  type BlockSlide,
} from "@/lib/lectures/blocks";
import {
  browserSlidesStorage,
  clearDeckDraft,
  HUB_DRAFT_TOPIC_TITLE,
  readDeckDraft,
  readHubDraft,
  writeDeckDraft,
  writeHubDraft,
} from "@/lib/lectures/draft-storage";
import { lectureEditHref } from "@/lib/lectures/slide-markup";
import { lectureCompanionLinkLabel } from "@/lib/lectures/catalog";
import {
  lectureChapterLabel,
  type LectureHubItem,
} from "@/lib/lectures/types";
import LectureDeckShell from "./LectureDeckShell";
import LectureHubNav from "./LectureHubNav";

async function highlightDraftSlides(slides: BlockSlide[]): Promise<BlockSlide[]> {
  return Promise.all(
    slides.map(async (slide) => ({
      ...slide,
      blocks: await Promise.all(
        slide.blocks.map(async (block) => {
          if (block.type !== "code" || block.html) return block;
          try {
            const response = await fetch("/api/slides/highlight", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                code: block.code,
                language: block.language,
                file: block.file,
              }),
            });
            if (!response.ok) return block;
            const data = (await response.json()) as { html?: string };
            return { ...block, html: data.html };
          } catch {
            return block;
          }
        }),
      ),
    })),
  );
}

export default function LectureDeckApp({
  slug,
  editMode,
  authored,
  highlightedSlides,
  prevDeck,
  nextDeck,
  chapter,
}: {
  slug: string;
  editMode: boolean;
  authored: {
    title: string;
    chapter: number;
    topic?: string;
    bookHref: string;
    bookSectionId?: string;
    slides: AuthoredSlide[];
  } | null;
  highlightedSlides: AuthoredSlide[] | null;
  prevDeck?: LectureHubItem;
  nextDeck?: LectureHubItem;
  chapter?: number;
}) {
  const authoredBlocks = useMemo(
    () => (highlightedSlides ? toBlockSlides(highlightedSlides) : null),
    [highlightedSlides],
  );
  const blockModel = Boolean(
    authored && deckUsesBlockModel(authored.slides),
  );
  const [title, setTitle] = useState(authored?.title ?? "Untitled deck");
  const [slides, setSlides] = useState<BlockSlide[]>(authoredBlocks ?? []);
  const [hasDraft, setHasDraft] = useState(false);
  const [isDraftDeck, setIsDraftDeck] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState("");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const storage = browserSlidesStorage();
    const hub = storage ? readHubDraft(storage) : null;
    const overlayTitle = hub?.titles[slug];
    const extra = hub?.extraDecks[slug];
    const draft = storage ? readDeckDraft(storage, slug) : null;

    if (draft) {
      setTitle(overlayTitle ?? draft.title);
      setHasDraft(true);
      setIsDraftDeck(Boolean(extra) && !authored);
      void highlightDraftSlides(draft.slides).then(setSlides);
      setHydrated(true);
      setMissing(false);
      return;
    }

    if (extra && !authored) {
      setTitle(overlayTitle ?? extra.title);
      setIsDraftDeck(true);
      setHasDraft(true);
      setSlides([
        createBlockSlide({
          id: "title",
          title: extra.title.slice(0, 42).toUpperCase(),
          kind: "title",
          blocks: [createBulletsBlock({ items: [extra.title] })],
        }),
      ]);
      setHydrated(true);
      setMissing(false);
      return;
    }

    if (authoredBlocks) {
      setTitle(overlayTitle ?? authored!.title);
      setSlides(authoredBlocks);
      setHasDraft(false);
      setIsDraftDeck(false);
      setHydrated(true);
      setMissing(false);
      return;
    }

    setMissing(true);
    setHydrated(true);
  }, [authored, authoredBlocks, slug]);

  const editable = editMode && (blockModel || isDraftDeck);
  const chapterNumber = chapter ?? authored?.chapter ?? 1;

  const saveDraft = useCallback(() => {
    const storage = browserSlidesStorage();
    if (!storage) {
      setStatus("localStorage is not available in this browser.");
      return;
    }
    writeDeckDraft(storage, {
      version: 1,
      slug,
      title,
      slides,
    });
    const hub = readHubDraft(storage);
    writeHubDraft(storage, {
      ...hub,
      titles: { ...hub.titles, [slug]: title },
    });
    setHasDraft(true);
    setStatus("Saved draft in this browser. Commit to the repo is a follow-up.");
  }, [slug, slides, title]);

  const resetDraft = useCallback(() => {
    const storage = browserSlidesStorage();
    if (!storage) return;
    clearDeckDraft(storage, slug);
    const hub = readHubDraft(storage);
    const titles = { ...hub.titles };
    delete titles[slug];
    const extraDecks = { ...hub.extraDecks };
    const wasExtra = Boolean(extraDecks[slug]);
    delete extraDecks[slug];
    writeHubDraft(storage, { ...hub, titles, extraDecks });
    if (wasExtra && !authored) {
      window.location.href = "/slides?edit=1";
      return;
    }
    if (authoredBlocks) {
      setSlides(authoredBlocks);
      setTitle(authored?.title ?? title);
    }
    setHasDraft(false);
    setStatus("Reset to authored slides.");
  }, [authored, authoredBlocks, slug, title]);

  const updateSlide = useCallback((index: number, next: BlockSlide) => {
    setSlides((current) => {
      const copy = current.slice();
      copy[index] = next;
      return copy;
    });
  }, []);

  const addSlide = useCallback(() => {
    setSlides((current) => [
      ...current,
      createBlockSlide({
        title: `Slide ${current.length + 1}`,
      }),
    ]);
  }, []);

  const removeSlide = useCallback((index: number) => {
    setSlides((current) =>
      current.length <= 1 ? current : current.filter((_, i) => i !== index),
    );
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-dvh items-center justify-center font-sans text-sm text-neutral-500">
        Loading deck…
      </div>
    );
  }

  if (missing) {
    return (
      <article className="px-4 py-8 sm:px-6">
        <LectureHubNav current="deck" editMode={editMode} />
        <h1 className="mt-0 font-sans text-3xl font-semibold">
          Slide deck not found
        </h1>
        <p>
          That slug is not a published deck, and this browser has no draft for
          it. Open the slides index, or create a deck in edit mode.
        </p>
        <p>
          <Link href="/slides">All slides</Link>
          {" · "}
          <Link href="/slides?edit=1">Edit hub</Link>
        </p>
      </article>
    );
  }

  const editHref = lectureEditHref({
    href:
      typeof window === "undefined"
        ? `/slides/${slug}`
        : window.location.href,
    edit: !editMode,
  });

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-3">
      <header className="shrink-0 px-1" data-lecture-deck-chrome>
        <LectureHubNav current="deck" editMode={editMode} />
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          {editMode ? (
            <input
              className="mt-0 mb-0 w-full max-w-xl border-0 bg-transparent font-sans text-xl font-semibold tracking-tight outline-none ring-1 ring-neutral-300 px-1 sm:text-2xl"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Deck title"
            />
          ) : (
            <h1 className="mt-0 mb-0 font-sans text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
          )}
          <p className="mb-0 flex flex-wrap items-center gap-2 font-sans text-sm text-neutral-600">
            <span>
              {lectureChapterLabel(chapterNumber)}
              {authored?.topic
                ? ` · ${authored.topic}`
                : isDraftDeck
                  ? ` · ${HUB_DRAFT_TOPIC_TITLE}`
                  : ""}{" "}
              · {slides.length} slides
              {hasDraft ? " · draft" : ""}
            </span>
            {authored ? (
              <Link href={authored.bookHref}>
                {lectureCompanionLinkLabel(
                  authored.chapter,
                  authored.bookSectionId,
                )}
              </Link>
            ) : (
              <span>Browser draft — not in the repo yet</span>
            )}
            {blockModel || isDraftDeck ? (
              <Link
                href={editHref}
                className="text-neutral-500 no-underline hover:underline"
              >
                {editMode ? "Done" : "Edit"}
              </Link>
            ) : null}
          </p>
        </div>
        {editMode ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-xs text-neutral-600">
            {editable ? (
              <>
                <button
                  type="button"
                  className="rounded border border-neutral-800 bg-neutral-800 px-2 py-1 text-white"
                  onClick={saveDraft}
                >
                  Save draft
                </button>
                <button
                  type="button"
                  className="rounded border border-neutral-400 bg-white px-2 py-1"
                  onClick={resetDraft}
                >
                  {isDraftDeck ? "Delete draft deck" : "Reset to authored"}
                </button>
                <button
                  type="button"
                  className="rounded border border-neutral-400 bg-white px-2 py-1"
                  onClick={addSlide}
                >
                  Add slide
                </button>
                <span>{status}</span>
                <span className="text-neutral-500">
                  Drafts stay in localStorage. Commit / PR is a follow-up.
                </span>
              </>
            ) : (
              <span>
                This deck is still on the legacy slide shape (read-only). Pilot
                edit mode:{" "}
                <Link href="/slides/installing-nodejs?edit=1">
                  Installing Node.js
                </Link>
                .
              </span>
            )}
          </div>
        ) : null}
      </header>
      <LectureDeckShell
        deckTitle={title}
        slides={slides}
        prevDeck={prevDeck}
        nextDeck={nextDeck}
        chapter={chapterNumber}
        editMode={editable}
        onSlideChange={updateSlide}
        onRemoveSlide={removeSlide}
      />
    </div>
  );
}
