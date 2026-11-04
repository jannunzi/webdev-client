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
    id: "purpose",
    title: "Fetching Data Without Leaving the Page",
    kind: "content",
    bullets: [
      "Links to the server replace the whole page with the raw reply",
      "Real apps fetch data in the background and update just part of the page",
      "Axios sends the request from a component and waits for the reply",
      "POST, PUT, and DELETE then let the page create, change, and remove server data",
    ],
  },
  {
    id: "ajax",
    title: "Staying on the Page with Axios",
    kind: "demo",
    bullets: [
      "Hyperlinks leave Lab 5. Axios fetches without navigating",
      "Install axios. In a new `HttpClient.tsx` component, add the button",
      "Import into `app/labs/lab5/page.tsx`. The first click throws CORS",
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
    title: "Allowing Cross-Origin Requests",
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
    title: "Creating a Reusable Client Library",
    kind: "demo",
    bullets: [
      "In a new `app/labs/lab5/client.ts`, add the request function",
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
    title: "Fetching Data with Axios",
    kind: "content",
    bullets: [
      "The handler calls `axios.get(url)` and the page stays put",
      "The browser sends the request to port 4000 in the background",
      "`await` waits for the reply. The reply object has a `data` property",
      "`response.data` is the body — text, or JSON already turned into an object",
      "Storing it in state re-renders the component",
    ],
  },
  {
    id: "http-client",
    title: "Fetching on Click with Axios",
    kind: "demo",
    bullets: [
      "In `HttpClient.tsx`, add the button as shown below",
      "The page stays put. axios returns the response data",
    ],
    code: "import axios from \"axios\";\nconst HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;\nconst [welcomeOnClick, setWelcomeOnClick] = useState(\"\");\nconst fetchWelcomeOnClick = async () => {\n  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);\n  setWelcomeOnClick(response.data);\n};\n<button type=\"button\" onClick={fetchWelcomeOnClick}>Fetch Welcome</button>\n<p>Response from server: <b>{welcomeOnClick}</b></p>",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-lib",
    title: "Calling the Client Library",
    kind: "demo",
    bullets: [
      "In `HttpClient.tsx`, call `client.ts` as shown below",
      "Components call `client.ts`, never axios directly",
    ],
    code: "import * as client from \"../client\";\nconst fetchWelcomeOnClick = async () => {\n  const message = await client.fetchWelcomeMessage();\n  setWelcomeOnClick(message);\n};",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-load",
    title: "Fetching When the Component Loads",
    kind: "demo",
    bullets: [
      "In `HttpClient.tsx`, add the effect as shown below",
      "`useEffect` with `[]` runs once after the first render",
    ],
    code: "const [welcomeOnLoad, setWelcomeOnLoad] = useState(\"\");\nconst fetchWelcomeOnLoad = async () => {\n  const welcome = await client.fetchWelcomeMessage();\n  setWelcomeOnLoad(welcome);\n};\nuseEffect(() => {\n  fetchWelcomeOnLoad();\n}, []);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HttpClient.tsx",
  },
  {
    id: "http-client-live",
    title: "Axios Requests Live Demo",
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
    title: "Updating Remote Objects Asynchronously",
    kind: "demo",
    bullets: [
      "In a new `WorkingWithRemoteObjectsAsync.tsx` component, add the code below",
      "Load the assignment on mount. Update the title in place",
      "Import into `app/labs/lab5/page.tsx`",
    ],
    code: "const [assignment, setAssignment] = useState({});\nconst fetchAssignment = async () => {\n  setAssignment(await client.fetchAssignment());\n};\nconst updateTitle = async () => {\n  setAssignment(await client.updateTitle(assignment.title));\n};\nuseEffect(() => { fetchAssignment(); }, []);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteObjectsAsync.tsx",
  },
  {
    id: "objects-async-live",
    title: "Async Remote Objects Live Demo",
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
    title: "Rendering an Array Fetched on Load",
    kind: "demo",
    bullets: [
      "In a new `WorkingWithRemoteArraysAsync.tsx` component, add the code below",
      "Fetch the array once, then map it to list items",
      "Import into `app/labs/lab5/page.tsx`",
    ],
    code: "const [todos, setTodos] = useState([]);\nconst fetchTodos = async () => {\n  setTodos(await client.fetchTodos());\n};\nuseEffect(() => { fetchTodos(); }, []);\n{todos.map((todo) => (\n  <li key={todo.id}>\n    <input type=\"checkbox\" defaultChecked={todo.completed} />\n    <span className={todo.completed ? \"line-through\" : \"\"}>{todo.title}</span>\n  </li>\n))}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "body-how",
    title: "Reading a JSON Request Body",
    kind: "content",
    bullets: [
      "Client: `axios.post(url, { title: \"New Task\" })` puts JSON in the request body",
      "A header on the request, `Content-Type: application/json`, says the body is JSON",
      "By default Express does not read the body, so `req.body` is `undefined`",
      "`express.json()` reads the body and sets `req.body = { title: \"New Task\" }`",
      "Routes registered after it can use `req.body`",
    ],
  },
  {
    id: "json-body",
    title: "Sending JSON in the HTTP Body",
    kind: "content",
    bullets: [
      "URLs are short, strings-only, and visible on the wire",
      "`express.json()` reads the JSON body and turns it into the `req.body` object",
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
    title: "Choosing the Right HTTP Verb",
    kind: "content",
    bullets: [
      "**GET** — retrieve only. We misused it for create/delete",
      "**POST** — create. **PUT** — update. **DELETE** — remove",
      "**OPTIONS** — the browser asks first whether the server allows those verbs from another origin",
      "Keep the older GET routes so earlier links still work",
    ],
  },
  {
    id: "icon-flow",
    title: "Deleting Items Asynchronously",
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
    title: "Deleting an Item from a Button",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, add the remove handler",
      "The GET-style delete route returns the new array",
    ],
    code: "const removeTodo = async (todo) => {\n  setTodos(await client.removeTodo(todo));\n};\n<FaTrash onClick={() => removeTodo(todo)} id=\"wd-remove-todo\"\n  className=\"cursor-pointer text-red-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "arrays-async-create",
    title: "Creating an Item from a Button",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, add the create handler",
    ],
    code: "const createNewTodo = async () => {\n  setTodos(await client.createNewTodo());\n};\n<FaPlusCircle onClick={createNewTodo} id=\"wd-create-todo\"\n  className=\"cursor-pointer text-green-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "post-delete-intro",
    title: "Implementing POST and DELETE Routes",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, add both routes as shown below",
      "POST `/lab5/todos` spreads `req.body` and assigns an id",
      "DELETE `/lab5/todos/:id` returns 404 when the id is missing",
    ],
  },
  {
    id: "post-delete",
    title: "Writing the POST and DELETE Handlers",
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
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
    codeHighlightLines: [[16, 17]],
  },
  {
    id: "post-flow",
    title: "Creating Items with HTTP POST",
    kind: "content",
    bullets: [
      "`axios.post(TODOS_API, todo)` sends `todo` as a JSON body",
      "Example body: `{ title: \"New Posted Todo\", completed: false }`",
      "The server adds an id, stores it, and replies with the new todo",
      "The client appends `response.data` to its `todos` state",
    ],
  },
  {
    id: "arrays-async-post",
    title: "Sending a POST Request with Axios",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, switch create to POST",
      "The server returns only the new todo. Append it",
    ],
    code: "const postNewTodo = async () => {\n  const newTodo = await client.postNewTodo({\n    title: \"New Posted Todo\",\n    completed: false,\n  });\n  setTodos([...todos, newTodo]);\n};\n<FaPlusCircle onClick={postNewTodo} id=\"wd-post-todo\"\n  className=\"cursor-pointer text-blue-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "arrays-async-delete",
    title: "Deleting Items with HTTP DELETE",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, switch delete to DELETE",
      "The server returns a status. Filter it out locally",
    ],
    code: "const deleteTodo = async (todo) => {\n  await client.deleteTodo(todo);\n  setTodos(todos.filter((t) => t.id !== todo.id));\n};\n<TiDelete onClick={() => deleteTodo(todo)} id=\"wd-delete-todo\"\n  className=\"cursor-pointer text-2xl text-red-600\" />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "put-server",
    title: "Updating Items with HTTP PUT",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, add the route as shown below",
      "`req.body` holds the changed fields. They overwrite the old ones",
      "Replies `200` with no body. The client already has the todo",
    ],
    code: "const updateTodo = (req, res) => {\n  const { id } = req.params;\n  todos = todos.map((t) => {\n    if (t.id === parseInt(id)) {\n      return { ...t, ...req.body };\n    }\n    return t;\n  });\n  res.sendStatus(200);\n};\napp.put(\"/lab5/todos/:id\", updateTodo);",
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
  },
  {
    id: "arrays-async-put",
    title: "Sending a PUT Request with Axios",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, add editing as shown below",
      "Pencil enters edit mode. The checkbox PUTs at once",
    ],
    code: "const editTodo = (todo) => {\n  setTodos(todos.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t)));\n};\nconst updateTodo = async (todo) => {\n  await client.updateTodo(todo);\n  setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));\n};\n<FaPencilAlt onClick={() => editTodo(todo)} className=\"cursor-pointer text-blue-600\" />\n<input type=\"checkbox\" checked={todo.completed}\n  onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "error-server",
    title: "Responding 404 for a Missing Item",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArrays.ts`, update the route as shown below",
      "No matching id: reply `404` with a `message`",
      "The same check goes in `updateTodo`",
    ],
    code: "const deleteTodo = (req, res) => {\n  const { id } = req.params;\n  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));\n  if (todoIndex === -1) {\n    res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });\n    return;\n  }\n  todos.splice(todoIndex, 1);\n  res.sendStatus(200);\n};",
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/WorkingWithRemoteArrays.ts",
  },
  {
    id: "arrays-async-error",
    title: "Showing the Server's Error Message",
    kind: "demo",
    bullets: [
      "In `WorkingWithRemoteArraysAsync.tsx`, add the error message",
      "A failed request throws. Show `response.data.message`",
    ],
    code: "const [errorMessage, setErrorMessage] = useState(null);\nconst deleteTodo = async (todo) => {\n  try {\n    await client.deleteTodo(todo);\n    setTodos(todos.filter((t) => t.id !== todo.id));\n  } catch (error) {\n    setErrorMessage(error.response.data.message);\n  }\n};\n{errorMessage && (\n  <p id=\"wd-todo-error-message\" className=\"rounded bg-red-100 px-3 py-2 text-red-800\">\n    {errorMessage}\n  </p>\n)}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/WorkingWithRemoteArraysAsync.tsx",
  },
  {
    id: "arrays-async-live",
    title: "Async Remote Arrays Live Demo",
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
    title: "Recap: Asynchronous HTTP with Axios",
    kind: "content",
    bullets: [
      "axios + `async`/`await` keep the Lab 5 page on screen",
      "`cors()` then `express.json()` then the routes",
      "POST / PUT / DELETE with error status codes",
    ],
  },
  {
    id: "next-up",
    title: "Next: Next.js Server Routes",
    kind: "title",
    bullets: [
      "Same-origin `/api` when you do not need a second process",
      "Hello JSON, then a calculator query API",
    ],
  },
];
