import SponsoredBookCover from "./SponsoredBookCover";

export type SponsoredBookItemProps = {
  title: string;
  author: string;
  href: string;
  asin: string;
  coverUrl?: string;
};

export default function SponsoredBookItem({
  title,
  author,
  href,
  asin,
  coverUrl,
}: SponsoredBookItemProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="flex items-start gap-3 rounded-md text-inherit no-underline hover:bg-amber-100/70"
    >
      <SponsoredBookCover
        title={title}
        asin={asin}
        coverUrl={coverUrl}
        className="h-[4.5rem] w-12 shrink-0 rounded border border-neutral-200 bg-neutral-50 object-cover"
      />
      <span className="min-w-0 pt-0.5">
        <span className="font-medium underline underline-offset-2">{title}</span>
        <span className="mt-0.5 block text-neutral-600"> — {author}</span>
      </span>
    </a>
  );
}
