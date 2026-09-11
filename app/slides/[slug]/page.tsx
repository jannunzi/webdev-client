import type { Metadata } from "next";
import { withHighlightedLectureCode } from "@/lib/code-block/highlight-lecture";
import {
  adjacentLectureSlugs,
  getLectureDeck,
  listLectureSlugs,
} from "@/lib/lectures";
import LectureDeckApp from "../_components/LectureDeckApp";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return listLectureSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getLectureDeck(slug);
  return {
    title: deck ? `${deck.title} — Slides` : "Slides",
  };
}

export default async function SlideDeckPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const editMode = edit === "1";
  const deck = getLectureDeck(slug);

  if (!deck) {
    return (
      <LectureDeckApp
        slug={slug}
        editMode={editMode}
        authored={null}
        highlightedSlides={null}
      />
    );
  }

  const { prev, next } = adjacentLectureSlugs(deck.slug);
  const slides = await withHighlightedLectureCode(deck.slides);

  return (
    <LectureDeckApp
      slug={deck.slug}
      editMode={editMode}
      authored={{
        title: deck.title,
        chapter: deck.chapter,
        topic: deck.topic,
        bookHref: deck.bookHref,
        bookSectionId: deck.bookSectionId,
        slides: deck.slides,
      }}
      highlightedSlides={slides}
      prevDeck={prev}
      nextDeck={next}
      chapter={deck.chapter}
    />
  );
}
