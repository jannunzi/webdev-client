/**
 * Shared Lab 1 exercise catalog for A1 and book §1.3.12.
 *
 * Order is chronological: the sequence students meet while reading
 * Chapter 1.3 (create the component, On your own, With AI, next section).
 * A1's Lab checklist and the §1.3.12 recap both render this list as one
 * parent item per section with nested a/b/c tasks.
 */
import type { RubricCriterion } from "./types";
import type { A1RubricAutoSpec } from "./a1-rubric-types";

export type LabExerciseKind = "core" | "oyo" | "ai";

export type A1LabExerciseAuto = {
  kind: "ids" | "headings";
  requireAllIds?: string[];
  requireAnyIds?: string[];
  headingLevels?: number[];
  requireHtmlIncludes?: string[];
  passMessage: string;
  failMessage: string;
};

export type A1LabExercise = {
  id: string;
  kind: LabExerciseKind;
  label: string;
  description: string;
  points: number;
  section: string;
  verifyPath: string;
  /** Present when auto-check can look at Lab HTML. Omitted = manual. */
  auto?: A1LabExerciseAuto;
};

/** One Lab section (1.3.1–1.3.11) with its create / On your own / With AI tasks. */
export type A1LabExerciseGroup = {
  section: string;
  label: string;
  tasks: readonly A1LabExercise[];
};

export function labExerciseKindLabel(kind: LabExerciseKind): string {
  if (kind === "core") return "Lab component";
  if (kind === "oyo") return "On your own";
  return "With AI";
}

export function groupA1LabExercises(
  exercises: readonly A1LabExercise[],
): A1LabExerciseGroup[] {
  const order: string[] = [];
  const tasksBySection = new Map<string, A1LabExercise[]>();
  for (const exercise of exercises) {
    const existing = tasksBySection.get(exercise.section);
    if (!existing) {
      order.push(exercise.section);
      tasksBySection.set(exercise.section, [exercise]);
    } else {
      existing.push(exercise);
    }
  }
  return order.map((section) => {
    const tasks = tasksBySection.get(section)!;
    const core = tasks.find((task) => task.kind === "core") ?? tasks[0];
    return { section, label: core.label, tasks };
  });
}

