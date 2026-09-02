import Link from "next/link";
import type { CourseGoal } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function CourseGoals({ goals }: { goals: CourseGoal }) {
  return (
    <SyllabusSection id="goals" title={goals.heading}>
      {goals.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      <ul className="list-none space-y-3 pl-0">
        {goals.topics.map((topic) => (
          <li
            key={topic.name}
            className="rounded-md border border-neutral-200 bg-white px-4 py-3"
          >
            <p className="font-sans text-base font-semibold">
              {topic.href ? (
                <Link href={topic.href}>{topic.name}</Link>
              ) : (
                topic.name
              )}
            </p>
            <p className="mt-1 text-neutral-700">{topic.detail}</p>
          </li>
        ))}
      </ul>
    </SyllabusSection>
  );
}
