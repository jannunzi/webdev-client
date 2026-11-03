import { currentUser } from "@clerk/nextjs/server";
import type { StaffGate } from "@/lib/inline-edit/handle-edit";
import { collectClerkEmails } from "@/lib/roster/emails";
import { getStaffAccess, isCurrentUserStaff } from "@/lib/roster/staff-access";

/** Same staff gate as the inline text save. View-as-student is not staff here. */
export async function staffActor(): Promise<StaffGate> {
  const access = await getStaffAccess();
  if (access !== "ok") {
    const status = access === "forbidden" ? 403 : 401;
    return { error: "Staff only.", status };
  }
  if (!(await isCurrentUserStaff())) {
    return { error: "Staff only.", status: 403 };
  }
  const email = collectClerkEmails(await currentUser())[0];
  if (!email) return { error: "Staff only.", status: 403 };
  return { email };
}
