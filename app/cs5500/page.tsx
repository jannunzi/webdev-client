import Link from "next/link";
import CourseBreadcrumb from "@/app/courses/CourseBreadcrumb";
import { offeringById, offeringHeading } from "@/lib/courses/offerings";
import Cs5500AiStrategies from "./Cs5500AiStrategies";
import Cs5500Resources from "./Cs5500Resources";

export default function Cs5500Page() {
  const offering = offeringById("cs5500-su2027");
  const heading = offering
    ? offeringHeading(offering)
    : "CS5500 · Foundations of Software Engineering · Summer 2027";
  return (
    <article className="page-content">
      <CourseBreadcrumb current="CS5500" />
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {heading}
      </h1>
      <p id="wd-coming-soon" className="mt-4 text-lg text-neutral-800">
        Coming soon.
      </p>
      <p>
        This course is not open yet.
        {offering ? (
          <>
            {" "}
            <Link href={offering.bookHref}>Book</Link>
          </>
        ) : null}
      </p>
      <Cs5500AiStrategies />
      <Cs5500Resources />
    </article>
  );
}
