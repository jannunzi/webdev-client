import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import StatusPanel from "@/app/quizzes/components/StatusPanel";
import { isClerkConfigured, isClerkPublishableKeySet } from "@/lib/config";
import { collectClerkEmails } from "@/lib/roster/emails";
import { isInstructor, isStaff } from "@/lib/roster/instructors";
import { listCanvasRoster } from "@/lib/roster/list";
import { groupRosterBySection } from "@/lib/roster/sections";
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
        <StatusPanel title="People is not configured yet" tone="warn">
          <p>
            Clerk env vars are missing, so this page cannot tell who is signed
            in. The rest of the course book stays available.
          </p>
          <p>
            Jose: add the keys from <code>.env.example</code> to Vercel,
            including <code>INSTRUCTOR_EMAILS=jannunzi@gmail.com</code>.
            TAs go in <code>TA_EMAILS</code> after they create a Clerk
            account.
          </p>
        </StatusPanel>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-5xl font-sans">
      {isClerkPublishableKeySet() ? <PeopleAuthBar /> : null}
      <PeoplePageBody section={section} />
    </article>
  );
}

async function PeoplePageBody({ section }: { section?: string }) {
  const user = await currentUser();
  if (!user) {
    return (
      <StatusPanel title="Sign in to view People" tone="neutral">
        <p>
          This page lists Canvas roster students for instructors and TAs.
          Anyone may create a Clerk account; People access is an email
          allowlist, not a separate registration. Sign in with the address
          on <code>INSTRUCTOR_EMAILS</code> or <code>TA_EMAILS</code>.
        </p>
      </StatusPanel>
    );
  }

  const emails = collectClerkEmails(user);
  if (!isStaff(emails)) {
    return (
      <StatusPanel title="403 Forbidden" tone="warn">
        <p>
          People is limited to the course instructor and TAs. Being on the
          Canvas student roster does not grant access. Signed-in browsing of
          the book, syllabus, labs, and practice pages is fine. The roster was
          not loaded.
        </p>
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
      {isInstructor(emails) ? (
        <p className="text-sm text-neutral-500">
          Add TA emails via <code>TA_EMAILS</code> on Vercel after they sign
          up with Clerk. No invite UI.
        </p>
      ) : null}
      <PeopleRoster groups={groups} selectedSection={selectedSection} />
    </>
  );
}
