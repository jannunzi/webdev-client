export const SHOW_DELAY_MS = 45_000;
export const ROTATE_INTERVAL_MS = 30_000;
export const DISMISS_STORAGE_KEY = "book-affiliate-banner-dismissed";

export type AffiliateBannerState = {
  shown: boolean;
  productIndex: number;
  dismissed: boolean;
};

export type BannerStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type BannerSessionOptions = {
  delayMs?: number;
  rotateMs?: number;
  storageKey?: string;
  now?: () => number;
  setTimeout?: (fn: () => void, ms: number) => ReturnType<typeof globalThis.setTimeout>;
  clearTimeout?: (id: ReturnType<typeof globalThis.setTimeout>) => void;
  isVisible?: () => boolean;
  subscribeVisibility?: (listener: () => void) => () => void;
  storage?: BannerStorage;
};

const HIDDEN_SERVER_STATE: AffiliateBannerState = {
  shown: false,
  productIndex: 0,
  dismissed: false,
};

function defaultIsVisible(): boolean {
  return typeof document === "undefined" || document.visibilityState !== "hidden";
}

function defaultSubscribeVisibility(listener: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

function defaultStorage(): BannerStorage {
  return {
    getItem(key) {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        /* private mode / quota */
      }
    },
  };
}

function isDismissedFlag(value: string | null): boolean {
  return value === "1" || value === "true";
}

export function createAffiliateBannerSession(options: BannerSessionOptions = {}) {
  const delayMs = options.delayMs ?? SHOW_DELAY_MS;
  const rotateMs = options.rotateMs ?? ROTATE_INTERVAL_MS;
  const storageKey = options.storageKey ?? DISMISS_STORAGE_KEY;
  const now = options.now ?? Date.now;
  const schedule = options.setTimeout ?? setTimeout;
  const cancel = options.clearTimeout ?? clearTimeout;
  const isVisible = options.isVisible ?? defaultIsVisible;
  const subscribeVisibility =
    options.subscribeVisibility ?? defaultSubscribeVisibility;
  const storage = options.storage ?? defaultStorage();

  const listeners = new Set<() => void>();
  let started = false;
  let reading = false;
  let unlocked = false;
  let dismissed = isDismissedFlag(storage.getItem(storageKey));
  let snapshot: AffiliateBannerState = {
    shown: false,
    productIndex: 0,
    dismissed,
  };
  let productIndex = 0;
  let accumulatedVisibleMs = 0;
  let visibleStartedAt: number | null = null;
  let showTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let rotateTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let unsubscribeVisibility: (() => void) | null = null;

  function publish() {
    snapshot = {
      shown: unlocked && !dismissed && reading,
      productIndex,
      dismissed,
    };
    listeners.forEach((listener) => listener());
  }

  function clearTimers() {
    if (showTimer != null) {
      cancel(showTimer);
      showTimer = null;
    }
    if (rotateTimer != null) {
      cancel(rotateTimer);
      rotateTimer = null;
    }
  }

  function pauseVisibleClock() {
    if (visibleStartedAt == null) return;
    accumulatedVisibleMs += Math.max(0, now() - visibleStartedAt);
    visibleStartedAt = null;
  }

  function unlock() {
    showTimer = null;
    visibleStartedAt = null;
    accumulatedVisibleMs = delayMs;
    unlocked = true;
    publish();
    syncTimers();
  }

  function rotate() {
    rotateTimer = null;
    productIndex += 1;
    publish();
    syncTimers();
  }

  function countingVisibleTime(): boolean {
    return started && reading && !dismissed && !unlocked && isVisible();
  }

  function rotating(): boolean {
    return started && reading && !dismissed && unlocked && isVisible();
  }

  function syncTimers() {
    clearTimers();
    pauseVisibleClock();
    if (!started || dismissed) {
      return;
    }

    if (unlocked) {
      if (rotating()) {
        rotateTimer = schedule(rotate, rotateMs);
      }
      return;
    }

    if (countingVisibleTime()) {
      visibleStartedAt = now();
      const remaining = Math.max(0, delayMs - accumulatedVisibleMs);
      showTimer = schedule(unlock, remaining);
    }
  }

  function start() {
    if (started) return;
    started = true;
    unsubscribeVisibility = subscribeVisibility(() => {
      syncTimers();
    });
    syncTimers();
  }

  function stop() {
    if (!started) return;
    started = false;
    unsubscribeVisibility?.();
    unsubscribeVisibility = null;
    clearTimers();
    pauseVisibleClock();
  }

  return {
    getState(): AffiliateBannerState {
      return snapshot;
    },
    getServerSnapshot(): AffiliateBannerState {
      return HIDDEN_SERVER_STATE;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    start,
    stop,
    setReading(active: boolean) {
      if (reading === active) return;
      reading = active;
      publish();
      syncTimers();
    },
    dismiss() {
      if (dismissed) return;
      dismissed = true;
      unlocked = false;
      storage.setItem(storageKey, "1");
      publish();
      syncTimers();
    },
  };
}

export type AffiliateBannerSession = ReturnType<typeof createAffiliateBannerSession>;
