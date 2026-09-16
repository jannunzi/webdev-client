import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/config";
import { resolveQueueStaff } from "@/lib/office-hours/access";
import { toQueueView } from "@/lib/office-hours/queue";
import { readOfficeHourQueue } from "@/lib/office-hours/queue-store";
import { collectClerkEmails } from "@/lib/roster/emails";
import { isActualStaff } from "@/lib/roster/staff-access";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ taId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { taId } = await context.params;
  const sectionId = new URL(request.url).searchParams.get("section") ?? "";
  const resolved = resolveQueueStaff(taId, sectionId);
  if (!resolved.ok) {
    return NextResponse.json(
      { ok: false, code: resolved.code },
      { status: resolved.code === "unknown_section" ? 400 : 404 },
    );
  }

  const queue = await readOfficeHourQueue({
    taId: resolved.member.id,
    taEmail: resolved.member.email,
    section: sectionId,
  });

  let includeEmails = false;
  let viewerEmail: string | undefined;
  if (isClerkConfigured()) {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
      const user = await currentUser();
      viewerEmail = collectClerkEmails(user)[0];
      includeEmails = await isActualStaff();
    }
  }

  return NextResponse.json({
    ok: true,
    view: toQueueView(queue, { viewerEmail, includeEmails }),
  });
}
