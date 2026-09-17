/**
 * Cover URLs for Amazon Associates placements (blog card + book banner).
 * Prefer a curated public cover, then Amazon’s product image, the
 * Associates widget, then Open Library’s ISBN endpoint. Amazon often
 * returns a 1×1 spacer instead of a real cover.
 */

const DEFAULT_ASSOCIATE_TAG = "jannunzi04-20";

function associateTag(
  tag: string | undefined = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG,
): string {
  const trimmed = tag?.trim();
  return trimmed || DEFAULT_ASSOCIATE_TAG;
}

/** Verified Open Library covers for already-listed affiliate titles. */
export const OPEN_LIBRARY_COVER_BY_ASIN: Record<string, string> = {
  "1492051721": "https://covers.openlibrary.org/b/id/10282783-M.jpg",
  "1801074970": "https://covers.openlibrary.org/b/id/13166260-M.jpg",
  "1118531647": "https://covers.openlibrary.org/b/id/7419725-M.jpg",
  "1492053511": "https://covers.openlibrary.org/b/id/8513971-M.jpg",
};

export function amazonRetailCoverUrl(asin: string): string {
  return `https://images-na.ssl-images-amazon.com/images/P/${encodeURIComponent(asin)}.01.LZZZZZZZ.jpg`;
}

export function amazonImageUrl(
  asin: string,
  tag: string = associateTag(),
): string {
  const params = new URLSearchParams({
    _encoding: "UTF8",
    ASIN: asin,
    Format: "_SL160_",
    ID: "AsinImage",
    MarketPlace: "US",
    ServiceVersion: "20070822",
    WS: "1",
    tag,
  });
  return `https://ws-na.amazon-adsystem.com/widgets/q?${params.toString()}`;
}

export function openLibraryIsbnCoverUrl(
  isbn: string,
  size: "S" | "M" | "L" = "M",
): string {
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-${size}.jpg`;
}

/** Amazon often serves a 1×1 spacer instead of a 404 for unknown covers. */
export function isUsableAmazonCover(width: number, height: number): boolean {
  return width >= 40 && height >= 40;
}

export function affiliateCoverSources(options: {
  asin: string;
  coverUrl?: string;
  tag?: string;
}): string[] {
  const sources = [
    options.coverUrl,
    OPEN_LIBRARY_COVER_BY_ASIN[options.asin],
    amazonRetailCoverUrl(options.asin),
    amazonImageUrl(options.asin, options.tag),
    openLibraryIsbnCoverUrl(options.asin),
  ].filter((url): url is string => Boolean(url));
  return [...new Set(sources)];
}
