/**
 * A1 auto-check mapping.
 *
 * Auto (ids / headings / delivery probes):
 *   a1-delivery-vercel, a1-delivery-name-section, a1-delivery-github,
 *   a1-delivery-labs-nav, plus every criterion in A1_RUBRIC_AUTO_SPECS.
 * Manual (no extra required id):
 *   a1-lab-highlighted-paragraph-oyo, a1-lab-highlighted-box-oyo
 */
import type { RubricGroupId } from "./types";
import {
  htmlHasAllIds,
  htmlHasAnyId,
  htmlHasHeadingLevels,
  htmlHasId,
} from "./html";

export type RubricAutoKind = "ids" | "headings" | "manual";

export type A1RubricAutoSpec = {
  criterionId: string;
  groupId: RubricGroupId;
  label: string;
  kind: RubricAutoKind;
  requireAllIds?: string[];
  requireAnyIds?: string[];
  headingLevels?: number[];
  passMessage: string;
  failMessage: string;
};

export const A1_MANUAL_CRITERION_IDS = [
  "a1-lab-highlighted-paragraph-oyo",
  "a1-lab-highlighted-box-oyo",
] as const;

export const A1_RUBRIC_AUTO_SPECS: A1RubricAutoSpec[] = [
  {
    criterionId: "a1-lab-heading-tags",
    groupId: "lab",
    label: "HeadingTags",
    kind: "headings",
    requireAllIds: ["wd-h-tag"],
    headingLevels: [1, 2, 3, 4, 5, 6],
    passMessage: "Found wd-h-tag and heading tags h1–h6.",
    failMessage: "Lab 1 should include wd-h-tag and sample h1–h6 tags.",
  },
  {
    criterionId: "a1-lab-heading-tags-oyo",
    groupId: "lab",
    label: "HeadingTags — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-heading", "wd-your-span"],
    passMessage: "Found wd-your-heading and wd-your-span.",
    failMessage: "Add a personal heading with ids wd-your-heading and wd-your-span.",
  },
  {
    criterionId: "a1-lab-paragraph",
    groupId: "lab",
    label: "ParagraphTag",
    kind: "ids",
    requireAllIds: ["wd-p-tag"],
    requireAnyIds: ["wd-p-1", "wd-p-2"],
    passMessage: "Found paragraph sample ids on Lab 1.",
    failMessage: "Lab 1 should include wd-p-tag and sample paragraph ids.",
  },
  {
    criterionId: "a1-lab-paragraph-oyo",
    groupId: "lab",
    label: "ParagraphTag — On your own",
    kind: "ids",
    requireAllIds: ["wd-p-your-1", "wd-p-your-2"],
    passMessage: "Found wd-p-your-1 and wd-p-your-2.",
    failMessage: "Add personal paragraphs with ids wd-p-your-1 and wd-p-your-2.",
  },
  {
    criterionId: "a1-lab-lists",
    groupId: "lab",
    label: "ListTags",
    kind: "ids",
    requireAllIds: ["wd-lists", "wd-pancakes"],
    passMessage: "Found wd-lists and the pancake sample list.",
    failMessage: "Lab 1 should include wd-lists and wd-pancakes.",
  },
  {
    criterionId: "a1-lab-lists-oyo",
    groupId: "lab",
    label: "ListTags — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-favorite-recipe", "wd-your-books"],
    passMessage: "Found wd-your-favorite-recipe and wd-your-books.",
    failMessage:
      "Add personal lists with ids wd-your-favorite-recipe and wd-your-books.",
  },
  {
    criterionId: "a1-lab-tables",
    groupId: "lab",
    label: "Tables",
    kind: "ids",
    requireAllIds: ["wd-tables"],
    passMessage: "Found wd-tables.",
    failMessage: "Lab 1 should include a table with id wd-tables.",
  },
  {
    criterionId: "a1-lab-tables-oyo",
    groupId: "lab",
    label: "Tables — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-table"],
    passMessage: "Found wd-your-table.",
    failMessage: "Add a personal table with id wd-your-table.",
  },
  {
    criterionId: "a1-lab-images",
    groupId: "lab",
    label: "Images",
    kind: "ids",
    requireAllIds: ["wd-images"],
    requireAnyIds: ["wd-starship", "wd-teslabot"],
    passMessage: "Found wd-images and a sample image id.",
    failMessage: "Lab 1 should include wd-images plus wd-starship or wd-teslabot.",
  },
  {
    criterionId: "a1-lab-images-oyo",
    groupId: "lab",
    label: "Images — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-image"],
    passMessage: "Found wd-your-image.",
    failMessage: "Add a personal image with id wd-your-image.",
  },
  {
    criterionId: "a1-lab-forms",
    groupId: "lab",
    label: "Forms",
    kind: "ids",
    requireAllIds: ["wd-forms"],
    requireAnyIds: [
      "wd-text-fields-username",
      "wd-textarea",
      "wd-radio-comedy",
      "wd-select-one-genre",
    ],
    passMessage: "Found wd-forms and sample form field ids.",
    failMessage:
      "Lab 1 should include wd-forms and the sample text, textarea, radio, or select ids.",
  },
  {
    criterionId: "a1-lab-forms-oyo",
    groupId: "lab",
    label: "Forms — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-form"],
    passMessage: "Found wd-your-form.",
    failMessage: "Add a Student Profile form with id wd-your-form.",
  },
  {
    criterionId: "a1-lab-highlighted-paragraph",
    groupId: "lab",
    label: "HighlightedParagraph",
    kind: "ids",
    requireAllIds: ["wd-highlighted-paragraph"],
    passMessage: "Found wd-highlighted-paragraph.",
    failMessage: "Lab 1 should include wd-highlighted-paragraph.",
  },
  {
    criterionId: "a1-lab-highlighted-box",
    groupId: "lab",
    label: "HighlightedBox",
    kind: "ids",
    requireAllIds: ["wd-highlighted-box"],
    passMessage: "Found wd-highlighted-box.",
    failMessage: "Lab 1 should include wd-highlighted-box.",
  },
  {
    criterionId: "a1-lab-anchor",
    groupId: "lab",
    label: "AnchorTag",
    kind: "ids",
    requireAnyIds: ["wd-lipsum", "wd-github"],
    passMessage: "Found Lab 1 anchor ids (wd-lipsum or wd-github).",
    failMessage: "Lab 1 should include wd-lipsum and/or wd-github anchors.",
  },
  {
    criterionId: "a1-lab-anchor-oyo",
    groupId: "lab",
    label: "AnchorTag — On your own",
    kind: "ids",
    requireAllIds: ["wd-your-link", "wd-your-github"],
    passMessage: "Found wd-your-link and wd-your-github.",
    failMessage: "Add personal anchors wd-your-link and wd-your-github.",
  },
  {
    criterionId: "a1-lab-toc",
    groupId: "lab",
    label: "Labs TOC and layout",
    kind: "ids",
    requireAnyIds: ["wd-home-link", "wd-lab1-link", "wd-lab2-link"],
    passMessage: "Found Labs TOC / navigation ids.",
    failMessage: "Labs TOC should include wd-home-link or wd-lab1-link.",
  },
  {
    criterionId: "a1-lab-toc-oyo",
    groupId: "lab",
    label: "Labs TOC — On your own",
    kind: "ids",
    requireAnyIds: ["wd-lab4-link"],
    passMessage: "Found a Lab 4 link (wd-lab4-link).",
    failMessage: "Link Lab 4 from Labs (id wd-lab4-link).",
  },
  {
    criterionId: "a1-kambaz-account",
    groupId: "kambaz",
    label: "Account screens",
    kind: "ids",
    requireAllIds: ["wd-signin-screen"],
    requireAnyIds: ["wd-signup-screen", "wd-profile-screen", "wd-account-navigation"],
    passMessage: "Found Kambaz sign-in and another account screen id.",
    failMessage:
      "Open /account/signin and add Sign up / Profile / Account Navigation ids from Chapter 1.",
  },
  {
    criterionId: "a1-kambaz-dashboard",
    groupId: "kambaz",
    label: "Dashboard",
    kind: "ids",
    requireAllIds: ["wd-dashboard"],
    passMessage: "Found wd-dashboard.",
    failMessage: "Dashboard should use id wd-dashboard.",
  },
  {
    criterionId: "a1-kambaz-nav",
    groupId: "kambaz",
    label: "Kambaz navigation",
    kind: "ids",
    requireAnyIds: ["wd-kambaz-navigation", "wd-kambaz", "wd-account-link"],
    passMessage: "Found Kambaz navigation ids.",
    failMessage: "Kambaz layout should include wd-kambaz-navigation (or wd-kambaz).",
  },
  {
    criterionId: "a1-kambaz-course-nav",
    groupId: "kambaz",
    label: "Course navigation",
    kind: "ids",
    requireAnyIds: [
      "wd-courses-navigation",
      "wd-course-home-link",
      "wd-course-modules-link",
      "wd-course-piazza-link",
    ],
    passMessage: "Found course navigation ids.",
    failMessage:
      "Course pages should include wd-courses-navigation or the course nav link ids.",
  },
  {
    criterionId: "a1-kambaz-modules",
    groupId: "kambaz",
    label: "Modules",
    kind: "ids",
    requireAnyIds: ["wd-modules", "wd-modules-controls"],
    passMessage: "Found Modules ids.",
    failMessage: "Modules should use id wd-modules.",
  },
  {
    criterionId: "a1-kambaz-home",
    groupId: "kambaz",
    label: "Course Home",
    kind: "ids",
    requireAnyIds: ["wd-home", "wd-course-status"],
    passMessage: "Found Course Home ids.",
    failMessage: "Course Home should include wd-home or wd-course-status.",
  },
  {
    criterionId: "a1-kambaz-assignments",
    groupId: "kambaz",
    label: "Assignments screen",
    kind: "ids",
    requireAnyIds: ["wd-assignments", "wd-assignment-list"],
    passMessage: "Found Assignments screen ids.",
    failMessage: "Assignments should use id wd-assignments.",
  },
  {
    criterionId: "a1-kambaz-editor",
    groupId: "kambaz",
    label: "Assignment Editor",
    kind: "ids",
    requireAnyIds: ["wd-assignments-editor", "wd-name"],
    passMessage: "Found Assignment Editor ids.",
    failMessage: "Assignment Editor should include wd-assignments-editor or wd-name.",
  },
];

