"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { createAffiliateBannerSession } from "../affiliate/banner-session";
import {
  amazonImageUrl,
  amazonProductUrl,
  chapterFromPathname,
  productAtIndex,
  productsForChapter,
} from "../affiliate/catalog";

export const ASSOCIATE_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export default function BookAffiliateBanner() {
  const pathname = usePathname();
  const chapter = chapterFromPathname(pathname);
  const products = useMemo(() => productsForChapter(chapter), [chapter]);
  const [session] = useState(() => createAffiliateBannerSession());
  const [slideOpen, setSlideOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    session.start();
    return () => session.stop();
  }, [session]);

  useEffect(() => {
    session.setReading(chapter !== null);
  }, [session, chapter]);

  const state = useSyncExternalStore(
    session.subscribe,
    session.getState,
    session.getServerSnapshot,
  );

  const shown = state.shown;
  const product = productAtIndex(products, state.productIndex);

  useEffect(() => {
    setImageFailed(false);
  }, [product.asin]);

  useEffect(() => {
    if (!shown) {
      setSlideOpen(false);
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setSlideOpen(true);
      return;
    }
    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => setSlideOpen(true));
    });
    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [shown]);

  if (!shown) return null;

  const href = amazonProductUrl(product.asin);

  return (
    <aside
      id="wd-book-affiliate-banner"
      className="book-affiliate-banner pointer-events-none fixed inset-x-0 bottom-0 z-30"
      data-open={slideOpen ? "true" : "false"}
      aria-label="Optional further reading"
    >
      <div className="pointer-events-auto border-t border-neutral-300 bg-white/95 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="relative mx-auto flex w-full max-w-4xl items-start gap-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 pe-14 md:pe-4">
          <a
            href={href}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="book-affiliate-cover shrink-0 no-underline"
            aria-hidden
            tabIndex={-1}
          >
            {imageFailed ? (
              <span className="flex h-[4.5rem] w-12 items-center justify-center rounded border border-neutral-300 bg-neutral-100 font-sans text-lg text-neutral-500">
                {product.title.slice(0, 1)}
              </span>
            ) : (
              // Amazon ASIN thumbnails 404 often; hide via onError. Book figures use img too.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={amazonImageUrl(product.asin)}
                alt=""
                width={48}
                height={72}
                className="h-[4.5rem] w-12 rounded border border-neutral-200 bg-neutral-50 object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
          </a>
          <div className="min-w-0 flex-1 font-sans">
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-500">
              Optional further reading
            </p>
            <p className="mb-0 mt-0.5 text-sm font-semibold leading-snug text-neutral-900">
              <a
                href={href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="text-neutral-900 no-underline hover:underline"
              >
                {product.title}
              </a>
            </p>
            <p className="mb-1 mt-0.5 text-xs text-neutral-600">{product.author}</p>
            <p className="mb-1 mt-0">
              <a
                href={href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="text-sm font-medium"
              >
                View on Amazon
              </a>
            </p>
            <p className="mb-0 mt-0 text-[0.7rem] leading-snug text-neutral-500">
              Not required for this course. {ASSOCIATE_DISCLOSURE}
            </p>
          </div>
          <button
            type="button"
            className="absolute end-16 top-2 rounded border border-neutral-300 bg-white p-1.5 text-neutral-700 hover:bg-neutral-50 md:static md:end-auto"
            aria-label="Dismiss recommended books"
            onClick={() => session.dismiss()}
          >
            <FaTimes aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}
