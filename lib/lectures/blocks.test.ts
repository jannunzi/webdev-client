import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createBulletsBlock,
  createCodeBlock,
  createComponentBlock,
  createStarterDeckSlides,
  deckUsesBlockModel,
  isBlockSlide,
  moveItem,
  toBlockSlide,
  toBlockSlides,
} from "./blocks";
import { isSlideComponentId, listSlideComponentOptions } from "./component-registry";
import {
  applySlugOrder,
  emptyHubDraft,
  parseDeckDraft,
  readDeckDraft,
  readHubDraft,
  slugifyDeckTitle,
  uniqueDraftSlug,
  writeDeckDraft,
  writeHubDraft,
  type SlidesStorage,
} from "./draft-storage";
import { applyHubOverlay } from "./hub-overlay";
import { htmlToSlideText, lectureEditHref, lectureSearchIsEdit } from "./slide-markup";
import { listChapterTopicGroups } from "./catalog";
import type { LectureSlide } from "./types";

function memoryStorage(seed: Record<string, string> = {}): SlidesStorage {
  const map = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key, value) {
      map.set(key, value);
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

describe("slide block model", () => {
  it("adapts a legacy lecture slide into bullets, code, and component blocks", () => {
    const slide: LectureSlide = {
      id: "demo",
      title: "Hello",
      bullets: ["**Bold** cue"],
      code: "console.log(1)",
      codeLanguage: "js",
      embed: "html-skeleton",
    };
    const block = toBlockSlide(slide);
    assert.equal(isBlockSlide(block), true);
    assert.equal(block.blocks[0]?.type, "bullets");
    assert.equal(block.blocks[1]?.type, "code");
    assert.equal(block.blocks[2]?.type, "component");
    if (block.blocks[2]?.type === "component") {
      assert.equal(block.blocks[2].componentId, "html-skeleton");
    }
  });

  it("leaves already-block slides unchanged and starter decks on the block model", () => {
    const starter = createStarterDeckSlides("My Draft");
    assert.equal(deckUsesBlockModel(starter), true);
    assert.deepEqual(toBlockSlides(starter), starter);
  });

  it("reorders blocks with up/down and rejects arbitrary component ids", () => {
    const items = ["a", "b", "c"];
    assert.deepEqual(moveItem(items, 1, -1), ["b", "a", "c"]);
    assert.deepEqual(moveItem(items, 0, -1), items);
    assert.equal(isSlideComponentId("ch1-home"), true);
    assert.equal(isSlideComponentId("EvilWidget"), false);
    assert.ok(listSlideComponentOptions().some((row) => row.id === "ch1-dashboard"));
    assert.ok(createCodeBlock({ language: "bash" }).type === "code");
    assert.ok(createBulletsBlock().items.length > 0);
    assert.ok(createComponentBlock().componentId);
  });
});

describe("slide drafts and hub overlay", () => {
  it("round-trips a deck draft and rejects unknown component ids", () => {
    const storage = memoryStorage();
    writeDeckDraft(storage, {
      version: 1,
      slug: "my-draft",
      title: "My draft",
      slides: createStarterDeckSlides("My draft"),
    });
    const draft = readDeckDraft(storage, "my-draft");
    assert.ok(draft);
    assert.equal(draft.title, "My draft");
    assert.equal(parseDeckDraft({ version: 1, slug: "x", title: "X", slides: [] }), null);
  });

  it("slugifies titles and applies hub order plus extra draft decks", () => {
    assert.equal(slugifyDeckTitle("Hello World!"), "hello-world");
    assert.equal(uniqueDraftSlug("intro-to-web-development", new Set(["intro-to-web-development"])), "intro-to-web-development-2");
    const authored = listChapterTopicGroups();
    const hub = emptyHubDraft();
    hub.titles["installing-nodejs"] = "Node install (draft title)";
    hub.order = ["creating-a-nextjs-react-application", "installing-nodejs"];
    hub.extraDecks["office-hours"] = {
      slug: "office-hours",
      title: "Office hours",
      summary: "Draft",
      chapter: 1,
      topicId: "draft",
      thumbnailSrc: "/lectures/thumbs/draft.svg",
      createdAt: "2026-09-11T00:00:00.000Z",
    };
    const overlaid = applyHubOverlay(authored, hub);
    const ch1 = overlaid.find((group) => group.chapter === 1);
    assert.ok(ch1);
    const setup = ch1.topics.find((topic) => topic.topicId === "setup");
    assert.ok(setup);
    assert.equal(setup.decks[0]?.slug, "creating-a-nextjs-react-application");
    assert.equal(
      setup.decks.find((deck) => deck.slug === "installing-nodejs")?.title,
      "Node install (draft title)",
    );
    const drafts = ch1.topics.find((topic) => topic.topicId === "draft");
    assert.ok(drafts);
    assert.equal(
      drafts.decks.some((deck) => String(deck.slug) === "office-hours"),
      true,
    );
    assert.deepEqual(
      applySlugOrder([{ slug: "b" }, { slug: "a" }], ["a", "b"]).map((row) => row.slug),
      ["a", "b"],
    );
  });

  it("writes hub drafts to the injected storage", () => {
    const storage = memoryStorage();
    writeHubDraft(storage, {
      version: 1,
      order: ["a"],
      titles: { a: "A" },
      extraDecks: {},
    });
    assert.deepEqual(readHubDraft(storage).order, ["a"]);
  });
});

describe("slide markup and edit query", () => {
  it("serializes bold HTML back to teaching-cue markdown", () => {
    assert.equal(htmlToSlideText("<strong>CLIENTS</strong> — React"), "**CLIENTS** — React");
    assert.equal(lectureSearchIsEdit("?edit=1"), true);
    assert.equal(lectureSearchIsEdit("?fullscreen=1"), false);
    assert.equal(
      lectureEditHref({
        href: "https://webdev-client.vercel.app/slides/installing-nodejs#slide-2",
        edit: true,
      }),
      "/slides/installing-nodejs?edit=1#slide-2",
    );
  });
});
