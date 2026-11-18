import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import {
  courseOfferings,
  offeringById,
  offeringHeading,
} from "@/lib/courses/offerings";

export function generateStaticParams() {
  return courseOfferings
    .filter((offering) => offering.syllabusHref.startsWith("/coming-soon/"))
    .map((offering) => ({ offeringId: offering.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ offeringId: string }>;
}): Promise<Metadata> {
  const { offeringId } = await params;
  const offering = offeringById(offeringId);
  return {
    title: offering ? `${offeringHeading(offering)} — Coming soon` : "Coming soon",
  };
}

export default async function ComingSoonOfferingPage({
  params,
}: {
  params: Promise<{ offeringId: string }>;
}) {
  const { offeringId } = await params;
  const offering = offeringById(offeringId);
  if (!offering) notFound();
  if (offering.status !== "coming-soon") redirect(offering.syllabusHref);
  const heading = offeringHeading(offering);
  return (
    <article className="page-content">
      <CourseBreadcrumb current={offering.courseNumber} />
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {heading}
      </h1>
      <p id="wd-coming-soon" className="mt-4 text-lg text-neutral-800">
        Coming soon.
      </p>
      <p>
        This course is not open yet.
        {offering.bookHref ? (
          <>
            {" "}
            <Link href={offering.bookHref}>Book</Link>
          </>
        ) : null}
      </p>
    </article>
  );
}
