"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Normalize "§1.3.11" or "1.3.11" → "1.3.11" */
export function normalizeSectionRef(ref: string): string {
  return ref.replace(/^§/, "").trim();
}

/** §1.3.11 → /book/ch1#sec-1-3-11 */
export function sectionHref(ref: string): string {
  const cleaned = normalizeSectionRef(ref);
  const parts = cleaned.split(".");
  const chapter = parts[0];
  const id = `sec-${parts.join("-")}`;
  return `/book/ch${chapter}#${id}`;
}

export default function SectionLink({
  to,
  children,
  className = "text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900",
}: {
  /** Section number, with or without § — e.g. "1.3.11" or "§1.3.11".
   *  Mid-sentence: use `{" "}` after the tag — a bare space after `/>`
   *  is stripped by the Next/SWC compiler.
   */
  to: string;
  children?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const cleaned = normalizeSectionRef(to);
  const href = sectionHref(cleaned);
  const hash = `sec-${cleaned.split(".").join("-")}`;

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        const targetPath = `/book/ch${cleaned.split(".")[0]}`;
        if (pathname !== targetPath) return;
        const el = document.getElementById(hash);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }}
    >
      {children ?? `§${cleaned}`}
    </Link>
  );
}
