import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function RegradePolicy({ policy }: { policy: PolicyBlock }) {
  return (
    <PolicySection id="regrade-policy" title="Regrade policy" policy={policy} />
  );
}
