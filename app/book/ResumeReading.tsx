"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { rewriteBookPath, type BookBase } from "@/lib/book-editor/book2-path";
import { describeLastPosition } from "./TOC";
import {
  getLastPositionServerSnapshot,
  getLastPositionSnapshot,
  subscribeLastPosition,
} from "./bookStorage";

export default function ResumeReading({ base = "/book" }: { base?: BookBase }) {
  const last = useSyncExternalStore(
    subscribeLastPosition,
    getLastPositionSnapshot,
    getLastPositionServerSnapshot,
  );
  const position =
    base === "/book2" && last
      ? { ...last, pathname: last.pathname.replace(/^\/book2(?=\/|$)/, "/book") }
      : last;
  const described = describeLastPosition(position);
  const resume = described
    ? { ...described, href: rewriteBookPath(described.href, base) }
    : null;

  if (!resume) return null;

  return (
    <p className="my-3 rounded border border-neutral-300 bg-neutral-100 px-3 py-2 font-sans text-sm">
      <Link href={resume.href} className="font-medium no-underline hover:underline">
        Resume reading
      </Link>
      <span className="text-neutral-600"> — {resume.label}</span>
    </p>
  );
}
