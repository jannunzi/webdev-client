import Link from "next/link";
import { A1_LAB_EXERCISES } from "@/lib/assignments/a1-lab-exercises";
import SectionLink from "../../components/SectionLink";

/**
 * §1.3.12 recap — same items and order as the A1 Lab checklist.
 */
export default function A1LabExerciseList() {
  return (
    <ol>
      {A1_LAB_EXERCISES.map((exercise) => (
        <li key={exercise.id}>
          <strong>{exercise.label}</strong>
          {" — "}
          {exercise.description}{" "}
          (<SectionLink to={exercise.section} />
          ).
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
