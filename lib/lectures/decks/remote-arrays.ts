import type { LectureSlide } from "../types";

export const REMOTE_ARRAYS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "server",
      headline: "Remote Arrays",
    },
    bullets: [
      "Chapter 5 · Remote Arrays",
      "CRUD on a todos collection",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Remote Arrays",
    kind: "content",
    bullets: [
      "**Create**, **Read**, **Update**, **Delete** — every list you will ship",
      "Same process memory as the assignment: reboot resets the seed",
      "Encode the item id in the path — not as a query parameter",
    ],
  },
  {
    id: "get-all",
    links: ["http://localhost:4000/lab5/todos"],
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.ts",
    codeHighlightLines: [[8, 11]],
  },
  {
    id: "id-how",
    title: "Finding an Item by ID",
    kind: "content",
    bullets: [
      "Pattern `/lab5/todos/:id`, URL `/lab5/todos/1`",
      "Express builds `req.params = { id: \"1\" }`",
      "Ids in the array are numbers, so compare after `parseInt`",
      "`find` returns the one todo whose `id` matches",
    ],
  },
  {
    id: "get-id",
    links: ["http://localhost:4000/lab5/todos/1"],
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "create-delete-intro",
    title: "Create and delete via GET first",
    kind: "demo",
    bullets: [
      "GET `/create` pushes a New Task. GET `/:id/delete` splices it out",
      "Misusing GET is a teaching step. The Async HTTP and JSON deck switches to POST and DELETE",
    ],
  },
  {
    id: "create-delete",
    links: ["http://localhost:4000/lab5/todos/create", "http://localhost:4000/lab5/todos/1/delete"],
    title: "Create and delete via GET first (code)",
    kind: "demo",
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.ts",
    codeHighlightLines: [[16, 17]],
  },
  {
    id: "arrays-click",
    title: "Mapping Links to Array Routes",
    kind: "content",
    bullets: [
      "`API` is `http://localhost:4000/lab5/todos`",
      "`API` → every todo. `API/1` → the todo with id 1",
      "`API?completed=true` → only finished todos",
      "`API/create` → appends New Task and returns the array",
      "`API/1/delete` → removes todo 1 and returns the array",
    ],
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
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
    codeHighlightLines: [2],
  },
  {
    id: "client-by-id",
    title: "Get one todo by ID",
    kind: "demo",
    bullets: [
      "The input picks the ID. The link puts it in the path",
    ],
    code: "const [todo, setTodo] = useState({ id: \"1\" });\n<a id=\"wd-retrieve-todo-by-id\" href={`${API}/${todo.id}`}>\n  Get Todo by ID\n</a>\n<input id=\"wd-todo-id\" value={todo.id}\n  onChange={(e) => setTodo({ ...todo, id: e.target.value })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
  },
  {
    id: "client-filter",
    title: "Filter with a query string",
    kind: "demo",
    code: "<a id=\"wd-retrieve-completed-todos\" href={`${API}?completed=true`}>\n  Get Completed Todos\n</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
  },
  {
    id: "client-create",
    title: "Create a todo",
    kind: "demo",
    code: "<a id=\"wd-create-todo\" href={`${API}/create`}>Create Todo</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
  },
  {
    id: "client-remove",
    title: "Remove a todo by ID",
    kind: "demo",
    code: "<a id=\"wd-remove-todo\" href={`${API}/${todo.id}/delete`}>\n  Remove Todo with ID = {todo.id}\n</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
  },
  {
    id: "client-update",
    title: "Update a todo title",
    kind: "demo",
    bullets: [
      "Two inputs: which todo, and its new title",
    ],
    code: "<a href={`${API}/${todo.id}/title/${todo.title}`} id=\"wd-update-todo-title\">\n  Update Todo\n</a>\n<input value={todo.id} onChange={(e) => setTodo({ ...todo, id: e.target.value })} />\n<input value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArrays.tsx",
  },
  {
    id: "client-live",
    title: "WorkingWithArrays: live demo",
    kind: "demo",
    bullets: [
      "Get Todos, then Get Todo by ID and Get Completed",
      "Create, Remove, Update \u2014 then Get Todos again",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-arrays",
  },
  {
    id: "recap",
    title: "Remote arrays recap",
    kind: "content",
    bullets: [
      "`res.json(todos)` for the collection. `find` / `splice` for one id",
      "Keep the GET create/delete routes so earlier links still work",
      "Proper verbs arrive with a JSON body in the next module",
    ],
  },
  {
    id: "next-up",
    title: "Next: axios, CORS, JSON body",
    kind: "title",
    bullets: [
      "Stay on the page. Then POST, PUT, and DELETE for real",
      "AJAX (requests without a page reload), CORS (letting another origin call the server), `express.json()`",
    ],
  },
];
