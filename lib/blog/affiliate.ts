/**
 * Blog-only Amazon Associates helpers.
 *
 * PR #85 (`BookAffiliateBanner`) is a 45s delayed overlay on book chapter
 * pages. Do not import that banner here — blog ads stay a static
 * “Sponsored / further reading” card so reading UX stays separate.
 */

export const DEFAULT_ASSOCIATE_TAG = "jannunzi04-20";

export const ASSOCIATES_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export type BlogAffiliateBook = {
  title: string;
  author: string;
  asin: string;
};

/** Optional further reading — not assigned course texts. */
export const BLOG_AFFILIATE_BOOKS: BlogAffiliateBook[] = [
  {
    title: "Learning React",
    author: "Alex Banks and Eve Porcello",
    asin: "1492051721",
  },
  {
    title: "Real-World Next.js",
    author: "Michele Riva",
    asin: "1801074970",
  },
];

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
