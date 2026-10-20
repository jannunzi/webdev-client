import type { AssignmentCheckResult } from "./check-types";

/** Warning rows (no rubric item) from a check run, one per id, in run order. */
export function checkWarnings(results: readonly AssignmentCheckResult[]): AssignmentCheckResult[] {
  const seen = new Set<string>();
  return results.filter((row) => {
    if (!row.warning || seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}
