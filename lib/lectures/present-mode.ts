/** History.state flag so browser Back exits CSS present mode, not the deck. */
export const LECTURE_PRESENT_STATE = { lecturePresent: true } as const;

export const SWIPE_MIN_PX = 50;

type FullscreenDocument = {
  fullscreenElement?: Element | null;
  webkitFullscreenElement?: Element | null;
  fullscreenEnabled?: boolean;
  webkitFullscreenEnabled?: boolean;
  exitFullscreen?: () => Promise<void>;
  webkitExitFullscreen?: () => void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

export function nativeFullscreenEnabled(doc: FullscreenDocument): boolean {
  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

export function nativeFullscreenElement(doc: FullscreenDocument): Element | null {
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export function lectureSearchIsPresent(search: string): boolean {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get(
    "fullscreen",
  ) === "1";
}

export function lecturePresentHref({
  href,
  slideNumber,
  present,
}: {
  href: string;
  slideNumber: number;
  present?: boolean;
}): string {
  const url = new URL(href);
  if (present === true) url.searchParams.set("fullscreen", "1");
  if (present === false) url.searchParams.delete("fullscreen");
  url.hash = `slide-${slideNumber}`;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function isLecturePresentHistoryState(state: unknown): boolean {
  return Boolean(
    state &&
      typeof state === "object" &&
      (state as { lecturePresent?: unknown }).lecturePresent === true,
  );
}

/**
 * Horizontal swipe → slide delta. Left is next (+1), right is previous (−1).
 * Vertical-dominant moves return 0 so overflow scrolling still works.
 */
export function swipeSlideDelta(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  minPx = SWIPE_MIN_PX,
): -1 | 0 | 1 {
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dx) < minPx) return 0;
  if (Math.abs(dx) <= Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}

export function swipeTargetIsInteractive(target: EventTarget | null): boolean {
  if (!target || typeof Element === "undefined") return false;
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest("a, button, input, textarea, select, [contenteditable='true']"),
  );
}

export async function requestNativeFullscreen(
  el: HTMLElement,
  doc: FullscreenDocument = document,
): Promise<boolean> {
  const node = el as FullscreenElement;
  try {
    if (node.requestFullscreen) {
      await node.requestFullscreen();
    } else if (node.webkitRequestFullscreen) {
      node.webkitRequestFullscreen();
    } else {
      return false;
    }
  } catch {
    return false;
  }
  if (nativeFullscreenElement(doc) === el) return true;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  return nativeFullscreenElement(doc) === el;
}

export async function exitNativeFullscreen(
  doc: FullscreenDocument = document,
): Promise<void> {
  if (doc.exitFullscreen && doc.fullscreenElement) {
    await doc.exitFullscreen();
    return;
  }
  if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
}
