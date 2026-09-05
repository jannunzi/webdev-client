import Link from "next/link";
import type { AssignmentItem } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function AssignmentsBlurb({
  intro,
  assignments,
}: {
  intro: string[];
  assignments: AssignmentItem[];
}) {
  return (
    <SyllabusSection id="assignments" title="Assignments">
      {intro.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      <p>
        Track the Delivery / Lab / Kambaz checklist on{" "}
        <Link href="/assignments">Assignments</Link>.
      </p>
      <ol className="list-none space-y-3 pl-0">
        {assignments.map((assignment) => (
          <li
            key={assignment.id}
            className="rounded-md border border-neutral-200 bg-white px-4 py-3"
          >
            <p className="font-sans font-semibold">
              <Link href={`/assignments/${assignment.id.toLowerCase()}`}>
                {assignment.id} — {assignment.title}
              </Link>{" "}
              <span className="font-normal text-neutral-500">
                ({assignment.chapter})
              </span>
            </p>
            <p className="mt-1 text-neutral-800">{assignment.summary}</p>
          </li>
        ))}
      </ol>
    </SyllabusSection>
  );
}
