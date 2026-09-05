import {
  COURSE_SITE_ORIGIN,
  assignmentPublicUrl,
  listAssignments,
} from "./catalog";
import type { AssignmentHubItem, AssignmentId } from "./types";

/**
 * Minimal Canvas assignment description. The IMSCC cartridge is not in this
 * git repo (Jose’s tooling keeps it under canvas-fall). Paste these into A1–A6
 * descriptions in a follow-up package; do not dump the website rubric into
 * Canvas.
 */
export function canvasAssignmentDescriptionHtml(
  assignment: AssignmentHubItem,
): string {
  const url = assignment.publicUrl;
  return [
    `<p>Complete ${assignment.canvasId} — ${assignment.title} on the course site:</p>`,
    `<p><a href="${url}">${url}</a></p>`,
    `<p>Sign in with your school email if you want the checklist to sync across devices. Submit your GitHub repository and Vercel URL here in Canvas.</p>`,
  ].join("");
}

export function listCanvasFollowupCopy(): Array<{
  canvasId: string;
  assignmentId: AssignmentId;
  publicUrl: string;
  html: string;
}> {
  return listAssignments().map((assignment) => ({
    canvasId: assignment.canvasId,
    assignmentId: assignment.id,
    publicUrl: assignment.publicUrl,
    html: canvasAssignmentDescriptionHtml(assignment),
  }));
}

export { COURSE_SITE_ORIGIN, assignmentPublicUrl };
