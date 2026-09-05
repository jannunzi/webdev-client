import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isClerkPublishableKeySet } from "@/lib/config";
import "../book/book.css";
import AssignmentAuthBar from "./components/AssignmentAuthBar";

export const metadata: Metadata = {
  title: "Assignments — CS 4550 / CS 5610",
  description:
    "Student assignment checklists for A1–A6: rubric criteria, book links, and progress tracking.",
};

export default function AssignmentsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="mx-auto min-w-0 max-w-3xl px-4 py-8 sm:px-6">
        {isClerkPublishableKeySet() ? <AssignmentAuthBar /> : null}
        {children}
      </main>
    </div>
  );
}
