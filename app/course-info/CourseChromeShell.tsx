import type { ReactNode } from "react";
import "../book/book.css";
import CourseSiteHeader from "./CourseSiteHeader";

export default function CourseChromeShell({
  children,
  mainClassName,
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <CourseSiteHeader />
      <div className="book-shell min-h-0 flex-1">
        {mainClassName ? (
          <main className={mainClassName}>{children}</main>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
