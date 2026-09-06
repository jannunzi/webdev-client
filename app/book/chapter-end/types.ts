export type ExternalLink = {
  name: string;
  href: string;
  /** Optional qualifier after the name (legacy; prefer description). */
  note?: string;
  /** One-sentence blurb shown after the name in Tools and AI Tools. */
  description: string;
  /**
   * Registry term when `name` would create a different slug (for example
   * "CSS (MDN)" → "CSS"). OfficialLink uses this so Tools reuse `/book/terms/[slug]`.
   */
  term?: string;
};

/** Label used to look up `/book/terms/[slug]` — `term` when set, otherwise `name`. */
export function endMatterTermName(item: ExternalLink): string {
  return item.term ?? item.name;
}

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
