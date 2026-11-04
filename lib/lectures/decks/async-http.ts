import type { LectureSlide } from "../types";

export const ASYNC_HTTP_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#5A29E4",
      icon: "link",
      headline: "Async HTTP and JSON",
    },
    bullets: [
      "Chapter 5 · Async HTTP and JSON",
      "Axios, CORS, POST/PUT/DELETE",
    ],
  },
  {
    id: "ajax",
    title: "Axios stays on the page",
    kind: "demo",
    bullets: [
      "Hyperlinks leave Lab 5. AJAX fetches without navigating",
      "JSON won; the AJAX name stuck. Install axios in the Next.js app",
      "The first click throws CORS — that is expected until the next slide",
    ],
    codeBlocks: [
      { code: "npm install axios", language: "bash" },
      {
        file: "app/labs/lab5/HttpClient.tsx",
        language: "tsx",
        code: `import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const [welcomeOnClick, setWelcomeOnClick] = useState("");
const fetchWelcomeOnClick = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/lab5/welcome\`);
  setWelcomeOnClick(response.data);
};
<button type="button" onClick={fetchWelcomeOnClick}>Fetch Welcome</button>
<p>Response from server: <b>{welcomeOnClick}</b></p>`,
        addedLines: [[4, 7]],
      },
    ],
  },
  {
    id: "cors",
    title: "CORS lets 3000 talk to 4000",
    kind: "demo",
    bullets: [
      "The UI origin is 3000. Express is 4000 — a different origin",
      "The browser asks Express first. `cors()` answers yes",
      "Use it right after `express()` and before the routes",
    ],
    codeBlocks: [
      { code: "npm install cors\nnpm i -D @types/cors", language: "bash" },
      {
        file: "webdev-server/index.ts",
        language: "ts",
        code: `import cors from "cors";
const app = express();
app.use(cors());
Lab5(app);`,
        addedLines: [1, 3],
      },
    ],
  },
  {
    id: "client-lib",
    title: "A reusable client library",
    kind: "demo",
    bullets: [
      "Screens share one file so the welcome URL changes once",
      "`useEffect` later loads data when the component mounts",
    ],
    code: `import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/lab5/welcome\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab5/client.ts",
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "axios-how",
    title: "What axios does on a click",
    kind: "content",
    bullets: [
      "The handler calls `axios.get(url)` and the page stays put",
      "The browser sends the request to port 4000 in the background",
      "`await` waits for the reply. The reply object has a `data` property",
      "`response.data` is the body — text, or JSON parsed into an object",
      "Storing it in state re-renders the component",
    ],
  },
  {
    id: "http-client",
    title: "Fetch on click with axios",
    kind: "demo",
    bullets: [
      "The page stays put. axios returns the response data",
    ],
    code: "import axios from \"axios\";\nconst HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;\nconst [welcomeOnClick, setWelcomeOnClick] = useState(\"\");\nconst fetchWelcomeOnClick = async () => {\n  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);\n  setWelcomeOnClick(response.data);\n};\n<button type=\"button\" onClick={fetchWelcomeOnClick}>Fetch Welcome</button>\n<p>Response from server: <b>{welcomeOnClick}</b></p>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-lib",
    title: "Call the client library instead",
    kind: "demo",
    bullets: [
      "Components call `client.ts`, never axios directly",
    ],
    code: "import * as client from \"../client\";\nconst fetchWelcomeOnClick = async () => {\n  const message = await client.fetchWelcomeMessage();\n  setWelcomeOnClick(message);\n};",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-load",
    title: "Fetch when the component loads",
    kind: "demo",
    bullets: [
      "`useEffect` with `[]` runs once after the first render",
    ],
    code: "const [welcomeOnLoad, setWelcomeOnLoad] = useState(\"\");\nconst fetchWelcomeOnLoad = async () => {\n  const welcome = await client.fetchWelcomeMessage();\n  setWelcomeOnLoad(welcome);\n};\nuseEffect(() => {\n  fetchWelcomeOnLoad();\n}, []);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-live",
    title: "HttpClient: live demo",
    kind: "demo",
    bullets: [
      "The on-load message appears without a click",
      "Click Fetch Welcome for the on-click message",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-http-client",
  },
  {
    id: "objects-async",
    title: "Objects without leaving the page",
    kind: "demo",
    bullets: [
      "Load the assignment on mount. Update the title in place",
    ],
    code: "const [assignment, setAssignment] = useState({});\nconst fetchAssignment = async () => {\n  setAssignment(await client.fetchAssignment());\n};\nconst updateTitle = async () => {\n  setAssignment(await client.updateTitle(assignment.title));\n};\nuseEffect(() => { fetchAssignment(); }, []);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithObjectsAsync.tsx",
  },
  {
    id: "objects-async-live",
    title: "ObjectsAsync: live demo",
    kind: "demo",
    bullets: [
      "The assignment renders as JSON on load",
      "Edit the title and update it \u2014 no navigation",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-objects-async",
  },
  {
    id: "arrays-async",
    title: "Render todos fetched on load",
    kind: "demo",
    bullets: [
      "Fetch the array once, then map it to list items",
    ],
    code: "const [todos, setTodos] = useState([]);\nconst fetchTodos = async () => {\n  setTodos(await client.fetchTodos());\n};\nuseEffect(() => { fetchTodos(); }, []);\n{todos.map((todo) => (\n  <li key={todo.id}>\n    <input type=\"checkbox\" defaultChecked={todo.completed} />\n    <span className={todo.completed ? \"line-through\" : \"\"}>{todo.title}</span>\n  </li>\n))}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "body-how",
    title: "How a JSON body reaches req.body",
    kind: "content",
    bullets: [
      "Client: `axios.post(url, { title: \"New Task\" })` puts JSON in the request body",
      "Request arrives with header `Content-Type: application/json`",
      "Without a parser, Express leaves the body unread and `req.body` is `undefined`",
      "`express.json()` reads the body and sets `req.body = { title: \"New Task\" }`",
      "Routes registered after it can use `req.body`",
    ],
  },
  {
    id: "json-body",
    title: "JSON in the HTTP body",
    kind: "content",
    bullets: [
      "URLs are short, strings-only, and visible on the wire",
      "`express.json()` parses the body into `req.body`",
      "Place it after CORS and before the routes",
    ],
    code: `app.use(cors());
app.use(express.json());
Lab5(app);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [2],
  },
  {
    id: "verbs",
    title: "Use the right HTTP verb",
    kind: "content",
    bullets: [
      "**GET** — retrieve only. We misused it for create/delete",
      "**POST** — create. **PUT** — update. **DELETE** — remove",
      "**OPTIONS** — the CORS preflight for those verbs",
      "Keep the older GET routes so earlier links still work",
    ],
  },
  {
    id: "post-delete-intro",
    title: "POST create, DELETE remove",
    kind: "demo",
    bullets: [
      "POST `/lab5/todos` spreads `req.body` and assigns an id",
      "DELETE `/lab5/todos/:id` returns 404 when the id is missing",
    ],
  },
  {
    id: "post-delete",
    title: "POST create, DELETE remove (code)",
    kind: "demo",
    code: `const postNewTodo = (req, res) => {
  const newTodo = { ...req.body, id: new Date().getTime() };
  todos.push(newTodo);
  res.json(newTodo);
};
const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ message: \`Unable to delete Todo with ID \${id}\` });
    return;
  }
  todos.splice(todoIndex, 1);
  res.sendStatus(200);
};
app.post("/lab5/todos", postNewTodo);
app.delete("/lab5/todos/:id", deleteTodo);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.ts",
    codeHighlightLines: [[16, 17]],
  },
  {
    id: "icon-flow",
    title: "From an icon click to a new list",
    kind: "content",
    bullets: [
      "Click the trash icon on todo 1",
      "`client.removeTodo` calls `axios.get(\"…/lab5/todos/1/delete\")`",
      "Express removes it and responds with the remaining array",
      "`response.data` is that array",
      "`setTodos` stores it, and the list re-renders without todo 1",
    ],
  },
  {
    id: "arrays-async-remove",
    title: "Remove with a trash icon",
    kind: "demo",
    bullets: [
      "The GET-style delete route returns the new array",
    ],
    code: "const removeTodo = async (todo) => {\n  setTodos(await client.removeTodo(todo));\n};\n<FaTrash onClick={() => removeTodo(todo)} id=\"wd-remove-todo\"\n  className=\"cursor-pointer text-red-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "arrays-async-create",
    title: "Create with a plus icon",
    kind: "demo",
    code: "const createNewTodo = async () => {\n  setTodos(await client.createNewTodo());\n};\n<FaPlusCircle onClick={createNewTodo} id=\"wd-create-todo\"\n  className=\"cursor-pointer text-green-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "post-flow",
    title: "POST, step by step",
    kind: "content",
    bullets: [
      "`axios.post(TODOS_API, todo)` sends `todo` as a JSON body",
      "Example body: `{ title: \"New Posted Todo\", completed: false }`",
      "`express.json()` turns it into `req.body`",
      "The server adds an id, stores it, and replies with the new todo",
      "The client appends `response.data` to its `todos` state",
    ],
  },
  {
    id: "arrays-async-post",
    title: "POST a new todo",
    kind: "demo",
    bullets: [
      "The server returns only the new todo. Append it",
    ],
    code: "const postNewTodo = async () => {\n  const newTodo = await client.postNewTodo({\n    title: \"New Posted Todo\",\n    completed: false,\n  });\n  setTodos([...todos, newTodo]);\n};\n<FaPlusCircle onClick={postNewTodo} id=\"wd-post-todo\"\n  className=\"cursor-pointer text-blue-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "arrays-async-delete",
    title: "DELETE a todo",
    kind: "demo",
    bullets: [
      "The server returns a status. Filter it out locally",
    ],
    code: "const deleteTodo = async (todo) => {\n  await client.deleteTodo(todo);\n  setTodos(todos.filter((t) => t.id !== todo.id));\n};\n<TiDelete onClick={() => deleteTodo(todo)} id=\"wd-delete-todo\"\n  className=\"cursor-pointer text-2xl text-red-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "arrays-async-put",
    title: "Edit and PUT a todo",
    kind: "demo",
    bullets: [
      "Pencil enters edit mode. The checkbox PUTs at once",
    ],
    code: "const editTodo = (todo) => {\n  setTodos(todos.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t)));\n};\nconst updateTodo = async (todo) => {\n  await client.updateTodo(todo);\n  setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));\n};\n<FaPencilAlt onClick={() => editTodo(todo)} className=\"cursor-pointer text-blue-600\" />\n<input type=\"checkbox\" checked={todo.completed}\n  onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "arrays-async-error",
    title: "Show the server\u2019s error message",
    kind: "demo",
    bullets: [
      "A failed request throws. Show `response.data.message`",
    ],
    code: "const [errorMessage, setErrorMessage] = useState(null);\nconst deleteTodo = async (todo) => {\n  try {\n    await client.deleteTodo(todo);\n    setTodos(todos.filter((t) => t.id !== todo.id));\n  } catch (error) {\n    setErrorMessage(error.response.data.message);\n  }\n};\n{errorMessage && (\n  <p id=\"wd-todo-error-message\" className=\"rounded bg-red-100 px-3 py-2 text-red-800\">\n    {errorMessage}\n  </p>\n)}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithArraysAsync.tsx",
  },
  {
    id: "arrays-async-live",
    title: "ArraysAsync: live demo",
    kind: "demo",
    bullets: [
      "Create, post, edit, check, and delete todos",
      "Delete the same todo twice to see the error",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-arrays-async",
  },
  {
    id: "recap",
    title: "Async HTTP recap",
    kind: "content",
    bullets: [
      "axios + `async`/`await` keep the Lab 5 page on screen",
      "`cors()` then `express.json()` then the routes",
      "POST / PUT / DELETE with error status codes",
    ],
  },
  {
    id: "next-up",
    title: "Next: Next.js Route Handlers",
    kind: "title",
    bullets: [
      "Same-origin `/api` when you do not need a second process",
      "Hello JSON, then a calculator query API",
    ],
  },
];
