"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { describeLastPosition } from "./TOC";
import {
  getLastPositionServerSnapshot,
  getLastPositionSnapshot,
  subscribeLastPosition,
} from "./bookStorage";

export default function ResumeReading() {
  const last = useSyncExternalStore(
    subscribeLastPosition,
    getLastPositionSnapshot,
    getLastPositionServerSnapshot,
  );
  const resume = describeLastPosition(last);

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
