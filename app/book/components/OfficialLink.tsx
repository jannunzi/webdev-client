import type { ReactNode } from "react";
import Link from "next/link";
import { getTerm } from "../terms/termRegistry";
import { childrenToText, termPageHref, termSlug } from "../terms/termSlug";


/**
 * First-use technology term. Navigates in-app to `/book/terms/[slug]`
 * (official site + explainer videos) instead of opening the official URL.
 * Optional `term` / `searchQuery` override the label and YouTube query;
 * defaults come from `children` text.
 */
export default function OfficialLink({
  href,
  children,
  className = "book-official-link",
  term,
  searchQuery,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  term?: string;
  searchQuery?: string;
}) {
  const label = (term ?? childrenToText(children)).trim();
  const slug = termSlug(label);
  const path = termPageHref(href, label, getTerm(slug), { term, searchQuery });

  return (
    <Link href={path} className={className} title={`Learn more about ${label}`}>
      {children}
    </Link>
  );
}
