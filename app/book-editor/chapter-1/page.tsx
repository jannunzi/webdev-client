import type { Metadata } from "next";
import Link from "next/link";
import { staffActor } from "@/app/api/staff/actor";
import { readChapter } from "@/lib/book-editor/handle";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { storagePlan } from "@/lib/book-editor/store";
import { getStaffAccess } from "@/lib/roster/staff-access";
import ChapterEditor from "./editor";
import "@/app/book/book.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chapter 1 editor",
};

/**
 * Staff pilot at /book-editor/chapter-1.
 * Uses the same Clerk allowlist as the rest of staff tools. It does not
 * change /book and it does not use Vercel preview authentication.
 */
export default async function Chapter1EditorPage() {
  const access = await getStaffAccess();
  if (access !== "ok") return <StaffGate access={access} />;
  const actor = await staffActor();
  if ("error" in actor) return <StaffGate access="forbidden" />;
  const plan = storagePlan();
  const initial = await readChapter(await openChapterStore(), plan);
  return (
    <main className="book-shell">
      <article className="book-content px-6 py-8">
        <ChapterEditor initial={initial} />
      </article>
    </main>
  );
}

function StaffGate({ access }: { access: "not_configured" | "signed_out" | "forbidden" }) {
  const title =
    access === "not_configured"
      ? "Sign-in is not configured"
      : access === "signed_out"
        ? "Sign in to edit Chapter 1"
        : "Staff only";
  const body =
    access === "not_configured"
      ? "Clerk is not configured on this server, so the chapter editor cannot check the staff allowlist. The public book at /book is unchanged."
      : access === "signed_out"
        ? "Sign in with the course account you already use on kambaz.dev. This page uses that same login. It is not a Vercel preview login."
        : "This editor is only for staff on the course allowlist. The public book at /book is unchanged.";
  return (
    <main className="mx-auto max-w-xl px-6 py-16 font-sans">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-neutral-700">{body}</p>
      {access === "signed_out" ? (
        <p className="mt-4">
          <Link className="text-blue-700 underline" href="/sign-in?redirect_url=%2Fbook-editor%2Fchapter-1">
            Sign in
          </Link>
        </p>
      ) : (
        <p className="mt-4">
          <Link className="text-blue-700 underline" href="/book/ch1">
            Back to Chapter 1
          </Link>
        </p>
      )}
    </main>
  );
}
