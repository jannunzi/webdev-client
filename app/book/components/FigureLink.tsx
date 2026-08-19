import type { ReactNode } from "react";

/** In-page link to a numbered book figure — e.g. Figure 2a → #fig-2a.
 *  Pass `to` as the figure number ("2a", "2.4.1"). Mid-sentence: a bare
 *  space after `/>` is stripped by the Next/SWC compiler — use `{" "}`.
 */
export default function FigureLink({
  to,
  children,
  className = "text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900",
}: {
  to: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a href={`#fig-${to}`} className={className}>
      {children ?? `Figure ${to}`}
    </a>
  );
}
