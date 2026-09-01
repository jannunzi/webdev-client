import type { ReactNode } from "react";

/**
 * First-use link to the site responsible for a technology (official docs,
 * spec, or Wikipedia when there is no single home page).
 */
export default function OfficialLink({
  href,
  children,
  className = "book-official-link",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}
