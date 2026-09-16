import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { COURSE_INFO_LINKS } from "../../app/course-info/CourseInfoFooter.tsx";
import {
  ASSOCIATES_DISCLOSURE,
  BLOG_AFFILIATE_BOOKS,
  DEFAULT_ASSOCIATE_TAG,
  amazonAssociateTag,
  amazonProductUrl,
} from "./affiliate.ts";
import {
  formatBlogDate,
  getBlogPost,
  listBlogPosts,
  listBlogSlugs,
  relatedChapterHref,
} from "./index.ts";
import { BLOG_POSTS } from "./posts.ts";

const REQUIRED_SEED_SOURCES = [
  "https://nextjs.org/blog/next-16-3",
  "https://nextjs.org/blog/next-16-3-ai-improvements",
  "https://nextjs.org/blog/august-2026-security-release",
] as const;

const REQUIRED_CATCHUP_SOURCES = [
  "https://react.dev/blog/2026/09/09/react-19-3",
  "https://vercel.com/blog/ai-sdk-7",
  "https://www.isyncevolution.com/blog/nextjs-security-best-practices",
] as const;

const REQUIRED_DIGEST_2026_09_15 = [
  "https://vercel.com/blog/how-we-cut-cdn-metadata-lookup-latency-by-91-percent",
  "https://cursor.com/blog/projects",
  "https://expressjs.com/en/blog/2026-08-31-security-releases/",
] as const;

const REQUIRED_DIGEST_2026_09_16 = [
  "https://vercel.com/blog/introducing-flat-rate-cdn",
  "https://openai.com/index/introducing-the-agents-api/",
  "https://vercel.com/blog/introducing-run",
] as const;

const REQUIRED_SOURCES = [
  ...REQUIRED_SEED_SOURCES,
  ...REQUIRED_CATCHUP_SOURCES,
  ...REQUIRED_DIGEST_2026_09_15,
  ...REQUIRED_DIGEST_2026_09_16,
] as const;

const ALLOWED_SOURCE_URL =
  /^https:\/\/(nextjs\.org\/blog\/|react\.dev\/blog\/|vercel\.com\/blog\/|www\.isyncevolution\.com\/blog\/|cursor\.com\/blog\/|expressjs\.com\/en\/blog\/|openai\.com\/index\/)/;

const BLOG_APP = join(process.cwd(), "app/blog");
const KAMBAZ_APP = join(process.cwd(), "app/(kambaz)");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(path));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(path);
  }
  return out;
}

