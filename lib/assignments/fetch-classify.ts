import type { HtmlFetchResult } from "./check-types";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import { htmlLooksLikeVercelAuthWall, isVercelAuthWallUrl } from "./urls";

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