export const A1_LAB_EXERCISES: readonly A1LabExercise[] = [
  {
    id: "a1-lab-heading-tags",
    kind: "core",
    label: "HeadingTags",
    description:
      "Create HeadingTags.tsx with sample h1–h6 tags and import it on the Lab 1 page.",
    points: 3,
    section: "1.3.1",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "headings",
      requireAllIds: ["wd-h-tag"],
      headingLevels: [1, 2, 3, 4, 5, 6],
      passMessage: "Found wd-h-tag and heading tags h1–h6.",
      failMessage: "Lab 1 should include wd-h-tag and sample h1–h6 tags.",
    },
  },
  {
    id: "a1-lab-heading-tags-oyo",
    kind: "oyo",
    label: "HeadingTags — On your own",
    description:
      "Personal heading under wd-your-heading, including a span with id wd-your-span.",
    points: 2,
    section: "1.3.1",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-heading", "wd-your-span"],
      passMessage: "Found wd-your-heading and wd-your-span.",
      failMessage:
        "Add a personal heading with ids wd-your-heading and wd-your-span.",
    },
  },
  {
    id: "a1-lab-heading-tags-ai",
    kind: "ai",
    label: "HeadingTags — With AI",
    description:
      "Sample outline with id wd-ai-headings (h4 Lab notes, h5 What I built, h6 Next step).",
    points: 2,
    section: "1.3.1",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-ai-headings"],
      passMessage: "Found wd-ai-headings.",
      failMessage: "Add the With AI sample outline with id wd-ai-headings.",
    },
  },
  {
    id: "a1-lab-paragraph",
    kind: "core",
    label: "ParagraphTag",
    description:
      "Create ParagraphTag.tsx and wrap sample text in paragraph tags for vertical spacing.",
    points: 3,
    section: "1.3.2",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-p-tag"],
      requireAnyIds: ["wd-p-1", "wd-p-2"],
      passMessage: "Found paragraph sample ids on Lab 1.",
      failMessage: "Lab 1 should include wd-p-tag and sample paragraph ids.",
    },
  },
  {
    id: "a1-lab-paragraph-oyo",
    kind: "oyo",
    label: "ParagraphTag — On your own",
    description: "Two personal paragraphs with ids wd-p-your-1 and wd-p-your-2.",
    points: 2,
    section: "1.3.2",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-p-your-1", "wd-p-your-2"],
      passMessage: "Found wd-p-your-1 and wd-p-your-2.",
      failMessage: "Add personal paragraphs with ids wd-p-your-1 and wd-p-your-2.",
    },
  },
  {
    id: "a1-lab-paragraph-ai",
    kind: "ai",
    label: "ParagraphTag — With AI",
    description:
      "Extra sample paragraph with id wd-ai-p that explains why wrapping text in p creates vertical spacing.",
    points: 2,
    section: "1.3.2",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-ai-p"],
      passMessage: "Found wd-ai-p.",
      failMessage: "Add the With AI sample paragraph with id wd-ai-p.",
    },
  },
  {
    id: "a1-lab-lists",
    kind: "core",
    label: "ListTags",
    description:
      "Create ListTags.tsx with the pancake ordered list and the sample book unordered list.",
    points: 3,
    section: "1.3.3",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-lists", "wd-pancakes"],
      passMessage: "Found wd-lists and the pancake sample list.",
      failMessage: "Lab 1 should include wd-lists and wd-pancakes.",
    },
  },
  {
    id: "a1-lab-lists-oyo",
    kind: "oyo",
    label: "ListTags — On your own",
    description:
      "Favorite recipe ordered list (wd-your-favorite-recipe) and favorites unordered list (wd-your-books).",
    points: 2,
    section: "1.3.3",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-favorite-recipe", "wd-your-books"],
      passMessage: "Found wd-your-favorite-recipe and wd-your-books.",
      failMessage:
        "Add personal lists with ids wd-your-favorite-recipe and wd-your-books.",
    },
  },
  {
    id: "a1-lab-lists-ai",
    kind: "ai",
    label: "ListTags — With AI",
    description:
      "Sample HTML-tags list with id wd-ai-html-tags (at least five tags from this chapter).",
    points: 2,
    section: "1.3.3",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-ai-html-tags"],
      passMessage: "Found wd-ai-html-tags.",
      failMessage: "Add the With AI HTML-tags list with id wd-ai-html-tags.",
    },
  },
  {
    id: "a1-lab-tables",
    kind: "core",
    label: "Tables",
    description:
      "Create Tables.tsx with the quiz grades table (Q1–Q3) and an average row.",
    points: 3,
    section: "1.3.4",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-tables"],
      passMessage: "Found wd-tables.",
      failMessage: "Lab 1 should include a table with id wd-tables.",
    },
  },
  {
    id: "a1-lab-tables-oyo",
    kind: "oyo",
    label: "Tables — On your own",
    description: "Second personal table with id wd-your-table.",
    points: 2,
    section: "1.3.4",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-table"],
      passMessage: "Found wd-your-table.",
      failMessage: "Add a personal table with id wd-your-table.",
    },
  },
  {
    id: "a1-lab-tables-ai",
    kind: "ai",
    label: "Tables — With AI",
    description:
      "Quiz rows Q4–Q10 in the sample grades table, with a recalculated average from all ten scores.",
    points: 2,
    section: "1.3.4",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireHtmlIncludes: ["Q4", "Q10"],
      passMessage: "Found Q4 and Q10 in the quiz table.",
      failMessage:
        "Extend the quiz table with rows Q4–Q10 and recalculate the average.",
    },
  },
  {
    id: "a1-lab-images",
    kind: "core",
    label: "Images",
    description:
      "Create Images.tsx with the remote Starship image and the local teslabot image.",
    points: 3,
    section: "1.3.5",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-images"],
      requireAnyIds: ["wd-starship", "wd-teslabot"],
      passMessage: "Found wd-images and a sample image id.",
      failMessage: "Lab 1 should include wd-images plus wd-starship or wd-teslabot.",
    },
  },
  {
    id: "a1-lab-images-oyo",
    kind: "oyo",
    label: "Images — On your own",
    description: "Your image with id wd-your-image.",
    points: 2,
    section: "1.3.5",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-image"],
      passMessage: "Found wd-your-image.",
      failMessage: "Add a personal image with id wd-your-image.",
    },
  },
  {
    id: "a1-lab-images-ai",
    kind: "ai",
    label: "Images — With AI",
    description: "Extra sample image with id wd-ai-image from a public URL.",
    points: 2,
    section: "1.3.5",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-ai-image"],
      passMessage: "Found wd-ai-image.",
      failMessage: "Add the With AI sample image with id wd-ai-image.",
    },
  },
  {
    id: "a1-lab-forms",
    kind: "core",
    label: "Forms",
    description:
      "Build the form components under app/labs/lab1/forms/ (text, textarea, radio, checkboxes, dropdowns, other types, buttons) and assemble them in Forms.tsx.",
    points: 5,
    section: "1.3.6",
    verifyPath: "/labs/lab1",
    auto: {
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
  },
  {
    id: "a1-lab-forms-oyo",
    kind: "oyo",
    label: "Forms — On your own",
    description:
      "Student Profile form in YourForm.tsx (wd-your-form) covering the field types from the chapter, plus Save and Cancel.",
    points: 3,
    section: "1.3.6",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-form"],
      passMessage: "Found wd-your-form.",
      failMessage: "Add a Student Profile form with id wd-your-form.",
    },
  },
  {
    id: "a1-lab-forms-ai",
    kind: "ai",
    label: "Forms — With AI",
    description:
      "Scaffold YourForm.tsx with the sample prompt, then replace every SAMPLE default with your own details.",
    points: 2,
    section: "1.3.6",
    verifyPath: "/labs/lab1",
  },
  {
    id: "a1-lab-highlighted-paragraph",
    kind: "core",
    label: "HighlightedParagraph",
    description:
      "Create HighlightedParagraph.tsx with text and style props (attributes only) and show a few variations.",
    points: 3,
    section: "1.3.7",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-highlighted-paragraph"],
      passMessage: "Found wd-highlighted-paragraph.",
      failMessage: "Lab 1 should include wd-highlighted-paragraph.",
    },
  },
  {
    id: "a1-lab-highlighted-paragraph-oyo",
    kind: "oyo",
    label: "HighlightedParagraph — On your own",
    description: "Extra HighlightedParagraph with your text and colors.",
    points: 2,
    section: "1.3.7",
    verifyPath: "/labs/lab1",
  },
  {
    id: "a1-lab-highlighted-paragraph-ai",
    kind: "ai",
    label: "HighlightedParagraph — With AI",
    description:
      "Extra sample HighlightedParagraph (not your personal sentence) with different colors.",
    points: 2,
    section: "1.3.7",
    verifyPath: "/labs/lab1",
  },
  {
    id: "a1-lab-highlighted-box",
    kind: "core",
    label: "HighlightedBox",
    description:
      "Create HighlightedBox.tsx that wraps nested children with the same style props.",
    points: 3,
    section: "1.3.8",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-highlighted-box"],
      passMessage: "Found wd-highlighted-box.",
      failMessage: "Lab 1 should include wd-highlighted-box.",
    },
  },
  {
    id: "a1-lab-highlighted-box-oyo",
    kind: "oyo",
    label: "HighlightedBox — On your own",
    description: "Extra HighlightedBox wrapping your goals list.",
    points: 2,
    section: "1.3.8",
    verifyPath: "/labs/lab1",
  },
  {
    id: "a1-lab-highlighted-box-ai",
    kind: "ai",
    label: "HighlightedBox — With AI",
    description:
      "Extra sample HighlightedBox of nested tags (not your personal goals list).",
    points: 2,
    section: "1.3.8",
    verifyPath: "/labs/lab1",
  },
  {
    id: "a1-lab-anchor",
    kind: "core",
    label: "AnchorTag",
    description:
      "Create AnchorTag.tsx with lipsum plus GitHub anchors and import it on the Lab 1 page.",
    points: 3,
    section: "1.3.9",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAnyIds: ["wd-lipsum", "wd-github"],
      passMessage: "Found Lab 1 anchor ids (wd-lipsum or wd-github).",
      failMessage: "Lab 1 should include wd-lipsum and/or wd-github anchors.",
    },
  },
  {
    id: "a1-lab-anchor-oyo",
    kind: "oyo",
    label: "AnchorTag — On your own",
    description: "Personal anchors wd-your-link and wd-your-github.",
    points: 2,
    section: "1.3.9",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-your-link", "wd-your-github"],
      passMessage: "Found wd-your-link and wd-your-github.",
      failMessage: "Add personal anchors wd-your-link and wd-your-github.",
    },
  },
  {
    id: "a1-lab-anchor-ai",
    kind: "ai",
    label: "AnchorTag — With AI",
    description: "Sample docs link with id wd-ai-link (for example MDN table element).",
    points: 2,
    section: "1.3.9",
    verifyPath: "/labs/lab1",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-ai-link"],
      passMessage: "Found wd-ai-link.",
      failMessage: "Add the With AI sample docs link with id wd-ai-link.",
    },
  },
  {
    id: "a1-delivery-labs-nav",
    kind: "core",
    label: "Labs navigation",
    description:
      "Labs index at app/labs/page.tsx lists Lab 1–3 with Link, plus a Kambaz link so graders can reach every required page.",
    points: 3,
    section: "1.3.10",
    verifyPath: "/labs",
    // Special-cased in runA1Checks (labs HTML / navigation ids).
  },
  {
    id: "a1-lab-labs-nav-oyo",
    kind: "oyo",
    label: "Labs navigation — On your own",
    description:
      "Create Lab 4 and link to it from the Labs index (id wd-lab4-link).",
    points: 2,
    section: "1.3.10",
    verifyPath: "/labs",
    auto: {
      kind: "ids",
      requireAnyIds: ["wd-lab4-link"],
      passMessage: "Found a Lab 4 link (wd-lab4-link).",
      failMessage: "Link Lab 4 from Labs (id wd-lab4-link).",
    },
  },
  {
    id: "a1-lab-labs-nav-ai",
    kind: "ai",
    label: "Labs navigation — With AI",
    description:
      "Lab 5 placeholder page and a Labs index link to /labs/lab5.",
    points: 2,
    section: "1.3.10",
    verifyPath: "/labs",
    auto: {
      kind: "ids",
      requireHtmlIncludes: ["/labs/lab5"],
      passMessage: "Found a Lab 5 index link.",
      failMessage: "Add a Lab 5 placeholder and link it from the Labs index.",
    },
  },
  {
    id: "a1-lab-toc",
    kind: "core",
    label: "Labs TOC and layout",
    description:
      "Create app/labs/TOC.tsx and app/labs/layout.tsx so the TOC wraps lab pages via children.",
    points: 3,
    section: "1.3.11",
    verifyPath: "/labs",
    auto: {
      kind: "ids",
      requireAnyIds: ["wd-home-link", "wd-lab1-link", "wd-lab2-link"],
      passMessage: "Found Labs TOC / navigation ids.",
      failMessage: "Labs TOC should include wd-home-link or wd-lab1-link.",
    },
  },
  {
    id: "a1-lab-toc-oyo",
    kind: "oyo",
    label: "Labs TOC — On your own",
    description:
      "Personal note or link in the labs TOC — your name, a one-line motto, or a link back to the book.",
    points: 2,
    section: "1.3.11",
    verifyPath: "/labs",
  },
  {
    id: "a1-lab-toc-ai",
    kind: "ai",
    label: "Labs TOC — With AI",
    description:
      "Chapter 1 link in the labs TOC (id wd-toc-book-link) labeled Chapter 1.",
    points: 2,
    section: "1.3.11",
    verifyPath: "/labs",
    auto: {
      kind: "ids",
      requireAllIds: ["wd-toc-book-link"],
      passMessage: "Found wd-toc-book-link.",
      failMessage: "Add a Chapter 1 link in the labs TOC with id wd-toc-book-link.",
    },
  },
];

