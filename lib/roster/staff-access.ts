import "server-only";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/config";
import { collectClerkEmails } from "./emails";
import { staffAccessFromUser, type StaffAccessStatus } from "./instructors";
import {
  VIEW_MODE_COOKIE,
  effectiveStaffAccess,
  resolveViewMode,
  shouldImpersonateStudent,
  type ViewMode,
} from "./view-mode";

export type { StaffAccessStatus, ViewMode };

export async function getStaffAccess(): Promise<StaffAccessStatus> {
  if (!isClerkConfigured()) return "not_configured";
  const user = await currentUser();
  return staffAccessFromUser(true, Boolean(user), collectClerkEmails(user));
}

/** Allowlist staff, ignoring “View as student”. Use for the toggle chrome. */
export async function isActualStaff(): Promise<boolean> {
  return (await getStaffAccess()) === "ok";
}

/**
 * `instructor` (default) or `student`. Non-staff users always resolve to
 * instructor — a client-set cookie cannot impersonate or elevate.
 */
export async function getViewMode(): Promise<ViewMode> {
  const store = await cookies();
  return resolveViewMode({
    cookieValue: store.get(VIEW_MODE_COOKIE)?.value,
    isActualStaff: await isActualStaff(),
  });
}

export async function getEffectiveStaffAccess(): Promise<StaffAccessStatus> {
  const access = await getStaffAccess();
  return effectiveStaffAccess(access, await getViewMode());
}

/** Staff allowlist AND instructor view. Gates People and author review. */
export async function effectiveIsStaff(): Promise<boolean> {
  return (await getEffectiveStaffAccess()) === "ok";
}

export async function isCurrentUserStaff(): Promise<boolean> {
  return effectiveIsStaff();
}

export async function isImpersonatingStudent(): Promise<boolean> {
  return shouldImpersonateStudent(await isActualStaff(), await getViewMode());
}
