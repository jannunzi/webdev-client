import Link from "next/link";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import { formatBlogDate, listBlogPosts } from "@/lib/blog";
import BlogAdSlot from "./components/BlogAdSlot";
import BlogSourceLink from "./components/BlogSourceLink";
import BlogTagChips from "./components/BlogTagChips";

const DIGEST_DISCLOSURE =
  "These posts are instructor-curated digests, not original reporting. Each item paraphrases a public article and always links to the original source. Optional further reading — not required for grades.";

export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <article className="page-content">
      <CourseInfoHeader
        title="Course blog"
        lede={
          <p className="mt-4 text-[1.05rem] text-neutral-800">
            A link-forward news digest for full-stack Next.js. Short intros,
            then the original article. Newest first.
          </p>
        }
      />

      <p className="rounded-lg border border-neutral-200 bg-white px-4 py-3 font-sans text-sm text-neutral-700">
        {DIGEST_DISCLOSURE}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <ol className="m-0 list-none space-y-8 p-0">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-neutral-200 pb-8 last:border-b-0 last:pb-0"
            >
              <p className="mb-1 font-sans text-sm text-neutral-500">
                <time dateTime={post.publishedAt}>
                  {formatBlogDate(post.publishedAt)}
                </time>
              </p>
              <h2 className="mt-0 mb-2 font-sans text-2xl font-semibold tracking-tight">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <BlogTagChips tags={post.tags} />
              <p className="mt-3 mb-3 text-[1.05rem] text-neutral-800">
                {post.intro[0]}
              </p>
              <p className="mb-0 font-sans text-sm">
                <Link href={`/blog/${post.slug}`}>Read digest</Link>
                {" · "}
                <BlogSourceLink source={post.source} />
              </p>
            </li>
          ))}
        </ol>
        <div className="lg:sticky lg:top-6">
          <BlogAdSlot />
        </div>
      </div>

      <CourseInfoFooter current="/blog" />
    </article>
  );
}
