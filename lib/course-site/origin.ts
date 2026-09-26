/** Canonical course site. Sign-in and assignment submit work here. */
export const COURSE_SITE_ORIGIN = "https://kambaz.dev";

const KAMBAZ_HOSTS = new Set(["kambaz.dev", "www.kambaz.dev"]);

/**
 * Vercel alias that still serves this same production deployment for reading notes.
 * Clerk production sign-in and submit do not work on this host.
 */
export const LEGACY_COURSE_SITE_HOST = "webdev-client.vercel.app";

/** Hostname from a Host header or `window.location.hostname`, without port. */
export function normalizeRequestHost(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "").replace(/:\d+$/, "");
}

function hostEndsWithDomain(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/**
 * Course backup alias (`webdev-client.vercel.app` and its subdomains).
 * Student apps on other `*.vercel.app` hosts are not this alias.
 */
export function isLegacyCourseHost(hostname: string): boolean {
  return hostEndsWithDomain(normalizeRequestHost(hostname), LEGACY_COURSE_SITE_HOST);
}

/**
 * Banner for the shared deployment. Decides from the request host only —
 * never from a build-time env var, because kambaz.dev and the Vercel alias
 * are the same build.
 *
 * Shown when the host ends with `webdev-client.vercel.app`, and on other
 * `*.vercel.app` preview hosts. Hidden on kambaz.dev and www.kambaz.dev.
 */
export function shouldShowCourseHostBanner(hostname: string): boolean {
  const host = normalizeRequestHost(hostname);
  if (!host || KAMBAZ_HOSTS.has(host)) return false;
  if (isLegacyCourseHost(host)) return true;
  return host.endsWith(".vercel.app");
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
