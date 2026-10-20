import type { AssignmentRubric } from "./types";

/**
 * Student checklist for A5 (Chapter 5: Node.js HTTP servers, Lab 5, the
 * Kambaz RESTful APIs, deploying to Render/Heroku). The checker reads the
 * Lab pages on the deploy, finds the student's server from the Lab 5 links,
 * and opens read-only (GET, non-mutating) routes on that server. Screens
 * that load data with axios after the first render, sessions, and routes
 * that change server state are not graded here (see the A5 PR notes).
 * wd-* ids help staff find things but never cost points.
 */
export const A5_RUBRIC: AssignmentRubric = {
  assignmentId: "a5",
  groups: [
    {
      id: "delivery",
      title: "Delivery",
      intro:
        "Push an a5 branch in both repositories (webdev-client and webdev-server), deploy the client to Vercel and the server to Render (or Heroku), and submit the client’s a5 Vercel URL.",
      criteria: [
        {
          id: "a5-delivery-branch",
          label: "a5 GitHub branch",
          description:
            "Create, commit, and push a branch named a5 on the same webdev-client repository. Submit your repository’s GitHub URL (the repository root or the …/tree/a5 branch URL both work). The URL must load.",
          points: 3,
          bookHref: "/book/ch5#sec-5-7",
          bookLabel: "§5.7",
        },
        {
          id: "a5-delivery-vercel",
          label: "Vercel branch deployment",
          description:
            "Submit the Vercel address made for your a5 branch (§5.7: each push to a5 gets its own address that contains the branch name). It looks like https://webdev-client-git-a5-yourname.vercel.app — the part before .vercel.app includes -git-a5. Deployment Protection must be off so anyone can open it.",
          points: 3,
          bookHref: "/book/ch5#sec-5-7",
          bookLabel: "§5.7",
        },
        {
          id: "a5-delivery-name-github",
          label: "Name and GitHub link",
          description:
            "The Labs pages show your full name (first name first, matching Canvas) and a link to your webdev-client GitHub repository.",
          points: 3,
          bookHref: "/book/ch5#sec-5-7",
          bookLabel: "§5.7",
        },
        {
          id: "a5-delivery-labs-nav",
          label: "Labs links",
          description:
            "The Labs pages link to /labs/lab1 through /labs/lab5, and to your Kambaz screens.",
          points: 3,
          bookHref: "/book/ch5#sec-5-7",
          bookLabel: "§5.7",
        },
        {
          id: "a5-delivery-server-links",
          label: "Server links",
          description:
            "The Labs pages also link to your Node server’s GitHub repository and to the root URL of your deployed server (Render or Heroku).",
          points: 3,
          bookHref: "/book/ch5#sec-5-7",
          bookLabel: "§5.7",
        },
      ],
    },
    {
      id: "lab",
      title: "Lab 5 — HTTP servers",
      intro:
        "Build Lab 5 at /labs/lab5 from §5.2–§5.3. The Lab 5 links must point at your deployed server (NEXT_PUBLIC_HTTP_SERVER set on Vercel, §5.5.3); the checker opens the same URLs the links do, with its own numbers.",
      criteria: [
        {
          id: "a5-lab-page",
          label: "Lab 5 page",
          description:
            "/labs/lab5 shows a titled section for each exercise in §5.2–§5.3 (at least 15 section headings).",
          points: 5,
          bookHref: "/book/ch5#sec-5-2",
          bookLabel: "§5.2",
        },
        {
          id: "a5-lab-server-url",
          label: "Server URL",
          description:
            "The Lab 5 links point at your deployed server over https (not localhost), and its /lab5/welcome route answers.",
          points: 5,
          bookHref: "/book/ch5#sec-5-2-1",
          bookLabel: "§5.2.1",
        },
        {
          id: "a5-lab-path",
          label: "Path parameters",
          description:
            "Your server answers /lab5/add/:a/:b and /lab5/subtract/:a/:b with the sum and the difference (for example /lab5/add/12/30 returns 42).",
          points: 7,
          bookHref: "/book/ch5#sec-5-2-2-1",
          bookLabel: "§5.2.2.1",
        },
        {
          id: "a5-lab-path-oyo",
          label: "Multiply and divide (On your own)",
          description:
            "Your server also answers /lab5/multiply/:a/:b and /lab5/divide/:a/:b.",
          points: 4,
          bookHref: "/book/ch5#sec-5-2-2-1",
          bookLabel: "§5.2.2.1",
          onYourOwn: true,
        },
        {
          id: "a5-lab-query",
          label: "Query parameters",
          description:
            "Your server answers /lab5/calculator?operation=add|subtract&a=…&b=… with the result.",
          points: 6,
          bookHref: "/book/ch5#sec-5-2-2-2",
          bookLabel: "§5.2.2.2",
        },
        {
          id: "a5-lab-query-oyo",
          label: "Query multiply and divide (On your own)",
          description:
            "/lab5/calculator also handles operation=multiply and operation=divide.",
          points: 3,
          bookHref: "/book/ch5#sec-5-2-2-2",
          bookLabel: "§5.2.2.2",
          onYourOwn: true,
        },
        {
          id: "a5-lab-object",
          label: "Remote object",
          description:
            "Your server returns the assignment object at /lab5/assignment and its title at /lab5/assignment/title.",
          points: 6,
          bookHref: "/book/ch5#sec-5-2-3-1",
          bookLabel: "§5.2.3",
        },
        {
          id: "a5-lab-module-oyo",
          label: "Module object (On your own)",
          description:
            "Your server returns a module object at /lab5/module and its name at /lab5/module/name.",
          points: 4,
          bookHref: "/book/ch5#sec-5-2-3-4",
          bookLabel: "§5.2.3.4",
          onYourOwn: true,
        },
        {
          id: "a5-lab-todos",
          label: "Remote array",
          description:
            "Your server returns the todos array at /lab5/todos, one todo at /lab5/todos/:id, and only completed todos at /lab5/todos?completed=true.",
          points: 7,
          bookHref: "/book/ch5#sec-5-2-4-1",
          bookLabel: "§5.2.4",
        },
        {
          id: "a5-lab-next-routes",
          label: "Next.js Route Handlers",
          description:
            "Your Vercel deployment answers /api/lab5/hello and /api/lab5/calculator?a=…&b=…&operation=add with JSON (the calculator’s result is a + b).",
          points: 8,
          bookHref: "/book/ch5#sec-5-3-1",
          bookLabel: "§5.3.1",
        },
      ],
    },
    {
      id: "kambaz",
      title: "Kambaz — RESTful Web APIs",
      intro:
        "Serve Kambaz data from your Node server (§5.4). Graders read the same routes your Dashboard and Modules screens call.",
      criteria: [
        {
          id: "a5-kambaz-courses-api",
          label: "Courses API",
          description:
            "Your server returns the courses array at /api/courses (at least 3 courses, each with an _id and a name).",
          points: 15,
          bookHref: "/book/ch5#sec-5-4-5-1",
          bookLabel: "§5.4.5.1",
        },
        {
          id: "a5-kambaz-modules-api",
          label: "Modules API",
          description:
            "/api/courses/:courseId/modules returns only that course’s modules; two courses return different lists.",
          points: 15,
          bookHref: "/book/ch5#sec-5-4-6-1",
          bookLabel: "§5.4.6.1",
        },
      ],
    },
  ],
};
