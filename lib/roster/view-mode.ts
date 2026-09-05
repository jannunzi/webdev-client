import { parseRosterEmailsEnv } from "./emails";
import type { StaffAccessStatus } from "./instructors";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";

export type ViewMode = "instructor" | "student";

/** httpOnly cookie set only by the staff-checked server action. */
export const VIEW_MODE_COOKIE = "webdev_view_mode";

/**
 * Synthetic roster identity used while staff “View as student” is on.
 * Never written to `canvas_roster`. Override with `IMPERSONATION_STUDENT_EMAIL`.
 */
export const DEFAULT_IMPERSONATION_STUDENT_EMAIL = "demo.student@webdev.local";
export const IMPERSONATION_STUDENT_NAME = "Demo Student";
export const IMPERSONATION_CANVAS_USER_ID = "impersonation-demo";

export function parseViewMode(value: string | undefined | null): ViewMode {
  return value === "student" ? "student" : "instructor";
}

/**
 * Student view is honored only for actual staff. A forged cookie does not
 * grant roster matching or change a non-staff user’s gates.
 */
export function resolveViewMode(input: {
  cookieValue: string | undefined | null;
  isActualStaff: boolean;
}): ViewMode {
  if (!input.isActualStaff) return "instructor";
  return parseViewMode(input.cookieValue);
}

export function effectiveStaffAccess(
  access: StaffAccessStatus,
  viewMode: ViewMode,
): StaffAccessStatus {
  if (access !== "ok") return access;
  if (viewMode === "student") return "forbidden";
  return "ok";
}

export function isEffectiveStaff(
  access: StaffAccessStatus,
  viewMode: ViewMode,
): boolean {
  return effectiveStaffAccess(access, viewMode) === "ok";
}

export function shouldImpersonateStudent(
  isActualStaff: boolean,
  viewMode: ViewMode,
): boolean {
  return isActualStaff && viewMode === "student";
}

export type ViewModeCookieUpdate =
  | { rejected: true }
  | { delete: true }
  | { set: "student" };

/** Cookie mutation after the server action has verified `isStaff`. */
export function viewModeCookieUpdate(input: {
  isActualStaff: boolean;
  requested: string | undefined | null;
}): ViewModeCookieUpdate {
  if (!input.isActualStaff) return { rejected: true };
  const mode = parseViewMode(input.requested);
  if (mode === "instructor") return { delete: true };
  return { set: "student" };
}

export function impersonationStudentEmail(
  value: string | undefined = process.env.IMPERSONATION_STUDENT_EMAIL,
): string {
  return parseRosterEmailsEnv(value)[0] ?? DEFAULT_IMPERSONATION_STUDENT_EMAIL;
}

export function impersonationDummyEntry(
  email: string = impersonationStudentEmail(),
): CanvasRosterEntry {
  return {
    email,
    name: IMPERSONATION_STUDENT_NAME,
    canvasUserId: IMPERSONATION_CANVAS_USER_ID,
    section: "Impersonation",
    source: "impersonation",
  };
}

export function impersonationRosterMatch(
  impersonating: boolean,
): Extract<RosterLookupResult, { status: "matched" }> | null {
  if (!impersonating) return null;
  return { status: "matched", entry: impersonationDummyEntry() };
}
