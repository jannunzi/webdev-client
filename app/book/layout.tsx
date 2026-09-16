import type { ReactNode } from "react";
import CourseChromeShell from "@/app/course-info/CourseChromeShell";
import { AccountProvider } from "@/app/(kambaz)/account/AccountContext";
import BookTOC from "./TOC";
import BookAffiliateBanner from "./components/BookAffiliateBanner";
import "./book.css";

export default function BookLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <CourseChromeShell>
        <div className="flex min-h-[calc(100dvh-var(--course-site-header-height))]">
          <BookTOC />
          <main className="min-w-0 w-full flex-1 overflow-x-auto px-4 py-6 md:p-6">
            {children}
          </main>
        </div>
        <BookAffiliateBanner />
      </CourseChromeShell>
    </AccountProvider>
  );
}
