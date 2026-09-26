import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  COURSE_SITE_ORIGIN,
  LEGACY_COURSE_SITE_HOST,
  courseSiteHrefForLocation,
  isLegacyCourseHost,
  shouldShowCourseHostBanner,
} from "./origin";

describe("course site origin", () => {
  it("points public course URLs at kambaz.dev", () => {
    assert.equal(COURSE_SITE_ORIGIN, "https://kambaz.dev");
    assert.equal(
      courseSiteHrefForLocation({
        pathname: "/assignments/a1",
        search: "",
        hash: "",
      }),
      "https://kambaz.dev/assignments/a1",
    );
    assert.equal(
      courseSiteHrefForLocation({
        pathname: "/syllabus",
        search: "?x=1",
        hash: "#accounts",
      }),
      "https://kambaz.dev/syllabus?x=1#accounts",
    );
  });

  it("recognizes the read-only vercel.app backup host", () => {
    assert.equal(isLegacyCourseHost(LEGACY_COURSE_SITE_HOST), true);
    assert.equal(isLegacyCourseHost("webdev-client.vercel.app:443"), true);
    assert.equal(isLegacyCourseHost("WEBDEV-CLIENT.VERCEL.APP"), true);
    assert.equal(isLegacyCourseHost("preview.webdev-client.vercel.app"), true);
    assert.equal(isLegacyCourseHost("kambaz.dev"), false);
    assert.equal(isLegacyCourseHost("www.kambaz.dev"), false);
    assert.equal(isLegacyCourseHost("jane-a1.vercel.app"), false);
    assert.equal(isLegacyCourseHost("webdev-client-git-main.vercel.app"), false);
    assert.equal(isLegacyCourseHost("localhost"), false);
  });

  it("shows the banner from the request host, never on kambaz.dev", () => {
    assert.equal(shouldShowCourseHostBanner("webdev-client.vercel.app"), true);
    assert.equal(shouldShowCourseHostBanner("Webdev-Client.vercel.app:443"), true);
    assert.equal(
      shouldShowCourseHostBanner("preview.webdev-client.vercel.app"),
      true,
    );
    assert.equal(
      shouldShowCourseHostBanner("webdev-client-git-main-team.vercel.app"),
      true,
    );
    assert.equal(shouldShowCourseHostBanner("jane-a1.vercel.app"), true);
    assert.equal(shouldShowCourseHostBanner("kambaz.dev"), false);
    assert.equal(shouldShowCourseHostBanner("www.kambaz.dev"), false);
    assert.equal(shouldShowCourseHostBanner("WWW.KAMBAZ.DEV:443"), false);
    assert.equal(shouldShowCourseHostBanner("localhost"), false);
    assert.equal(shouldShowCourseHostBanner(""), false);
  });
});

describe("legacy host banner wiring", () => {
  it("mounts the banner from the root layout and does not redirect hosts", () => {
    const layout = readFileSync(new URL("../../app/layout.tsx", import.meta.url), "utf8");
    const config = readFileSync(
      new URL("../../next.config.ts", import.meta.url),
      "utf8",
    );
    assert.match(layout, /LegacyCourseHostBanner/);
    assert.doesNotMatch(config, /webdev-client\.vercel\.app/);
    assert.doesNotMatch(config, /kambaz\.dev/);

    const banner = readFileSync(
      new URL("../../app/legacy-course-host-banner.tsx", import.meta.url),
      "utf8",
    );
    assert.match(banner, /window\.location/);
    assert.match(banner, /shouldShowCourseHostBanner/);
    assert.doesNotMatch(banner, /process\.env/);
  });
});
