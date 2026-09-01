"use client";

import { useState } from "react";

export default function CopyButton({
  code,
  variant = "dark",
}: {
  code: string;
  variant?: "dark" | "light";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const className =
    variant === "light"
      ? "shrink-0 rounded border border-violet-300 bg-white px-2 py-0.5 font-sans text-xs text-violet-900 hover:bg-violet-50"
      : "shrink-0 rounded border border-neutral-600 bg-neutral-800 px-2 py-0.5 font-sans text-xs text-neutral-100 hover:bg-neutral-700";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label="Copy code"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
