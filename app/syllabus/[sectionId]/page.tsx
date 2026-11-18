import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import { landingCards, legacySectionPath, type LandingCard } from "@/lib/courses/offerings";
import { sections } from "../data/sections";
import SyllabusPage from "../SyllabusPage";

export function generateStaticParams() {
  return landingCards()
    .filter((card) => card.sectionId)
    .map((card) => ({ sectionId: card.sectionId as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}): Promise<Metadata> {
  const { sectionId } = await params;
  const section = sections.find((item) => item.id === sectionId);
  if (!section) {
    const card = landingCards().find((item) => item.sectionId === sectionId);
    return { title: card ? `${card.sectionLabel} — Syllabus` : "Syllabus" };
  }
  return {
    title: `${section.code}-${section.sectionNumber} — Syllabus`,
  };
}

function UnpublishedSection({ card }: { card: LandingCard }) {
  return (
    <article className="page-content">
      <CourseBreadcrumb current={card.sectionLabel ?? card.heading} />
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {card.heading}
      </h1>
      {card.sectionLabel ? (
        <p className="mt-2 text-lg text-neutral-700">{card.sectionLabel}</p>
      ) : null}
      <p id="wd-syllabus-unpublished" className="mt-4">
        The syllabus for this section is not published yet.
      </p>
    </article>
  );
}

export default async function SectionSyllabusPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const destination = legacySectionPath(sectionId);
  if (destination) redirect(destination);
  if (sections.some((section) => section.id === sectionId)) {
    return <SyllabusPage sectionId={sectionId} />;
  }
  const card = landingCards().find((item) => item.sectionId === sectionId);
  if (card) return <UnpublishedSection card={card} />;
  notFound();
}
