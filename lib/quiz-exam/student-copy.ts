/**
 * Student-facing graded-quiz copy. Do not name the auth vendor (Clerk)
 * here — staff pages and the README still can.
 *
 * Creating a course-website account is open and is not Canvas. Roster
 * match is only for taking / submitting a graded quiz. Shared Sign up /
 * Sign in page hints live in `lib/course-site/account-copy.ts`.
 */
import { COURSE_WEBSITE_ACCOUNT_COPY } from "../course-site/account-copy";

export const STUDENT_COPY = {
  signInWithSchoolEmail: "Sign in with your school email",
  signUpWithSchoolEmail: "Sign up with your school email",
  useRosterEmail: "Use the email on the course roster.",
  takeMetaDescription:
    "Student exam mode. Sign up if you don’t have a course-website account yet, then Sign in with your school email — the email on the course roster — to take a graded quiz.",
  takeIndexLead:
    "Anyone can browse the book. If you don’t have a course-website account yet, Sign up first — accounts are not pre-provisioned and this site is not Canvas. Then Sign in with your school email — the email on the course roster — to start or submit a graded attempt.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRosterPage:
    "Sign in with your school email — the email on the course roster. Browsing the book, syllabus, labs, and practice pages is fine. A graded attempt was not created.",
  notOnRosterSubmit:
    "This email isn’t on the course roster. Sign in with your school email — the email on the course roster. You can browse the book, but a graded attempt was not created.",
  signInToSubmit: "Sign in with your school email to submit a graded quiz.",
  signInPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
  signUpPageHint: COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
} as const;

export type StudentCopyKey = keyof typeof STUDENT_COPY;
