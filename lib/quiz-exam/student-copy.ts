/**
 * Student-facing graded-quiz copy. Do not name the auth vendor (Clerk)
 * here — staff pages and the README still can.
 */
export const STUDENT_COPY = {
  signInWithSchoolEmail: "Sign in with your school email",
  signUpWithSchoolEmail: "Sign up with your school email",
  useRosterEmail: "Use the email on the course roster.",
  takeMetaDescription:
    "Student exam mode. Sign in with your school email — the email on the course roster — to take a graded quiz.",
  takeIndexLead:
    "Anyone can browse the book. Sign in with your school email — the email on the course roster — to start or submit a graded attempt.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRosterPage:
    "Sign in with your school email — the email on the course roster. Browsing the book, syllabus, labs, and practice pages is fine. A graded attempt was not created.",
  notOnRosterSubmit:
    "This email isn’t on the course roster. Sign in with your school email — the email on the course roster. You can browse the book, but a graded attempt was not created.",
  signInToSubmit: "Sign in with your school email to submit a graded quiz.",
  signInPageHint:
    "Sign in with your school email — the email on the course roster — to take a graded quiz.",
  signUpPageHint:
    "Sign up with your school email — the email on the course roster — to take a graded quiz.",
} as const;

export type StudentCopyKey = keyof typeof STUDENT_COPY;
