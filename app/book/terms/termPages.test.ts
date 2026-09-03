import assert from "node:assert/strict";
import { createElement } from "react";
import { describe, it } from "node:test";
import {
  childrenToText,
  defaultSearchQuery,
  isSafeBookPath,
  safeHttpUrl,
  termSlug,
  titleFromSlug,
  youtubeEmbedUrl,
  youtubeSearchPageUrl,
  termPageHref,
  youtubeWatchUrl,
} from "./termSlug.ts";

describe("termSlug", () => {
  it("builds stable URL-safe slugs from labels", () => {
    assert.equal(termSlug("React"), "react");
    assert.equal(termSlug("Next.js"), "next-js");
    assert.equal(termSlug("TCP/IP"), "tcp-ip");
    assert.equal(termSlug("World Wide Web"), "world-wide-web");
    assert.equal(termSlug("NEXT_PUBLIC_"), "next-public");
    assert.equal(termSlug("git"), "git");
    assert.equal(
      termSlug("Integrated Development Environment (IDE)"),
      "integrated-development-environment-ide",
    );
  });

  it("falls back when the label has no URL-safe characters", () => {
    assert.equal(termSlug("***"), "term");
    assert.equal(termSlug("   "), "term");
  });
});

describe("childrenToText", () => {
  it("reads plain text and nested markup used in OfficialLink", () => {
    assert.equal(childrenToText("TCP/IP"), "TCP/IP");
    assert.equal(childrenToText(createElement("strong", null, "Internet")), "Internet");
    assert.equal(childrenToText(createElement("code", null, "git")), "git");
    assert.equal(
      childrenToText([
        createElement("strong", { key: "a" }, "World"),
        " ",
        "Wide Web",
      ]),
      "World Wide Web",
    );
  });
});

describe("defaultSearchQuery", () => {
  it("adds a light tutorial bias for YouTube", () => {
    assert.equal(defaultSearchQuery("React"), "React explained tutorial");
  });
});

describe("url helpers", () => {
  it("only allows in-app book paths", () => {
    assert.equal(isSafeBookPath("/book/ch1"), true);
    assert.equal(isSafeBookPath("/book/ch1#intro"), true);
    assert.equal(isSafeBookPath("/book/terms/react"), true);
    assert.equal(isSafeBookPath("/account/signin"), false);
    assert.equal(isSafeBookPath("//evil.example"), false);
    assert.equal(isSafeBookPath("https://evil.example/book"), false);
  });

  it("only accepts http(s) official URLs", () => {
    assert.equal(safeHttpUrl("https://react.dev/"), "https://react.dev/");
    assert.equal(safeHttpUrl("http://localhost:3000/"), "http://localhost:3000/");
    assert.equal(safeHttpUrl("javascript:alert(1)"), null);
    assert.equal(safeHttpUrl("/relative"), null);
  });

  it("builds YouTube URLs without scraping", () => {
    assert.equal(
      youtubeWatchUrl("dQw4w9WgXcQ"),
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    assert.match(
      youtubeEmbedUrl("dQw4w9WgXcQ"),
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/,
    );
    assert.match(youtubeSearchPageUrl("React explained"), /youtube\.com\/results/);
    assert.equal(titleFromSlug("next-js"), "Next Js");
  });

  it("builds clean in-app term paths when the registry matches", () => {
    assert.equal(
      termPageHref("https://react.dev/", "React", {
        term: "React",
        officialUrl: "https://react.dev/",
      }),
      "/book/terms/react",
    );
    assert.equal(
      termPageHref("https://www.mongodb.com/try/download/community", "mongodb.com", {
        term: "mongodb.com",
        officialUrl: "https://www.mongodb.com/",
      }),
      "/book/terms/mongodb-com?href=https%3A%2F%2Fwww.mongodb.com%2Ftry%2Fdownload%2Fcommunity",
    );
  });
});
