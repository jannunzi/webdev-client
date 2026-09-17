import {
  labExerciseKindLabel,
  type LabExerciseKind,
} from "@/lib/assignments/a1-lab-exercises";
import type { BookExerciseParent } from "../exercise-lists/types";
import SectionLink from "./SectionLink";

/**
 * Numbered parent topics with lettered a/b/c sub-tasks — same markup as
 * the shipped §1.3.12 / A1 Lab list. Chapter recaps pass their own catalog.
 */
export default function NestedExerciseList({
  groups,
}: {
  groups: readonly BookExerciseParent[];
}) {
  return (
    <ol className="book-nested-exercises">
      {groups.map((group) => (
        <li key={group.id}>
          <strong>{group.parentLabel}</strong>{" "}
          (<SectionLink to={group.section} />
          {group.sectionEnd ? (
            <>
              –
              <SectionLink to={group.sectionEnd} />
            </>
          ) : null}
          )
          <ol type="a">
            {group.tasks.map((task) => (
              <li key={task.id}>
                <strong>{labExerciseKindLabel(task.kind as LabExerciseKind)}</strong>
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
