"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getLastPositionServerSnapshot,
  getLastPositionSnapshot,
  subscribeLastPosition,
} from "../../bookStorage";
import { isSafeBookPath } from "../termSlug";

function chapterLikePath(path: string): boolean {
  return path === "/book" || /^\/book\/ch\d+/.test(path);
}

function subscribeReferrer() {
  return () => {};
}

function getReferrerHref(): string | null {
  const raw = document.referrer;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.origin !== window.location.origin) return null;
    if (!isSafeBookPath(url.pathname) || !chapterLikePath(url.pathname)) {
      return null;
    }
    return url.hash ? `${url.pathname}${url.hash}` : url.pathname;
  } catch {
    return null;
  }
}

function getReferrerServerSnapshot() {
  return null;
}

export default function TermBackLink({
  from,
}: {
  from?: string;
}) {
  const last = useSyncExternalStore(
    subscribeLastPosition,
    getLastPositionSnapshot,
    getLastPositionServerSnapshot,
  );
  const referrerHref = useSyncExternalStore(
    subscribeReferrer,
    getReferrerHref,
    getReferrerServerSnapshot,
  );

  const fromHref =
    from && isSafeBookPath(from) && chapterLikePath(from.split("#")[0] ?? from)
      ? from
      : null;
  const lastHref = last
    ? last.hash
      ? `${last.pathname}#${last.hash}`
      : last.pathname
    : null;
  const href = fromHref ?? referrerHref ?? lastHref ?? "/book";
  const label =
    href === "/book" ? "Back to book home" : "Back to chapter";

  return (
    <p className="mb-4 font-sans text-sm">
      <Link
        href={href}
        className="text-neutral-700 no-underline hover:text-neutral-900 hover:underline"
      >
        ← {label}
      </Link>
    </p>
  );
}
