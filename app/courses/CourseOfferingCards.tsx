import Link from "next/link";
import { landingGroupsWithMeetings } from "@/lib/courses/card-meetings";
import { termCardGridClass, type LandingCard } from "@/lib/courses/offerings";

function cardStripe(card: LandingCard): string {
  return card.status === "coming-soon" ? "bg-amber-500" : "bg-neutral-900";
}

function OfferingCard({ card }: { card: LandingCard }) {
  const label = [
    card.title,
    ...card.lines,
    card.status === "coming-soon" ? "Coming soon" : null,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <li className="min-w-0">
      <Link
        id={`wd-course-card-${card.id}`}
        href={card.href}
        aria-label={label}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 no-underline shadow-sm hover:border-neutral-900"
      >
        <span className={`block h-2 ${cardStripe(card)}`} />
        <span className="flex flex-1 flex-col gap-1 p-4">
          <span className="font-sans text-lg font-semibold leading-snug">
            {card.title}
          </span>
          {card.lines.map((line) => (
            <span key={line} className="font-sans text-sm text-neutral-600">
              {line}
            </span>
          ))}
          {card.status === "coming-soon" ? (
            <span className="mt-auto inline-flex w-fit rounded-md bg-amber-100 px-2 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-amber-950">
              Coming soon
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

export default function CourseOfferingCards() {
  const groups = landingGroupsWithMeetings();
  return (
    <div id="wd-course-dashboard" className="grid gap-8">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`wd-term-${group.id}`}>
          <h2
            id={`wd-term-${group.id}`}
            className="mt-0 mb-3 font-sans text-2xl font-semibold"
          >
            {group.label}
          </h2>
          <ul
            className={`m-0 grid list-none gap-4 p-0 ${termCardGridClass()}`}
          >
            {group.cards.map((card) => (
              <OfferingCard key={card.id} card={card} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
