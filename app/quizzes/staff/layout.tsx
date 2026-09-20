import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isClerkPublishableKeySet } from "@/lib/config";
import ClerkAuthBar from "../components/ClerkAuthBar";
import StaffViewModeBar from "../components/StaffViewModeBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff quiz attempts — CS 4550 / CS 5610",
  description:
    "Staff-only review of student quiz submissions, with grade overrides.",
};

export default function StaffQuizLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {isClerkPublishableKeySet() ? (
        <ClerkAuthBar
          title="Staff attempt review"
          fallbackRedirect="/quizzes/staff"
          showActions={false}
        />
      ) : null}
      <StaffViewModeBar />
      {children}
    </>
  );
}
