import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import ProjectOptionNav from "./components/ProjectOptionNav";
import { deliverables, projectOverview } from "./data";

export default function ProjectPage() {
  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Final Project"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Overview of the three project options. Open an option for the full
            requirements. Deliverables and the due date also live on the{" "}
            <Link href="/syllabus#project">syllabus</Link>.
          </p>
        }
      />

      <ProjectOptionNav current="hub" />

      <CourseInfoSection id="overview" title="Overview">
        {projectOverview.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <ul className="mt-4 list-none space-y-3 p-0">
          {projectOverview.options.map((option) => (
            <li
              key={option.id}
              id={option.id}
              className="scroll-mt-32 rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h3 className="mt-0 mb-1 font-sans text-lg font-semibold">
                <Link href={option.href}>{option.title}</Link>
              </h3>
              <p className="mb-3 mt-0 text-neutral-800">{option.summary}</p>
              <Link
                href={option.href}
                className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
              >
                Open {option.title.replace(" Final Project", "")} requirements
              </Link>
            </li>
          ))}
        </ul>
        {projectOverview.cadence.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </CourseInfoSection>

      <CourseInfoSection id="ai" title={projectOverview.ai.heading}>
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          {projectOverview.ai.note}
        </p>
        {projectOverview.ai.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </CourseInfoSection>

      <CourseInfoSection id="deliverables" title={deliverables.heading}>
        {deliverables.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <ul className="list-disc space-y-1 pl-6">
          {deliverables.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CourseInfoSection>

      <CourseInfoFooter current="/project" />
    </article>
  );
}
