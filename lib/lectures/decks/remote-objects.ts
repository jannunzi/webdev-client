import type { LectureSlide } from "../types";

export const REMOTE_OBJECTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Remote Objects",
      "§5.2.3 · one assignment in process memory",
    ],
  },
  {
    id: "purpose",
    title: "An object lives on the server",
    kind: "content",
    bullets: [
      "Integers and strings were a start. Objects and arrays persist too",
      "State lasts until you reboot Express — then the seed returns",
      "`res.json` sets the content type and serializes for you",
    ],
  },
  {
    id: "assignment",
    title: "res.json sends an object",
    kind: "demo",
    bullets: [
      "Import in `Lab5/index.js` and visit `/lab5/assignment`",
      "Get Assignment is a hyperlink to the raw JSON",
    ],
    code: `const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};
export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  app.get("/lab5/assignment", getAssignment);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithObjects.js",
    codeHighlightLines: [[10, 13]],
  },
  {
    id: "title-get",
    title: "GET a single property",
    kind: "demo",
    bullets: [
      "`/lab5/assignment/title` responds with just the string",
      "Add a Get Title link next to Get Assignment",
    ],
    code: `const getAssignmentTitle = (req, res) => {
  res.json(assignment.title);
};
app.get("/lab5/assignment/title", getAssignmentTitle);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithObjects.js",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "title-put",
    title: "Mutate title from the path",
    kind: "demo",
    bullets: [
      "A path segment writes `assignment.title`, then returns the object",
      "Refresh Get Assignment — the new title is still there until reboot",
    ],
    code: `const setAssignmentTitle = (req, res) => {
  const { newTitle } = req.params;
  assignment.title = newTitle;
  res.json(assignment);
};
app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithObjects.js",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "client",
    title: "Links retrieve, then update",
    kind: "demo",
    bullets: [
      "Get Assignment / Get Title navigate to Express JSON",
      "An input plus Update Title encodes the new string in the path",
    ],
    code: `<h4>Retrieving Objects</h4>
<a id="wd-retrieve-assignments"
  className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
  href={\`\${HTTP_SERVER}/lab5/assignment\`}>
  Get Assignment
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-2-3-WorkingWithObjects.tsx",
    codeHighlightLines: [4],
  },
  {
    id: "recap",
    title: "Remote objects recap",
    kind: "content",
    bullets: [
      "`res.json` for objects. `res.send` for plain strings",
      "GET a property, then encode a write in the path",
      "On your own: score and completed the same way",
    ],
  },
  {
    id: "next-up",
    title: "Next: remote arrays",
    kind: "title",
    bullets: [
      "CRUD on a todos collection — create, read, update, delete",
      "§5.2.4: `/lab5/todos` plus an id in the path",
    ],
  },
];
