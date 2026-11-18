import Link from "next/link";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import { offeringById, offeringHeading } from "@/lib/courses/offerings";

export default function Cs5500BookPage() {
  const offering = offeringById("cs5500-su2027");
  const heading = offering
    ? `${offeringHeading(offering)} — Book`
    : "CS5500 book";
  return (
    <article className="page-content">
      <CourseBreadcrumb current="CS5500 book" />
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {heading}
      </h1>
      <p id="wd-cs5500-book" className="mt-4 text-lg text-neutral-800">
        Coming soon.
      </p>
      <p>
        <Link href={offering?.syllabusHref ?? "/cs5500"}>CS5500</Link>
      </p>
    </article>
  );
}
