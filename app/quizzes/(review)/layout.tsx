import type { ReactNode } from "react";
import StaffReviewGate from "../components/StaffReviewGate";

export const dynamic = "force-dynamic";

/**
 * Gates `/quizzes` and `/quizzes/qN` author review. Lives in a route group
 * so it does not wrap `/quizzes/take` (that path uses the Canvas roster).
 */
export default function QuizReviewLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <StaffReviewGate>{children}</StaffReviewGate>;
}
