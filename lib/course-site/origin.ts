/** Canonical course site. Sign-in and assignment submit work here. */
export const COURSE_SITE_ORIGIN = "https://kambaz.dev";

/**
 * Vercel alias that still serves this app for reading notes.
 * Clerk production sign-in and submit do not work on this host.
 */
export const LEGACY_COURSE_SITE_HOST = "webdev-client.vercel.app";

export function isLegacyCourseHost(hostname: string): boolean {
  const host = hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/:\d+$/, "");
  return host === LEGACY_COURSE_SITE_HOST;
}

/** Absolute kambaz.dev URL for the current path, search, and hash. */
export function courseSiteHrefForLocation(location: {
  pathname: string;
  search?: string;
  hash?: string;
}): string {
  const pathname = location.pathname.startsWith("/")
    ? location.pathname
    : `/${location.pathname}`;
  return `${COURSE_SITE_ORIGIN}${pathname}${location.search ?? ""}${location.hash ?? ""}`;
}
