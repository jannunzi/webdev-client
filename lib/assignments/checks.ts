import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { hasUsableNameQuery, htmlHasStudentName, type NameQuery } from "./names";
import {
  htmlLooksLikeVercelAuthWall,
  isVercelAuthWallUrl,
  labsUrlFromDeploy,
  looksLikeDeployUrl,
  parseGithubRepoUrl,
} from "./urls";

export type AssignmentCheckResult = {
  id: string;
  label: string;
  passed: boolean;
  message: string;
};

export type HtmlFetchResult =
  | { ok: true; status: number; finalUrl: string; html: string }
  | {
      ok: false;
      status?: number;
      finalUrl?: string;
      html?: string;
      code: "auth_wall" | "http_error" | "network";
      message: string;
    };

export type UrlProbeResult =
  | { ok: true; status: number }
  | { ok: false; status?: number; message: string };

export type AssignmentCheckProbes = {
  getHtml: (url: string) => Promise<HtmlFetchResult>;
  probeUrl?: (url: string) => Promise<UrlProbeResult>;
};

const WD_ID_RE = /id=["']wd-[a-z0-9-]+["']/i;

export function htmlHasWdHooks(html: string): boolean {
  return WD_ID_RE.test(html);
}

export function htmlHasLabsNavigation(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes('id="wd-lab1-link"') ||
    lower.includes("id='wd-lab1-link'") ||
    lower.includes('id="wd-labs"') ||
    lower.includes("id='wd-labs'") ||
    lower.includes('id="wd-kambaz-link"') ||
    lower.includes("id='wd-kambaz-link'") ||
    lower.includes('href="/labs/lab1"') ||
    lower.includes("href='/labs/lab1'")
  );
}

export function htmlHasA1LabMarkers(html: string): boolean {
  const lower = html.toLowerCase();
  if (
    lower.includes('id="wd-github"') ||
    lower.includes("id='wd-github'") ||
    htmlHasLabsNavigation(html)
  ) {
    return true;
  }
  return htmlHasWdHooks(html);
}

export function classifyDeployFetch(result: HtmlFetchResult): HtmlFetchResult {
  if (!result.ok) {
    if (result.code === "auth_wall") return result;
    if (
      result.status === 401 ||
      result.status === 403 ||
      (result.finalUrl && isVercelAuthWallUrl(result.finalUrl)) ||
      (result.html && htmlLooksLikeVercelAuthWall(result.html))
    ) {
      return {
        ok: false,
        status: result.status,
        finalUrl: result.finalUrl,
        html: result.html,
        code: "auth_wall",
        message: ASSIGNMENT_STUDENT_COPY.vercelAuthWall,
      };
    }
    return result;
  }

  if (
    result.status === 401 ||
    result.status === 403 ||
    isVercelAuthWallUrl(result.finalUrl) ||
    htmlLooksLikeVercelAuthWall(result.html)
  ) {
    return {
      ok: false,
      status: result.status,
      finalUrl: result.finalUrl,
      html: result.html,
      code: "auth_wall",
      message: ASSIGNMENT_STUDENT_COPY.vercelAuthWall,
    };
  }

  return result;
}

function check(
  id: string,
  label: string,
  passed: boolean,
  message: string,
): AssignmentCheckResult {
  return { id, label, passed, message };
}

export async function runA1Checks(input: {
  githubUrl: string;
  vercelUrl: string;
  nameQuery?: NameQuery;
  probes: AssignmentCheckProbes;
}): Promise<AssignmentCheckResult[]> {
  const results: AssignmentCheckResult[] = [];

  const github = parseGithubRepoUrl(input.githubUrl);
  results.push(
    check(
      "github-url",
      "GitHub repository URL",
      github.ok,
      github.ok ? ASSIGNMENT_STUDENT_COPY.githubOk : github.message,
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
            : (probe.message || ASSIGNMENT_STUDENT_COPY.githubUnreachable),
      ),
    );
  } else if (github.ok) {
    results.push(
      check(
        "github-public",
        "GitHub repository is public",
        true,
        "GitHub URL format is valid. Public-repo reachability was not probed.",
      ),
    );
  }

  const vercel = looksLikeDeployUrl(input.vercelUrl);
  results.push(
    check(
      "vercel-url",
      "Vercel deployment URL",
      vercel.ok,
      vercel.ok ? ASSIGNMENT_STUDENT_COPY.vercelOk : vercel.message,
    ),
  );

  if (!vercel.ok) {
    results.push(
      check(
        "vercel-open",
        "Deployment opens without signing in",
        false,
        ASSIGNMENT_STUDENT_COPY.vercelUnreachable,
      ),
      check(
        "labs-markers",
        "Labs page markers",
        false,
        ASSIGNMENT_STUDENT_COPY.labsUnread,
      ),
    );
    return results;
  }

  const landing = classifyDeployFetch(await input.probes.getHtml(vercel.href));
  if (!landing.ok) {
    results.push(
      check(
        "vercel-open",
        "Deployment opens without signing in",
        false,
        landing.code === "auth_wall"
          ? ASSIGNMENT_STUDENT_COPY.vercelAuthWall
          : landing.status
            ? `The deployment returned HTTP ${landing.status}.`
            : landing.message || ASSIGNMENT_STUDENT_COPY.vercelUnreachable,
      ),
      check(
        "labs-markers",
        "Labs page markers",
        false,
        ASSIGNMENT_STUDENT_COPY.labsUnread,
      ),
    );
    return results;
  }

  results.push(
    check(
      "vercel-open",
      "Deployment opens without signing in",
      true,
      "The deployment responded successfully.",
    ),
  );

  let htmlForMarkers = landing.html;
  if (!htmlHasA1LabMarkers(htmlForMarkers)) {
    const labsHref = labsUrlFromDeploy(vercel.href);
    if (labsHref && labsHref !== landing.finalUrl) {
      const labs = classifyDeployFetch(await input.probes.getHtml(labsHref));
      if (labs.ok) htmlForMarkers = `${htmlForMarkers}\n${labs.html}`;
    }
  }

  const labsFound = htmlHasA1LabMarkers(htmlForMarkers);
  results.push(
    check(
      "labs-markers",
      "Labs page markers",
      labsFound,
      labsFound
        ? ASSIGNMENT_STUDENT_COPY.labsOk
        : ASSIGNMENT_STUDENT_COPY.labsMissing,
    ),
  );

  if (input.nameQuery && hasUsableNameQuery(input.nameQuery)) {
    const named = htmlHasStudentName(htmlForMarkers, input.nameQuery);
    results.push(
      check(
        "name-markers",
        "Your name on Labs",
        named,
        named
          ? ASSIGNMENT_STUDENT_COPY.nameOk
          : ASSIGNMENT_STUDENT_COPY.nameMissing,
      ),
    );
  }

  return results;
}
