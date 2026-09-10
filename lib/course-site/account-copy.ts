/**
 * Student-facing course-website account copy.
 * Piazza CS5610-09 Post 12: students tried school email, got
 * “couldn’t find your account,” and thought they needed roster access.
 * Do not name the auth vendor (Clerk) here.
 */
export const COURSE_WEBSITE_ACCOUNT_COPY = {
  heading: "Course website accounts",
  separateFromCanvas:
    "This course website (Kambaz) at https://webdev-client.vercel.app/ is separate from Canvas and Northeastern SSO. Signing in here is not the same as signing into Canvas.",
  notPreProvisioned:
    "Accounts are not pre-provisioned. If Sign in says it couldn’t find your account, you do not need roster access — you still need to register.",
  signUpThenSignIn:
    "Use Sign up to create your own account (school email is fine if the form asks for it), then Sign in.",
  quizRosterSeparate:
    "Sign-up is open. Taking a graded quiz is different: that still requires the email on the Canvas course roster. Creating a site account does not enroll you on the roster, and roster match is not required to Sign up.",
  signInPageHint:
    "This site is separate from Canvas and Northeastern SSO. Accounts are not created for you. If you don’t have an account yet, Sign up first (school email is fine), then Sign in. “Couldn’t find your account” means you still need to Sign up — not that you need roster access.",
  signUpPageHint:
    "This site is separate from Canvas and Northeastern SSO. Sign up to create your own account — nothing is pre-provisioned. School email is fine if the form asks for it. After you register, Sign in. Sign-up is open; taking a graded quiz still requires your Canvas roster email.",
  assignmentAuthHint:
    "Need an account? Sign up first (school email is fine), then Sign in. This site is not Canvas, and accounts are not pre-provisioned.",
  assignmentSignInHint:
    "This site is separate from Canvas. Accounts are not created for you — Sign up first (school email is fine), then Sign in to save URLs across devices.",
  signUpCtaSuffix: "if you do not have an account yet.",
  signInCtaSuffix: "after you create your account.",
} as const;

export type CourseWebsiteAccountCopyKey = keyof typeof COURSE_WEBSITE_ACCOUNT_COPY;
