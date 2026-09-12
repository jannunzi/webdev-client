export const DEFAULT_ASSOCIATE_TAG = "jannunzi04-20";

export type AffiliateBook = {
  title: string;
  author: string;
  asin: string;
};

/**
 * Hand-picked bestsellers that complement the course stack.
 * These are optional further reading — not assigned course texts.
 */
export const AFFILIATE_BOOKS = {
  duckettHtml: {
    title: "HTML and CSS: Design and Build Websites",
    author: "Jon Duckett",
    asin: "1118008189",
  },
  duckettJs: {
    title: "JavaScript and jQuery: Interactive Front-End Web Development",
    author: "Jon Duckett",
    asin: "1118531647",
  },
  eloquentJs: {
    title: "Eloquent JavaScript, 4th Edition",
    author: "Marijn Haverbeke",
    asin: "1718504101",
  },
  definitiveJs: {
    title: "JavaScript: The Definitive Guide",
    author: "David Flanagan",
    asin: "1491952024",
  },
  learningReact: {
    title: "Learning React",
    author: "Alex Banks and Eve Porcello",
    asin: "1492051721",
  },
  realWorldNext: {
    title: "Real-World Next.js",
    author: "Michele Riva",
    asin: "1801074970",
  },
  nodeExpress: {
    title: "Web Development with Node and Express",
    author: "Ethan Brown",
    asin: "1492053511",
  },
  nodePatterns: {
    title: "Node.js Design Patterns",
    author: "Mario Casciaro and Luciano Mammino",
    asin: "1839214112",
  },
  cssGuide: {
    title: "CSS: The Definitive Guide",
    author: "Eric Meyer and Estelle Weyl",
    asin: "1098117613",
  },
  mongoGuide: {
    title: "MongoDB: The Definitive Guide",
    author: "Shannon Bradshaw, Eoin Brazil, and Kristina Chodorow",
    asin: "1491954469",
  },
} as const satisfies Record<string, AffiliateBook>;

export type AffiliateBookId = keyof typeof AFFILIATE_BOOKS;

/** Global rotation list when a chapter has no topic map. */
export const FALLBACK_BESTSELLERS: AffiliateBook[] = [
  AFFILIATE_BOOKS.duckettHtml,
  AFFILIATE_BOOKS.eloquentJs,
  AFFILIATE_BOOKS.learningReact,
  AFFILIATE_BOOKS.realWorldNext,
  AFFILIATE_BOOKS.nodeExpress,
  AFFILIATE_BOOKS.mongoGuide,
  AFFILIATE_BOOKS.definitiveJs,
  AFFILIATE_BOOKS.cssGuide,
  AFFILIATE_BOOKS.nodePatterns,
  AFFILIATE_BOOKS.duckettJs,
];

/** Chapter 1 HTML/Next → Chapter 6 Mongo, topic-based when possible. */
export const CHAPTER_BESTSELLERS: Record<number, AffiliateBook[]> = {
  1: [
    AFFILIATE_BOOKS.duckettHtml,
    AFFILIATE_BOOKS.realWorldNext,
    AFFILIATE_BOOKS.eloquentJs,
    AFFILIATE_BOOKS.definitiveJs,
  ],
  2: [
    AFFILIATE_BOOKS.duckettHtml,
    AFFILIATE_BOOKS.cssGuide,
    AFFILIATE_BOOKS.duckettJs,
  ],
  3: [
    AFFILIATE_BOOKS.eloquentJs,
    AFFILIATE_BOOKS.definitiveJs,
    AFFILIATE_BOOKS.duckettJs,
    AFFILIATE_BOOKS.learningReact,
  ],
  4: [
    AFFILIATE_BOOKS.learningReact,
    AFFILIATE_BOOKS.realWorldNext,
    AFFILIATE_BOOKS.eloquentJs,
  ],
  5: [
    AFFILIATE_BOOKS.nodeExpress,
    AFFILIATE_BOOKS.nodePatterns,
    AFFILIATE_BOOKS.definitiveJs,
  ],
  6: [
    AFFILIATE_BOOKS.mongoGuide,
    AFFILIATE_BOOKS.nodeExpress,
    AFFILIATE_BOOKS.learningReact,
  ],
};

const CHAPTER_PATH = /^\/book\/ch([1-6])(?:\/|$)/;

export function amazonAssociateTag(
  envTag: string | undefined = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG,
): string {
  const trimmed = envTag?.trim();
  return trimmed || DEFAULT_ASSOCIATE_TAG;
}

export function amazonProductUrl(
  asin: string,
  tag: string = amazonAssociateTag(),
): string {
  return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
}

export function amazonImageUrl(asin: string): string {
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SX160_SCLZZZZZZZ_.jpg`;
}

export function chapterFromPathname(pathname: string): number | null {
  const match = CHAPTER_PATH.exec(pathname);
  if (!match) return null;
  return Number(match[1]);
}

export function isBookChapterPath(pathname: string): boolean {
  return chapterFromPathname(pathname) !== null;
}

export function productsForChapter(chapter: number | null): AffiliateBook[] {
  if (chapter != null && CHAPTER_BESTSELLERS[chapter]) {
    return CHAPTER_BESTSELLERS[chapter];
  }
  return FALLBACK_BESTSELLERS;
}

export function productAtIndex(
  products: readonly AffiliateBook[],
  index: number,
): AffiliateBook {
  const list = products.length > 0 ? products : FALLBACK_BESTSELLERS;
  const safeIndex = ((index % list.length) + list.length) % list.length;
  return list[safeIndex] ?? FALLBACK_BESTSELLERS[0];
}
