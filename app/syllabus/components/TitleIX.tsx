import type { PolicyBlock } from "../data/types";
import PolicySection from "./PolicySection";

export default function TitleIX({ policy }: { policy: PolicyBlock }) {
  return <PolicySection id="title-ix" title="Title IX" policy={policy} />;
}
