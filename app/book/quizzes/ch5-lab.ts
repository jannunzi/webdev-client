import type { QuizQuestion } from "./types";

/** Curated self-check bank for Chapter 5 labs. The quiz draws 10. */
export const CH5_LAB_QUESTIONS: QuizQuestion[] = [
  {
    id: "5-http-acronym",
    section: "5.2.1",
    kind: "acronym",
    prompt: "What does HTTP stand for?",
    choices: [
      { id: "a", text: "HyperText Transfer Protocol" },
      { id: "b", text: "High-Traffic Text Process" },
      { id: "c", text: "Host Transfer Type Path" },
      { id: "d", text: "Hashed Tag Transport Package" },
    ],
    answer: "a",
    explanation:
      "HTTP is HyperText Transfer Protocol — the request/response protocol browsers use to talk to servers.",
  },
  {
    id: "5-rest-acronym",
    section: "5.2.4",
    kind: "acronym",
    prompt: "What does REST stand for?",
    choices: [
      { id: "a", text: "Remote Express Server Transfer" },
      { id: "b", text: "Representational State Transfer" },
      { id: "c", text: "Routed Endpoint Style Template" },
      { id: "d", text: "Reusable Entity Service Type" },
    ],
    answer: "b",
    explanation:
      "REST is Representational State Transfer. Resources have URLs; HTTP methods say what to do with them.",
  },
  {
    id: "5-crud-acronym",
    section: "5.2.4",
    kind: "acronym",
    prompt: "What does CRUD stand for?",
    choices: [
      { id: "a", text: "Create, Read, Update, Delete" },
      { id: "b", text: "Cache, Route, Upload, Download" },
      { id: "c", text: "Client Request, URL, Data" },
      { id: "d", text: "Copy, Replace, Undo, Drop" },
    ],
    answer: "a",
    explanation:
      "CRUD is Create, Read, Update, Delete — mapped here to POST, GET, PUT, and DELETE.",
  },
  {
    id: "5-url-acronym",
    section: "5.2.1",
    kind: "acronym",
    prompt: "What does URL stand for?",
    choices: [
      { id: "a", text: "Uniform Resource Locator" },
      { id: "b", text: "Universal Route List" },
      { id: "c", text: "User Request Link" },
      { id: "d", text: "Upstream Resource Library" },
    ],
    answer: "a",
    explanation:
      "A URL is a Uniform Resource Locator: scheme, host, path, and optional query string.",
  },
  {
    id: "5-get-safe",
    section: "5.2.2",
    kind: "concept",
    prompt: "Which HTTP method is safe — it must not change server state?",
    choices: [
      { id: "a", text: "POST" },
      { id: "b", text: "PUT" },
      { id: "c", text: "GET" },
      { id: "d", text: "DELETE" },
    ],
    answer: "c",
    explanation:
      "GET is safe and idempotent: it retrieves a representation and should not create, update, or delete.",
  },
  {
    id: "5-post-not-idempotent",
    section: "5.2.2",
    kind: "concept",
    prompt: "Why is POST not idempotent?",
    choices: [
      { id: "a", text: "POST cannot send a JSON body" },
      {
        id: "b",
        text: "Two identical POSTs typically create two resources, so a retry is not a no-op",
      },
      { id: "c", text: "POST always returns 500" },
      { id: "d", text: "POST is another name for GET" },
    ],
    answer: "b",
    explanation:
      "Idempotent methods can be retried without a second side effect. POST creates; two creates make two items.",
  },
  {
    id: "5-status-201",
    section: "5.2.3",
    kind: "concept",
    prompt: "Which status code should a successful POST that created a todo return?",
    choices: [
      { id: "a", text: "200 OK" },
      { id: "b", text: "201 Created" },
      { id: "c", text: "400 Bad Request" },
      { id: "d", text: "404 Not Found" },
    ],
    answer: "b",
    explanation:
      "201 Created means a new resource exists. 200 is a generic success; the lab uses 201 for POST.",
  },
  {
    id: "5-status-404",
    section: "5.2.3",
    kind: "concept",
    prompt: "When should a Route Handler return 404?",
    choices: [
      { id: "a", text: "The JSON body is missing a required title" },
      { id: "b", text: "No item in the store matches the id in the URL" },
      { id: "c", text: "The handler threw an unexpected exception" },
      { id: "d", text: "The create succeeded" },
    ],
    answer: "b",
    explanation:
      "404 Not Found means the URL does not identify a resource. A missing title is 400; an uncaught throw is 500.",
  },
  {
    id: "5-status-400",
    section: "5.3.4",
    kind: "concept",
    prompt: "The todos POST returns 400 when…",
    choices: [
      { id: "a", text: "the id is not in the store" },
      { id: "b", text: "the JSON body has no non-empty title" },
      { id: "c", text: "the method is GET" },
      { id: "d", text: "the browser sent Content-Type: application/json" },
    ],
    answer: "b",
    explanation:
      "400 Bad Request is for a body or query the handler will not accept. An empty title is invalid input.",
  },
  {
    id: "5-route-file",
    section: "5.3",
    kind: "syntax",
    prompt: "Which file serves GET /api/lab5/hello?",
    choices: [
      { id: "a", text: "app/api/lab5/hello/page.tsx" },
      { id: "b", text: "app/api/lab5/hello/route.ts" },
      { id: "c", text: "app/labs/lab5/hello.ts" },
      { id: "d", text: "pages/api/hello.js" },
    ],
    answer: "b",
    explanation:
      "App Router Route Handlers are route.ts files. The folder path under app/api is the URL path.",
  },
  {
    id: "5-response-json",
    section: "5.3.1",
    kind: "syntax",
    prompt: "How does the hello handler return JSON with status 200?",
    choices: [
      { id: "a", text: "res.json({ message: \"Hello\" })" },
      { id: "b", text: "return Response.json({ message: \"Hello World from Lab 5\" })" },
      { id: "c", text: "return JSON.stringify({ message: \"Hello\" })" },
      { id: "d", text: "return <pre>{message}</pre>" },
    ],
    answer: "b",
    explanation:
      "Route Handlers return a Web Response. Response.json serializes the value and sets Content-Type.",
  },
  {
    id: "5-params-promise",
    section: "5.3.3",
    kind: "syntax",
    prompt: "How do you read [a] and [b] in a Next.js 16 Route Handler?",
    choices: [
      { id: "a", text: "const { a, b } = request.query" },
      { id: "b", text: "const { a, b } = await params" },
      { id: "c", text: "const { a, b } = useParams()" },
      { id: "d", text: "const { a, b } = params  // no await" },
    ],
    answer: "b",
    explanation:
      "In Next.js 16, params is a Promise. Await it, then destructure. useParams is for Client Components.",
  },
  {
    id: "5-search-params",
    section: "5.3.2",
    kind: "syntax",
    prompt: "How does the welcome handler read ?name=Jose?",
    choices: [
      { id: "a", text: "request.body.name" },
      { id: "b", text: "request.nextUrl.searchParams.get(\"name\")" },
      { id: "c", text: "await params then params.name" },
      { id: "d", text: "useSearchParams() inside route.ts" },
    ],
    answer: "b",
    explanation:
      "NextRequest exposes nextUrl.searchParams. Query strings are not path params and not the JSON body.",
  },
  {
    id: "5-fetch-post",
    section: "5.3.4",
    kind: "snippet",
    prompt: "Which fetch call creates a todo?",
    code: `fetch("/api/lab5/todos", {
  ???
})`,
    choices: [
      { id: "a", text: "method: \"GET\"" },
      {
        id: "b",
        text: "method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify({ title })",
      },
      { id: "c", text: "method: \"POST\", body: { title }" },
      { id: "d", text: "method: \"PUT\", body: title" },
    ],
    answer: "b",
    explanation:
      "POST needs a method, a JSON Content-Type, and a stringified body. A raw object is not a valid body.",
  },
  {
    id: "5-json-stringify-body",
    section: "5.3.4",
    kind: "concept",
    prompt: "Why does fetch send JSON.stringify({ title }) instead of the object itself?",
    choices: [
      { id: "a", text: "HTTP bodies are text; stringify turns the object into a JSON string" },
      { id: "b", text: "JSON.stringify converts the title to a number" },
      { id: "c", text: "The server cannot call request.json() on a string" },
      { id: "d", text: "stringify is required only for GET" },
    ],
    answer: "a",
    explanation:
      "The body option expects a string (or other BodyInit). JSON.stringify is the inverse of request.json().",
  },
  {
    id: "5-use-effect-fetch",
    section: "5.4.1",
    kind: "concept",
    prompt: "Why does ClientGet call fetch inside useEffect with [] rather than in the component body?",
    choices: [
      { id: "a", text: "fetch is illegal in Client Components" },
      {
        id: "b",
        text: "A fetch in the body would run on every render; the effect runs after the first paint",
      },
      { id: "c", text: "useEffect is required to import Response.json" },
      { id: "d", text: "Empty arrays disable fetch" },
    ],
    answer: "b",
    explanation:
      "fetch is a side effect. Putting it in the render body retriggers it when setTodos causes a re-render.",
  },
  {
    id: "5-refetch-after-post",
    section: "5.4.2",
    kind: "concept",
    prompt: "After a successful POST, why does ClientPost call load() again?",
    choices: [
      { id: "a", text: "POST responses never include JSON" },
      {
        id: "b",
        text: "Refetching GET /api/lab5/todos picks up the server-generated id and the new list",
      },
      { id: "c", text: "useEffect cannot run after a click" },
      { id: "d", text: "The browser caches POST forever" },
    ],
    answer: "b",
    explanation:
      "The server assigns the id. Reloading the collection keeps client state aligned with the store.",
  },
  {
    id: "5-server-vs-client-fetch",
    section: "5.5",
    kind: "concept",
    prompt: "What is the main contrast between ClientGet and the Server Component todo list?",
    choices: [
      {
        id: "a",
        text: "The Server Component loads data before HTML is sent; the client fetch fills the list after paint",
      },
      { id: "b", text: "Server Components cannot read JSON" },
      { id: "c", text: "Client fetch cannot call /api" },
      { id: "d", text: "Server Components must use useEffect" },
    ],
    answer: "a",
    explanation:
      "A Server Component can await data (or call the store) during render. Client fetch needs useEffect and a first empty paint.",
  },
  {
    id: "5-use-client-server-fetch",
    section: "5.5",
    kind: "syntax",
    prompt: "Does 5-5-1-ServerFetch.tsx start with \"use client\"?",
    choices: [
      { id: "a", text: "Yes — all fetch lives in Client Components" },
      { id: "b", text: "No — omitting the directive keeps it a Server Component that can be async" },
      { id: "c", text: "Yes — async functions require it" },
      { id: "d", text: "It starts with \"use server\" instead" },
    ],
    answer: "b",
    explanation:
      "Server Components are the default. They may be async. \"use client\" would block importing the server store.",
  },
  {
    id: "5-cache-no-store",
    section: "5.5",
    kind: "concept",
    prompt: "Why mention cache: \"no-store\" on a server fetch of a mutable API?",
    choices: [
      { id: "a", text: "It converts GET into POST" },
      {
        id: "b",
        text: "It tells Next.js not to reuse a cached GET across requests after the store changes",
      },
      { id: "c", text: "It is required to import route.ts" },
      { id: "d", text: "It disables HTTP status codes" },
    ],
    answer: "b",
    explanation:
      "Cached GETs can show stale todos after a POST. no-store forces a fresh read.",
  },
  {
    id: "5-server-action-directive",
    section: "5.6",
    kind: "syntax",
    prompt: "Which directive marks addTodoAction as a Server Action?",
    choices: [
      { id: "a", text: "\"use client\"" },
      { id: "b", text: "\"use server\"" },
      { id: "c", text: "\"use action\"" },
      { id: "d", text: "export const server = true" },
    ],
    answer: "b",
    explanation:
      "\"use server\" at the top of actions.ts makes every export a Server Action callable from a form.",
  },
  {
    id: "5-actions-vs-handlers",
    section: "5.6",
    kind: "concept",
    prompt: "Why does this chapter use Route Handlers for Kambaz instead of Server Actions?",
    choices: [
      {
        id: "a",
        text: "Route Handlers expose a public HTTP URL any client can call; Server Actions do not",
      },
      { id: "b", text: "Server Actions cannot run on the server" },
      { id: "c", text: "Route Handlers cannot return JSON" },
      { id: "d", text: "Server Actions require Express" },
    ],
    answer: "a",
    explanation:
      "A Server Action is a function call from this app. /api/courses is an HTTP contract you can later put MongoDB behind.",
  },
  {
    id: "5-two-models",
    section: "5.7.1",
    kind: "concept",
    prompt: "Which two server models does this chapter teach?",
    choices: [
      {
        id: "a",
        text: "Only MongoDB collections and only Zustand stores",
      },
      {
        id: "b",
        text: "Next.js Route Handlers in the same app as the UI, and a separate Node/Express process the UI calls over HTTP",
      },
      {
        id: "c",
        text: "Only Express — Route Handlers are deprecated in this chapter",
      },
      {
        id: "d",
        text: "Only Server Actions — HTTP APIs are extra credit",
      },
    ],
    answer: "b",
    explanation:
      "Keep both tracks. Route Handlers are same-app APIs. Express is a second process you deploy to Render. Neither uses MongoDB yet.",
  },
  {
    id: "5-in-memory",
    section: "5.3.4",
    kind: "concept",
    prompt: "What happens to in-memory todos when the Next.js process restarts?",
    choices: [
      { id: "a", text: "They persist in the browser cookie" },
      { id: "b", text: "The module-level array reseeds from its initial values" },
      { id: "c", text: "MongoDB reloads them automatically" },
      { id: "d", text: "They are written to courses.json" },
    ],
    answer: "b",
    explanation:
      "A let array lives in the server process. Restart (or a later MongoDB chapter) is what makes data durable.",
  },
  {
    id: "5-modules-query",
    section: "5.11.4",
    kind: "syntax",
    prompt: "How does the Modules screen ask for RS101’s modules?",
    choices: [
      { id: "a", text: "GET /api/modules/RS101" },
      { id: "b", text: "GET /api/modules?course=RS101" },
      { id: "c", text: "POST /api/modules with an empty body" },
      { id: "d", text: "GET /api/courses/RS101/modules.json" },
    ],
    answer: "b",
    explanation:
      "The collection is /api/modules. A course query filters. Path params on /api/modules/[id] identify one module.",
  },
  {
    id: "5-encode-uri",
    section: "5.3.2",
    kind: "concept",
    prompt: "Why does QueryHandler wrap name in encodeURIComponent?",
    choices: [
      { id: "a", text: "It hashes the name for security" },
      {
        id: "b",
        text: "Spaces and punctuation must be escaped so they stay legal in a query string",
      },
      { id: "c", text: "It converts the name to JSON" },
      { id: "d", text: "Route Handlers reject unencoded ASCII letters" },
    ],
    answer: "b",
    explanation:
      "A space in Jose Annunziato would break the query without encoding. Letters like Jose are unchanged.",
  },
  {
    id: "5-content-type",
    section: "5.4.2",
    kind: "syntax",
    prompt: "Which header tells the Route Handler the POST body is JSON?",
    choices: [
      { id: "a", text: "Accept: text/html" },
      { id: "b", text: "Content-Type: application/json" },
      { id: "c", text: "X-Method: POST" },
      { id: "d", text: "Cache-Control: no-store" },
    ],
    answer: "b",
    explanation:
      "Content-Type describes the body you are sending. application/json matches request.json() on the server.",
  },
  {
    id: "5-put-path",
    section: "5.3.5",
    kind: "syntax",
    prompt: "Which URL updates todo id 1?",
    choices: [
      { id: "a", text: "PUT /api/lab5/todos" },
      { id: "b", text: "PUT /api/lab5/todos/1" },
      { id: "c", text: "POST /api/lab5/todos/1" },
      { id: "d", text: "GET /api/lab5/todos?id=1" },
    ],
    answer: "b",
    explanation:
      "The item URL is the collection plus the id. PUT replaces that resource; POST on the collection creates.",
  },
  {
    id: "5-blank-rest-resource",
    section: "5.2.4",
    kind: "blank",
    prompt:
      "In REST, a course or a todo identified by a URL is called a _____.",
    answer: "resource",
    accept: ["resources", "REST resource"],
    explanation:
      "REST treats the Web as resources. /api/courses/RS101 is one course resource.",
  },
  {
    id: "5-assignments-oyo",
    section: "5.11.8",
    kind: "concept",
    prompt: "How should Assignments persist in this chapter?",
    choices: [
      { id: "a", text: "MongoDB collections created in this chapter" },
      {
        id: "b",
        text: "The same /api/assignments HTTP contract on Route Handlers and on Express, talking to in-memory stores — no MongoDB",
      },
      { id: "c", text: "Only Zustand, with no HTTP" },
      { id: "d", text: "Only a SQL file in public/" },
    ],
    answer: "b",
    explanation:
      "Assignments are On Your Own but follow courses and modules on both server models. Switching NEXT_PUBLIC_API_BASE must not 404.",
  },
  {
    id: "5-cors-why",
    section: "5.7.3",
    kind: "concept",
    prompt: "Why does the Express server need CORS middleware?",
    choices: [
      { id: "a", text: "Express cannot send JSON without CORS" },
      {
        id: "b",
        text: "A page on localhost:3000 (or Vercel) fetching localhost:4000 (or Render) is cross-origin; the browser hides the response without Access-Control-Allow-Origin",
      },
      { id: "c", text: "Same-origin Route Handlers also require the cors npm package" },
      { id: "d", text: "CORS replaces HTTP status codes" },
    ],
    answer: "b",
    explanation:
      "Different scheme, host, or port is a different origin. OPTIONS preflight asks permission. Route Handlers on the same origin skip this.",
  },
  {
    id: "5-api-base",
    section: "5.7.4",
    kind: "syntax",
    prompt: "What does an empty NEXT_PUBLIC_API_BASE make apiUrl(\"/api/courses\") return?",
    choices: [
      { id: "a", text: "http://localhost:4000/api/courses" },
      { id: "b", text: "/api/courses" },
      { id: "c", text: "https://vercel.com/api/courses" },
      { id: "d", text: "undefined" },
    ],
    answer: "b",
    explanation:
      "Empty base means same-origin Route Handlers. A Render or localhost:4000 origin prefixes that path.",
  },
  {
    id: "5-next-public",
    section: "5.7.4",
    kind: "concept",
    prompt: "Why must the API base env var start with NEXT_PUBLIC_?",
    choices: [
      { id: "a", text: "Render rejects any other prefix" },
      {
        id: "b",
        text: "Client Components can only read env vars that Next.js inlines into the browser bundle",
      },
      { id: "c", text: "It enables MongoDB" },
      { id: "d", text: "Without it Express will not listen" },
    ],
    answer: "b",
    explanation:
      "fetch in Dashboard and Lab 5 runs in the browser. NEXT_PUBLIC_API_BASE is visible there; a server-only var would be undefined.",
  },
  {
    id: "5-render-root",
    section: "5.8.2",
    kind: "concept",
    prompt: "When deploying the separate API to Render, what is the Web Service root directory?",
    choices: [
      { id: "a", text: "The repository root (so Render starts Next.js)" },
      { id: "b", text: "server" },
      { id: "c", text: "app/api" },
      { id: "d", text: "node_modules" },
    ],
    answer: "b",
    explanation:
      "Root Directory server makes Render use server/package.json and npm start (tsx index.ts). The repo root is the Next.js app on Vercel.",
  },
  {
    id: "5-frontend-origin",
    section: "5.8.3",
    kind: "concept",
    prompt: "FRONTEND_ORIGIN on Render should be…",
    choices: [
      { id: "a", text: "The Render API URL itself" },
      { id: "b", text: "The Next.js UI origin (Vercel and/or localhost:3000) allowed by CORS" },
      { id: "c", text: "A MongoDB connection string" },
      { id: "d", text: "The GitHub repository URL" },
    ],
    answer: "b",
    explanation:
      "CORS allow-lists the page that calls fetch. NEXT_PUBLIC_API_BASE is the opposite direction: the UI naming the API host.",
  },
];
