import { auth } from "@clerk/nextjs/server";
import { canViewStaffGrader, supportsUrlSubmission } from "@/lib/assignments/access";
import { getAssignment } from "@/lib/assignments/catalog";
import { buildFixupExportRows, fixupExportCsv } from "@/lib/assignments/fixup";
import { listFixupWindows, listFixupsForAssignment } from "@/lib/assignments/fixup-store";
import { isAssignmentFixupsEnabled, isAssignmentProgressConfigured } from "@/lib/config";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";

export const dynamic = "force-dynamic";

/**
 * Staff-only fix-up CSV for loading regained points into Canvas.
 *   /assignments/a2/fixup-export?section=CS5610-02
 * Rows still waiting on staff (or never submitted) are ready_for_canvas=no.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ assignmentId: string }> },
) {
  if (!isAssignmentFixupsEnabled()) return new Response("Not found", { status: 404 });
  const { assignmentId } = await context.params;
  const assignment = getAssignment(assignmentId);
  if (!assignment?.rubric || !supportsUrlSubmission(assignmentId)) {
    return new Response("Not found", { status: 404 });
  }
  const { userId } = await auth();
  if (!userId) return new Response("Sign in as course staff.", { status: 401 });
  const staff = await isActualStaff();
  const impersonating = await isImpersonatingStudent();
  if (!canViewStaffGrader(staff, impersonating)) {
    return new Response("This export is for course staff only.", { status: 403 });
  }
  if (!isAssignmentProgressConfigured()) {
    return new Response("Submissions are not configured.", { status: 503 });
  }
  const section = new URL(request.url).searchParams.get("section")?.trim() || "";
  const rows = buildFixupExportRows({
    assignmentId: assignment.id,
    rubric: assignment.rubric,
    records: await listFixupsForAssignment(assignment.id),
    section,
    windows: await listFixupWindows(),
    now: new Date(),
  });
  const date = new Date().toISOString().slice(0, 10);
  const slug = section ? `-${section.replace(/[^A-Za-z0-9-]/g, "")}` : "";
  return new Response(fixupExportCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${assignment.id}${slug}-fixups-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
