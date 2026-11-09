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
      stackWords: true,
      headlineScale: 2,
    },
    bullets: [
      "Chapter 5 · Remote Arrays",
      "CRUD on a todos collection",
    ],
  },
  {
    id: "purpose",
    title: "Managing Lists on the Server",
    kind: "content",
    bullets: [
      "Most app data is lists: todos, courses, users",
      "The server keeps a todos array with routes to create, read, update, and delete",
      "Every client sees the same list until the server restarts",
    ],
  },
  {
    id: "get-all",
    links: ["http://localhost:4000/lab5/todos"],
    title: "Returning an Array as JSON",
    kind: "demo",
    bullets: [
      "In a new `Lab5/WorkingWithRemoteArrays.ts`, add the route as shown below",
      "Visit `/lab5/todos` and confirm four seed tasks",
      "Import into `Lab5/index.ts`",
    ],
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide2-diagram.png",
    imageAlt:
      "GET /lab5/todos reads the in-memory todos array of Task 1 through Task 4 and res.json returns that array.",
    code: `let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];
export default function WorkingWithRemoteArrays(app) {
  const getTodos = (req, res) => {
    res.json(todos);
  };
  app.get("/lab5/todos", getTodos);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
    codeHighlightLines: [[8, 11]],
  },
  {
    id: "client",
    title: "Linking to an Array Route",
    kind: "demo",
    bullets: [
      "In a new `WorkingWithRemoteArrays.tsx` component, create the link as shown below",
      "Get Todos navigates to the route you just wrote",
      "Import into `app/labs/lab5/page.tsx`",
    ],
    code: `const API = \`\${HTTP_SERVER}/lab5/todos\`;
<a id="wd-retrieve-todos" href={API}>Get Todos</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
    codeHighlightLines: [2],
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
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide5-diagram.png",
    imageAlt:
      "GET /lab5/todos/1 sets req.params.id to 1, find returns the todo whose id is 1, and res.json sends Task 1.",
  },
  {
    id: "get-id",
    links: ["http://localhost:4000/lab5/todos/1"],
    title: "Returning One Item by ID",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, add the route as shown below",
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
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "client-by-id",
    title: "Sending an Item ID in the Path",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.tsx`, add the input and link as shown below",
      "The input picks the ID. The link puts it in the path",
    ],
    code: "const [todo, setTodo] = useState({ id: \"1\" });\n<a id=\"wd-retrieve-todo-by-id\" href={`${API}/${todo.id}`}>\n  Get Todo by ID\n</a>\n<input id=\"wd-todo-id\" value={todo.id}\n  onChange={(e) => setTodo({ ...todo, id: e.target.value })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
  },
  {
    id: "filter-server",
    links: ["http://localhost:4000/lab5/todos?completed=true"],
    title: "Filtering an Array by Query",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, update the route as shown below",
      "`req.query.completed` is a string, so compare with `\"true\"`",
      "No `completed` in the URL: return every todo",
    ],
    code: "const getTodos = (req, res) => {\n  const { completed } = req.query;\n  if (completed !== undefined) {\n    const completedBool = completed === \"true\";\n    res.json(todos.filter((t) => t.completed === completedBool));\n    return;\n  }\n  res.json(todos);\n};",
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
  },
  {
    id: "client-filter",
    title: "Linking to a Filtered Array",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.tsx`, add the filter link as shown below",
    ],
    code: "<a id=\"wd-retrieve-completed-todos\" href={`${API}?completed=true`}>\n  Get Completed Todos\n</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide9-diagram.png",
    imageAlt:
      "GET /lab5/todos?completed=true sets req.query.completed to the string true, filters to Task 2 and Task 4, and res.json returns those two todos.",
  },
  {
    id: "create-delete-intro",
    title: "Adding and Removing Array Items",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, add both routes as shown below",
      "GET `/create` pushes a New Task onto the array",
      "GET `/:id/delete` splices that item out",
      "Misusing GET is a teaching step. The Async HTTP and JSON deck switches to POST and DELETE",
    ],
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide10-diagram.png",
    imageAlt:
      "GET /lab5/todos/create builds a New Task, pushes it onto the todos array, and res.json returns the full array including that task.",
  },
  {
    id: "create-delete",
    links: ["http://localhost:4000/lab5/todos/create", "http://localhost:4000/lab5/todos/1/delete"],
    title: "Writing Add and Remove Item Routes",
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
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
    codeHighlightLines: [[16, 17]],
  },
  {
    id: "client-create",
    title: "Linking to Add an Item",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.tsx`, add the following link.",
    ],
    code: "<a id=\"wd-create-todo\" href={`${API}/create`}>Create Todo</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide10-diagram.png",
    imageAlt:
      "GET /lab5/todos/create builds a New Task, pushes it onto the todos array, and res.json returns the full array including that task.",
  },
  {
    id: "client-remove",
    title: "Linking to Remove an Item by ID",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.tsx`, add the delete link as shown below",
    ],
    code: "<a id=\"wd-remove-todo\" href={`${API}/${todo.id}/delete`}>\n  Remove Todo with ID = {todo.id}\n</a>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
    imageSrc: "/lectures/remote-arrays/remote-arrays-slide13-diagram.png",
    imageAlt:
      "With todo.id 1, GET /lab5/todos/1/delete finds that id, splices it out, and res.json returns the remaining todos.",
  },
  {
    id: "title-server",
    links: ["http://localhost:4000/lab5/todos/1/title/NewTitle"],
    title: "Updating an Item from the Path",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, add the route as shown below",
      "The path carries both the todo id and its new title",
      "On your own: completed and description routes the same way",
    ],
    code: "const updateTodoTitle = (req, res) => {\n  const { id, title } = req.params;\n  const todo = todos.find((t) => t.id === parseInt(id));\n  todo.title = title;\n  res.json(todos);\n};\napp.get(\"/lab5/todos/:id/title/:title\", updateTodoTitle);",
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
  },
  {
    id: "client-update",
    title: "Linking to Update an Item",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.tsx`, add the inputs and link as shown below",
      "Two inputs: which todo, and its new title",
    ],
    code: "<a href={`${API}/${todo.id}/title/${todo.title}`} id=\"wd-update-todo-title\">\n  Update Todo\n</a>\n<input value={todo.id} onChange={(e) => setTodo({ ...todo, id: e.target.value })} />\n<input value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArrays.tsx",
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
    id: "client-live",
    title: "Remote Arrays Live Demo",
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
    title: "Recap: Remote Arrays",
    kind: "content",
    bullets: [
      "`res.json(todos)` for the collection. `find` / `splice` for one id",
      "Keep the GET create/delete routes so earlier links still work",
      "Proper verbs arrive with a JSON body in the next module",
    ],
  },
  {
    id: "next-up",
    title: "Next: Async HTTP and JSON",
    kind: "title",
    bullets: [
      "Stay on the page. Then POST, PUT, and DELETE for real",
      "AJAX (requests without a page reload), CORS (letting another origin call the server), `express.json()`",
    ],
  },
];
