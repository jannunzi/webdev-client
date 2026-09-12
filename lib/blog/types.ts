export type BlogTag = "nextjs" | "react" | "ai" | "security" | "course";

export type BlogRelatedChapter = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6";

export type BlogSource = {
  title: string;
  url: string;
  publisher: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: BlogTag[];
  /** 1–3 short paragraphs: why it matters for full-stack / this course. */
  intro: string[];
  source: BlogSource;
  relatedChapters?: BlogRelatedChapter[];
};
