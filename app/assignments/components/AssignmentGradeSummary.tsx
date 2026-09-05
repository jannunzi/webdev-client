import {
  formatGradeSummary,
  type GradeBreakdown,
} from "@/lib/assignments/grade";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";

export default function AssignmentGradeSummary({
  proposed,
  staff,
}: {
  proposed?: GradeBreakdown | null;
  staff?: GradeBreakdown | null;
}) {
  if (!proposed && !staff) return null;
  return (
    <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 font-sans">
      {proposed ? (
        <p className="m-0 text-base font-semibold text-emerald-950">
          {ASSIGNMENT_STUDENT_COPY.proposedGradeLabel}:{" "}
          {formatGradeSummary(proposed)}
        </p>
      ) : null}
      {staff ? (
        <p className={`${proposed ? "mt-1 mb-0" : "m-0"} text-base font-semibold text-emerald-950`}>
          {ASSIGNMENT_STUDENT_COPY.staffGradeLabel}: {formatGradeSummary(staff)}
        </p>
      ) : null}
      <p className="mb-0 mt-1 text-sm text-emerald-900">
        All-or-nothing per criterion: full points if it passes, 0 if it does
        not.
      </p>
    </div>
  );
}
