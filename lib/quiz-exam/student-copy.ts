/**
 * Student-facing graded-quiz copy. Do not name the auth vendor (Clerk)
 * here — staff pages and the README still can.
 *
 * Creating a course-website account is not Canvas. Students Sign up with
 * the same Northeastern email they use on Canvas so progress can be
 * mapped to the roster. Roster match is still required to take / submit
 * a graded quiz. Shared Sign up / Sign in page hints live in
 * `lib/course-site/account-copy.ts`.
 */
import { COURSE_WEBSITE_ACCOUNT_COPY } from "../course-site/account-copy";

export const STUDENT_COPY = {
  signInWithSchoolEmail: COURSE_WEBSITE_ACCOUNT_COPY.signInWithCanvasEmail,
  signUpWithSchoolEmail: COURSE_WEBSITE_ACCOUNT_COPY.signUpWithCanvasEmail,
  useRosterEmail: "Use the same Northeastern email you use on Canvas.",
  takeMetaDescription:
    "Student exam mode. Sign up if you don’t have a course-website account yet, then Sign in with the same Northeastern email you use on Canvas to take a graded quiz.",
  takeIndexLead:
    "Anyone can browse the book. If you don’t have a course-website account yet, Sign up first with the same Northeastern email you use on Canvas — accounts are not pre-provisioned and this site is not Canvas. Then Sign in with that Canvas email to start or submit a graded attempt.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRosterPage:
    "Sign in with the same Northeastern email you use on Canvas. Browsing the book, syllabus, labs, and practice pages is fine. A graded attempt was not created.",
  notOnRosterSubmit:
    "This email isn’t on the course roster. Sign in with the same Northeastern email you use on Canvas. You can browse the book, but a graded attempt was not created.",
  signInToSubmit: "Sign in with your Canvas email to submit a graded quiz.",
  signInPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
  signUpPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
} as const;

export type StudentCopyKey = keyof typeof STUDENT_COPY;
