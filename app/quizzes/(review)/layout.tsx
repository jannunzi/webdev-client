import type { ReactNode } from "react";
import { isClerkPublishableKeySet } from "@/lib/config";
import ClerkAuthBar from "../components/ClerkAuthBar";

export const dynamic = "force-dynamic";

/**
 * Auth chrome for `/quizzes` and `/quizzes/qN` only — this route group
 * does not wrap `/quizzes/take`. The staff check that hides answers must
 * live in each page (`renderStaffReview`); a layout cannot prevent the
 * page RSC payload from being sent.
 */
export default function QuizReviewLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {isClerkPublishableKeySet() ? (
        <ClerkAuthBar title="Author review" fallbackRedirect="/quizzes" />
      ) : null}
      {children}
    </>
  );
}
