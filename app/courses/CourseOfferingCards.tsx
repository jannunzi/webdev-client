import Link from "next/link";
import {
  landingCards,
  type LandingCard,
} from "@/lib/courses/offerings";

function cardClass(card: LandingCard): string {
  const stripe =
    card.status === "coming-soon" ? "bg-amber-500" : "bg-neutral-900";
  return stripe;
}

export default function CourseOfferingCards() {
  const cards = landingCards();
  return (
    <ul
      id="wd-course-dashboard"
      className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2"
    >
      {cards.map((card) => {
        const sectionLine = [card.sectionLabel, card.detail]
          .filter(Boolean)
          .join(" · ");
        const label = [
          card.heading,
          sectionLine,
          card.status === "coming-soon" ? "Coming soon" : null,
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <li key={card.id} className="min-w-0">
            <Link
              id={`wd-course-card-${card.id}`}
              href={card.href}
              aria-label={label}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 no-underline shadow-sm hover:border-neutral-900"
            >
              <span className={`block h-2 ${cardClass(card)}`} />
              <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="font-sans text-lg font-semibold leading-snug">
                  {card.heading}
                </span>
                {sectionLine ? (
                  <span className="font-sans text-sm text-neutral-600">
                    {sectionLine}
                  </span>
                ) : null}
                {card.status === "coming-soon" ? (
                  <span className="mt-auto inline-flex w-fit rounded-md bg-amber-100 px-2 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-amber-950">
                    Coming soon
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
