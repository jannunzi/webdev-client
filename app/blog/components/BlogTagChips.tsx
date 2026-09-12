import type { BlogTag } from "@/lib/blog";

const TAG_LABEL: Record<BlogTag, string> = {
  nextjs: "Next.js",
  react: "React",
  ai: "AI",
  security: "Security",
  course: "Course",
};

export default function BlogTagChips({ tags }: { tags: BlogTag[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 font-sans">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs font-medium text-neutral-700"
        >
          {TAG_LABEL[tag]}
        </li>
      ))}
    </ul>
  );
}
