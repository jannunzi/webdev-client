export type ExternalLink = {
  name: string;
  href: string;
  /** Optional qualifier after the name (tools). */
  note?: string;
  /** One-sentence blurb (AI tools). */
  description?: string;
};

export type ChapterEndSection<T> = {
  id: string;
  title: string;
  lead: string;
  items: T[];
};

export type ChapterEndMatterData = {
  chapter: number;
  references: ChapterEndSection<string> & {
    /** Headings and ideas that do not have `/book/terms/[slug]` pages. */
    topics: string[];
  };
  tools: ChapterEndSection<ExternalLink>;
  aiTools: ChapterEndSection<ExternalLink>;
};

export function numberedEndMatter(chapter: number, first: number) {
  return {
    references: {
      id: `sec-${chapter}-${first}`,
      title: `${chapter}.${first} References`,
    },
    tools: {
      id: `sec-${chapter}-${first + 1}`,
      title: `${chapter}.${first + 1} Tools`,
    },
    aiTools: {
      id: `sec-${chapter}-${first + 2}`,
      title: `${chapter}.${first + 2} AI Tools`,
    },
  };
}

export function chapterEndToc(data: ChapterEndMatterData) {
  return [
    { id: data.references.id, label: data.references.title },
    { id: data.tools.id, label: data.tools.title },
    { id: data.aiTools.id, label: data.aiTools.title },
  ];
}
