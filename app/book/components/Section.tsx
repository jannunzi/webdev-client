import type { ReactNode } from "react";
import BookSectionSlidesLink from "./BookSectionSlidesLink";

export default function Section({
  id,
  title,
  children,
  level = 2,
}: {
  id: string;
  title: string;
  children: ReactNode;
  /** 2 = chapter section (e.g. 1.3); 3 = subsection (e.g. 1.3.1), matching 1.2.4 */
  level?: 2 | 3;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  const headingClass =
    level === 3
      ? "mb-0 font-sans text-xl font-semibold"
      : "mb-0 font-sans text-2xl font-semibold tracking-tight";
  const wrapClass =
    level === 3
      ? "mb-3 mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 scroll-mt-6"
      : "mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-neutral-300 pb-2";

  return (
    <section id={id} className="scroll-mt-6 py-4">
      <div className={wrapClass}>
        <Heading className={headingClass}>{title}</Heading>
        <BookSectionSlidesLink sectionId={id} />
      </div>
      <div className="space-y-3 text-[1.05rem]">{children}</div>
    </section>
  );
}