export const A1_LAB_EXERCISE_GROUPS: readonly A1LabExerciseGroup[] =
  groupA1LabExercises(A1_LAB_EXERCISES);

const LAB_NEST_UNDER_BY_ID: Readonly<Record<string, string>> = Object.fromEntries(
  A1_LAB_EXERCISE_GROUPS.flatMap((group) =>
    group.tasks.map((task) => [task.id, group.label]),
  ),
);

export function bookHrefForSection(section: string): string {
  return `/book/ch1#sec-${section.split(".").join("-")}`;
}

export function bookLabelForSection(section: string): string {
  return `§${section}`;
}

export function labExerciseToCriterion(exercise: A1LabExercise): RubricCriterion {
  return {
    id: exercise.id,
    label: exercise.label,
    description: exercise.description,
    points: exercise.points,
    bookHref: bookHrefForSection(exercise.section),
    bookLabel: bookLabelForSection(exercise.section),
    onYourOwn: exercise.kind === "oyo" || undefined,
    withAI: exercise.kind === "ai" || undefined,
    nestUnder: LAB_NEST_UNDER_BY_ID[exercise.id],
  };
}

export function a1LabCriteria(): RubricCriterion[] {
  return A1_LAB_EXERCISES.map(labExerciseToCriterion);
}

