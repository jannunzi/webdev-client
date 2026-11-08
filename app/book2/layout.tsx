import type { ReactNode } from "react";
import { staffActor } from "@/app/api/staff/actor";
import CourseSiteHeader from "@/app/course-info/CourseSiteHeader";
import BookAffiliateBanner from "@/app/book/components/BookAffiliateBanner";
import BookTOC from "@/app/book/TOC";
import { AccountProvider } from "@/lib/account/AccountContext";
import { getStaffAccess } from "@/lib/roster/staff-access";
import Book2Gate from "./gate";
import "@/app/book/book.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "book2",
  robots: { index: false, follow: false },
};

/**
 * Staff reader at /book2. The public /book layout is a different route.
 * Unauthorized requests stop here, before any saved draft is read.
 */
export default async function Book2Layout({ children }: { children: ReactNode }) {
  const access = await getStaffAccess();
  if (access !== "ok") return <Book2Gate access={access} />;
  const actor = await staffActor();
  if ("error" in actor) return <Book2Gate access="forbidden" />;
  return (
    <AccountProvider>
      <div className="book-shell flex min-h-screen flex-col">
        <CourseSiteHeader />
        <div className="flex min-h-0 flex-1">
          <BookTOC base="/book2" />
          <main className="min-w-0 w-full flex-1 overflow-x-auto py-6">
            <div className="page-content px-4 sm:px-6">{children}</div>
          </main>
        </div>
        <BookAffiliateBanner />
      </div>
    </AccountProvider>
  );
}
