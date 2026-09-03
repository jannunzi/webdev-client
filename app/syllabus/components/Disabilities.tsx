import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function Disabilities({ policy }: { policy: PolicyBlock }) {
  return (
    <PolicySection
      id="disabilities"
      title="Disability Access Services"
      policy={policy}
    />
  );
}
