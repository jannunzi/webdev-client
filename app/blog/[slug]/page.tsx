import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseInfoFooter from "@/app/course-info/CourseInfoFooter";
import CourseInfoHeader from "@/app/course-info/CourseInfoHeader";
import {
  formatBlogDate,
  getBlogPost,
  listBlogSlugs,
  relatedChapterHref,
  relatedChapterLabel,
} from "@/lib/blog";
import BlogAdSlot from "../components/BlogAdSlot";
import BlogSourceLink from "../components/BlogSourceLink";
import BlogTagChips from "../components/BlogTagChips";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Post not found — Course blog" };
  }
  return {
    title: `${post.title} — Course blog`,
    description: post.intro[0],
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="page-content">
      <p className="mb-4 font-sans text-sm">
        <Link href="/blog">← All posts</Link>
      </p>
      <CourseInfoHeader
        title={post.title}
        lede={
          <div className="mt-4 space-y-3">
            <p className="mb-0 font-sans text-sm text-neutral-500">
              <time dateTime={post.publishedAt}>
                {formatBlogDate(post.publishedAt)}
              </time>
            </p>
            <BlogTagChips tags={post.tags} />
          </div>
        }
      />

      <p className="rounded-lg border border-neutral-200 bg-white px-4 py-3 font-sans text-sm text-neutral-700">
        Instructor-curated digest, not original reporting. Optional further
        reading — not required for grades.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          {post.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-[1.05rem]">
              {paragraph}
            </p>
          ))}

          <p className="mt-6 font-sans text-base">
            <BlogSourceLink source={post.source} />
          </p>

          {post.relatedChapters && post.relatedChapters.length > 0 ? (
            <p className="mt-4 font-sans text-sm text-neutral-700">
              Related in the book:{" "}
              {post.relatedChapters.map((chapter, index) => (
                <span key={chapter}>
                  {index > 0 ? " · " : null}
                  <Link href={relatedChapterHref(chapter)}>
                    {relatedChapterLabel(chapter)}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <div className="lg:sticky lg:top-6">
          <BlogAdSlot />
        </div>
      </div>

      <CourseInfoFooter current="/blog" />
    </article>
  );
}
