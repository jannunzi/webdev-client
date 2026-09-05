import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import StatusPanel from "@/app/quizzes/components/StatusPanel";
import { formatLongDate } from "@/app/syllabus/data/dates";
import {
  assignmentSubmitAccess,
  canViewStaffGrader,
  supportsUrlSubmission,
} from "@/lib/assignments/access";
import {
  getAssignment,
  listAssignmentIds,
  rubricPointTotal,
} from "@/lib/assignments/catalog";
import { readAssignmentProgress } from "@/lib/assignments/progress";
import {
  listSubmissionsForAssignment,
  readAssignmentSubmission,
} from "@/lib/assignments/submissions";
import {
  toSubmissionView,
  type AssignmentSubmissionView,
} from "@/lib/assignments/submissions-store";
import {
  buildStaffStudentQueue,
  findStaffStudent,
  type StaffStudentRow,
} from "@/lib/assignments/staff";
import {
  isAssignmentProgressConfigured,
  isClerkConfigured,
} from "@/lib/config";
import {
  canvasUserIdFromMetadata,
  collectClerkEmails,
} from "@/lib/roster/emails";
import { listCanvasRoster } from "@/lib/roster/list";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import {
  isActualStaff,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import A1WorkArea from "../components/A1WorkArea";
import type { SubmissionGateReason } from "../components/A1SubmissionForm";
import AssignmentChapterLink from "../components/AssignmentChapterLink";
import AssignmentChecklist from "../components/AssignmentChecklist";
import AssignmentHubNav from "../components/AssignmentHubNav";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ student?: string }>;
};

export function generateStaticParams() {
  return listAssignmentIds().map((assignmentId) => ({ assignmentId }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { assignmentId } = await params;
  const assignment = getAssignment(assignmentId);
  return {
    title: assignment
      ? `${assignment.canvasId} — ${assignment.title}`
      : "Assignment",
  };
}

export default async function AssignmentDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { assignmentId } = await params;
  const { student: studentKey } = await searchParams;
  const assignment = getAssignment(assignmentId);
  if (!assignment) notFound();

  let signedIn = false;
  let mongoReady = isAssignmentProgressConfigured();
  let initialCompletedIds: string[] = [];
  let canSubmit = false;
  let impersonating = false;
  let gateReason: SubmissionGateReason = mongoReady ? "sign_in" : "not_configured";
  let initialSubmission: AssignmentSubmissionView | null = null;
  let staffQueue: StaffStudentRow[] | undefined;
  let selectedStudent: StaffStudentRow | null = null;
  let showStaffGrader = false;

  if (isClerkConfigured()) {
    const { userId, isAuthenticated } = await auth();
    signedIn = Boolean(isAuthenticated && userId);
    if (signedIn && userId) {
      const user = await currentUser();
      impersonating = await isImpersonatingStudent();
      const staff = await isActualStaff();
      showStaffGrader =
        supportsUrlSubmission(assignment.id) &&
        canViewStaffGrader(staff, impersonating);
      const canvasUserId = canvasUserIdFromMetadata(user);
      const roster = mongoReady
        ? await lookupCanvasRoster({
            emails: collectClerkEmails(user),
            canvasUserIds: canvasUserId ? [canvasUserId] : [],
            impersonating,
          })
        : { status: "not_configured" as const };
      const access = assignmentSubmitAccess({
        signedIn: true,
        configured: mongoReady,
        isActualStaff: staff,
        roster,
      });
      canSubmit = access.ok && supportsUrlSubmission(assignment.id);
      gateReason = access.ok
        ? null
        : access.code === "unauthenticated"
          ? "sign_in"
          : access.code === "not_on_roster"
            ? "not_on_roster"
            : access.code === "roster_empty"
              ? "roster_empty"
              : "not_configured";

      if (mongoReady) {
        try {
          initialCompletedIds = await readAssignmentProgress(
            userId,
            assignment.id,
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Could not load progress.";
          console.error("assignment progress load failed", message);
          mongoReady = false;
        }
      }

      if (
        mongoReady &&
        canSubmit &&
        !impersonating &&
        supportsUrlSubmission(assignment.id)
      ) {
        try {
          const doc = await readAssignmentSubmission(userId, assignment.id);
          initialSubmission = doc ? toSubmissionView(doc) : null;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not load submission.";
          console.error("assignment submission load failed", message);
        }
      }

      if (showStaffGrader && mongoReady) {
        try {
          const [rosterList, submissions] = await Promise.all([
            listCanvasRoster(),
            listSubmissionsForAssignment(assignment.id),
          ]);
          staffQueue = buildStaffStudentQueue(
            rosterList.status === "ok" ? rosterList.entries : [],
            submissions,
          );
          if (studentKey) {
            selectedStudent = findStaffStudent(staffQueue, studentKey) ?? null;
            if (selectedStudent?.clerkUserId) {
              const doc = await readAssignmentSubmission(
                selectedStudent.clerkUserId,
                assignment.id,
              );
              initialSubmission = doc ? toSubmissionView(doc) : null;
              initialCompletedIds = [];
            } else if (selectedStudent) {
              initialSubmission = selectedStudent.vercelUrl
                ? {
                    githubUrl: selectedStudent.githubUrl ?? "",
                    vercelUrl: selectedStudent.vercelUrl,
                    updatedAt: new Date().toISOString(),
                    lastCheckedAt: selectedStudent.lastCheckedAt,
                    checkResults: selectedStudent.checkResults,
                    email: selectedStudent.email,
                    name: selectedStudent.name,
                    staffGrade: selectedStudent.staffGrade,
                  }
                : null;
              initialCompletedIds = [];
            }
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not load staff submissions.";
          console.error("assignment staff queue load failed", message);
        }
      }
    } else {
      gateReason = mongoReady ? "sign_in" : "not_configured";
    }
  } else {
    gateReason = "not_configured";
  }

  const points = assignment.rubric
    ? rubricPointTotal(assignment.rubric)
    : null;

  return (
    <article>
      <AssignmentHubNav current="detail" />
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {assignment.canvasId}
      </p>
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        {assignment.title}
      </h1>
      <p className="font-sans text-neutral-700">
        {assignment.dueDate
          ? `Due ${formatLongDate(assignment.dueDate)}`
          : null}
        {points != null
          ? `${assignment.dueDate ? " · " : ""}${points} pts`
          : null}
      </p>
      <p>{assignment.summary}</p>
      <AssignmentChapterLink assignment={assignment} />

      {assignment.status === "coming_soon" || !assignment.rubric ? (
        <StatusPanel title="Checklist coming soon" tone="neutral">
          <p>
            The syllabus summary for {assignment.canvasId} is here. The
            Delivery / Lab / Kambaz checklist will be added when that
            chapter&apos;s rubric is ready. Work from{" "}
            <Link href={assignment.chapterHref}>{assignment.chapter}</Link>{" "}
            in the meantime.
          </p>
        </StatusPanel>
      ) : supportsUrlSubmission(assignment.id) ? (
        <A1WorkArea
          assignment={assignment}
          initialSubmission={initialSubmission}
          initialCompletedIds={initialCompletedIds}
          signedIn={signedIn}
          mongoReady={mongoReady}
          canSubmit={canSubmit}
          impersonating={impersonating}
          gateReason={canSubmit ? null : gateReason}
          staffQueue={staffQueue}
          selectedStudent={selectedStudent}
        />
      ) : (
        <AssignmentChecklist
          assignment={assignment}
          initialCompletedIds={initialCompletedIds}
          signedIn={signedIn}
          mongoReady={mongoReady}
        />
      )}
    </article>
  );
}
