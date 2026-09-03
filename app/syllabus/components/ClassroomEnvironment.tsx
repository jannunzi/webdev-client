import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function ClassroomEnvironment({
  policy,
}: {
  policy: PolicyBlock;
}) {
  return (
    <PolicySection
      id="classroom"
      title="Classroom environment"
      policy={policy}
    />
  );
}
