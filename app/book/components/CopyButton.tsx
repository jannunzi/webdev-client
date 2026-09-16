"use client";

import { useState } from "react";

function fallbackCopy(text: string) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(field);
  if (!ok) throw new Error("copy failed");
}

export default function CopyButton({
  code,
  variant = "dark",
}: {
  code: string;
  variant?: "dark" | "light" | "lecture";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        fallbackCopy(code);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      try {
        fallbackCopy(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        setCopied(false);
      }
    }
  }

  const className =
    variant === "lecture"
      ? "lecture-code-copy"
      : variant === "light"
        ? "shrink-0 rounded border border-violet-300 bg-white px-2 py-0.5 font-sans text-xs text-violet-900 hover:bg-violet-50"
        : "shrink-0 rounded border border-neutral-600 bg-neutral-800 px-2 py-0.5 font-sans text-xs text-neutral-100 hover:bg-neutral-700";

  return (
    <button
      type="button"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        void handleCopy();
      }}
      className={className}
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
      aria-live="polite"
      data-lecture-copy={variant === "lecture" ? "true" : undefined}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
