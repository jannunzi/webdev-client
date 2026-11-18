import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import Cs5500Page from "@/app/cs5500/page";
import { offeringById, offeringHeading } from "@/lib/courses/offerings";
import {
  defaultSection,
  FOUNDATIONS_SUBJECT,
  isTermSlug,
  sectionSyllabusPath,
  sharedPagePath,
  WEBDEV_SUBJECT,
} from "@/lib/courses/routes";

type Params = { year: string; term: string; subject: string; courseNumber: string };

function contextOf(params: Params) {
  if (!isTermSlug(params.term)) return null;
  return {
    year: params.year,
    term: params.term,
    subject: params.subject,
    courseNumber: params.courseNumber,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await params;
  const offering = offeringById(
    resolved.courseNumber === "cs5500"
      ? "cs5500-su2027"
      : `${resolved.courseNumber}-${resolved.term === "spring" ? "sp" : "fa"}${resolved.year}`,
  );
  return {
    title: offering ? offeringHeading(offering) : resolved.courseNumber.toUpperCase(),
  };
}

export default async function CourseNumberPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  const context = contextOf(resolved);
  if (!context) notFound();

  if (
    context.subject === FOUNDATIONS_SUBJECT &&
    context.courseNumber === "cs5500" &&
    context.year === "2027" &&
    context.term === "summer"
  ) {
    return <Cs5500Page />;
  }

  if (
    context.subject === WEBDEV_SUBJECT &&
    context.year === "2027" &&
    context.term === "spring" &&
    (context.courseNumber === "cs5610" || context.courseNumber === "cs4550")
  ) {
    const offering = offeringById(
      context.courseNumber === "cs5610" ? "cs5610-sp2027" : "cs4550-sp2027",
    );
    const heading = offering
      ? offeringHeading(offering)
      : `${context.courseNumber.toUpperCase()} · Web Development · Spring 2027`;
    return (
      <article className="page-content">
        <CourseBreadcrumb current={context.courseNumber.toUpperCase()} />
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">{heading}</h1>
        <p id="wd-coming-soon" className="mt-4 text-lg text-neutral-800">
          Coming soon.
        </p>
        <p>
          This course is not open yet.{" "}
          <Link
            href={sharedPagePath(
              { year: "2026", term: "fall", subject: WEBDEV_SUBJECT },
              "book",
            )}
          >
            Book
          </Link>
        </p>
      </article>
    );
  }

  if (
    context.subject === WEBDEV_SUBJECT &&
    context.year === "2026" &&
    context.term === "fall"
  ) {
    const section = defaultSection(context.courseNumber);
    if (section) {
      redirect(sectionSyllabusPath({ ...context, section }));
    }
  }

  notFound();
}
