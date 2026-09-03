import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function LatePolicy({ policy }: { policy: PolicyBlock }) {
  return <PolicySection id="late-policy" title="Late policy" policy={policy} />;
}
