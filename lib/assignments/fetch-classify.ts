import type { HtmlFetchResult } from "./check-types";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { htmlLooksLikeVercelAuthWall, isVercelAuthWallUrl } from "./urls";

export function deployOpenFailureMessage(
  opened: HtmlFetchResult | null,
): string {
  if (!opened || opened.ok) return ASSIGNMENT_STUDENT_COPY.vercelUnreachable;
  if (opened.code === "auth_wall") return ASSIGNMENT_STUDENT_COPY.vercelAuthWall;
  if (opened.status === 404) return ASSIGNMENT_STUDENT_COPY.vercelNotFound;
  if (opened.status) {
    return `${ASSIGNMENT_STUDENT_COPY.vercelHttpError} (HTTP ${opened.status}).`;
  }
  return opened.message || ASSIGNMENT_STUDENT_COPY.vercelUnreachable;
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
