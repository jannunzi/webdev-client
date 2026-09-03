import { isValidElement, type ReactNode } from "react";

/** Stable, URL-safe slug from a first-use term label. */
export function termSlug(term: string): string {
  const slug = term
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "term";
}

/** Flatten OfficialLink children (string, <strong>, <code>, …) to a label. */
export function childrenToText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return childrenToText(props.children);
  }
  return "";
}

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Only allow in-app book paths (no protocol-relative or external URLs). */
export function isSafeBookPath(path: string): boolean {
  if (!path.startsWith("/book")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  if (path.includes("\\")) return false;
  return true;
}

/** Accept http(s) official-site URLs only. */
export function safeHttpUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function defaultSearchQuery(term: string): string {
  return `${term.trim()} explained tutorial`;
}

export function youtubeSearchPageUrl(query: string): string {
  const params = new URLSearchParams({ search_query: query });
  return `https://www.youtube.com/results?${params.toString()}`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

export type RegisteredTerm = {
  term: string;
  officialUrl: string;
  searchQuery?: string;
};

/** In-app term URL. Query params are only added when the registry does not match. */
export function termPageHref(
  officialUrl: string,
  label: string,
  entry?: RegisteredTerm,
  extras?: { term?: string; searchQuery?: string },
): string {
  const slug = termSlug(label);
  const params = new URLSearchParams();
  if (!entry || entry.officialUrl !== officialUrl) {
    params.set("href", officialUrl);
  }
  if (extras?.term && (!entry || entry.term !== extras.term)) {
    params.set("term", extras.term);
  }
  if (extras?.searchQuery && (!entry || entry.searchQuery !== extras.searchQuery)) {
    params.set("q", extras.searchQuery);
  }
  const qs = params.toString();
  return qs ? `/book/terms/${slug}?${qs}` : `/book/terms/${slug}`;
}
