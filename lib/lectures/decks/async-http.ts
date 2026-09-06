import type { LectureSlide } from "../types";

export const ASYNC_HTTP_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Async HTTP and JSON",
      "§5.2.5–5.2.6 · axios, CORS, POST/PUT/DELETE",
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
        file: "app/labs/lab5/intermediates/5-2-5-HttpClient.tsx",
        language: "tsx",
        code: `import axios from "axios";
const HTTP_SERVER = httpServer();
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
      { code: "npm install cors", language: "bash" },
      {
        file: "webdev-server/index.js",
        language: "js",
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
import { httpServer } from "@/app/lib/httpServer";
const HTTP_SERVER = httpServer();
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(\`\${HTTP_SERVER}/lab5/welcome\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/labs/lab5/client.ts",
    codeHighlightLines: [[4, 7]],
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
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
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
    id: "post-delete",
    title: "POST create, DELETE remove",
    kind: "demo",
    bullets: [
      "POST `/lab5/todos` spreads `req.body` and assigns an id",
      "DELETE `/lab5/todos/:id` returns 404 when the id is missing",
    ],
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
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/WorkingWithArrays.js",
    codeHighlightLines: [[16, 17]],
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
      "§5.3: hello JSON, then a calculator query API",
    ],
  },
];
