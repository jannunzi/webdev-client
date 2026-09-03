import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import CourseInfoSection from "@/app/course-info/CourseInfoSection";
import {
  deliverables,
  openEndedDetail,
  pazzaDetail,
  projectOverview,
  quizzesDetail,
} from "./data";

export default function ProjectPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <CourseInfoHeader
        title="Final Project"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Overview of the three project options. Requirements documents,
            deliverables, and the due date live on Canvas and on the{" "}
            <Link href="/syllabus#project">syllabus</Link>.
          </p>
        }
      />

      <CourseInfoSection id="overview" title="Overview">
        {projectOverview.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <ol className="list-decimal space-y-3 pl-6">
          {projectOverview.options.map((option) => (
            <li key={option.id}>
              <a href={`#${option.id}`} className="font-semibold no-underline hover:underline">
                {option.title}
              </a>
              {": "}
              {option.summary}
            </li>
          ))}
        </ol>
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

      <CourseInfoSection id="quizzes" title={quizzesDetail.heading}>
        {quizzesDetail.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </CourseInfoSection>

      <CourseInfoSection id="pazza" title={pazzaDetail.heading}>
        {pazzaDetail.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </CourseInfoSection>

      <CourseInfoSection id="open-ended" title={openEndedDetail.heading}>
        {openEndedDetail.paragraphs.map((paragraph) => (
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
