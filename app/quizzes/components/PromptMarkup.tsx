import { parsePromptMarkup } from "@/lib/question-bank/prompt-markup";

type PromptMarkupProps = {
  text: string;
  as?: "p" | "span";
  className?: string;
};

/** Renders bank `backticks` as styled inline `<code>` (book-matching red/grey). */
export default function PromptMarkup({
  text,
  as: Tag = "p",
  className,
}: PromptMarkupProps) {
  const parts = parsePromptMarkup(text);
  return (
    <Tag className={className}>
      {parts.map((part, index) =>
        part.type === "code" ? (
          <code key={index} className="quiz-prompt-code">
            {part.value}
          </code>
        ) : (
          part.value
        ),
      )}
    </Tag>
  );
}
