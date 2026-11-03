import { currentUser } from "@clerk/nextjs/server";
import { handleEditTextRequest, type StaffGate } from "@/lib/inline-edit/handle-edit";
import { collectClerkEmails } from "@/lib/roster/emails";
import { getStaffAccess, isCurrentUserStaff } from "@/lib/roster/staff-access";

export const runtime = "nodejs";

async function staffActor(): Promise<StaffGate> {
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

/** Staff probe used by the book and slides editor. Anonymous visitors get `{ staff: false }`. */
export async function GET() {
  const staff = await staffActor();
  return Response.json({ staff: "email" in staff });
}

export async function POST(request: Request) {
  return handleEditTextRequest(request, {
    staff: await staffActor(),
    env: process.env,
  });
}
