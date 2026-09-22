import {
  formatGradePoints,
  formatGradePercent,
  type GradeBreakdown,
} from "@/lib/assignments/grade";
import { ASSIGNMENT_STUDENT_COPY } from "@/lib/assignments/student-copy";

function GradeLine({
  label,
  grade,
}: {
  label: string;
  grade: GradeBreakdown;
}) {
  return (
    <div>
      <p className="m-0 text-sm font-medium text-emerald-900">{label}</p>
      <p className="m-0 text-3xl font-semibold tracking-tight text-emerald-950">
        {formatGradePercent(grade)}
      </p>
      <p className="mb-0 mt-0.5 text-sm text-emerald-900">
        {formatGradePoints(grade)}
      </p>
    </div>
  );
}

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
      <div className="flex flex-wrap gap-8">
        {proposed ? (
          <GradeLine
            label={ASSIGNMENT_STUDENT_COPY.proposedGradeLabel}
            grade={proposed}
          />
        ) : null}
        {staff ? (
          <GradeLine
            label={ASSIGNMENT_STUDENT_COPY.staffGradeLabel}
            grade={staff}
          />
        ) : null}
      </div>
      <p className="mb-0 mt-3 text-sm text-emerald-900">
        All-or-nothing per criterion: full points if it passes, 0 if it does
        not. {ASSIGNMENT_STUDENT_COPY.canvasPercentHint}
      </p>
    </div>
  );
}
