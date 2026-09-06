import Link from "next/link";
import {
  lectureTopicByBookSection,
  listDecksForBookSection,
  slidesHref,
} from "@/lib/lectures";

/**
 * Book → slides cross-link. Renders only when a deck maps to this TOC id,
 * or when the id is a hub topic’s parent section (then links to the hub group).
 */
export default function BookSectionSlidesLink({
  sectionId,
}: {
  sectionId: string;
}) {
  const decks = listDecksForBookSection(sectionId);
  const topic = lectureTopicByBookSection(sectionId);

  if (decks.length === 0 && !topic) return null;

  if (decks.length === 1) {
    const deck = decks[0]!;
    return (
      <Link
        href={slidesHref(deck.slug)}
        className="font-sans text-sm font-medium text-blue-700 no-underline hover:underline"
      >
        Slides
      </Link>
    );
  }

  if (decks.length > 1) {
    return (
      <span className="font-sans text-sm font-medium">
        <span className="text-neutral-500">Slides</span>
        {decks.map((deck) => (
          <span key={deck.slug}>
            {" · "}
            <Link href={slidesHref(deck.slug)}>{deck.title}</Link>
          </span>
        ))}
      </span>
    );
  }

  return (
    <Link
      href={`/slides#chapter-${topic!.chapter}-${topic!.topicId}-heading`}
      className="font-sans text-sm font-medium text-blue-700 no-underline hover:underline"
    >
      Slides
    </Link>
  );
}
