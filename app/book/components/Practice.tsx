import type { ReactNode } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import CopyButton from "./CopyButton";

function PracticeCallout({
  kind,
  title,
  children,
}: {
  kind: "own" | "ai";
  title: string;
  children: ReactNode;
}) {
  const Icon = kind === "own" ? FaPencilAlt : HiSparkles;
  return (
    <aside className={`book-practice book-practice-${kind}`} aria-label={title}>
      <div className="book-practice-header">
        <Icon aria-hidden className="book-practice-icon" />
        <strong>{title}</strong>
      </div>
      {children}
    </aside>
  );
}

/** Personal work the student invents — not the course sample. */
export function OnYourOwn({ children }: { children: ReactNode }) {
  return (
    <PracticeCallout kind="own" title="On your own">
      <div className="book-practice-body">{children}</div>
    </PracticeCallout>
  );
}

/** Optional assistant step after On your own — pasteable sample prompt. */
export function WithAI({
  children,
  prompt,
}: {
  children?: ReactNode;
  prompt: string;
}) {
  return (
    <PracticeCallout kind="ai" title="With AI">
      {children ? <div className="book-practice-body">{children}</div> : null}
      <div className="book-practice-prompt">
        <div className="book-practice-prompt-bar">
          <span>Sample prompt</span>
          <CopyButton code={prompt} variant="light" />
        </div>
        <pre>{prompt}</pre>
      </div>
    </PracticeCallout>
  );
}
