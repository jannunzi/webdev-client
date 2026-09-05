import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  adjacentLectureSlugs,
  getLectureDeck,
  listLectureSlugs,
} from "@/lib/lectures/catalog";
import LectureChapterLink from "../_components/LectureChapterLink";
import LectureDeckShell from "../_components/LectureDeckShell";
import LectureHubNav from "../_components/LectureHubNav";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listLectureSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getLectureDeck(slug);
  return {
    title: deck ? `${deck.title} — Lectures` : "Lecture",
  };
}

export default async function LectureDeckPage({ params }: PageProps) {
  const { slug } = await params;
  const deck = getLectureDeck(slug);
  if (!deck) notFound();

  const { prev, next } = adjacentLectureSlugs(deck.slug);

  return (
    <article>
      <LectureHubNav current="deck" />
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Canvas Lecture {deck.canvasLecture} · Chapter {deck.chapter}
      </p>
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        {deck.title}
      </h1>
      <p className="font-sans text-neutral-700">
        {deck.slides.length} slides · Fall 2026
      </p>
      <p>{deck.summary}</p>
      <LectureChapterLink lecture={deck} />
      <LectureDeckShell
        deckTitle={deck.title}
        slides={deck.slides}
        prevDeck={prev}
        nextDeck={next}
      />
    </article>
  );
}
