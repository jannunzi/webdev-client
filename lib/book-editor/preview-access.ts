import "server-only";

import { staffActor } from "@/app/api/staff/actor";
import { getStaffAccess } from "@/lib/roster/staff-access";

/** Same allowlist as the chapter editor. View-as-student does not count. */
export async function canSeeBook2(): Promise<boolean> {
  try {
    const access = await getStaffAccess();
    if (access !== "ok") return false;
    const actor = await staffActor();
    return !("error" in actor);
  } catch {
    return false;
  }
}
