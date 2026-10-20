import { A4_RUBRIC } from "./a4";
import type { A1RubricAutoSpec } from "./a1-rubric-types";
import {
  A4_PATH_PARAM_BASE,
  A4_PATH_PARAM_PROBES,
  A4_STRUCTURE_FALLBACKS,
  a4GithubLinkStructurePassed,
  a4IdHasContent,
  a4LabsNavStructurePassed,
} from "./a4-structure";
import type { AssignmentChecker } from "./checker-types";

/**
 * A4 history:
 *   v1: structure-only checks on the first (signed-out) render: Lab 4
 *       state widgets, path-parameter probes, Dashboard CRUD controls,
 *       Modules controls, and the signed-out account screens.
 * Kept here, not in checker-version.ts, until A4 is turned on.
 */
export const A4_CHECKER_RULES_VERSION = "a4-rules-v1";

export const A4_CHECKER_FOLLOWUP_CAP = 12;

export const A4_SEED_PATHS = [
  "/",
  "/labs",
  "/labs/lab1",
  "/labs/lab2",
  "/labs/lab3",
  "/labs/lab4",
  ...A4_PATH_PARAM_PROBES.map((probe) => `${A4_PATH_PARAM_BASE}/${probe.a}/${probe.b}`),
  "/dashboard",
  "/courses/RS101/home",
  "/courses/RS101/modules",
  "/courses/RS102/modules",
  "/account/signin",
  "/account/profile",
] as const;

export const A4_VERIFY_PATHS: Record<string, string> = {
  "a4-delivery-branch": "/",
  "a4-delivery-vercel": "/",
  "a4-delivery-name-github": "/labs",
  "a4-delivery-labs-nav": "/labs",
  "a4-lab-page": "/labs/lab4",
  "a4-lab-counters": "/labs/lab4",
  "a4-lab-boolean": "/labs/lab4",
  "a4-lab-string": "/labs/lab4",
  "a4-lab-date": "/labs/lab4",
  "a4-lab-object": "/labs/lab4",
  "a4-lab-object-city": "/labs/lab4",
  "a4-lab-array": "/labs/lab4",
  "a4-lab-todos": "/labs/lab4",
  "a4-lab-url": `${A4_PATH_PARAM_BASE}/12/30`,
  "a4-kambaz-dashboard-form": "/dashboard",
  "a4-kambaz-dashboard-fields": "/dashboard",
  "a4-kambaz-card-buttons": "/dashboard",
  "a4-kambaz-modules": "/courses/RS101/modules",
  "a4-kambaz-signin": "/account/signin",
  "a4-kambaz-account-nav": "/account/signin",
  "a4-kambaz-profile-guard": "/account/profile",
};

const DELIVERY_ROWS = new Set(["a4-delivery-branch", "a4-delivery-vercel", "a4-delivery-name-github", "a4-delivery-labs-nav"]);

export const A4_AUTO_SPECS: A1RubricAutoSpec[] = A4_RUBRIC.groups
  .flatMap((group) => group.criteria)
  .filter((row) => !DELIVERY_ROWS.has(row.id))
  .map((row) => {
    const groupId = row.id.startsWith("a4-lab-") ? ("lab" as const) : ("kambaz" as const);
    const fallback = A4_STRUCTURE_FALLBACKS[row.id];
    if (!fallback) throw new Error(`A4 item ${row.id} has no structure check`);
    return {
      criterionId: row.id,
      groupId,
      label: row.label,
      kind: "headings" as const,
      passMessage: `Found ${fallback.looksFor}.`,
      failMessage: fallback.missMessage,
    };
  });

/** "Needs TA review" keeps points only behind real work on the same screen family. */
export const A4_REVIEW_GATES: Record<string, { requires: string[]; minPassed: number }> = {
  "a4-lab-counters": { requires: ["a4-lab-page"], minPassed: 1 },
  "a4-lab-boolean": { requires: ["a4-lab-page"], minPassed: 1 },
  "a4-lab-object-city": { requires: ["a4-lab-object"], minPassed: 1 },
  "a4-lab-todos": { requires: ["a4-lab-page"], minPassed: 1 },
  "a4-lab-url": { requires: ["a4-lab-page"], minPassed: 1 },
  "a4-kambaz-modules": { requires: ["a4-kambaz-card-buttons", "a4-kambaz-dashboard-form"], minPassed: 1 },
  "a4-kambaz-profile-guard": { requires: ["a4-kambaz-signin"], minPassed: 1 },
};

const autoIds = new Set<string>([...DELIVERY_ROWS, ...A4_AUTO_SPECS.map((spec) => spec.criterionId)]);

export const A4_CHECKER: AssignmentChecker = {
  assignmentId: "a4",
  rulesVersion: A4_CHECKER_RULES_VERSION,
  idsOptional: true,
  structureFallbacks: A4_STRUCTURE_FALLBACKS,
  idHasContent: a4IdHasContent,
  reviewGates: A4_REVIEW_GATES,
  seedPaths: A4_SEED_PATHS,
  followupCap: A4_CHECKER_FOLLOWUP_CAP,
  extraCourseScreens: ["modules"],
  verifyPaths: A4_VERIFY_PATHS,
  verifyHashes: {},
  autoSpecs: A4_AUTO_SPECS,
  autoIds,
  manualIds: new Set<string>(),
  manualRows: [],
  delivery: {
    vercelCriterionId: "a4-delivery-vercel",
    previewBranch: "a4",
    previewHostMessage:
      "Submit the Vercel address made for your a4 branch, for example https://webdev-client-git-a4-yourname.vercel.app: the part before .vercel.app must include -git-a4 (Vercel may cut a long address right after it). Find it in Vercel under Deployments, on the deployment for the a4 branch. Staff can override this at grading.",
    labsNav: {
      criterionId: "a4-delivery-labs-nav",
      groupId: "delivery",
      label: "Labs links",
      anyIds: ["wd-kambaz-link"],
      allHrefs: ["/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4"],
      structurePassed: a4LabsNavStructurePassed,
      passMessage: "Found links to Labs 1–4 and Kambaz on the Labs pages.",
      failMessage: "The Labs pages should link to /labs/lab1, /labs/lab2, /labs/lab3, /labs/lab4, and to your Kambaz screens.",
    },
    github: {
      criterionId: "a4-delivery-name-github",
      groupId: "delivery",
      linkLabel: "GitHub link on Labs",
      linkPassMessage: "Found a link to your GitHub repository on the Labs pages.",
      linkFailMessage: "We couldn't find a link to your GitHub repository (https://github.com/<you>/<repo>) on the Labs pages.",
      linkStructurePassed: a4GithubLinkStructurePassed,
    },
    name: { criterionId: "a4-delivery-name-github", groupId: "delivery", label: "Name on Labs" },
    branch: {
      criterionId: "a4-delivery-branch",
      groupId: "delivery",
      label: "a4 GitHub branch",
      branch: "a4",
      missingMessage:
        "Submit the GitHub URL of your repository, for example https://github.com/you/webdev-client (the a4 branch URL …/tree/a4 is fine too).",
      notFoundMessage:
        "GitHub returned HTTP 404 for that URL. Make sure the repository is public and the URL points to it (for example https://github.com/you/webdev-client).",
      passMessage: "GitHub /tree/a4 loaded (HTTP 200).",
      repoPassMessage: "Your GitHub repository URL loaded (HTTP 200).",
    },
  },
};
