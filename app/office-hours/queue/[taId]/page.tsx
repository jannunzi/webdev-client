import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import { findStaffMember } from "@/app/syllabus/data/officeHours";
import { defaultSectionId } from "@/app/syllabus/data/sections";
import {
  isClerkConfigured,
  isClerkPublishableKeySet,
  isOfficeHourQueueConfigured,
  isOfficeHourQueuePreview,
} from "@/lib/config";
import { queueJoinAccess, queueManageAccess, resolveQueueStaff } from "@/lib/office-hours/access";
import { previewQueueView } from "@/lib/office-hours/preview";
import { emptyQueue, toQueueView } from "@/lib/office-hours/queue";
import { readOfficeHourQueue } from "@/lib/office-hours/queue-store";
import { isSyllabusSectionId, sectionLabelForId } from "@/lib/office-hours/sections";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
} from "@/lib/roster/emails";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import { isActualStaff, isImpersonatingStudent } from "@/lib/roster/staff-access";
import QueueClient from "./QueueClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ taId: string }>;
  searchParams: Promise<{ section?: string; preview?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { taId } = await params;
  return {
    title: `Office-hour line — ${taId}`,
  };
}

function joinReason(code: string | undefined): string | undefined {
  switch (code) {
    case "unauthenticated":
      return "Sign in with your Canvas email to join this section’s line.";
    case "not_on_roster":
      return "Joining is limited to students on the Canvas roster.";
    case "wrong_section":
      return "Your roster section does not match this line. Use your section’s office hours.";
    case "staff_cannot_join":
      return "Staff manage the line from this page; students join below when the session is open.";
    case "impersonating":
      return "Student view does not write to the live line.";
    case "not_configured":
      return "The live line is not configured yet.";
    default:
      return undefined;
  }
}

export default async function OfficeHourQueuePage({
  params,
  searchParams,
}: PageProps) {
  const { taId } = await params;
  const { section: sectionParam, preview: previewParam } = await searchParams;
  const memberHint = findStaffMember(taId);
  const sectionId =
    sectionParam && isSyllabusSectionId(sectionParam)
      ? sectionParam
      : (memberHint?.sectionIds[0] ?? defaultSectionId);
  const resolved = resolveQueueStaff(taId, sectionId);

  if (!resolved.ok && resolved.code === "unknown_staff") {
    notFound();
  }

  if (!resolved.ok && resolved.code === "no_queue") {
    return (
      <article className="page-content">
        <CourseInfoHeader
          title="No live office-hour line"
          lede={
            <p className="mt-4 text-[1.05rem] text-neutral-800">
              Giuseppe Marotta is Piazza-only. There is no walk-up or Teams
              check-in queue.
            </p>
          }
        />
        <p>
          <Link href="/office-hours">Back to staff and office hours</Link>
          {" · "}
          <Link href="/piazza-hours">Piazza hours</Link>
        </p>
        <CourseInfoFooter current="/office-hours" />
      </article>
    );
  }

  if (!resolved.ok) {
    notFound();
  }

  const member = resolved.member;
  const previewRole =
    isOfficeHourQueuePreview() &&
    (previewParam === "student" || previewParam === "ta")
      ? previewParam
      : undefined;

  let staff = false;
  let impersonating = false;
  let canJoin = false;
  let canManage = false;
  let joinBlockedReason: string | undefined;
  let viewerEmail: string | undefined;

  if (isClerkConfigured()) {
    const { userId, isAuthenticated } = await auth();
    if (isAuthenticated && userId) {
      const user = await currentUser();
      viewerEmail = collectClerkEmails(user)[0];
      staff = await isActualStaff();
      impersonating = await isImpersonatingStudent();
      const roster = await lookupCanvasRoster({
        emails: collectClerkEmails(user),
        canvasUserIds: canvasUserIdFromMetadata(user)
          ? [canvasUserIdFromMetadata(user)!]
          : [],
        impersonating,
      });
      const join = queueJoinAccess({
        signedIn: true,
        configured: isOfficeHourQueueConfigured(),
        isActualStaff: staff,
        impersonating,
        roster,
        sectionId,
        taId: member.id,
      });
      canJoin = join.ok;
      joinBlockedReason = join.ok ? undefined : joinReason(join.code);
      canManage = queueManageAccess({
        signedIn: true,
        configured: isOfficeHourQueueConfigured(),
        isActualStaff: staff,
        impersonating,
      }).ok;
    } else {
      joinBlockedReason = joinReason("unauthenticated");
    }
  } else {
    joinBlockedReason = joinReason("unauthenticated");
  }

  if (previewRole === "student") {
    canJoin = true;
    canManage = false;
    joinBlockedReason = undefined;
  }
  if (previewRole === "ta") {
    canManage = true;
    canJoin = false;
    joinBlockedReason = joinReason("staff_cannot_join");
  }

  const stored = previewRole
    ? emptyQueue({
        taId: member.id,
        taEmail: member.email,
        section: sectionId,
      })
    : await readOfficeHourQueue({
        taId: member.id,
        taEmail: member.email,
        section: sectionId,
      });
  const initialView = previewRole
    ? previewQueueView(previewRole)
    : toQueueView(stored, { viewerEmail, includeEmails: canManage });

  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Live office-hour line"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            Walk-up and Teams check-in for {sectionLabelForId(sectionId)}. Not a
            booking calendar.{" "}
            <Link href="/office-hours">All staff hours</Link>
            {" · "}
            <Link href="/syllabus#office-hours">Syllabus</Link>
            {" · "}
            <Link href="/piazza-hours">Piazza hours</Link>.
          </p>
        }
      />
      <QueueClient
        taId={member.id}
        taName={member.name}
        sectionId={sectionId}
        sectionLabel={sectionLabelForId(sectionId)}
        hoursSummary={member.hoursSummary}
        teams={member.teams}
        initialView={initialView}
        canJoin={canJoin}
        canManage={canManage}
        joinBlockedReason={joinBlockedReason}
        showAuthBar={isClerkPublishableKeySet()}
        preview={Boolean(previewRole)}
      />
      <CourseInfoFooter current="/office-hours" />
    </article>
  );
}
