import type { ReactNode } from "react";

/**
 * `position: fixed` descendants normally anchor to the browser viewport,
 * which would let a CSS demo escape its LiveDemo figure and stick to the
 * real page (e.g. a fixed sidebar or corner label bleeding over the rest of
 * the book). Setting `transform` on this wrapper creates a new containing
 * block, so fixed descendants anchor to this box instead — a well known CSS
 * trick, not a real transform.
 */
export default function ContainFixed({
  height = 220,
  children,
}: {
  height?: number | string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        transform: "translateZ(0)",
        height,
      }}
    >
      {children}
    </div>
  );
}
