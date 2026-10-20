import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A4 (Chapter 4: events, state, Context, Zustand,
 * Redux, and the stateful Kambaz). The checker reads the pages as they first
 * load (signed out), so every item names what that first render shows:
 * element, count, structure. Clicks, alerts, document.title, and screens
 * that need a signed-in user are not graded here (see the A4 PR notes).
 * wd-* ids help staff find things but never cost points.
 */
export const A4_RUBRIC: AssignmentRubric = {
  assignmentId: "a4",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        "Push an a4 branch on the same webdev-client repo and submit that branch’s Vercel URL. Run npm run build before you push.",
      criteria: [
        {
          id: "a4-delivery-branch",
          label: "a4 GitHub branch",
          description:
            "Create, commit, and push a branch named a4 on the same public repository. Submit your repository’s GitHub URL (the repository root or the …/tree/a4 branch URL both work). The URL must load.",
          points: 3,
          bookHref: "/book/ch4#sec-4-12",
          bookLabel: "§4.12",
        },
        {
          id: "a4-delivery-vercel",
          label: "Vercel branch deployment",
          description:
            "Branch deployments are on, so a4 has its own preview URL whose hostname contains -git-a4-, with Deployment Protection off.",
          points: 3,
          bookHref: "/book/ch4#sec-4-12",
          bookLabel: "§4.12",
        },
        {
          id: "a4-delivery-name-github",
          label: "Name and GitHub link",
          description:
            "The Labs pages show your full name (first name first, matching Canvas) and a link to your GitHub repository (https://github.com/<you>/<repo>).",
          points: 3,
          bookHref: "/book/ch4#sec-4-12",
          bookLabel: "§4.12",
        },
        {
          id: "a4-delivery-labs-nav",
          label: "Labs links",
          description:
            "The Labs pages link to /labs/lab1 through /labs/lab4, and to your Kambaz screens.",
          points: 3,
          bookHref: "/book/ch4#sec-4-12",
          bookLabel: "§4.12",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab 4 — events, state, and stores",
      intro:
        "Build Lab 4 at /labs/lab4 from §4.2–§4.7. Each item says what the page shows when it first loads; you may change labels and starting values.",
      criteria: [
        {
          id: "a4-lab-page",
          label: "Lab 4 page",
          description:
            "/labs/lab4 shows a titled section for each exercise in §4.2–§4.7 (at least 15 section headings and 15 buttons).",
          points: 5,
          bookHref: "/book/ch4#sec-4-2",
          bookLabel: "§4.2",
        },
        {
          id: "a4-lab-counters",
          label: "Counters",
          description:
            "At least 4 counters, each a heading (or line) ending in the current count with its Up/Down buttons next to it (useState, parent/child, Zustand, and Redux counters).",
          points: 6,
          bookHref: "/book/ch4#sec-4-2-4",
          bookLabel: "§4.2.4",
        },
        {
          id: "a4-lab-boolean",
          label: "Boolean state",
          description:
            "A checkbox bound to a boolean state variable (a clickable checkbox, not a read-only one).",
          points: 4,
          bookHref: "/book/ch4#sec-4-2-5",
          bookLabel: "§4.2.5",
        },
        {
          id: "a4-lab-string",
          label: "String state",
          description:
            "A text input whose value is also printed on the page (a controlled string).",
          points: 4,
          bookHref: "/book/ch4#sec-4-2-6",
          bookLabel: "§4.2.6",
        },
        {
          id: "a4-lab-date",
          label: "Date state",
          description:
            "A date input (type=\"date\") showing a date in YYYY-MM-DD form.",
          points: 4,
          bookHref: "/book/ch4#sec-4-2-7",
          bookLabel: "§4.2.7",
        },
        {
          id: "a4-lab-object",
          label: "Object state",
          description:
            "A <pre> prints a state object as JSON, and inputs show its field values.",
          points: 5,
          bookHref: "/book/ch4#sec-4-2-8",
          bookLabel: "§4.2.8",
        },
        {
          id: "a4-lab-object-city",
          label: "Object city (On your own)",
          description:
            "The printed object also has a city property, shown in its own input.",
          points: 3,
          bookHref: "/book/ch4#sec-4-2-8",
          bookLabel: "§4.2.8",
          onYourOwn: true,
        },
        {
          id: "a4-lab-array",
          label: "Array state",
          description:
            "A list of at least 3 items, each with its own Delete button, next to an Add button.",
          points: 5,
          bookHref: "/book/ch4#sec-4-2-9",
          bookLabel: "§4.2.9",
        },
        {
          id: "a4-lab-todos",
          label: "Todo lists",
          description:
            "At least two todo lists (Zustand and Redux), each with a title input, an Add button, and at least 3 items with Edit/Delete buttons.",
          points: 7,
          bookHref: "/book/ch4#sec-4-5-2",
          bookLabel: "§4.5.2",
        },
        {
          id: "a4-lab-url",
          label: "Query and path parameters",
          description:
            "/labs/lab4 links to a query-parameter URL (?a=…&b=…) and a path-parameter URL (…/<a>/<b>), and /labs/lab4/url-encoding/path-params/<a>/<b> shows a + b for any two numbers.",
          points: 7,
          bookHref: "/book/ch4#sec-4-3-3",
          bookLabel: "§4.3.3",
        },
      ],
    },
    {
      id: "kambaz",
      title: "Kambaz — client state",
      intro:
        "Make Kambaz stateful with the Zustand stores and the account context from §4.10. Graders open your site signed out.",
      criteria: [
        {
          id: "a4-kambaz-dashboard-form",
          label: "Dashboard course form",
          description:
            "Above the course cards the Dashboard has the course form (name and description fields) with Add and Update buttons.",
          points: 5,
          bookHref: "/book/ch4#sec-4-10-2-1",
          bookLabel: "§4.10.2.1",
        },
        {
          id: "a4-kambaz-dashboard-fields",
          label: "Course number and start date (On your own)",
          description:
            "The course form also has fields for the course number and start date (at least 4 fields, one showing a date).",
          points: 4,
          bookHref: "/book/ch4#sec-4-10-2-3",
          bookLabel: "§4.10.2.3",
          onYourOwn: true,
        },
        {
          id: "a4-kambaz-card-buttons",
          label: "Edit and Delete on cards",
          description:
            "Every course card (at least 3) has Edit and Delete buttons.",
          points: 6,
          bookHref: "/book/ch4#sec-4-10-2-2",
          bookLabel: "§4.10.2.2",
        },
        {
          id: "a4-kambaz-modules",
          label: "Modules controls",
          description:
            "/courses/<_id>/modules has a + Module button, and each module row has edit (pencil) and delete (trash) controls next to its other icons.",
          points: 8,
          bookHref: "/book/ch4#sec-4-10-4",
          bookLabel: "§4.10.4",
        },
        {
          id: "a4-kambaz-signin",
          label: "Sign in screen",
          description:
            "/account/signin shows a username field, a password field, and a Sign in button.",
          points: 6,
          bookHref: "/book/ch4#sec-4-10-5-2",
          bookLabel: "§4.10.5.2",
        },
        {
          id: "a4-kambaz-account-nav",
          label: "Account Navigation",
          description:
            "Signed out, Account Navigation links to Sign in and Sign up but not Profile.",
          points: 5,
          bookHref: "/book/ch4#sec-4-10-5-4",
          bookLabel: "§4.10.5.4",
        },
        {
          id: "a4-kambaz-profile-guard",
          label: "Profile needs a user",
          description:
            "Signed out, /account/profile shows no user’s details (it redirects to Sign in or renders nothing).",
          points: 4,
          bookHref: "/book/ch4#sec-4-10-5-5",
          bookLabel: "§4.10.5.5",
        },
      ],
    },
  ],
};
