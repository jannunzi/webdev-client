import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function AiPolicy({ policy }: { policy: PolicyBlock }) {
  return <PolicySection id="ai-policy" title="AI policy" policy={policy} />;
}
