import { setStaffViewMode } from "@/lib/roster/view-mode-actions";
import { getViewMode, isActualStaff } from "@/lib/roster/staff-access";
import type { ViewMode } from "@/lib/roster/view-mode";

const MODES: { id: ViewMode; label: string }[] = [
  { id: "instructor", label: "Instructor" },
  { id: "student", label: "Student" },
];

export default async function StaffViewModeBar() {
  if (!(await isActualStaff())) return null;
  const viewMode = await getViewMode();
  const student = viewMode === "student";

  return (
    <div
      role="region"
      aria-label="Staff view mode"
      className={`sticky top-0 z-40 mb-4 rounded-lg border px-3 py-2 font-sans text-sm shadow-sm ${
        student
          ? "border-amber-500 bg-amber-50 text-amber-950"
          : "border-neutral-300 bg-neutral-50 text-neutral-800"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 font-medium">
          Viewing as:{" "}
          <span className="sr-only">
            {student ? "Student" : "Instructor"}
          </span>
        </p>
        <div
          role="group"
          aria-label="Switch staff view"
          className="flex flex-wrap gap-2"
        >
          {MODES.map((mode) => {
            const pressed = viewMode === mode.id;
            return (
              <form key={mode.id} action={setStaffViewMode}>
                <input type="hidden" name="mode" value={mode.id} />
                <button
                  type="submit"
                  aria-pressed={pressed}
                  className={`rounded border px-3 py-1.5 ${
                    pressed
                      ? student
                        ? "border-amber-800 bg-amber-800 text-white"
                        : "border-neutral-800 bg-neutral-800 text-white"
                      : "border-neutral-400 bg-white hover:bg-neutral-50"
                  }`}
                >
                  {mode.label}
                </button>
              </form>
            );
          })}
        </div>
      </div>
      {student ? (
        <p className="mb-0 mt-2 text-xs">
          Student view — People and answer keys are hidden. Graded exam
          attempts and A1 URL submissions are not saved. Switch back to
          Instructor anytime.
        </p>
      ) : null}
    </div>
  );
}
