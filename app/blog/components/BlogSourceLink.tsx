import type { BlogSource } from "@/lib/blog";

export default function BlogSourceLink({
  source,
  className = "",
}: {
  source: BlogSource;
  className?: string;
}) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Read original: {source.title}
      <span className="text-neutral-600"> — {source.publisher}</span>
    </a>
  );
}
