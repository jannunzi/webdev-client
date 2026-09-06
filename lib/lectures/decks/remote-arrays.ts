import type { LectureSlide } from "../types";

export const REMOTE_ARRAYS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Remote Arrays",
      "§5.2.4 · CRUD on a todos collection",
    ],
  },
  {
    id: "purpose",
    title: "CRUD is the collection contract",
    kind: "content",
    bullets: [
      "**Create**, **Read**, **Update**, **Delete** — every list you will ship",
      "Same process memory as the assignment: reboot resets the seed",
      "Encode the item id in the path — not as a query parameter",
    ],
  },
  {
    id: "get-all",
    title: "GET the whole todos array",
    kind: "demo",
    bullets: [
      "Visit `/lab5/todos` and confirm four seed tasks",
      "A Get Todos link on the client retrieves the same JSON",
    ],
    code: `let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];
export default function WorkingWithArrays(app) {
  const getTodos = (req, res) => {
    res.json(todos);
  };
  app.get("/lab5/todos", getTodos);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.js",
    codeHighlightLines: [[8, 11]],
  },
  {
    id: "get-id",
    title: "GET one todo by id",
    kind: "demo",
    bullets: [
      "`/lab5/todos/:id` finds the matching object",
      "Primary keys belong in the path",
    ],
    code: `const getTodoById = (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));
  res.json(todo);
};
app.get("/lab5/todos/:id", getTodoById);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.js",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "create-delete",
    title: "Create and delete via GET first",
    kind: "demo",
    bullets: [
      "GET `/create` pushes a New Task. GET `/:id/delete` splices it out",
      "Misusing GET is a teaching step. §5.2.6 switches to POST and DELETE",
    ],
    code: `const createNewTodo = (req, res) => {
  const newTodo = {
    id: new Date().getTime(),
    title: "New Task",
    completed: false,
  };
  todos.push(newTodo);
  res.json(todos);
};
const removeTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  todos.splice(todoIndex, 1);
  res.json(todos);
};
app.get("/lab5/todos/create", createNewTodo);
app.get("/lab5/todos/:id/delete", removeTodo);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.js",
    codeHighlightLines: [[16, 17]],
  },
  {
    id: "client",
    title: "A Get Todos hyperlink",
    kind: "demo",
    bullets: [
      "Build more links for create, delete, and title updates",
      "On your own: completed and description path routes",
    ],
    code: `const API = \`\${HTTP_SERVER}/lab5/todos\`;
<a id="wd-retrieve-todos" href={API}>Get Todos</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-2-4-WorkingWithArrays.tsx",
    codeHighlightLines: [2],
  },
  {
    id: "recap",
    title: "Remote arrays recap",
    kind: "content",
    bullets: [
      "`res.json(todos)` for the collection. `find` / `splice` for one id",
      "Keep the GET create/delete routes so earlier links still work",
      "Proper verbs arrive with a JSON body in the next deck",
    ],
  },
  {
    id: "next-up",
    title: "Next: axios, CORS, JSON body",
    kind: "title",
    bullets: [
      "Stay on the page. Then POST, PUT, and DELETE for real",
      "§5.2.5–5.2.6: AJAX, CORS, `express.json()`",
    ],
  },
];
