import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function AcademicIntegrity({ policy }: { policy: PolicyBlock }) {
  return (
    <PolicySection id="integrity" title="Academic integrity" policy={policy} />
  );
}
