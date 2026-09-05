/**
 * Feature flags derived from env. Safe to import from Server Components.
 * Never put secrets in NEXT_PUBLIC_* vars.
 */

export function isClerkPublishableKeySet(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim());
}

export function isClerkConfigured(): boolean {
  return (
    isClerkPublishableKeySet() && Boolean(process.env.CLERK_SECRET_KEY?.trim())
  );
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function isQuizTakingConfigured(): boolean {
  return isClerkConfigured() && isMongoConfigured();
}

/** Signed-in assignment checklists persist to Mongo when both are set. */
export function isAssignmentProgressConfigured(): boolean {
  return isClerkConfigured() && isMongoConfigured();
}

/** A1 URL submit uses the same Clerk + Mongo gate as checklist sync. */
export function isAssignmentSubmissionConfigured(): boolean {
  return isAssignmentProgressConfigured();
}

export function mongoDbName(): string {
  return process.env.MONGODB_DB?.trim() || "webdev";
}
