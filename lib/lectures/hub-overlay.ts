import {
  bookChapterMeta,
  bookHrefForSection,
  COURSE_SITE_ORIGIN,
  lectureTopicMeta,
} from "./catalog";
import {
  applySlugOrder,
  HUB_DRAFT_THUMB,
  HUB_DRAFT_TOPIC_ID,
  HUB_DRAFT_TOPIC_TITLE,
  type HubDraftDeckMeta,
  type SlidesHubDraft,
} from "./draft-storage";
import { lectureThumbPath } from "./types";
import type {
  LectureChapterGroup,
  LectureHubItem,
  LectureTopicGroup,
} from "./types";

export function hubItemFromDraftMeta(meta: HubDraftDeckMeta): LectureHubItem {
  const chapter = bookChapterMeta(meta.chapter);
  const topic = lectureTopicMeta(
    meta.topicId === HUB_DRAFT_TOPIC_ID ? undefined : meta.topicId,
  );
  return {
    slug: meta.slug as LectureHubItem["slug"],
    chapter: meta.chapter,
    topicId: meta.topicId === HUB_DRAFT_TOPIC_ID ? undefined : meta.topicId,
    topic: topic?.title ?? HUB_DRAFT_TOPIC_TITLE,
    bookHref: bookHrefForSection(meta.chapter),
    canvasLecture: 1,
    title: meta.title,
    summary: meta.summary,
    chapterHref: chapter.href,
    chapterTitle: chapter.title,
    publicUrl: `${COURSE_SITE_ORIGIN}/slides/${meta.slug}`,
    thumbnailSrc: meta.thumbnailSrc || HUB_DRAFT_THUMB,
  };
}

function applyTitle(
  item: LectureHubItem,
  titles: Record<string, string>,
): LectureHubItem {
  const title = titles[item.slug];
  return title ? { ...item, title } : item;
}

export function applyHubOverlay(
  chapters: LectureChapterGroup[],
  draft: SlidesHubDraft,
): LectureChapterGroup[] {
  const extras = Object.values(draft.extraDecks);
  const extraByChapter = new Map<number, LectureHubItem[]>();
  for (const meta of extras) {
    const item = applyTitle(hubItemFromDraftMeta(meta), draft.titles);
    const list = extraByChapter.get(meta.chapter) ?? [];
    list.push(item);
    extraByChapter.set(meta.chapter, list);
  }

  return chapters.map((group) => {
    const topics: LectureTopicGroup[] = group.topics.map((topic) => ({
      ...topic,
      decks: applySlugOrder(
        topic.decks.map((deck) => applyTitle(deck, draft.titles)),
        draft.order,
      ),
    }));

    const chapterExtras = extraByChapter.get(group.chapter) ?? [];
    if (chapterExtras.length > 0) {
      const existing = topics.find((topic) => topic.topicId === HUB_DRAFT_TOPIC_ID);
      const extraDecks = applySlugOrder(chapterExtras, draft.order);
      if (existing) {
        existing.decks = applySlugOrder(
          [...existing.decks, ...extraDecks],
          draft.order,
        );
      } else {
        topics.push({
          topicId: HUB_DRAFT_TOPIC_ID,
          title: HUB_DRAFT_TOPIC_TITLE,
          decks: extraDecks,
        });
      }
    }

    return { ...group, topics };
  });
}

export function flattenHubDecks(
  chapters: LectureChapterGroup[],
): LectureHubItem[] {
  return chapters.flatMap((group) =>
    group.topics.flatMap((topic) => topic.decks),
  );
}

export function overlayThumb(item: LectureHubItem): string {
  if (item.thumbnailSrc) return item.thumbnailSrc;
  try {
    return lectureThumbPath(item.slug);
  } catch {
    return HUB_DRAFT_THUMB;
  }
}
