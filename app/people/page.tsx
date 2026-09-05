import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import StaffViewModeBar from "@/app/quizzes/components/StaffViewModeBar";
import StatusPanel from "@/app/quizzes/components/StatusPanel";
import { isClerkConfigured, isClerkPublishableKeySet } from "@/lib/config";
import { listCanvasRoster } from "@/lib/roster/list";
import { groupRosterBySection } from "@/lib/roster/sections";
import {
  getEffectiveStaffAccess,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import PeopleAuthBar from "./components/PeopleAuthBar";
import PeopleRoster from "./components/PeopleRoster";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "People — CS 4550 / CS 5610",
};

type PageProps = {
  searchParams: Promise<{ section?: string }>;
};

export default async function PeoplePage({ searchParams }: PageProps) {
  const { section } = await searchParams;

  if (!isClerkConfigured()) {
    return (
      <article className="mx-auto max-w-3xl font-sans">
        <StatusPanel title="This page is for course staff." tone="warn">
          <p>Sign in to continue.</p>
        </StatusPanel>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-5xl font-sans">
      {isClerkPublishableKeySet() ? <PeopleAuthBar /> : null}
      <StaffViewModeBar />
      <PeoplePageBody section={section} />
    </article>
  );
}

async function PeoplePageBody({ section }: { section?: string }) {
  const user = await currentUser();
  const access = await getEffectiveStaffAccess();
  if (access === "signed_out" || !user) {
    return (
      <StatusPanel title="Sign in to continue." tone="neutral">
        <p>This page is for course staff.</p>
      </StatusPanel>
    );
  }

  if (access !== "ok") {
    return (
      <StatusPanel title="403 Forbidden" tone="warn">
        <p>This page is for course staff only.</p>
        {(await isImpersonatingStudent()) ? (
          <p>
            You are in student view. Use <strong>Viewing as: Instructor</strong>{" "}
            above to return to the roster.
          </p>
        ) : null}
      </StatusPanel>
    );
  }

  let roster;
  try {
    roster = await listCanvasRoster();
  } catch {
    return (
      <StatusPanel title="Could not load the Canvas roster" tone="warn">
        <p>
          MongoDB Atlas could not be reached. The roster was not sent to the
          browser. Try again in a moment.
        </p>
      </StatusPanel>
    );
  }

  if (roster.status === "not_configured") {
    return (
      <StatusPanel title="Canvas roster is not configured" tone="warn">
        <p>
          MongoDB Atlas env vars are missing, so People cannot load{" "}
          <code>canvas_roster</code>.
        </p>
      </StatusPanel>
    );
  }

  const groups = groupRosterBySection(roster.entries);
  if (groups.length === 0) {
    return (
      <StatusPanel title="Canvas roster has not been loaded" tone="warn">
        <p>
          There are no documents in <code>canvas_roster</code>. Import a
          Canvas People CSV with <code>npm run roster:import</code>.
        </p>
      </StatusPanel>
    );
  }

  const selectedSection =
    typeof section === "string" && groups.some((group) => group.section === section)
      ? section
      : undefined;

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href="/quizzes">Question banks</Link>
        {" · "}
        <Link href="/quizzes/take">Graded quizzes</Link>
        {" · "}
        <Link href="/book">Course book</Link>
      </p>
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">People</h1>
      <p className="text-neutral-700">
        Fall 2026 Canvas roster from MongoDB Atlas. Staff only — this is not
        the Kambaz lab People demo.
      </p>
      <PeopleRoster groups={groups} selectedSection={selectedSection} />
    </>
  );
}
