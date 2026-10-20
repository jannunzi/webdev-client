import type { LectureSlide } from "../types";

export const KAMBAZ_ASSIGNMENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ ASSIGNMENTS",
      "List + editor, matching the ids",
    ],
  },
  {
    id: "on-your-own",
    title: "Creating the Assignments Screen",
    kind: "content",
    bullets: [
      "Lists assignments students must complete throughout a course",
      "From the Dashboard, open a course, then **Assignments** in Course Navigation",
      "Grouped as ASSIGNMENTS, QUIZZES, EXAMS, and PROJECT",
      "Match the Assignments screen and the `wd-*` ids",
    ],
  },
  {
    id: "target-assignments",
    title: "Canvas target: Assignments",
    kind: "content",
    bullets: [
      "Book Figure 1.4.7a — grouped list students see in Canvas-style LMS",
      "This week: **plain HTML**. Match the ids; Tailwind is Chapter 2",
    ],
    imageSrc: "/images/book/kambaz/assignments.png",
    imageAlt: "Target Kambaz Assignments screen",
    imageCaption: "Figure 1.4.7a — Assignments Screen",
  },
  {
    id: "assignment-item-intro",
    title: "Extract AssignmentItem",
    kind: "content",
    bullets: [
      "Same idea as `CourseCard`: one `AssignmentItem` per row, with props `cid`, `aid`, `title`, `details`",
      "The title is a `Link` from `next/link`, not `<a>`, with class `wd-assignment-link`",
      "It goes to `/courses/${cid}/assignments/${aid}`, and `details` sits underneath",
    ],
  },
  {
    id: "assignment-item",
    title: "Extract AssignmentItem (code)",
    kind: "content",
    code: `import Link from "next/link";

export default function AssignmentItem({
  cid,
  aid,
  title,
  details,
}: {
  cid: string;
  aid: string;
  title: string;
  details: string;
}) {
  return (
    <li className="wd-assignment-list-item">
      <Link
        href={\`/courses/\${cid}/assignments/\${aid}\`}
        className="wd-assignment-link"
      >
        {title}
      </Link>
      <div>{details}</div>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/AssignmentItem.tsx",
  },
  {
    id: "await-params-intro",
    title: "Page awaits cid from params",
    kind: "content",
    bullets: [
      "Same `async` / `await params` shape as the courses layout",
      "The page renders one assignment, A1, linked to its editor. Add the rest yourself. Aim for three (A2 and A3 after A1)",
      "Also add the search box, `+ Group`, `+ Assignment`, and the `wd-assignments-title` heading",
    ],
  },
  {
    id: "await-params",
    title: "Page awaits cid from params (code)",
    kind: "content",
    code: `import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* search input, + Group, + Assignment */}
      {/* h3 wd-assignments-title */}
      <ul id="wd-assignment-list">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Due May 13 at 11:59pm | 100 pts"
        />
        {/* Add more assignments here (three recommended, like A2, A3), each linking to its editor */}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "await-params-live",
    title: "Assignments starter: live demo",
    kind: "demo",
    embed: "kambaz-assignments-step",
  },
  {
    id: "finished-intro",
    title: "Finished Assignments page",
    kind: "content",
    bullets: [
      "Fill in the comments from the starter: search box `wd-search-assignment`",
      "Buttons `+ Group` (`wd-add-assignment-group`) and `+ Assignment` (`wd-add-assignment`)",
      "Heading `wd-assignments-title`: `ASSIGNMENTS 40% of Total`",
      "A1, A2, A3 as three `AssignmentItem`s, each linking to its editor",
    ],
  },
  {
    id: "finished",
    title: "Finished Assignments page (code)",
    kind: "content",
    code: `import AssignmentItem from "./AssignmentItem";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      <input
        placeholder="Search for Assignments"
        id="wd-search-assignment"
      />{" "}
      <button id="wd-add-assignment-group">+ Group</button>{" "}
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ul id="wd-assignment-list">
        <AssignmentItem
          cid={cid}
          aid="123"
          title="A1 - ENV + HTML"
          details="Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts"
        />
        <AssignmentItem
          cid={cid}
          aid="124"
          title="A2 - CSS + TAILWIND"
          details="Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts"
        />
        <AssignmentItem
          cid={cid}
          aid="125"
          title="A3 - JAVASCRIPT + REACT"
          details="Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 pts"
        />
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
  },
  {
    id: "finished-live",
    title: "Finished Assignments: live demo",
    kind: "demo",
    bullets: [
      "Search box and buttons sit above the `ASSIGNMENTS` heading",
      "Each title links to `/courses/1234/assignments/<aid>`",
    ],
    embed: "kambaz-assignments-finished",
  },
  {
    id: "target-editor",
    title: "Canvas target: Assignment editor",
    kind: "content",
    bullets: [
      "Book Figure 1.4.8a — faculty edit name, points, dates, and assign",
      "Start from name / description / points, then complete on your own",
    ],
    imageSrc: "/images/book/kambaz/assignment-editor.png",
    imageAlt: "Target Kambaz Assignment Editor screen",
    imageCaption: "Figure 1.4.8a — Assignment Editor",
  },
  {
    id: "editor-intro",
    title: "Create Assignment Editor Screen",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx`",
      "Wrapper `wd-assignments-editor`. Use **`defaultValue`**, not `value`",
      "Start from name (`wd-name`), description, points (`wd-points`)",
    ],
  },
  {
    id: "editor",
    title: "Create Assignment Editor Screen (code)",
    kind: "content",
    code: `export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /> <br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>                                           <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          {/* Complete on your own — see checklist below */}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
  },
  {
    id: "editor-rest",
    title: "Complete the editor fields",
    kind: "content",
    bullets: [
      "Group `wd-group` — ASSIGNMENTS, QUIZZES, EXAMS, PROJECT",
      "`wd-display-grade-as`, `wd-submission-type`",
      "Checkboxes: `wd-text-entry`, `wd-website-url`, `wd-media-recordings`",
      "Assign: `wd-assign-to`, `wd-due-date`, `wd-available-from`, `wd-available-until`",
      "Cancel `wd-cancel` and Save `wd-save` — `Link`s back to the list",
    ],
  },
  {
    id: "editor-finished",
    title: "Finished Assignment Editor (code)",
    kind: "content",
    code: `import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /> <br /><br />
      <textarea
        id="wd-description"
        cols={50}
        rows={6}
        defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Vercel."
      /> <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group" defaultValue="ASSIGNMENTS">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as" defaultValue="PERCENTAGE">
                <option value="PERCENTAGE">Percentage</option>
                <option value="POINTS">Points</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type" defaultValue="ONLINE">
                <option value="ONLINE">Online</option>
                <option value="ON_PAPER">On Paper</option>
              </select>            <br /><br />
              Online Entry Options <br />
              <input type="checkbox" id="wd-text-entry" />
              <label htmlFor="wd-text-entry">Text Entry</label> <br />
              <input type="checkbox" id="wd-website-url" />
              <label htmlFor="wd-website-url">Website URL</label> <br />
              <input type="checkbox" id="wd-media-recordings" />
              <label htmlFor="wd-media-recordings">Media Recordings</label> <br />
              <input type="checkbox" id="wd-student-annotation" />
              <label htmlFor="wd-student-annotation">Student Annotation</label> <br />
              <input type="checkbox" id="wd-file-upload" />
              <label htmlFor="wd-file-upload">File Uploads</label>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              Assign
            </td>
            <td>
              <label htmlFor="wd-assign-to">Assign to</label>     <br />
              <input id="wd-assign-to" defaultValue="Everyone" /> <br /><br />
              <label htmlFor="wd-due-date">Due</label>            <br />
              <input type="date" id="wd-due-date"
                     defaultValue="2024-05-13" /> <br /><br />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="wd-available-from">Available from</label> <br />
                      <input type="date" id="wd-available-from"
                             defaultValue="2024-05-06" />
                    </td>
                    <td>
                      <label htmlFor="wd-available-until">Until</label> <br />
                      <input type="date" id="wd-available-until"
                             defaultValue="2024-05-20" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <Link href="/courses/1234/assignments" id="wd-cancel">Cancel</Link>{" "}
      <Link href="/courses/1234/assignments" id="wd-save">Save</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/[aid]/page.tsx",
  },
  {
    id: "editor-finished-live",
    title: "Finished Assignment Editor: live",
    kind: "demo",
    bullets: [
      "Click a label to focus its field or toggle its checkbox",
      "Cancel and Save are `Link`s back to the Assignments list",
    ],
    embed: "kambaz-assignment-editor",
  },
  {
    id: "labels",
    title: "Labels must focus controls",
    kind: "content",
    bullets: [
      "Same Lab 1 rule: `htmlFor` on the label matches `id` on the control",
      "Clicking a label next to a text field **focuses** that field",
      "Clicking a label next to a checkbox **toggles** the checkbox",
    ],
  },
  {
    id: "labs-name-github-intro",
    title: "Name, Section, and GitHub on Labs",
    kind: "content",
    bullets: [
      "Graders need to know whose deploy this is and where its source lives",
      "In `app/labs/page.tsx`: an `h2` with your full name as in Canvas, then a `p` with your course and section",
      "Link `wd-github` to **your** `webdev-client` repository. Your Lab 4 and Lab 5 links go where the comment is",
    ],
  },
  {
    id: "labs-name-github",
    title: "Name, Section, and GitHub on Labs (code)",
    kind: "content",
    code: `import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Jose Annunziato</h2>
      <p>CS4550 Section 01</p>
      <ul>
        <li>
          <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
        </li>
        <li>
          <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
        </li>
        <li>
          <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
        </li>
        {/* your Lab 4 / Lab 5 links */}
        <li>
          <Link href="/" id="wd-kambaz-link">
            Kambaz
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/jannunzi/webdev-client"
            id="wd-github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub repository
          </a>
        </li>
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/page.tsx",
  },
  {
    id: "labs-name-github-live",
    title: "Labs name and GitHub: live demo",
    kind: "demo",
    embed: "labs-name-github",
  },
  {
    id: "labs-name-github-push",
    title: "Commit and Push the Change",
    kind: "content",
    bullets: [
      "From the project root, commit the Labs page and push it to GitHub",
    ],
    code: `git add .
git commit -m "Add name, section, and GitHub link to Labs"
git push`,
    codeLanguage: "bash",
  },
];
