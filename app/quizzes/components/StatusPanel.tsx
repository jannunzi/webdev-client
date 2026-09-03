import type { ReactNode } from "react";
import Link from "next/link";

export default function StatusPanel({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: ReactNode;
  tone?: "neutral" | "warn" | "ok";
}) {
  const toneClass =
    tone === "warn"
      ? "border-amber-500 bg-amber-50 text-amber-950"
      : tone === "ok"
        ? "border-emerald-600 bg-emerald-50 text-emerald-950"
        : "border-neutral-300 bg-white text-neutral-900";

  return (
    <div className={`rounded-lg border-2 px-4 py-3 font-sans shadow-sm ${toneClass}`}>
      <p className="m-0 text-base font-semibold tracking-tight">{title}</p>
      <div className="mt-1 text-sm [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
      <p className="mb-0 mt-3 text-sm">
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/quizzes">Question banks</Link>
        {" · "}
        <Link href="/book/practice">Practice (ungraded)</Link>
      </p>
    </div>
  );
}
