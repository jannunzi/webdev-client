/**
 * Student-facing assignment submit copy. Do not name the auth vendor
 * (Clerk) here — staff pages and the README still can.
 */
export const ASSIGNMENT_STUDENT_COPY = {
  signInToSubmit:
    "Sign in with your school email to submit your GitHub and Vercel URLs.",
  signInHint:
    "Sign in with your school email — the email on the course roster — to save URLs across devices.",
  notOnRosterTitle: "This email isn’t on the course roster",
  notOnRoster:
    "Sign in with your school email — the email on the course roster. You can still use the checklist in this browser, but URL submit stays closed.",
  rosterEmpty:
    "The course roster has not been loaded yet. URL submit is closed until the instructor imports the roster.",
  notConfigured: "Assignment URL submit is not available yet.",
  unknownAssignment: "URL submit is only available for A1 right now.",
  impersonationBanner:
    "Impersonation — you can run checks to smoke-test the form. The submission is not saved.",
  saved: "Your GitHub and Vercel URLs are saved.",
  savedButNotPersisted: "Checks finished. This preview was not saved.",
  bothUrlsRequired: "Enter both a GitHub repository URL and a Vercel deployment URL.",
  githubFormat:
    "Enter a public GitHub repository URL such as https://github.com/yourname/webdev-client.",
  githubOfficial:
    "Submit your own public GitHub repository, not the course starter repo.",
  githubPrivate:
    "This GitHub repository was not found or is private. Make the repo public so graders can open it.",
  githubUnreachable: "Could not reach GitHub to confirm the repository is public.",
  githubOk: "This looks like a public GitHub repository.",
  vercelFormat:
    "Enter an https Vercel deployment URL that graders can open. Localhost and http URLs cannot be checked.",
  vercelLocalhost:
    "Localhost URLs cannot be graded. Submit your public Vercel deployment.",
  vercelCourseSite: "Submit your own Vercel deployment, not the course website.",
  vercelBlockedHost:
    "That host cannot be checked. Submit a public https deployment URL.",
  vercelHttps: "Use an https URL, not http.",
  vercelOk: "This is an https deployment URL (not localhost).",
  vercelAuthWall:
    "Vercel Deployment Protection is on (login required, or HTTP 401/403). Turn protection off so the page opens without signing in.",
  vercelUnreachable: "Could not open the deployment URL.",
  labsOk: "Found Labs navigation or wd- hooks used in A1.",
  labsMissing:
    "The page opened, but Labs navigation / wd- ids were not found. Open /labs on your deploy and follow Chapter 1.",
  labsUnread: "Could not read the page to check Labs markers.",
  nameOk: "Found your name on the page.",
  nameMissing:
    "Your name was not found. Put your full name (first then last) on Labs, matching the course roster.",
} as const;

export type AssignmentStudentCopyKey = keyof typeof ASSIGNMENT_STUDENT_COPY;