export function evaluateRubricSpec(
  spec: A1RubricAutoSpec,
  html: string,
): { passed: boolean; message: string } {
  if (spec.kind === "manual") {
    return { passed: false, message: spec.failMessage };
  }

  const missing: string[] = [];
  if (spec.requireAllIds?.length) {
    const all = htmlHasAllIds(html, spec.requireAllIds);
    missing.push(...all.missing);
  }
  if (spec.requireAnyIds?.length && !htmlHasAnyId(html, spec.requireAnyIds)) {
    missing.push(`one of ${spec.requireAnyIds.join(", ")}`);
  }
  if (spec.headingLevels?.length) {
    const headings = htmlHasHeadingLevels(html, spec.headingLevels);
    if (!headings.ok) {
      missing.push(`h${headings.missing.join("/h")}`);
    }
  }

  if (missing.length === 0 && spec.requireAllIds?.length) {
    return { passed: true, message: spec.passMessage };
  }
  if (
    missing.length === 0 &&
    (spec.requireAnyIds?.length || spec.headingLevels?.length)
  ) {
    return { passed: true, message: spec.passMessage };
  }
  if (missing.length === 0) {
    return { passed: htmlHasId(html, "wd-lab1"), message: spec.passMessage };
  }
  return {
    passed: false,
    message: `${spec.failMessage} Missing: ${missing.join(", ")}.`,
  };
}

export function isManualA1Criterion(criterionId: string): boolean {
  return (A1_MANUAL_CRITERION_IDS as readonly string[]).includes(criterionId);
}

const DELIVERY_AUTO_IDS = [
  "a1-delivery-vercel",
  "a1-delivery-name-section",
  "a1-delivery-github",
  "a1-delivery-labs-nav",
] as const;

export function a1CriterionCoverage(
  criterionId: string,
): "auto" | "manual" {
  if (isManualA1Criterion(criterionId)) return "manual";
  if (A1_RUBRIC_AUTO_SPECS.some((spec) => spec.criterionId === criterionId)) {
    return "auto";
  }
  if ((DELIVERY_AUTO_IDS as readonly string[]).includes(criterionId)) {
    return "auto";
  }
  return "manual";
}
