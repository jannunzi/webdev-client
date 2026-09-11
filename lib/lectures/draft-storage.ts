import {
  isBlockSlide,
  stripBlockHtml,
  type BlockSlide,
} from "./blocks";
import { isSlideComponentId } from "./component-registry";
import type { LectureTopicId } from "./types";

export const SLIDES_DECK_DRAFT_PREFIX = "webdev.slides.deck.";
export const SLIDES_HUB_DRAFT_KEY = "webdev.slides.hub.v1";

/** Overlay-only topic. New decks land here (Ch1), not a book TOC section. */
export const HUB_DRAFT_TOPIC_ID = "draft" as const;
export const HUB_DRAFT_TOPIC_TITLE = "Draft decks";
export const HUB_DRAFT_THUMB = "/lectures/thumbs/draft.svg";

export type HubDraftDeckMeta = {
  slug: string;
  title: string;
  summary: string;
  chapter: number;
  topicId: typeof HUB_DRAFT_TOPIC_ID | LectureTopicId;
  thumbnailSrc: string;
  createdAt: string;
};

export type SlidesHubDraft = {
  version: 1;
  order: string[];
  titles: Record<string, string>;
  extraDecks: Record<string, HubDraftDeckMeta>;
};

export type SlidesDeckDraft = {
  version: 1;
  slug: string;
  title: string;
  slides: BlockSlide[];
};

export type SlidesStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function deckDraftKey(slug: string): string {
  return `${SLIDES_DECK_DRAFT_PREFIX}${slug}`;
}

