"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type MouseEvent, type ReactNode } from "react";
import { book2Destination } from "@/lib/book-editor/book2-path";

/** Keep published chapter, section, and practice links inside book2. */
export default function Book2Links({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const root = document.querySelector("[data-book2-links]");
    if (!(root instanceof HTMLElement)) return;
    const rewrite = () => {
      for (const anchor of root.querySelectorAll("a[href]")) {
        const href = anchor.getAttribute("href");
        const next = href ? book2Destination(href) : null;
        if (next && next !== href) anchor.setAttribute("href", next);
      }
    };
    rewrite();
    const observer = new MutationObserver(rewrite);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    return () => observer.disconnect();
  }, [pathname]);

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const next = book2Destination(anchor.getAttribute("href") ?? "");
    if (!next) return;
    event.preventDefault();
    event.stopPropagation();
    const url = new URL(next, "https://kambaz.dev");
    if (url.pathname === pathname) {
      const id = url.hash.replace(/^#/, "");
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      return;
    }
    router.push(`${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div data-book2-links="" onClickCapture={onClickCapture}>
      {children}
    </div>
  );
}
