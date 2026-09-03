export const TOC_MOBILE_OPEN_KEY = "book-toc-mobile-open";
export const TOC_LAST_POSITION_KEY = "book-toc-last-position";
export const TOC_OPEN_CHAPTERS_KEY = "book-toc-open-chapters";
export const TOC_OPEN_SECTIONS_KEY = "book-toc-open-sections";

export type BookLastPosition = {
  pathname: string;
  hash: string;
};

function readLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / quota */
  }
}

function readMobileTocOpen(): boolean | null {
  const raw = readLocalStorage(TOC_MOBILE_OPEN_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function readLastPosition(): BookLastPosition | null {
  const raw = readLocalStorage(TOC_LAST_POSITION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as BookLastPosition;
    if (
      parsed &&
      typeof parsed.pathname === "string" &&
      typeof parsed.hash === "string"
    ) {
      return parsed;
    }
  } catch {
    /* ignore corrupt values */
  }
  return null;
}

export function readIdSet(key: string): Set<string> | null {
  const raw = readLocalStorage(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
      return new Set(parsed);
    }
  } catch {
    /* ignore corrupt values */
  }
  return null;
}

export function writeIdSet(key: string, ids: Set<string>) {
  writeLocalStorage(key, JSON.stringify([...ids]));
}

type Listener = () => void;

function createValueStore<T>(readClient: () => T, serverValue: T) {
  const listeners = new Set<Listener>();
  let cache: T | undefined;

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      if (cache === undefined) cache = readClient();
      return cache;
    },
    getServerSnapshot() {
      return serverValue;
    },
    set(value: T) {
      cache = value;
      listeners.forEach((listener) => listener());
    },
  };
}

const mobileOpenStore = createValueStore<boolean>(
  () => readMobileTocOpen() === true,
  false,
);

export const subscribeMobileTocOpen = mobileOpenStore.subscribe;
export const getMobileTocOpenSnapshot = mobileOpenStore.getSnapshot;
export const getMobileTocOpenServerSnapshot = mobileOpenStore.getServerSnapshot;

export function writeMobileTocOpen(open: boolean) {
  writeLocalStorage(TOC_MOBILE_OPEN_KEY, open ? "true" : "false");
  mobileOpenStore.set(open);
}

const lastPositionStore = createValueStore<BookLastPosition | null>(
  readLastPosition,
  null,
);

export const subscribeLastPosition = lastPositionStore.subscribe;
export const getLastPositionSnapshot = lastPositionStore.getSnapshot;
export const getLastPositionServerSnapshot = lastPositionStore.getServerSnapshot;

export function writeLastPosition(position: BookLastPosition) {
  const prev = lastPositionStore.getSnapshot();
  if (prev && prev.pathname === position.pathname && prev.hash === position.hash) {
    return;
  }
  writeLocalStorage(TOC_LAST_POSITION_KEY, JSON.stringify(position));
  lastPositionStore.set(position);
}
