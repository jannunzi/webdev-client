import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  adjacentLectureSlugs,
  getLectureDeck,
  listLectureSlugs,
} from "@/lib/lectures";
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
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-3">
      <header className="shrink-0 px-1">
        <LectureHubNav current="deck" />
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h1 className="mt-0 mb-0 font-sans text-xl font-semibold tracking-tight sm:text-2xl">
            {deck.title}
          </h1>
          <p className="mb-0 font-sans text-sm text-neutral-600">
            Lecture {deck.canvasLecture} · {deck.slides.length} slides
          </p>
        </div>
      </header>
      <LectureDeckShell
        deckTitle={deck.title}
        slides={deck.slides}
        prevDeck={prev}
        nextDeck={next}
      />
    </div>
  );
}
