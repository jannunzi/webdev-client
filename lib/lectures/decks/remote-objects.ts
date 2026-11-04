import type { LectureSlide } from "../types";

export const REMOTE_OBJECTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "server",
      headline: "Remote Objects",
    },
    bullets: [
      "Chapter 5 · Remote Objects",
      "One assignment in process memory",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Remote Objects",
    kind: "content",
    bullets: [
      "Integers and strings were a start. Objects and arrays persist too",
      "State lasts until you reboot Express — then the seed returns",
      "`res.json(assignment)` turns the object into a JSON string and tells the browser it is JSON (`Content-Type: application/json`)",
    ],
  },
  {
    id: "json-how",
    title: "Sending Objects as JSON",
    kind: "content",
    bullets: [
      "Server memory holds a JavaScript object such as `{ id: 1, title: \"NodeJS Assignment\" }`",
      "`res.json(obj)` converts the object into a JSON string",
      "It also tells the browser the response is JSON (`Content-Type: application/json`)",
      "The browser shows the text. Client code can turn it back into an object",
      "The object lives until the server restarts",
    ],
  },
  {
    id: "assignment-intro",
    title: "Sending an Object with res.json",
    kind: "demo",
    bullets: [
      "In a new `Lab5/WorkingWithRemoteObjects.ts`, add the route as shown below",
      "Goal: the browser shows the whole assignment as JSON",
      "Import into `Lab5/index.ts`",
    ],
  },
  {
    id: "assignment",
    links: ["http://localhost:4000/lab5/assignment"],
    title: "Returning the Assignment as JSON",
    kind: "demo",
    code: `const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};
export default function WorkingWithRemoteObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  app.get("/lab5/assignment", getAssignment);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteObjects.ts",
    codeHighlightLines: [[10, 13]],
  },
  {
    id: "client",
    title: "Linking to Get Assignment",
    kind: "demo",
    bullets: [
      "In a new `WorkingWithRemoteObjects.tsx` component, create the link as shown below",
      "Get Assignment navigates to the route you just wrote",
      "Import into `app/labs/lab5/page.tsx`",
    ],
    code: `<h4>Retrieving Objects</h4>
<a id="wd-retrieve-assignments"
  className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
  href={\`\${HTTP_SERVER}/lab5/assignment\`}>
  Get Assignment
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteObjects.tsx",
    codeHighlightLines: [4],
  },
  {
    id: "title-get",
    links: ["http://localhost:4000/lab5/assignment/title"],
    title: "Implementing GET Assignment Title",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteObjects.ts`, add the route as shown below",
      "`/lab5/assignment/title` responds with just the string",
    ],
    code: `const getAssignmentTitle = (req, res) => {
  res.json(assignment.title);
};
app.get("/lab5/assignment/title", getAssignmentTitle);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteObjects.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "client-title",
    title: "Retrieving One Object Property",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteObjects.tsx`, add the link as shown below",
      "`/lab5/assignment/title` returns just the string",
    ],
    code: "<h4>Retrieving Properties</h4>\n<a id=\"wd-retrieve-assignment-title\"\n  href={`${HTTP_SERVER}/lab5/assignment/title`}>\n  Get Title\n</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteObjects.tsx",
  },
  {
    id: "title-put",
    links: ["http://localhost:4000/lab5/assignment/title/NewTitle"],
    title: "Updating the Title from the Path",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteObjects.ts`, add the route as shown below",
      "A path segment writes `assignment.title`, then returns the object",
      "Refresh Get Assignment — the new title stays until reboot",
    ],
    code: `const setAssignmentTitle = (req, res) => {
  const { newTitle } = req.params;
  assignment.title = newTitle;
  res.json(assignment);
};
app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteObjects.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "client-update",
    title: "Updating a Property from an Input",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteObjects.tsx`, add the state, link, and input",
      "The input edits local state. The link sends it to Express",
    ],
    code: "const [assignment, setAssignment] = useState({\n  id: 1, title: \"NodeJS Assignment\",\n  description: \"Create a NodeJS server with ExpressJS\",\n  due: \"2021-10-10\", completed: false, score: 0,\n});\nconst ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;\n<a id=\"wd-update-assignment-title\"\n  href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>\n  Update Title\n</a>\n<input id=\"wd-assignment-title\" value={assignment.title}\n  onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteObjects.tsx",
  },
  {
    id: "objects-click",
    title: "Reading and Writing a Remote Object",
    kind: "content",
    bullets: [
      "`HTTP_SERVER/lab5/assignment` shows the whole object as JSON",
      "`HTTP_SERVER/lab5/assignment/title` shows only `NodeJS Assignment`",
      "Type `New Title`, and the link becomes `/lab5/assignment/title/New Title`",
      "The server sets `newTitle` from the path and replies with the updated object",
      "Get Title again now shows `New Title` until Express restarts",
    ],
  },
  {
    id: "client-live",
    title: "WorkingWithRemoteObjects Live Demo",
    kind: "demo",
    bullets: [
      "Get Assignment, then Get Title",
      "Type a new title, click Update Title, then Get again",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-objects",
  },
  {
    id: "recap",
    title: "Recap: Remote Objects",
    kind: "content",
    bullets: [
      "`res.json` for objects. `res.send` for plain strings",
      "GET a property, then encode a write in the path",
      "On your own: score and completed the same way",
    ],
  },
  {
    id: "next-up",
    title: "Next: Remote Arrays",
    kind: "title",
    bullets: [
      "CRUD on a todos collection — create, read, update, delete",
      "`/lab5/todos` plus an id in the path",
    ],
  },
];
