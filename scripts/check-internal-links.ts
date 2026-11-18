/**
 * Crawl a local production server and fail when an internal href 404s or
 * renders a not-found page. Usage:
 *   BASE_URL=http://127.0.0.1:3460 npx tsx scripts/check-internal-links.ts
 */
import { listLectureSlugs } from "../lib/lectures/catalog";

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3460").replace(/\/$/, "");

const seeds = [
  "/",
  "/2026/fall/webdev/book",
  "/2026/fall/webdev/book/ch1",
  "/2026/fall/webdev/book/ch2",
  "/2026/fall/webdev/book/ch3",
  "/2026/fall/webdev/book/ch4",
  "/2026/fall/webdev/book/ch5",
  "/2026/fall/webdev/book/ch6",
  "/2026/fall/webdev/slides",
  "/2026/fall/webdev/videos",
  "/2026/fall/webdev/assignments",
  "/2026/fall/webdev/labs",
  "/2026/fall/webdev/project",
  "/2026/fall/webdev/blog",
  "/2026/fall/webdev/office-hours",
  "/2026/fall/webdev/cs5610/02/syllabus",
  "/2026/fall/webdev/cs5610/09/syllabus",
  "/2026/fall/webdev/cs4550/01/syllabus",
  "/2027/summer/fse/cs5500",
  "/2027/summer/fse/book",
  ...listLectureSlugs().map((slug) => `/2026/fall/webdev/slides/${slug}`),
];

function visibleHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
}

async function fetchPage(pathname: string): Promise<{ status: number; html: string; finalPath: string }> {
  const response = await fetch(`${base}${pathname}`, { redirect: "follow" });
  const html = await response.text();
  const finalPath = new URL(response.url).pathname;
  return { status: response.status, html, finalPath };
}

async function main() {
const queue = [...new Set(seeds)];
const seen = new Set<string>();
const broken: string[] = [];
let linksChecked = 0;
let pagesCrawled = 0;

while (queue.length > 0 && pagesCrawled < 1500) {
  const pathname = queue.shift()!;
  if (seen.has(pathname)) continue;
  seen.add(pathname);
  pagesCrawled += 1;
  let page: { status: number; html: string; finalPath: string };
  try {
    page = await fetchPage(pathname);
  } catch (error) {
    broken.push(`${pathname} FETCH ${error instanceof Error ? error.message : error}`);
    continue;
  }
  const body = visibleHtml(page.html);
  const title = body.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
  const missingDeck = /<h1[^>]*>\s*Slide deck not found\s*<\/h1>/i.test(body);
  const coursePage = pathname === "/" || /^\/(2026|2027)\//.test(pathname) || /^\/(book|slides|videos|labs|assignments|project|syllabus|blog|office-hours)(\/|$)/.test(pathname);
  if (coursePage && (page.status === 404 || missingDeck || /404/.test(title))) {
    broken.push(`${pathname} -> ${page.status} ${page.finalPath} ${title}`);
  }
  const hrefs = body.match(/href="([^"]+)"/g) ?? [];
  for (const raw of hrefs) {
    const href = raw.slice(6, -1);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    linksChecked += 1;
    const pathOnly = href.split("#")[0]?.split("?")[0] || "/";
    if (!seen.has(pathOnly) && !queue.includes(pathOnly)) queue.push(pathOnly);
  }
}

const missedSeeds = seeds.filter((path) => !seen.has(path));
console.log(JSON.stringify({ pagesCrawled, linksChecked, broken: broken.length, remaining: queue.length, missedSeeds, sample: broken.slice(0, 20) }, null, 2));
if (broken.length > 0) process.exit(1);
}

main();
