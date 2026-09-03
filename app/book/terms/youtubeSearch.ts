/**
 * Server-side YouTube Data API v3 search for book term pages.
 *
 * Env: `YOUTUBE_API_KEY` — optional API key from Google Cloud
 * (YouTube Data API v3 enabled). When unset, callers get an empty list
 * and the term page shows a “Search on YouTube” fallback. Do not scrape
 * YouTube HTML.
 *
 * Results are cached with `fetch` (`force-cache` + 24h revalidate) so
 * repeat visits stay fast and quota-friendly.
 */

import { youtubeThumbnailUrl } from "./termSlug";

export type YouTubeVideo = {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
};

export type YouTubeSearchResult = {
  videos: YouTubeVideo[];
  /** True when YOUTUBE_API_KEY is set (search was attempted). */
  configured: boolean;
  error?: string;
};

const YOUTUBE_REVALIDATE_SECONDS = 60 * 60 * 24;
const MAX_RESULTS = 8;

type YouTubeSearchResponse = {
  error?: { message?: string };
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        medium?: { url?: string };
        high?: { url?: string };
      };
    };
  }>;
};

function getApiKey(): string | undefined {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  return key || undefined;
}

export async function searchYouTubeVideos(
  query: string,
): Promise<YouTubeSearchResult> {
  const key = getApiKey();
  if (!key) {
    return { videos: [], configured: false };
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return { videos: [], configured: true };
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(MAX_RESULTS));
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: YOUTUBE_REVALIDATE_SECONDS },
    });
    const data = (await res.json()) as YouTubeSearchResponse;
    if (!res.ok) {
      const message = data.error?.message || `YouTube search failed (${res.status})`;
      console.error("YouTube Data API error:", message);
      return { videos: [], configured: true, error: message };
    }
    const videos: YouTubeVideo[] = [];
    for (const item of data.items ?? []) {
      const id = item.id?.videoId;
      const title = item.snippet?.title?.trim();
      if (!id || !title) continue;
      videos.push({
        id,
        title,
        channel: item.snippet?.channelTitle?.trim() || "YouTube",
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          youtubeThumbnailUrl(id),
      });
    }
    return { videos, configured: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "YouTube search failed";
    console.error("YouTube Data API error:", message);
    return { videos: [], configured: true, error: message };
  }
}
