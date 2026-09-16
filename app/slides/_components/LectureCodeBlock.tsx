"use client";

import CopyButton from "@/app/book/components/CopyButton";
import type { LectureCodeBlock as LectureCodeBlockData } from "@/lib/lectures/types";

export default function LectureCodeBlock({
  block,
}: {
  block: LectureCodeBlockData;
}) {
  const language = block.language ?? "tsx";

  return (
    <div className="book-code-block relative my-3 w-full max-w-full overflow-hidden rounded border border-neutral-300">
      <div className="book-code-block-header flex items-center justify-between gap-2 border-b border-neutral-700 bg-[#161b22] px-3 py-2 font-sans">
        <span className="min-w-0 truncate font-mono text-neutral-400">
          {block.file ?? language}
        </span>
        {block.file ? (
          <span className="shrink-0 font-mono text-[0.85em] uppercase tracking-wide text-neutral-500">
            {language}
          </span>
        ) : null}
      </div>
      <CopyButton code={block.code} variant="lecture" />
      {block.html ? (
        <div
          className="book-code-block-body book-code-block-lined overflow-x-auto leading-snug"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      ) : (
        <pre className="book-code-block-body book-code-block-plain m-0 overflow-x-auto bg-[#0d1117] p-3 leading-snug text-neutral-100 !text-[1.5625rem] md:!text-[1.875rem] [&_code]:!text-[1em]">
          <code>{block.code}</code>
        </pre>
      )}
    </div>
  );
}
