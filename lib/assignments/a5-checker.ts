import { A5_RUBRIC } from "./a5";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import {
  A5_STRUCTURE_FALLBACKS,
  a5GithubLinkStructurePassed,
  a5IdHasContent,
  a5LabsNavStructurePassed,
  judgeA5,
} from "./a5-structure";
import type { AssignmentChecker } from "./checker-types";

/**
 * A5 history:
 *   v1: Lab pages graded on structure; the student's Node server (found
 *       from the Lab 5 links) graded on read-only GET routes with the
 *       checker's own numbers; Next.js Route Handlers on the deploy.
 * Kept here, not in checker-version.ts, until A5 is turned on.
 */
/** Saved runs with the server unreachable before its items go to TA review. */
export const A5_RECHECK_LIMIT = 3;

export const A5_CHECKER_RULES_VERSION = "a5-rules-v1";

export const A5_CHECKER_FOLLOWUP_CAP = 0;

export const A5_SEED_PATHS = ["/", "/labs", "/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4", "/labs/lab5"] as const;

export const A5_VERIFY_PATHS: Record<string, string> = {
  "a5-delivery-branch": "/",
  "a5-delivery-vercel": "/",
  "a5-delivery-name-github": "/labs",
  "a5-delivery-labs-nav": "/labs",
  "a5-delivery-server-links": "/labs",
  "a5-lab-page": "/labs/lab5",
  "a5-lab-server-url": "/labs/lab5",
  "a5-lab-path": "/labs/lab5",
  "a5-lab-path-oyo": "/labs/lab5",
  "a5-lab-query": "/labs/lab5",
  "a5-lab-query-oyo": "/labs/lab5",
  "a5-lab-object": "/labs/lab5",
  "a5-lab-module-oyo": "/labs/lab5",
  "a5-lab-todos": "/labs/lab5",
  "a5-lab-next-routes": "/labs/lab5",
  "a5-kambaz-courses-api": "/labs/lab5",
  "a5-kambaz-modules-api": "/labs/lab5",
};

/** Delivery items the shared runner grades itself. */
const RUNNER_DELIVERY = new Set(["a5-delivery-branch", "a5-delivery-vercel", "a5-delivery-name-github", "a5-delivery-labs-nav"]);

export const A5_AUTO_SPECS: A1RubricAutoSpec[] = A5_RUBRIC.groups.flatMap((group) =>
  group.criteria
    .filter((row) => !RUNNER_DELIVERY.has(row.id))
    .map((row) => {
      const fallback = A5_STRUCTURE_FALLBACKS[row.id];
      if (!fallback) throw new Error(`A5 item ${row.id} has no check`);
      return {
        criterionId: row.id,
        groupId: group.id,
        label: row.label,
        kind: "headings" as const,
        passMessage: `Found ${fallback.looksFor}.`,
        failMessage: fallback.missMessage,
      };
    }),
);

const autoIds = new Set<string>([...RUNNER_DELIVERY, ...A5_AUTO_SPECS.map((spec) => spec.criterionId)]);

export const A5_CHECKER: AssignmentChecker = {
  assignmentId: "a5",
  rulesVersion: A5_CHECKER_RULES_VERSION,
  idsOptional: true,
  structureFallbacks: A5_STRUCTURE_FALLBACKS,
  idHasContent: a5IdHasContent,
  judgeAutoSpecs: judgeA5,
  seedPaths: A5_SEED_PATHS,
  followupCap: A5_CHECKER_FOLLOWUP_CAP,
  recheckLimit: A5_RECHECK_LIMIT,
  verifyPaths: A5_VERIFY_PATHS,
  verifyHashes: {},
  autoSpecs: A5_AUTO_SPECS,
  autoIds,
  manualIds: new Set<string>(),
  manualRows: [],
  delivery: {
    vercelCriterionId: "a5-delivery-vercel",
    previewBranch: "a5",
    previewHostMessage:
      "Submit the Vercel address made for your a5 branch, for example https://webdev-client-git-a5-yourname.vercel.app: the part before .vercel.app must include -git-a5 (Vercel may cut a long address right after it). Find it in Vercel under Deployments, on the deployment for the a5 branch. Staff can override this at grading.",
    labsNav: {
      criterionId: "a5-delivery-labs-nav",
      groupId: "delivery",
      label: "Labs links",
      anyIds: ["wd-kambaz-link"],
      allHrefs: ["/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4", "/labs/lab5"],
      structurePassed: a5LabsNavStructurePassed,
      passMessage: "Found links to Labs 1–5 and Kambaz on the Labs pages.",
      failMessage: "The Labs pages should link to /labs/lab1 through /labs/lab5, and to your Kambaz screens.",
    },
    github: {
      criterionId: "a5-delivery-name-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a link to your GitHub repository on the Labs pages.",
      linkFailMessage: "We couldn't find a link to your GitHub repository (https://github.com/<you>/<repo>) on the Labs pages.",
      linkStructurePassed: a5GithubLinkStructurePassed,
    },
    name: { criterionId: "a5-delivery-name-github", groupId: "delivery", label: "Name on Labs" },
    branch: {
      criterionId: "a5-delivery-branch",
      groupId: "delivery",
      label: "a5 GitHub branch",
      branch: "a5",
      missingMessage:
        "Submit the GitHub URL of your repository, for example https://github.com/you/webdev-client (the a5 branch URL …/tree/a5 is fine too).",
      notFoundMessage:
        "GitHub returned HTTP 404 for that URL. Make sure the repository is public and the URL points to it (for example https://github.com/you/webdev-client).",
      passMessage: "GitHub /tree/a5 loaded (HTTP 200).",
      repoPassMessage: "Your GitHub repository URL loaded (HTTP 200).",
    },
  },
};
