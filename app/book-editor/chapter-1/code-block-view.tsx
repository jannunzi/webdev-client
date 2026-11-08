"use client";

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import { highlightCodeToHtml } from "@/lib/code-block/highlight";

/** Editable code. The gutter and colors are display-only and are not stored. */
export default function CodeBlockView({ node }: NodeViewProps) {
  const text = node.textContent;
  const language = typeof node.attrs.language === "string" && node.attrs.language ? node.attrs.language : "text";
  const [html, setHtml] = useState("");
  useEffect(() => {
    let cancelled = false;
    highlightCodeToHtml({ code: text, language, lineNumbers: false })
      .then((value) => {
        if (!cancelled) setHtml(value);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [text, language]);
  const lineCount = text.length === 0 ? 1 : text.split("\n").length;
  return (
    <NodeViewWrapper className="book-editor-code" data-language={language}>
      <div className="book-editor-code-gutter" aria-hidden="true" contentEditable={false}>
        {Array.from({ length: lineCount }, (_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>
      <div className="book-editor-code-body">
        {html ? (
          <div className="book-editor-code-highlight" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
        ) : null}
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
}
