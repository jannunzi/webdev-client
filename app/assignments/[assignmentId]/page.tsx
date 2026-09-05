import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import StatusPanel from "@/app/quizzes/components/StatusPanel";
import { formatLongDate } from "@/app/syllabus/data/dates";
import {
  getAssignment,
  listAssignmentIds,
  rubricPointTotal,
} from "@/lib/assignments/catalog";
import { readAssignmentProgress } from "@/lib/assignments/progress";
import {
  isAssignmentProgressConfigured,
  isClerkConfigured,
} from "@/lib/config";
import AssignmentChapterLink from "../components/AssignmentChapterLink";
import AssignmentChecklist from "../components/AssignmentChecklist";
import AssignmentHubNav from "../components/AssignmentHubNav";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ assignmentId: string }>;
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

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { assignmentId } = await params;
  const assignment = getAssignment(assignmentId);
  if (!assignment) notFound();

  let signedIn = false;
  let mongoReady = isAssignmentProgressConfigured();
  let initialCompletedIds: string[] = [];

  if (isClerkConfigured()) {
    const { userId, isAuthenticated } = await auth();
    signedIn = Boolean(isAuthenticated && userId);
    if (signedIn && mongoReady && userId) {
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
      ) : (
        <>
          <p className="rounded-lg border border-neutral-300 bg-white px-4 py-3 font-sans text-sm text-neutral-800">
            Canvas grades still use Best / Better / Almost / Missing. This
            checklist only shows the maximum points for each row so you can
            track what you have finished.
          </p>
          <AssignmentChecklist
            assignment={assignment}
            initialCompletedIds={initialCompletedIds}
            signedIn={signedIn}
            mongoReady={mongoReady}
          />
        </>
      )}
    </article>
  );
}
