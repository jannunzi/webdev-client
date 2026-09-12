import {
  ASSOCIATES_DISCLOSURE,
  BLOG_AFFILIATE_BOOKS,
  amazonProductUrl,
} from "@/lib/blog/affiliate";

/**
 * Static sponsored card for /blog only. Do not reuse the book chapter
 * 45s overlay (PR #85) here, and do not import this slot into Kambaz LMS.
 */
export default function BlogAdSlot() {
  return (
    <aside
      aria-label="Sponsored further reading"
      className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-4 font-sans text-sm text-neutral-800"
    >
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-amber-900">
        Sponsored / further reading
      </p>
      <p className="mt-2 mb-0 text-neutral-700">
        Optional books that complement the course stack. Not required for
        grades or labs.
      </p>
      <ul className="mt-3 mb-0 list-none space-y-2 p-0">
        {BLOG_AFFILIATE_BOOKS.map((book) => (
          <li key={book.asin}>
            <a
              href={amazonProductUrl(book.asin)}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              {book.title}
            </a>
            <span className="text-neutral-600"> — {book.author}</span>
          </li>
        ))}
      </ul>
      <p className="mb-0 mt-3 text-xs text-neutral-600">
        {ASSOCIATES_DISCLOSURE}
      </p>
    </aside>
  );
}