describe("blog posts", () => {
  it("keeps required seed, catch-up, and digest source URLs with no empty sources", () => {
    assert.equal(BLOG_POSTS.length, REQUIRED_SOURCES.length);
    const urls = BLOG_POSTS.map((post) => post.source.url);
    assert.equal(new Set(urls).size, urls.length, "source URLs must be unique");
    assert.deepEqual([...urls].sort(), [...REQUIRED_SOURCES].sort());
    for (const required of REQUIRED_SEED_SOURCES) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_CATCHUP_SOURCES) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_15) {
      assert.ok(urls.includes(required), required);
    }
    for (const required of REQUIRED_DIGEST_2026_09_16) {
      assert.ok(urls.includes(required), required);
    }

    for (const post of BLOG_POSTS) {
      assert.ok(post.slug.length > 0, "slug");
      assert.ok(post.title.length > 0, "title");
      assert.ok(!Number.isNaN(Date.parse(post.publishedAt)), post.publishedAt);
      assert.ok(post.tags.length > 0, `tags for ${post.slug}`);
      assert.ok(post.intro.length >= 1 && post.intro.length <= 3, post.slug);
      for (const paragraph of post.intro) {
        assert.ok(paragraph.trim().length > 40, `intro too short: ${post.slug}`);
      }
      assert.ok(post.source.title.trim(), `source.title ${post.slug}`);
      assert.ok(post.source.publisher.trim(), `source.publisher ${post.slug}`);
      assert.match(post.source.url, ALLOWED_SOURCE_URL);
    }
  });

  it("lists newest first and looks up by slug", () => {
    const listed = listBlogPosts();
    assert.equal(listed.length, REQUIRED_SOURCES.length);
    const times = listed.map((post) => Date.parse(post.publishedAt));
    assert.deepEqual(
      times,
      [...times].sort((a, b) => b - a),
    );
    assert.deepEqual(
      listed.slice(0, 3).map((post) => post.slug),
      [
        "openai-agents-api",
        "vercel-flat-rate-cdn",
        "vercel-run-sdk",
      ],
    );
    assert.deepEqual(
      listed.slice(0, 3).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_16].sort(),
    );
    assert.deepEqual(
      listed.slice(3, 6).map((post) => post.source.url).sort(),
      [...REQUIRED_DIGEST_2026_09_15].sort(),
    );
    assert.deepEqual(
      listed.slice(6, 9).map((post) => post.source.url).sort(),
      [...REQUIRED_CATCHUP_SOURCES].sort(),
    );
    assert.equal(listed[9]?.slug, "august-2026-nextjs-security-release");
    assert.equal(listed[10]?.slug, "nextjs-16-3-instant-navigations");
    assert.equal(listed[11]?.slug, "nextjs-16-3-ai-improvements");

    assert.equal(listBlogSlugs().length, REQUIRED_SOURCES.length);
    assert.equal(
      getBlogPost("nextjs-16-3-instant-navigations")?.source.url,
      "https://nextjs.org/blog/next-16-3",
    );
    assert.equal(
      getBlogPost("react-19-3")?.source.url,
      "https://react.dev/blog/2026/09/09/react-19-3",
    );
    assert.equal(getBlogPost("does-not-exist"), undefined);
  });

  it("formats published dates in UTC and maps related chapters", () => {
    assert.equal(formatBlogDate("2026-09-16T12:00:00.000Z"), "September 16, 2026");
    assert.equal(formatBlogDate("2026-09-15T12:00:00.000Z"), "September 15, 2026");
    assert.equal(formatBlogDate("2026-09-14T16:00:00.000Z"), "September 14, 2026");
    assert.equal(formatBlogDate("2026-08-25T18:00:00.000Z"), "August 25, 2026");
    assert.equal(formatBlogDate("2026-08-03T17:00:00.000Z"), "August 3, 2026");
    assert.equal(formatBlogDate("2026-06-26T15:00:00.000Z"), "June 26, 2026");
    assert.equal(relatedChapterHref("ch3"), "/book/ch3");
    assert.equal(relatedChapterHref("ch5"), "/book/ch5");
  });

  it("does not invent quotes or unstated dates in intros", () => {
    for (const post of BLOG_POSTS) {
      const body = post.intro.join(" ");
      assert.doesNotMatch(body, /[“”]/);
      assert.doesNotMatch(body, /\b20\d{2}-\d{2}-\d{2}\b/);
    }
    const security = getBlogPost("august-2026-nextjs-security-release");
    assert.match(security?.intro.join(" ") ?? "", /August 25, 2026/);
    assert.match(security?.intro.join(" ") ?? "", /v16\.3\.3/);
    assert.match(security?.intro.join(" ") ?? "", /v15\.5\.24/);
    const release = getBlogPost("nextjs-16-3-instant-navigations");
    assert.match(release?.intro.join(" ") ?? "", /Instant Navigations/);
    assert.match(release?.intro.join(" ") ?? "", /90%/);
    const ai = getBlogPost("nextjs-16-3-ai-improvements");
    assert.match(ai?.intro.join(" ") ?? "", /AGENTS\.md/);
    assert.match(ai?.intro.join(" ") ?? "", /next-dev-loop/);

    const react = getBlogPost("react-19-3");
    assert.match(react?.intro.join(" ") ?? "", /View Transition/);
    assert.match(react?.intro.join(" ") ?? "", /FragmentInstance/);
    assert.match(react?.intro.join(" ") ?? "", /use\(browser\(\)\)/);
    assert.match(react?.intro.join(" ") ?? "", /Trusted Types/);
    const sdk = getBlogPost("ai-sdk-7-agent-platform");
    assert.match(sdk?.intro.join(" ") ?? "", /WorkflowAgent/);
    assert.match(sdk?.intro.join(" ") ?? "", /realtime/);
    const proxy = getBlogPost("nextjs-security-middleware-proxy");
    assert.match(proxy?.intro.join(" ") ?? "", /CVE-2025-29927/);
    assert.match(proxy?.intro.join(" ") ?? "", /proxy\.ts/);

    const cdn = getBlogPost("vercel-cdn-metadata-shards-91");
    assert.match(cdn?.intro.join(" ") ?? "", /91%/);
    assert.match(cdn?.intro.join(" ") ?? "", /indexed shards/);
    const projects = getBlogPost("cursor-projects-coordinator");
    assert.match(projects?.intro.join(" ") ?? "", /Projects coordinator/);
    assert.match(projects?.intro.join(" ") ?? "", /Cursor reports/);
    const express = getBlogPost("express-august-2026-security-releases");
    assert.match(express?.intro.join(" ") ?? "", /multer 2\.3\.0/);
    assert.match(express?.intro.join(" ") ?? "", /CVE-2026-77078/);

    const flatRate = getBlogPost("vercel-flat-rate-cdn");
    assert.match(flatRate?.intro.join(" ") ?? "", /Flat Rate CDN/);
    assert.match(flatRate?.intro.join(" ") ?? "", /Jas Garcha/);
    const agentsApi = getBlogPost("openai-agents-api");
    assert.match(agentsApi?.intro.join(" ") ?? "", /Agents API/);
    assert.match(agentsApi?.intro.join(" ") ?? "", /Codex harness/);
    const runSdk = getBlogPost("vercel-run-sdk");
    assert.match(runSdk?.intro.join(" ") ?? "", /QuickJS/);
    assert.match(runSdk?.intro.join(" ") ?? "", /hostFunctions/);
  });

  it("dates the September 14 catch-up posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "react-19-3",
      "ai-sdk-7-agent-platform",
      "nextjs-security-middleware-proxy",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 14, 2026");
    }
  });

  it("dates the September 16 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "vercel-flat-rate-cdn",
      "openai-agents-api",
      "vercel-run-sdk",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-16T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 16, 2026");
    }
  });

  it("dates the September 15 digest posts in America/New_York", () => {
    const nyDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    for (const slug of [
      "vercel-cdn-metadata-shards-91",
      "cursor-projects-coordinator",
      "express-august-2026-security-releases",
    ]) {
      const post = getBlogPost(slug);
      assert.ok(post, slug);
      assert.equal(post.publishedAt, "2026-09-15T12:00:00.000Z");
      assert.equal(nyDate.format(new Date(post.publishedAt)), "September 15, 2026");
    }
  });
});

