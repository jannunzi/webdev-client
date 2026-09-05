import {
  A1_RUBRIC_AUTO_SPECS,
  evaluateRubricSpec,
} from "./a1-rubric";
import { classifyDeployFetch } from "./fetch-classify";
import type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
} from "./check-types";
import { crawlA1Deploy, submittedUrlOpens } from "./crawl";
import { htmlHasId } from "./html";
import { hasUsableNameQuery, htmlHasStudentName, type NameQuery } from "./names";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { looksLikeDeployUrl, parseGithubRepoUrl } from "./urls";

export type {
  AssignmentCheckProbes,
  AssignmentCheckResult,
  HtmlFetchResult,
  UrlProbeResult,
} from "./check-types";

export {
  htmlHasA1LabMarkers,
  htmlHasLabsNavigation,
  htmlHasWdHooks,
} from "./markers";

export { classifyDeployFetch } from "./fetch-classify";

function check(
  id: string,
  label: string,
  passed: boolean,
  message: string,
  extra: Partial<AssignmentCheckResult> = {},
): AssignmentCheckResult {
  return { id, label, passed, message, ...extra };
}

export async function runA1Checks(input: {
  githubUrl?: string;
  vercelUrl: string;
  nameQuery?: NameQuery;
  probes: AssignmentCheckProbes;
}): Promise<AssignmentCheckResult[]> {
  const results: AssignmentCheckResult[] = [];
  const githubRaw = input.githubUrl?.trim() ?? "";

  if (githubRaw) {
    const github = parseGithubRepoUrl(githubRaw);
    results.push(
      check(
        "github-url",
        "GitHub repository URL",
        github.ok,
        github.ok ? ASSIGNMENT_STUDENT_COPY.githubOk : github.message,
        { criterionId: "a1-delivery-github", groupId: "delivery" },
      ),
    );
    if (github.ok && input.probes.probeUrl) {
      const probe = await input.probes.probeUrl(github.repo.href);
      results.push(
        check(
          "github-public",
          "GitHub repository is public",
          probe.ok,
          probe.ok
            ? ASSIGNMENT_STUDENT_COPY.githubOk
            : probe.status === 404
              ? ASSIGNMENT_STUDENT_COPY.githubPrivate
              : probe.message || ASSIGNMENT_STUDENT_COPY.githubUnreachable,
          { criterionId: "a1-delivery-github", groupId: "delivery" },
        ),
      );
    }
  }

  const vercel = looksLikeDeployUrl(input.vercelUrl);
  results.push(
    check(
      "a1-delivery-vercel",
      "Vercel deployment",
      vercel.ok,
      vercel.ok ? ASSIGNMENT_STUDENT_COPY.vercelOk : vercel.message,
      { criterionId: "a1-delivery-vercel", groupId: "delivery" },
    ),
  );

  if (!vercel.ok) {
    return results;
  }

  const crawled = await crawlA1Deploy({
    deployUrl: vercel.href,
    getHtml: async (url) => classifyDeployFetch(await input.probes.getHtml(url)),
  });
  if ("ok" in crawled && crawled.ok === false) {
    results.push(
      check(
        "a1-delivery-vercel-open",
        "Deployment opens without signing in",
        false,
        crawled.message,
        { criterionId: "a1-delivery-vercel", groupId: "delivery" },
      ),
    );
    return results;
  }

  const opened = submittedUrlOpens(vercel.href, crawled.pages);
  const openedOk = Boolean(opened?.ok);
  results.push(
    check(
      "a1-delivery-vercel-open",
      "Deployment opens without signing in",
      openedOk,
      openedOk
        ? "The deployment responded successfully."
        : opened && !opened.ok && opened.code === "auth_wall"
          ? ASSIGNMENT_STUDENT_COPY.vercelAuthWall
          : opened && !opened.ok && opened.status
            ? `The deployment returned HTTP ${opened.status}.`
            : ASSIGNMENT_STUDENT_COPY.vercelUnreachable,
      { criterionId: "a1-delivery-vercel", groupId: "delivery" },
    ),
  );

  if (!openedOk) {
    return results;
  }

  const labsNav =
    htmlHasId(crawled.labsHtml, "wd-lab1-link") ||
    htmlHasId(crawled.labsHtml, "wd-labs") ||
    htmlHasId(crawled.labsHtml, "wd-kambaz-link") ||
    htmlHasId(crawled.labsHtml, "wd-home-link");
  results.push(
    check(
      "a1-delivery-labs-nav",
      "Labs navigation",
      labsNav,
      labsNav
        ? ASSIGNMENT_STUDENT_COPY.labsOk
        : ASSIGNMENT_STUDENT_COPY.labsMissing,
      { criterionId: "a1-delivery-labs-nav", groupId: "delivery" },
    ),
  );

  const githubHook = htmlHasId(crawled.labsHtml, "wd-github");
  results.push(
    check(
      "a1-delivery-github-link",
      "GitHub link on Labs",
      githubHook,
      githubHook
        ? "Found a wd-github link on Labs."
        : "Add a public repo link with id wd-github on Labs.",
      { criterionId: "a1-delivery-github", groupId: "delivery" },
    ),
  );

  if (input.nameQuery && hasUsableNameQuery(input.nameQuery)) {
    const named = htmlHasStudentName(crawled.labsHtml, input.nameQuery);
    results.push(
      check(
        "a1-delivery-name-section",
        "Name and section",
        named,
        named
          ? ASSIGNMENT_STUDENT_COPY.nameOk
          : ASSIGNMENT_STUDENT_COPY.nameMissing,
        { criterionId: "a1-delivery-name-section", groupId: "delivery" },
      ),
    );
  }

  for (const spec of A1_RUBRIC_AUTO_SPECS) {
    const html =
      spec.groupId === "lab" ? crawled.labsHtml || crawled.allHtml : crawled.allHtml;
    const judged = evaluateRubricSpec(spec, html);
    results.push(
      check(spec.criterionId, spec.label, judged.passed, judged.message, {
        criterionId: spec.criterionId,
        groupId: spec.groupId,
      }),
    );
  }

  results.push(
    check(
      "a1-lab-highlighted-paragraph-oyo",
      "HighlightedParagraph — On your own",
      false,
      "This On your own row stays manual — there is no required extra id to look for.",
      {
        criterionId: "a1-lab-highlighted-paragraph-oyo",
        groupId: "lab",
        skipped: true,
      },
    ),
    check(
      "a1-lab-highlighted-box-oyo",
      "HighlightedBox — On your own",
      false,
      "This On your own row stays manual — there is no required extra id to look for.",
      {
        criterionId: "a1-lab-highlighted-box-oyo",
        groupId: "lab",
        skipped: true,
      },
    ),
  );

  return results;
}

export function latestResultByCriterion(
  results: readonly AssignmentCheckResult[],
): Map<string, AssignmentCheckResult> {
  const map = new Map<string, AssignmentCheckResult>();
  for (const row of results) {
    if (!row.criterionId) continue;
    const existing = map.get(row.criterionId);
    if (!existing) {
      map.set(row.criterionId, row);
      continue;
    }
    if (existing.skipped) {
      map.set(row.criterionId, row);
      continue;
    }
    if (row.skipped) continue;
    if (existing.passed && !row.passed) map.set(row.criterionId, row);
  }
  return map;
}
