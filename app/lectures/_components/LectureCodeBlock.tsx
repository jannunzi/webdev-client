"use client";

import type { LectureCodeBlock as LectureCodeBlockData } from "@/lib/lectures/types";

export default function LectureCodeBlock({
  block,
}: {
  block: LectureCodeBlockData;
}) {
  const language = block.language ?? "tsx";
  return (
    <div className="book-code-block relative my-4 w-full max-w-full overflow-hidden rounded border border-neutral-300">
      {block.file ? (
        <div className="book-code-block-header flex items-center justify-between gap-2 border-b border-neutral-700 bg-[#161b22] px-3 py-1.5 font-sans">
          <span className="truncate font-mono text-xs text-neutral-400">
            {block.file}
          </span>
          <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wide text-neutral-500">
            {language}
          </span>
        </div>
      ) : null}
      <pre className="book-code-block-body book-code-block-plain m-0 overflow-x-auto bg-[#0d1117] p-3 text-sm leading-relaxed text-neutral-100">
        <code>{block.code}</code>
      </pre>
    </div>
  );
}
