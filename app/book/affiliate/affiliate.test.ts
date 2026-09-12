import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AFFILIATE_BOOKS,
  CHAPTER_BESTSELLERS,
  DEFAULT_ASSOCIATE_TAG,
  FALLBACK_BESTSELLERS,
  amazonAssociateTag,
  amazonProductUrl,
  chapterFromPathname,
  isBookChapterPath,
  productAtIndex,
  productsForChapter,
} from "./catalog.ts";
import {
  DISMISS_STORAGE_KEY,
  ROTATE_INTERVAL_MS,
  SHOW_DELAY_MS,
  createAffiliateBannerSession,
  type BannerStorage,
} from "./banner-session.ts";

class FakeClock {
  nowMs = 0;
  private nextId = 1;
  private timers = new Map<number, { when: number; fn: () => void }>();

  now = () => this.nowMs;

  setTimeout = (fn: () => void, ms: number) => {
    const id = this.nextId++;
    this.timers.set(id, { when: this.nowMs + ms, fn });
    return id as unknown as ReturnType<typeof setTimeout>;
  };

  clearTimeout = (id: ReturnType<typeof setTimeout>) => {
    this.timers.delete(Number(id));
  };

  tick(ms: number) {
    const target = this.nowMs + ms;
    while (true) {
      let next: { id: number; when: number; fn: () => void } | null = null;
      for (const [id, timer] of this.timers) {
        if (timer.when <= target && (!next || timer.when < next.when)) {
          next = { id, when: timer.when, fn: timer.fn };
        }
      }
      if (!next) {
        this.nowMs = target;
        return;
      }
      this.nowMs = next.when;
      this.timers.delete(next.id);
      next.fn();
    }
  }
}

