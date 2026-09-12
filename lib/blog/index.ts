import { BLOG_POSTS } from "./posts";
import type { BlogPost, BlogRelatedChapter } from "./types";

const CHAPTER_HREF: Record<BlogRelatedChapter, string> = {
  ch1: "/book/ch1",
  ch2: "/book/ch2",
  ch3: "/book/ch3",
  ch4: "/book/ch4",
  ch5: "/book/ch5",
  ch6: "/book/ch6",
};

const CHAPTER_LABEL: Record<BlogRelatedChapter, string> = {
  ch1: "Chapter 1",
  ch2: "Chapter 2",
  ch3: "Chapter 3",
  ch4: "Chapter 4",
  ch5: "Chapter 5",
  ch6: "Chapter 6",
};

export function listBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => {
    const byDate = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    if (byDate !== 0) return byDate;
    return a.slug.localeCompare(b.slug);
  });
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function listBlogSlugs(): string[] {
  return listBlogPosts().map((post) => post.slug);
}

export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid blog publishedAt: ${iso}`);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function relatedChapterHref(chapter: BlogRelatedChapter): string {
  return CHAPTER_HREF[chapter];
}

export function relatedChapterLabel(chapter: BlogRelatedChapter): string {
  return CHAPTER_LABEL[chapter];
}

export type { BlogPost, BlogRelatedChapter, BlogSource, BlogTag } from "./types";
