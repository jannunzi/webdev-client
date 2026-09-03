import Link from "next/link";
import { projectBlurb } from "../data/project";
import SyllabusSection from "./SyllabusSection";

export default function ProjectBlurb({
  project = projectBlurb,
}: {
  project?: typeof projectBlurb;
}) {
  return (
    <SyllabusSection id="project" title={project.heading}>
      {project.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      <ul className="list-disc space-y-1 pl-6">
        {project.requirements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Option overviews (Quizzes, Pazza, or open-ended) are on the{" "}
        <Link href="/project">Final Project</Link> page.
      </p>
    </SyllabusSection>
  );
}
