import type { ReactNode } from "react";
import {
  getEffectiveStaffAccess,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import StaffReviewDenied from "./StaffReviewDenied";

/**
 * Call this from each author-review *page* (not a parent layout).
 * Next.js renders layouts and pages in parallel, so skipping `{children}`
 * in a layout still serializes the page — including answer-key props.
 */
export async function renderStaffReview(
  render: () => ReactNode | Promise<ReactNode>,
): Promise<ReactNode> {
  const access = await getEffectiveStaffAccess();
  if (access !== "ok") {
    return (
      <StaffReviewDenied
        access={access}
        impersonating={await isImpersonatingStudent()}
      />
    );
  }
  return render();
}
