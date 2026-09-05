import type { HtmlFetchResult } from "./check-types";
import {
  extractAssignmentIds,
  extractCourseIds,
  extractInternalHrefs,
  isCourseScreenPath,
  isLabsPath,
  pathnameOf,
  uniqueUrls,
} from "./html";
import {
  a1SeedUrls,
  deployOriginFromUrl,
  looksLikeDeployUrl,
  urlOnDeployOrigin,
} from "./urls";

export type PageSnapshot = {
  path: string;
  url: string;
  result: HtmlFetchResult;
};

export type DeployCorpus = {
  ok: true;
  origin: string;
  pages: PageSnapshot[];
  allHtml: string;
  labsHtml: string;
};

const FALLBACK_COURSE_IDS = ["1234", "RS101"];

function successfulHtml(pages: PageSnapshot[]): string {
  return pages
    .filter((page) => page.result.ok)
    .map((page) => page.result.html)
    .join("\n");
}

function labsHtmlFrom(pages: PageSnapshot[]): string {
  const labsPages = pages.filter(
    (page) => page.result.ok && isLabsPath(page.path),
  );
  if (labsPages.length > 0) return successfulHtml(labsPages);
  return successfulHtml(pages);
}

function sameOriginHref(origin: string, href: string): string | null {
  try {
    const resolved = new URL(href, origin);
    if (resolved.origin !== new URL(origin).origin) return null;
    return resolved.href;
  } catch {
    return null;
  }
}

function followupUrls(origin: string, html: string): string[] {
  const urls: string[] = [];
  for (const href of extractInternalHrefs(html)) {
    const resolved = sameOriginHref(origin, href);
    if (!resolved) continue;
    const path = pathnameOf(resolved);
    if (isLabsPath(path) || isCourseScreenPath(path)) {
      urls.push(resolved);
    }
  }

  const courseIds = extractCourseIds(html);
  const ids = courseIds.length > 0 ? courseIds.slice(0, 2) : FALLBACK_COURSE_IDS;
  for (const cid of ids) {
    urls.push(
      urlOnDeployOrigin(origin, `/courses/${cid}/home`),
      urlOnDeployOrigin(origin, `/Courses/${cid}/Home`),
      urlOnDeployOrigin(origin, `/courses/${cid}/modules`),
      urlOnDeployOrigin(origin, `/Courses/${cid}/Modules`),
      urlOnDeployOrigin(origin, `/courses/${cid}/assignments`),
      urlOnDeployOrigin(origin, `/Courses/${cid}/Assignments`),
    );
    const assignmentIds = extractAssignmentIds(html, cid).slice(0, 1);
    const aid = assignmentIds[0] ?? "123";
    urls.push(
      urlOnDeployOrigin(origin, `/courses/${cid}/assignments/${aid}`),
      urlOnDeployOrigin(origin, `/Courses/${cid}/Assignments/${aid}`),
    );
  }
  return uniqueUrls(urls).slice(0, 16);
}

export async function crawlA1Deploy(input: {
  deployUrl: string;
  getHtml: (url: string) => Promise<HtmlFetchResult>;
}): Promise<DeployCorpus | { ok: false; message: string }> {
  const origin = deployOriginFromUrl(input.deployUrl);
  if (!origin.ok) return { ok: false, message: origin.message };

  const seed = a1SeedUrls(input.deployUrl);
  const first = await Promise.all(
    seed.map(async (url) => {
      const result = await input.getHtml(url);
      return {
        path: pathnameOf(result.ok ? result.finalUrl : url) || pathnameOf(url),
        url,
        result,
      } satisfies PageSnapshot;
    }),
  );

  const more = followupUrls(origin.href, successfulHtml(first)).filter(
    (url) => !seed.includes(url),
  );
  const second = await Promise.all(
    more.map(async (url) => {
      const result = await input.getHtml(url);
      return {
        path: pathnameOf(result.ok ? result.finalUrl : url) || pathnameOf(url),
        url,
        result,
      } satisfies PageSnapshot;
    }),
  );

  const pages = [...first, ...second];
  return {
    ok: true,
    origin: origin.href,
    pages,
    allHtml: successfulHtml(pages),
    labsHtml: labsHtmlFrom(pages),
  };
}

export function submittedUrlOpens(
  deployUrl: string,
  pages: PageSnapshot[],
): HtmlFetchResult | null {
  const parsed = looksLikeDeployUrl(deployUrl);
  if (!parsed.ok) return null;
  const exact = pages.find((page) => page.url === parsed.href);
  if (exact) return exact.result;
  const originHome = pages.find((page) => page.path === "/");
  return originHome?.result ?? pages[0]?.result ?? null;
}
