/** YouTube video ids are 11 characters from this alphabet. */
export const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

/** Pull a video id from a watch, embed, shorts, live, or youtu.be URL. */
export function youtubeVideoIdFromUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_VIDEO_ID.test(id) ? id : null;
  }
  if (!YOUTUBE_HOSTS.has(host)) return null;
  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v");
    return id && YOUTUBE_VIDEO_ID.test(id) ? id : null;
  }
  const [kind, id] = url.pathname.split("/").filter(Boolean);
  if ((kind === "embed" || kind === "shorts" || kind === "live") && id) {
    return YOUTUBE_VIDEO_ID.test(id) ? id : null;
  }
  return null;
}

export function formatClipClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  const paddedMinutes =
    hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const paddedSeconds = String(remainder).padStart(2, "0");
  return hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;
}

/** Integer seconds for YouTube `start` / `end` / `t`. */
export function youtubeClipWindow(
  startSec: number,
  endSec: number,
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(startSec));
  let end = Math.ceil(endSec);
  if (end <= start) end = start + 1;
  return { start, end };
}

/** Embed starts at `start` and stops at `end`. Host is the privacy-enhanced player. */
export function youtubeEmbedUrl(
  videoId: string,
  startSec: number,
  endSec: number,
): string {
  const { start, end } = youtubeClipWindow(startSec, endSec);
  const params = new URLSearchParams({
    start: String(start),
    end: String(end),
    rel: "0",
  });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}

/**
 * Watch URL deep-link. `start` is seconds; `t` is the same offset in YouTube's
 * share-link form (`90s`). Either one opens the video at the clip start.
 */
export function youtubeWatchUrl(videoId: string, startSec: number): string {
  const { start } = youtubeClipWindow(startSec, startSec + 1);
  const params = new URLSearchParams({
    v: videoId,
    start: String(start),
    t: `${start}s`,
  });
  return `https://www.youtube.com/watch?${params.toString()}`;
}

/** Whole-lecture watch URL. No `start` and no `t`, so playback begins at 0. */
export function youtubeLectureUrl(videoId: string): string {
  const params = new URLSearchParams({ v: videoId });
  return `https://www.youtube.com/watch?${params.toString()}`;
}

export function isYoutubeHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./, "");
  return host === "youtu.be" || YOUTUBE_HOSTS.has(host);
}
