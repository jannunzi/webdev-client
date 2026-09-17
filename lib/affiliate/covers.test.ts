import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OPEN_LIBRARY_COVER_BY_ASIN,
  affiliateCoverSources,
  amazonImageUrl,
  amazonRetailCoverUrl,
  isUsableAmazonCover,
  openLibraryIsbnCoverUrl,
} from "./covers.ts";

describe("affiliate covers", () => {
  it("builds Associates widget URLs and rejects 1×1 spacers", () => {
    const cover = amazonImageUrl("1492051721", "jannunzi04-20");
    assert.match(cover, /ASIN=1492051721/);
    assert.match(cover, /tag=jannunzi04-20/);
    assert.equal(isUsableAmazonCover(1, 1), false);
    assert.equal(isUsableAmazonCover(160, 240), true);
  });

  it("uses Open Library ISBN and curated IDs for listed titles", () => {
    assert.equal(
      openLibraryIsbnCoverUrl("1492051721"),
      "https://covers.openlibrary.org/b/isbn/1492051721-M.jpg",
    );
    assert.match(OPEN_LIBRARY_COVER_BY_ASIN["1801074970"], /covers\.openlibrary\.org/);
    const sources = affiliateCoverSources({
      asin: "1801074970",
      coverUrl: "https://covers.openlibrary.org/b/id/13166260-M.jpg",
    });
    assert.equal(sources[0], "https://covers.openlibrary.org/b/id/13166260-M.jpg");
    assert.ok(sources.some((url) => url.includes("amazon-adsystem.com")));
    assert.equal(
      amazonRetailCoverUrl("1118008189"),
      "https://images-na.ssl-images-amazon.com/images/P/1118008189.01.LZZZZZZZ.jpg",
    );
    assert.equal(sources.length, new Set(sources).size);
  });
});
