import Link from "next/link";
import {
  A1_LAB_EXERCISE_GROUPS,
  labExerciseKindLabel,
} from "@/lib/assignments/a1-lab-exercises";
import SectionLink from "../../components/SectionLink";

/**
 * §1.3.12 recap — same grouped items and order as the A1 Lab checklist.
 */
export default function A1LabExerciseList() {
  return (
    <ol>
      {A1_LAB_EXERCISE_GROUPS.map((group) => (
        <li key={group.section}>
          <strong>{group.label}</strong>{" "}
          (<SectionLink to={group.section} />)
          <ol type="a">
            {group.tasks.map((task) => (
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