function memoryStorage(initial: Record<string, string> = {}): BannerStorage & {
  data: Map<string, string>;
} {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

function fakeVisibility(initial = true) {
  let visible = initial;
  const listeners = new Set<() => void>();
  return {
    isVisible: () => visible,
    subscribeVisibility: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setVisible(next: boolean) {
      visible = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function sessionWithClock(
  clock: FakeClock,
  extras: {
    storage?: BannerStorage;
    visibility?: ReturnType<typeof fakeVisibility>;
  } = {},
) {
  const visibility = extras.visibility ?? fakeVisibility(true);
  return createAffiliateBannerSession({
    now: clock.now,
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
    storage: extras.storage ?? memoryStorage(),
    isVisible: visibility.isVisible,
    subscribeVisibility: visibility.subscribeVisibility,
  });
}

describe("Amazon associate links", () => {
  it("uses the Associates tag on /dp/{ASIN} URLs", () => {
    assert.equal(
      amazonProductUrl("1492051721", "jannunzi04-20"),
      "https://www.amazon.com/dp/1492051721?tag=jannunzi04-20",
    );
    assert.equal(amazonAssociateTag(""), DEFAULT_ASSOCIATE_TAG);
    assert.equal(amazonAssociateTag("   "), DEFAULT_ASSOCIATE_TAG);
    assert.equal(amazonAssociateTag(undefined), DEFAULT_ASSOCIATE_TAG);
    assert.equal(amazonAssociateTag("custom-tag-20"), "custom-tag-20");
    assert.equal(
      amazonProductUrl(AFFILIATE_BOOKS.mongoGuide.asin),
      `https://www.amazon.com/dp/${AFFILIATE_BOOKS.mongoGuide.asin}?tag=${DEFAULT_ASSOCIATE_TAG}`,
    );
  });

  it("tags every curated bestseller with the default associate id", () => {
    for (const book of Object.values(AFFILIATE_BOOKS)) {
      assert.match(book.asin, /^[A-Z0-9]{10}$/);
      assert.equal(
        amazonProductUrl(book.asin),
        `https://www.amazon.com/dp/${book.asin}?tag=${DEFAULT_ASSOCIATE_TAG}`,
      );
    }
    assert.equal(FALLBACK_BESTSELLERS.length >= 6, true);
    assert.equal(FALLBACK_BESTSELLERS.length <= 10, true);
  });
});

describe("chapter topic mapping", () => {
  it("only treats book chapter routes as reading pages", () => {
    assert.equal(chapterFromPathname("/book/ch1"), 1);
    assert.equal(chapterFromPathname("/book/ch6/"), 6);
    assert.equal(chapterFromPathname("/book/ch3"), 3);
    assert.equal(isBookChapterPath("/book/ch2"), true);
    assert.equal(chapterFromPathname("/book"), null);
    assert.equal(chapterFromPathname("/book/practice"), null);
    assert.equal(chapterFromPathname("/book/practice/ch1-lab"), null);
    assert.equal(chapterFromPathname("/book/terms/react"), null);
    assert.equal(chapterFromPathname("/quizzes/take/q1"), null);
    assert.equal(chapterFromPathname("/assignments"), null);
    assert.equal(chapterFromPathname("/syllabus"), null);
    assert.equal(chapterFromPathname("/sign-in"), null);
    assert.equal(chapterFromPathname("/Account/Signin"), null);
    assert.equal(chapterFromPathname("/dashboard"), null);
    assert.equal(chapterFromPathname("/courses/1234/Home"), null);
  });

  it("maps chapters to stack-relevant bestsellers and falls back otherwise", () => {
    assert.equal(productsForChapter(1)[0]?.asin, AFFILIATE_BOOKS.duckettHtml.asin);
    assert.ok(productsForChapter(1).some((book) => book.asin === AFFILIATE_BOOKS.realWorldNext.asin));
    assert.equal(productsForChapter(2)[0]?.asin, AFFILIATE_BOOKS.duckettHtml.asin);
    assert.ok(productsForChapter(2).some((book) => book.asin === AFFILIATE_BOOKS.cssGuide.asin));
    assert.equal(productsForChapter(3)[0]?.asin, AFFILIATE_BOOKS.eloquentJs.asin);
    assert.equal(productsForChapter(4)[0]?.asin, AFFILIATE_BOOKS.learningReact.asin);
    assert.equal(productsForChapter(5)[0]?.asin, AFFILIATE_BOOKS.nodeExpress.asin);
    assert.equal(productsForChapter(6)[0]?.asin, AFFILIATE_BOOKS.mongoGuide.asin);
    assert.equal(productsForChapter(null), FALLBACK_BESTSELLERS);
    assert.equal(productsForChapter(99), FALLBACK_BESTSELLERS);
    assert.equal(productAtIndex(productsForChapter(4), 3).asin, AFFILIATE_BOOKS.learningReact.asin);
    assert.deepEqual(
      Object.keys(CHAPTER_BESTSELLERS).map(Number),
      [1, 2, 3, 4, 5, 6],
    );
  });
});

describe("affiliate banner session", () => {
  it("appears only after 45s of visible reading time", () => {
    const clock = new FakeClock();
    const session = sessionWithClock(clock);
    session.start();
    session.setReading(true);

    clock.tick(SHOW_DELAY_MS - 1);
    assert.equal(session.getState().shown, false);

    clock.tick(1);
    assert.equal(session.getState().shown, true);
    assert.equal(session.getState().productIndex, 0);
  });

  it("does not count time while the tab is hidden", () => {
    const clock = new FakeClock();
    const visibility = fakeVisibility(true);
    const session = sessionWithClock(clock, { visibility });
    session.start();
    session.setReading(true);

    clock.tick(20_000);
    assert.equal(session.getState().shown, false);

    visibility.setVisible(false);
    clock.tick(40_000);
    assert.equal(session.getState().shown, false);

    visibility.setVisible(true);
    clock.tick(24_999);
    assert.equal(session.getState().shown, false);
    clock.tick(1);
    assert.equal(session.getState().shown, true);
  });

  it("keeps accumulated visible time if visibility syncs while still visible", () => {
    const clock = new FakeClock();
    const visibility = fakeVisibility(true);
    const session = sessionWithClock(clock, { visibility });
    session.start();
    session.setReading(true);
    clock.tick(20_000);
    visibility.setVisible(true);
    clock.tick(25_000);
    assert.equal(session.getState().shown, true);
  });

  it("pauses the delay while the reader leaves chapter pages", () => {
    const clock = new FakeClock();
    const session = sessionWithClock(clock);
    session.start();
    session.setReading(true);
    clock.tick(20_000);
    session.setReading(false);
    clock.tick(40_000);
    assert.equal(session.getState().shown, false);
    session.setReading(true);
    clock.tick(24_999);
    assert.equal(session.getState().shown, false);
    clock.tick(1);
    assert.equal(session.getState().shown, true);
  });

  it("rotates the product index every 30 seconds while visible", () => {
    const clock = new FakeClock();
    const visibility = fakeVisibility(true);
    const session = sessionWithClock(clock, { visibility });
    session.start();
    session.setReading(true);
    clock.tick(SHOW_DELAY_MS);
    assert.equal(session.getState().productIndex, 0);

    clock.tick(ROTATE_INTERVAL_MS - 1);
    assert.equal(session.getState().productIndex, 0);
    clock.tick(1);
    assert.equal(session.getState().productIndex, 1);
    clock.tick(ROTATE_INTERVAL_MS);
    assert.equal(session.getState().productIndex, 2);

    visibility.setVisible(false);
    clock.tick(ROTATE_INTERVAL_MS);
    assert.equal(session.getState().productIndex, 2);
    visibility.setVisible(true);
    clock.tick(ROTATE_INTERVAL_MS);
    assert.equal(session.getState().productIndex, 3);
  });

  it("remembers a dismiss for the session and does not re-show", () => {
    const clock = new FakeClock();
    const storage = memoryStorage();
    const session = sessionWithClock(clock, { storage });
    session.start();
    session.setReading(true);
    clock.tick(SHOW_DELAY_MS);
    assert.equal(session.getState().shown, true);

    session.dismiss();
    assert.equal(session.getState().shown, false);
    assert.equal(session.getState().dismissed, true);
    assert.equal(storage.getItem(DISMISS_STORAGE_KEY), "1");

    clock.tick(SHOW_DELAY_MS + ROTATE_INTERVAL_MS);
    assert.equal(session.getState().shown, false);

    session.setReading(false);
    session.setReading(true);
    clock.tick(SHOW_DELAY_MS);
    assert.equal(session.getState().shown, false);

    const laterClock = new FakeClock();
    const restored = sessionWithClock(laterClock, { storage });
    restored.start();
    restored.setReading(true);
    laterClock.tick(SHOW_DELAY_MS * 2);
    assert.equal(restored.getState().shown, false);
    assert.equal(restored.getState().dismissed, true);
  });
});
