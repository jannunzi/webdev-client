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

/** Dev/agent-only in-memory queue when Mongo is unset. */
export function isOfficeHourQueueMemory(): boolean {
  return process.env.OH_QUEUE_MEMORY === "1";
}

export function isOfficeHourQueueConfigured(): boolean {
  return (
    isClerkConfigured() && (isMongoConfigured() || isOfficeHourQueueMemory())
  );
}

/** Local/agent screenshots of student and TA line chrome. Off in production. */
export function isOfficeHourQueuePreview(): boolean {
  return (
    process.env.OH_QUEUE_PREVIEW === "1" && process.env.NODE_ENV !== "production"
  );
}

export function mongoDbName(): string {
  return process.env.MONGODB_DB?.trim() || "webdev";
}
