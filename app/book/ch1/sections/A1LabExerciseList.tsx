import Link from "next/link";
import { A1_LAB_EXERCISE_SECTIONS, labExerciseKindLabel } from "@/lib/assignments/a1-lab-exercises";
import SectionLink from "../../components/SectionLink";

/**
 * §1.3.12 recap — same nested parents and a/b/c tasks as the A1 Lab checklist.
 */
export default function A1LabExerciseList() {
  return (
    <ol>
      {A1_LAB_EXERCISE_SECTIONS.map((section) => (
        <li key={section.section}>
          <strong>{section.label}</strong>{" "}
          (<SectionLink to={section.section} />)
          <ol type="a">
            {section.tasks.map((task) => (
              <li key={task.id}>
                <strong>{labExerciseKindLabel(task.kind)}</strong>
                {" — "}
                {task.description}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

export function A1LabExerciseIntroLink() {
  return (
    <Link href="/assignments/a1" className="underline underline-offset-2">
      A1 Lab checklist
    </Link>
  );
}
