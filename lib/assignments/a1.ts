import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A1, regrouped like the Canvas rubric:
 * Delivery / Lab HTML / Kambaz Ch1.
 *
 * Canvas graders still use Best / Better / Almost / Missing. This module
 * stores only the max points students see beside each row.
 */
export const A1_RUBRIC: AssignmentRubric = {
  assignmentId: "a1",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        "Submit a Vercel URL that graders can open without signing in. A public GitHub repository is optional for auto-checks, but graders still look for the repo and a wd-github link on Labs.",
      criteria: [
        {
          id: "a1-delivery-vercel",
          label: "Vercel deployment",
          description:
            "Import webdev-client on Vercel, disable Deployment Protection, and submit a URL that opens without a Vercel login.",
          points: 3,
          bookHref: "/book/ch1#sec-1-6",
          bookLabel: "§1.6",
        },
        {
          id: "a1-delivery-name-section",
          label: "Name and section",
          description:
            "Labs shows your full name (first then last, matching Canvas) so graders can identify the work.",
          points: 3,
          bookHref: "/book/ch1#sec-1-7",
          bookLabel: "§1.7",
        },
        {
          id: "a1-delivery-github",
          label: "GitHub repository",
          description:
            "Public webdev-client repo with the source that produced the deploy, plus a wd-github link on Labs.",
          points: 3,
          bookHref: "/book/ch1#sec-1-5",
          bookLabel: "§1.5",
        },
        {
          id: "a1-delivery-labs-nav",
          label: "Labs navigation",
          description:
            "Labs index and TOC list the labs and a Kambaz link so graders can reach every required page.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-10",
          bookLabel: "§1.3.10",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab — HTML components",
      intro:
        "Build each Lab 1 component in app/labs/lab1, then add the personal On your own rows in the same files.",
      criteria: [
        {
          id: "a1-lab-heading-tags",
          label: "HeadingTags",
          description:
            "Create HeadingTags.tsx with sample h1–h6 tags and import it on the Lab 1 page.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-1",
          bookLabel: "§1.3.1",
        },
        {
          id: "a1-lab-heading-tags-oyo",
          label: "HeadingTags — On your own",
          description:
            "Personal heading under wd-your-heading, including a span with id wd-your-span.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-1",
          bookLabel: "§1.3.1",
          onYourOwn: true,
        },
        {
          id: "a1-lab-paragraph",
          label: "ParagraphTag",
          description:
            "Create ParagraphTag.tsx and wrap sample text in paragraph tags for vertical spacing.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-2",
          bookLabel: "§1.3.2",
        },
        {
          id: "a1-lab-paragraph-oyo",
          label: "ParagraphTag — On your own",
          description:
            "Two personal paragraphs with ids wd-p-your-1 and wd-p-your-2.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-2",
          bookLabel: "§1.3.2",
          onYourOwn: true,
        },
        {
          id: "a1-lab-lists",
          label: "ListTags",
          description:
            "Create ListTags.tsx with the pancake ordered list and the sample book unordered list.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-3",
          bookLabel: "§1.3.3",
        },
        {
          id: "a1-lab-lists-oyo",
          label: "ListTags — On your own",
          description:
            "Favorite recipe ordered list (wd-your-favorite-recipe) and favorites unordered list (wd-your-books).",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-3",
          bookLabel: "§1.3.3",
          onYourOwn: true,
        },
        {
          id: "a1-lab-tables",
          label: "Tables",
          description:
            "Create Tables.tsx with the quiz grades table (Q1–Q3) and an average row.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-4",
          bookLabel: "§1.3.4",
        },
        {
          id: "a1-lab-tables-oyo",
          label: "Tables — On your own",
          description: "Second personal table with id wd-your-table.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-4",
          bookLabel: "§1.3.4",
          onYourOwn: true,
        },
        {
          id: "a1-lab-images",
          label: "Images",
          description:
            "Create Images.tsx with the remote Starship image and the local teslabot image.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-5",
          bookLabel: "§1.3.5",
        },
        {
          id: "a1-lab-images-oyo",
          label: "Images — On your own",
          description: "Your image with id wd-your-image.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-5",
          bookLabel: "§1.3.5",
          onYourOwn: true,
        },
        {
          id: "a1-lab-forms",
          label: "Forms",
          description:
            "Build the form components under app/labs/lab1/forms/ (text, textarea, radio, checkboxes, dropdowns, other types, buttons) and assemble them in Forms.tsx.",
          points: 5,
          bookHref: "/book/ch1#sec-1-3-6",
          bookLabel: "§1.3.6",
        },
        {
          id: "a1-lab-forms-oyo",
          label: "Forms — On your own",
          description:
            "Student Profile form in YourForm.tsx (wd-your-form) covering the field types from the chapter, plus Save and Cancel.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-6",
          bookLabel: "§1.3.6",
          onYourOwn: true,
        },
        {
          id: "a1-lab-highlighted-paragraph",
          label: "HighlightedParagraph",
          description:
            "Create HighlightedParagraph.tsx with text and style props (attributes only) and show a few variations.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-7",
          bookLabel: "§1.3.7",
        },
        {
          id: "a1-lab-highlighted-paragraph-oyo",
          label: "HighlightedParagraph — On your own",
          description:
            "Extra HighlightedParagraph with your text and colors.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-7",
          bookLabel: "§1.3.7",
          onYourOwn: true,
        },
        {
          id: "a1-lab-highlighted-box",
          label: "HighlightedBox",
          description:
            "Create HighlightedBox.tsx that wraps nested children with the same style props.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-8",
          bookLabel: "§1.3.8",
        },
        {
          id: "a1-lab-highlighted-box-oyo",
          label: "HighlightedBox — On your own",
          description: "Extra HighlightedBox wrapping your goals list.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-8",
          bookLabel: "§1.3.8",
          onYourOwn: true,
        },
        {
          id: "a1-lab-anchor",
          label: "AnchorTag",
          description:
            "Create AnchorTag.tsx with lipsum plus GitHub anchors and import it on the Lab 1 page.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-9",
          bookLabel: "§1.3.9",
        },
        {
          id: "a1-lab-anchor-oyo",
          label: "AnchorTag — On your own",
          description:
            "Personal anchors wd-your-link and wd-your-github.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-9",
          bookLabel: "§1.3.9",
          onYourOwn: true,
        },
        {
          id: "a1-lab-toc",
          label: "Labs TOC and layout",
          description:
            "Create app/labs/TOC.tsx and app/labs/layout.tsx so the TOC wraps lab pages via children.",
          points: 3,
          bookHref: "/book/ch1#sec-1-3-11",
          bookLabel: "§1.3.11",
        },
        {
          id: "a1-lab-toc-oyo",
          label: "Labs TOC — On your own",
          description:
            "Personal note or link in the labs TOC, and Lab 4 linked from the Labs index.",
          points: 2,
          bookHref: "/book/ch1#sec-1-3-11",
          bookLabel: "§1.3.11",
          onYourOwn: true,
        },
      ],
    },
    {
      id: "kambaz",
      title: "Kambaz — Chapter 1 screens",
      intro:
        "Prototype the Kambaz screens with HTML and the App Router. Assignments and the editor stay On your own.",
      criteria: [
        {
          id: "a1-kambaz-account",
          label: "Account screens",
          description:
            "Sign in, Sign up, Profile, and Account Navigation, with / and /account redirecting to /account/signin.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-2",
          bookLabel: "§1.4.2",
        },
        {
          id: "a1-kambaz-dashboard",
          label: "Dashboard",
          description:
            "Dashboard with at least three CourseCards linking to /courses/[cid]/home.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-3",
          bookLabel: "§1.4.3",
        },
        {
          id: "a1-kambaz-nav",
          label: "Kambaz navigation",
          description:
            "Kambaz Navigation sidebar in the (kambaz) layout; Sign in (wd-signin-btn) points at /dashboard.",
          points: 3,
          bookHref: "/book/ch1#sec-1-4-3-1",
          bookLabel: "§1.4.3.1",
        },
        {
          id: "a1-kambaz-course-nav",
          label: "Course navigation",
          description:
            "Course Navigation and course layout, including placeholder pages for Piazza, Zoom, Quizzes, Grades, and People.",
          points: 3,
          bookHref: "/book/ch1#sec-1-4-4",
          bookLabel: "§1.4.4",
        },
        {
          id: "a1-kambaz-modules",
          label: "Modules",
          description:
            "Modules page with Module and Lesson, nested weeks, lessons, and content items.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-5",
          bookLabel: "§1.4.5",
        },
        {
          id: "a1-kambaz-home",
          label: "Course Home",
          description:
            "Home assembles Modules plus Course Status. No leftover page.tsx directly under courses/[cid]/.",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-6",
          bookLabel: "§1.4.6",
        },
        {
          id: "a1-kambaz-assignments",
          label: "Assignments screen",
          description:
            "Assignments list matching the book LiveDemo and required ids (On your own).",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-7",
          bookLabel: "§1.4.7",
          onYourOwn: true,
        },
        {
          id: "a1-kambaz-editor",
          label: "Assignment Editor",
          description:
            "Assignment Editor matching the book LiveDemo and required ids (On your own).",
          points: 5,
          bookHref: "/book/ch1#sec-1-4-8",
          bookLabel: "§1.4.8",
          onYourOwn: true,
        },
      ],
    },
  ],
};
