import type { AssignmentCheckResult } from "@/lib/assignments/check-types";
import { checkWarnings } from "@/lib/assignments/check-warnings";

/** Before-submit warnings from Run checks (no rubric item, never scored). */
export default function CheckWarnings({ results }: { results: readonly AssignmentCheckResult[] }) {
  const warnings = checkWarnings(results);
  if (warnings.length === 0) return null;
  return (
    <div role="alert" data-check-status="warning" className="mb-4 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
      {warnings.map((row) => (
        <p key={row.id} className="my-1">
          <strong>{row.label}:</strong> {row.message}
        </p>
      ))}
    </div>
  );
}
