"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  courseSiteHrefForLocation,
  isLegacyCourseHost,
} from "@/lib/course-site/origin";
import "./legacy-course-host-banner.css";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

/** Hostname, search, and hash. Path comes from usePathname so App Router navigations update the link. */
function clientLocationSnapshot(): string {
  const { hostname, search, hash } = window.location;
  return `${hostname}\n${search}\n${hash}`;
}

/**
 * Shown only when this app is served from the read-only Vercel alias.
 * Does not redirect. The link keeps the current path, query, and hash.
 */
export default function LegacyCourseHostBanner() {
  const pathname = usePathname() || "/";
  const snapshot = useSyncExternalStore(
    subscribe,
    clientLocationSnapshot,
    () => "",
  );
  if (!snapshot) return null;

  const [hostname, search = "", hash = ""] = snapshot.split("\n");
  if (!hostname || !isLegacyCourseHost(hostname)) return null;

  const href = courseSiteHrefForLocation({ pathname, search, hash });

  return (
    <p className="legacy-course-host-banner" role="status">
      Sign in and submit at <a href={href}>{href}</a>.
    </p>
  );
}
