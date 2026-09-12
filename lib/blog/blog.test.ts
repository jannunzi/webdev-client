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

const REQUIRED_SOURCES = [
  "https://nextjs.org/blog/next-16-3",
  "https://nextjs.org/blog/next-16-3-ai-improvements",
  "https://nextjs.org/blog/august-2026-security-release",
] as const;

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
  it("seeds exactly three posts with required source URLs and no empty sources", () => {
    assert.equal(BLOG_POSTS.length, 3);
    const urls = BLOG_POSTS.map((post) => post.source.url).sort();
    assert.deepEqual(urls, [...REQUIRED_SOURCES].sort());

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
      assert.match(post.source.url, /^https:\/\/nextjs\.org\/blog\//);
    }
  });

  it("lists newest first and looks up by slug", () => {
    const listed = listBlogPosts();
    assert.equal(listed.length, 3);
    const times = listed.map((post) => Date.parse(post.publishedAt));
    assert.deepEqual(
      times,
      [...times].sort((a, b) => b - a),
    );
    assert.equal(listed[0]?.slug, "august-2026-nextjs-security-release");
    assert.equal(listed[1]?.slug, "nextjs-16-3-instant-navigations");
    assert.equal(listed[2]?.slug, "nextjs-16-3-ai-improvements");

    assert.equal(listBlogSlugs().length, 3);
    assert.equal(
      getBlogPost("nextjs-16-3-instant-navigations")?.source.url,
      "https://nextjs.org/blog/next-16-3",
    );
    assert.equal(getBlogPost("does-not-exist"), undefined);
  });

  it("formats published dates in UTC and maps related chapters", () => {
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
