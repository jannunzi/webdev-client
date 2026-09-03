import type { Metadata } from "next";
import { listTermSlugs, resolveTerm } from "../termRegistry";
import { isSafeBookPath } from "../termSlug";
import { searchYouTubeVideos } from "../youtubeSearch";
import TermBackLink from "./TermBackLink";
import TermVideos from "./TermVideos";

export const revalidate = 86400;

type TermPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    href?: string | string[];
    term?: string | string[];
    q?: string | string[];
    from?: string | string[];
  }>;
};

export function generateStaticParams() {
  return listTermSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: TermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const resolved = resolveTerm(slug, query);
  return {
    title: `${resolved.term} · Course book`,
    description: `Official reference and explainer videos for ${resolved.term}.`,
  };
}

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function TermPage({ params, searchParams }: TermPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const resolved = resolveTerm(slug, query);
  const fromRaw = firstString(query.from);
  const from =
    fromRaw && isSafeBookPath(fromRaw) ? fromRaw : undefined;
  const result = await searchYouTubeVideos(resolved.searchQuery);

  return (
    <article className="mx-auto max-w-3xl">
      <TermBackLink from={from} />
      <header>
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Technology term
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          {resolved.term}
        </h1>
      </header>

      <section className="mt-6 rounded border border-neutral-300 bg-white px-4 py-4">
        <h2 className="mt-0 font-sans text-lg font-semibold">Official site</h2>
        {resolved.officialUrl ? (
          <p className="mb-0 text-[1.05rem]">
            Read the canonical docs or homepage for {resolved.term}:{" "}
            <a
              href={resolved.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="book-official-link break-all font-medium"
            >
              {resolved.officialUrl}
            </a>
          </p>
        ) : (
          <p className="mb-0 text-[1.05rem] text-neutral-700">
            No official URL is registered for this term. Return to the book and
            follow the first-use link, or search for “{resolved.term}” on the
            web.
          </p>
        )}
      </section>

      <TermVideos
        term={resolved.term}
        searchQuery={resolved.searchQuery}
        result={result}
      />
    </article>
  );
}