export function emptyHubDraft(): SlidesHubDraft {
  return { version: 1, order: [], titles: {}, extraDecks: {} };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseHubDraft(raw: unknown): SlidesHubDraft | null {
  const row = asRecord(raw);
  if (!row || row.version !== 1) return null;
  const order = Array.isArray(row.order)
    ? row.order.filter((slug): slug is string => typeof slug === "string")
    : [];
  const titles: Record<string, string> = {};
  const titleRow = asRecord(row.titles);
  if (titleRow) {
    for (const [slug, title] of Object.entries(titleRow)) {
      if (typeof title === "string" && title.trim()) titles[slug] = title;
    }
  }
  const extraDecks: Record<string, HubDraftDeckMeta> = {};
  const extra = asRecord(row.extraDecks);
  if (extra) {
    for (const [slug, meta] of Object.entries(extra)) {
      const parsed = parseHubDeckMeta(slug, meta);
      if (parsed) extraDecks[slug] = parsed;
    }
  }
  return { version: 1, order, titles, extraDecks };
}

function parseHubDeckMeta(
  slug: string,
  raw: unknown,
): HubDraftDeckMeta | null {
  const row = asRecord(raw);
  if (!row) return null;
  if (typeof row.title !== "string" || !row.title.trim()) return null;
  const chapter = typeof row.chapter === "number" ? row.chapter : 1;
  return {
    slug,
    title: row.title.trim(),
    summary:
      typeof row.summary === "string" && row.summary.trim()
        ? row.summary
        : "Instructor draft deck (this browser only).",
    chapter,
    topicId: HUB_DRAFT_TOPIC_ID,
    thumbnailSrc:
      typeof row.thumbnailSrc === "string" && row.thumbnailSrc.startsWith("/")
        ? row.thumbnailSrc
        : HUB_DRAFT_THUMB,
    createdAt:
      typeof row.createdAt === "string" ? row.createdAt : new Date(0).toISOString(),
  };
}

function parseBlock(raw: unknown): BlockSlide["blocks"][number] | null {
  const row = asRecord(raw);
  if (!row || typeof row.id !== "string" || typeof row.type !== "string") {
    return null;
  }
  if (row.type === "bullets") {
    const items = Array.isArray(row.items)
      ? row.items.filter((item): item is string => typeof item === "string")
      : [];
    return {
      id: row.id,
      type: "bullets",
      title: typeof row.title === "string" ? row.title : undefined,
      items,
      fontSize:
        row.fontSize === "sm" ||
        row.fontSize === "md" ||
        row.fontSize === "lg" ||
        row.fontSize === "xl"
          ? row.fontSize
          : undefined,
    };
  }
  if (row.type === "code") {
    if (typeof row.code !== "string") return null;
    return {
      id: row.id,
      type: "code",
      code: row.code,
      language: typeof row.language === "string" ? row.language : undefined,
      file: typeof row.file === "string" ? row.file : undefined,
      fontSize:
        row.fontSize === "sm" ||
        row.fontSize === "md" ||
        row.fontSize === "lg" ||
        row.fontSize === "xl"
          ? row.fontSize
          : undefined,
      size:
        row.size === "sm" || row.size === "md" || row.size === "lg"
          ? row.size
          : undefined,
    };
  }
  if (row.type === "component") {
    if (typeof row.componentId !== "string" || !isSlideComponentId(row.componentId)) {
      return null;
    }
    return {
      id: row.id,
      type: "component",
      componentId: row.componentId,
      size:
        row.size === "sm" || row.size === "md" || row.size === "lg"
          ? row.size
          : undefined,
    };
  }
  return null;
}

function parseBlockSlide(raw: unknown): BlockSlide | null {
  const row = asRecord(raw);
  if (!row || typeof row.id !== "string" || typeof row.title !== "string") {
    return null;
  }
  if (!Array.isArray(row.blocks)) return null;
  const blocks = row.blocks
    .map(parseBlock)
    .filter((block): block is BlockSlide["blocks"][number] => Boolean(block));
  const kind =
    row.kind === "title" ||
    row.kind === "content" ||
    row.kind === "demo" ||
    row.kind === "break"
      ? row.kind
      : undefined;
  return {
    id: row.id,
    title: row.title,
    kind,
    blocks,
    interactiveHint:
      typeof row.interactiveHint === "string" ? row.interactiveHint : undefined,
    diagram: typeof row.diagram === "string" ? (row.diagram as BlockSlide["diagram"]) : undefined,
    imageSrc: typeof row.imageSrc === "string" ? row.imageSrc : undefined,
    imageAlt: typeof row.imageAlt === "string" ? row.imageAlt : undefined,
    density: row.density === "dense" || row.density === "spacious" ? row.density : undefined,
  };
}

export function parseDeckDraft(raw: unknown): SlidesDeckDraft | null {
  const row = asRecord(raw);
  if (!row || row.version !== 1) return null;
  if (typeof row.slug !== "string" || typeof row.title !== "string") return null;
  if (!Array.isArray(row.slides)) return null;
  const slides = row.slides
    .map(parseBlockSlide)
    .filter((slide): slide is BlockSlide => Boolean(slide));
  if (slides.length === 0) return null;
  return {
    version: 1,
    slug: row.slug,
    title: row.title,
    slides,
  };
}

export function readHubDraft(storage: SlidesStorage): SlidesHubDraft {
  try {
    const raw = storage.getItem(SLIDES_HUB_DRAFT_KEY);
    if (!raw) return emptyHubDraft();
    return parseHubDraft(JSON.parse(raw)) ?? emptyHubDraft();
  } catch {
    return emptyHubDraft();
  }
}

export function writeHubDraft(storage: SlidesStorage, draft: SlidesHubDraft): void {
  storage.setItem(SLIDES_HUB_DRAFT_KEY, JSON.stringify(draft));
}

export function clearHubDraft(storage: SlidesStorage): void {
  storage.removeItem(SLIDES_HUB_DRAFT_KEY);
}

export function readDeckDraft(
  storage: SlidesStorage,
  slug: string,
): SlidesDeckDraft | null {
  try {
    const raw = storage.getItem(deckDraftKey(slug));
    if (!raw) return null;
    const parsed = parseDeckDraft(JSON.parse(raw));
    if (!parsed || parsed.slug !== slug) return null;
    if (!parsed.slides.every(isBlockSlide)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDeckDraft(
  storage: SlidesStorage,
  draft: SlidesDeckDraft,
): void {
  const payload: SlidesDeckDraft = {
    ...draft,
    slides: stripBlockHtml(draft.slides),
  };
  storage.setItem(deckDraftKey(draft.slug), JSON.stringify(payload));
}

export function clearDeckDraft(storage: SlidesStorage, slug: string): void {
  storage.removeItem(deckDraftKey(slug));
}

export function slugifyDeckTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "untitled-deck";
}

export function uniqueDraftSlug(
  base: string,
  taken: Set<string>,
): string {
  if (!taken.has(base)) return base;
  for (let n = 2; n < 1000; n += 1) {
    const next = `${base}-${n}`;
    if (!taken.has(next)) return next;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export function applySlugOrder<T extends { slug: string }>(
  items: T[],
  order: string[],
): T[] {
  if (order.length === 0) return items;
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort((a, b) => {
    const ai = rank.has(a.slug) ? rank.get(a.slug)! : 10_000;
    const bi = rank.has(b.slug) ? rank.get(b.slug)! : 10_000;
    if (ai !== bi) return ai - bi;
    return 0;
  });
}

export function browserSlidesStorage(): SlidesStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