describe("blog affiliate", () => {
  it("tags curated ASINs with the Associates tag and disclosure", () => {
    assert.equal(DEFAULT_ASSOCIATE_TAG, "jannunzi04-20");
    assert.equal(amazonAssociateTag(undefined), "jannunzi04-20");
    assert.equal(amazonAssociateTag("  custom-20  "), "custom-20");
    assert.equal(BLOG_AFFILIATE_BOOKS.length, 2);
    for (const book of BLOG_AFFILIATE_BOOKS) {
      assert.match(book.asin, /^[A-Z0-9]{10}$/);
      assert.equal(
        amazonProductUrl(book.asin),
        `https://www.amazon.com/dp/${book.asin}?tag=jannunzi04-20`,
      );
    }
    assert.match(ASSOCIATES_DISCLOSURE, /Amazon Associate/i);
  });
});

describe("blog routes and nav", () => {
  it("adds Blog to the main course nav near Book", () => {
    const hrefs = COURSE_INFO_LINKS.map((link) => link.href);
    assert.ok(hrefs.includes("/blog"));
    assert.ok(hrefs.indexOf("/blog") === hrefs.indexOf("/book") + 1);
    assert.equal(
      COURSE_INFO_LINKS.find((link) => link.href === "/blog")?.label,
      "Blog",
    );
    assert.match(
      read(join(process.cwd(), "app/syllabus/components/SyllabusNav.tsx")),
      /href="\/blog">Blog</,
    );
  });

  it("keeps index and slug route modules that render posts and source links", () => {
    const index = read(join(BLOG_APP, "page.tsx"));
    const post = read(join(BLOG_APP, "[slug]/page.tsx"));
    const ad = read(join(BLOG_APP, "components/BlogAdSlot.tsx"));
    const source = read(join(BLOG_APP, "components/BlogSourceLink.tsx"));

    assert.match(index, /listBlogPosts/);
    assert.match(index, /BlogAdSlot/);
    assert.match(index, /instructor-curated digests, not original reporting/i);
    assert.match(index, /href=\{`\/blog\/\$\{post\.slug\}`\}/);

    assert.match(post, /generateStaticParams/);
    assert.match(post, /getBlogPost/);
    assert.match(post, /notFound/);
    assert.match(post, /BlogAdSlot/);
    assert.match(post, /BlogSourceLink/);

    assert.match(source, /rel="noopener noreferrer"/);
    assert.match(source, /Read original/);
    assert.match(ad, /Sponsored \/ further reading/);
    assert.match(ad, /noopener noreferrer nofollow sponsored/);
    assert.match(ad, /ASSOCIATES_DISCLOSURE/);
    assert.doesNotMatch(ad, /import .*BookAffiliateBanner/);
    assert.doesNotMatch(index + post, /import .*BookAffiliateBanner/);

    const bookLayout = read(join(process.cwd(), "app/book/layout.tsx"));
    assert.match(bookLayout, /BookAffiliateBanner/);
    assert.doesNotMatch(bookLayout, /BlogAdSlot/);
  });

  it("does not mount blog ads on Kambaz LMS routes", () => {
    for (const file of walkTsx(KAMBAZ_APP)) {
      const source = read(file);
      assert.doesNotMatch(source, /BlogAdSlot/);
      assert.doesNotMatch(source, /lib\/blog\/affiliate/);
      assert.doesNotMatch(source, /from ["']@\/lib\/blog/);
    }
  });
});