export function a1LabAutoSpecs(): A1RubricAutoSpec[] {
  return A1_LAB_EXERCISES.filter((exercise) => exercise.auto).map((exercise) => {
    const auto = exercise.auto!;
    return {
      criterionId: exercise.id,
      groupId: "lab",
      label: exercise.label,
      kind: auto.kind,
      requireAllIds: auto.requireAllIds,
      requireAnyIds: auto.requireAnyIds,
      headingLevels: auto.headingLevels,
      requireHtmlIncludes: auto.requireHtmlIncludes,
      passMessage: auto.passMessage,
      failMessage: auto.failMessage,
    };
  });
}

/** Labs navigation is auto-checked in runA1Checks, not via a rubric spec. */
export const A1_LAB_SPECIAL_AUTO_IDS = ["a1-delivery-labs-nav"] as const;

export function a1LabManualIds(): string[] {
  return A1_LAB_EXERCISES.filter(
    (exercise) =>
      !exercise.auto &&
      !(A1_LAB_SPECIAL_AUTO_IDS as readonly string[]).includes(exercise.id),
  ).map((exercise) => exercise.id);
}

export function a1LabVerifyPaths(): Record<string, string> {
  return Object.fromEntries(
    A1_LAB_EXERCISES.map((exercise) => [exercise.id, exercise.verifyPath]),
  );
}

export function isA1LabExerciseId(criterionId: string): boolean {
  return A1_LAB_EXERCISES.some((exercise) => exercise.id === criterionId);
}
