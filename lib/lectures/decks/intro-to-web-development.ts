import type { LectureSlide } from "../types";

export const INTRO_TO_WEB_DEVELOPMENT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "CS 4550 / CS 5610 — Fall 2026",
      "Lecture 1 · Deck 1 — Introduction to Web Development",
      "Chapter 1 in the course book",
    ],
  },
  {
    id: "internet",
    title: "The Internet",
    kind: "content",
    bullets: [
      "A **network of networks** — many independently operated networks that agree to route traffic to one another",
      "Started in the 1960s as a U.S. Department of Defense research project at **DARPA** (then ARPA)",
      "First operational network: **ARPANET** — decentralized so it could survive disruptions",
      "TCP/IP in the 1980s let isolated academic and military networks interconnect worldwide",
      "The Internet is the pipes. The Web is one application that runs on those pipes",
    ],
  },
  {
    id: "web",
    title: "The World Wide Web",
    kind: "content",
    bullets: [
      "**WWW** — documents linked to other documents over the Internet",
      "Invented in 1989 by **Tim Berners-Lee** at **CERN** to share physics research",
      "Three inventions shipped together: **HTML** (pages), **HTTP** (how to request them), **URL**s (how to name them)",
      "First browser was also named WorldWideWeb; CERN released the technology to the public domain in 1993",
      "Today: billions of static pages and dynamic applications on the same ideas",
    ],
  },
  {
    id: "browsers-urls",
    title: "Browsers, URLs, and anchors",
    kind: "content",
    bullets: [
      "A **browser** is the client: it requests a document, parses HTML, and paints the page",
      "A **URL** names what to fetch: protocol + host + optional port + path (`https://webdev-client.vercel.app/book/ch1`)",
      "Local development uses the same pattern: `http://localhost:3000/labs/lab1`",
      "An **anchor** (`<a href=\"…\">`) is a hyperlink — the original Web feature that made documents a web",
      "Relative hrefs stay on this site; absolute hrefs can leave it",
    ],
    interactiveHint:
      "Open DevTools → Network, then click a link. Watch the browser issue a new HTTP request for that URL.",
  },
  {
    id: "network-of-networks",
    title: "Network of networks",
    kind: "content",
    bullets: [
      "Your laptop → home/campus Wi-Fi → ISP → backbone routers → the server’s ISP → the server",
      "No single company owns the path. Each hop is a network that peers with the next",
      "DNS turns `www.nasa.gov` into an IP address so packets can find the machine",
      "If one path fails, routing can take another — that was the ARPANET idea",
      "Diagram to sketch: [browser] — [your network] — [Internet] — [server network] — [web server]",
    ],
    interactiveHint:
      "On the board (or a notebook): draw five boxes in a line and label each hop. That picture is the whole Internet story.",
  },
  {
    id: "client-server",
    title: "Client–server",
    kind: "content",
    bullets: [
      "The **client** asks. The **server** answers. That is the architecture of the Web",
      "Client technologies you will write: **HTML**, **CSS**, **JavaScript**, **React**, **Next.js**",
      "Server technologies you will meet: **PHP**, **Java**, **Python**, and in this course **Node.js** + **Express**",
      "They talk over **HTTP**: a request (method + URL + headers + optional body) and a response (status + headers + body)",
      "GET `/labs/lab1` → 200 OK + HTML. The browser never opens the server’s files directly",
    ],
  },
  {
    id: "http",
    title: "HTTP request and response",
    kind: "content",
    bullets: [
      "Request line: `GET /hello HTTP/1.1` — method, path, protocol",
      "Common methods: GET (read), POST (create), PUT/PATCH (update), DELETE",
      "Response starts with a **status**: 200 OK, 301 redirect, 404 not found, 500 server error",
      "Headers carry metadata (`Content-Type: text/html`); the body is the page, JSON, or file",
      "Later labs: you will send JSON from Express and fetch it from React",
    ],
    interactiveHint:
      "In Chrome DevTools → Network, click a document row and read Headers. Find the request URL and the status code.",
  },
  {
    id: "milestones",
    title: "Milestones: 1960s–2020s",
    kind: "content",
    bullets: [
      "1960s — packet switching; ARPANET research",
      "1970s–80s — TCP/IP; the Internet becomes a network of networks",
      "1989–93 — Web, HTML, HTTP; CERN goes public",
      "1995–2000s — JavaScript, CSS, CGI, PHP, Java servlets; the dynamic Web",
      "2000s–10s — Ajax, REST, jQuery, then Angular / React / Vue; SPAs",
      "2010s–20s — Node.js, mobile, cloud, Next.js, serverless. That is this course’s stack",
    ],
  },
  {
    id: "server-frameworks",
    title: "Server frameworks: CGI → Node / Flask",
    kind: "content",
    bullets: [
      "**CGI** (1990s): the server launches a new program per request — simple, slow",
      "Then long-lived processes: PHP, Java servlets / Spring, Ruby on Rails, **Flask** / Django",
      "**Node.js** (2009): JavaScript on the server, one event loop, great at many concurrent connections",
      "**Express** is the small Node framework we use for REST APIs in later chapters",
      "This course: Next.js for the UI (and some server rendering); Express + Mongo for the API and data",
    ],
  },
  {
    id: "ssr",
    title: "Server-side rendering (SSR)",
    kind: "content",
    bullets: [
      "The **server** runs code, builds HTML, and sends a finished page",
      "Classic PHP / JSP / Rails / early Next.js pages: the first paint already has content",
      "Good for first load, SEO, and sharing a URL that “is” the page",
      "Next.js App Router can still render on the server — `page.tsx` is a Server Component by default",
      "You do not have to pick SSR *or* React. Next.js does both",
    ],
  },
  {
    id: "client-frameworks",
    title: "Client frameworks: JS → React / Next",
    kind: "content",
    bullets: [
      "Plain **JavaScript** can rewrite the DOM (`document.querySelector`, `innerHTML`)",
      "Libraries then frameworks: jQuery → Backbone → Angular / **React** / Vue / Svelte",
      "**React**: UI is a function of data. You describe components; React updates the DOM",
      "**Next.js** sits on React: file-system routing, server rendering, and a production toolchain",
      "This course teaches **React + Next.js App Router** — not a Vite-only SPA, not Pages Router",
    ],
  },
  {
    id: "csr",
    title: "Client-side rendering (CSR)",
    kind: "content",
    bullets: [
      "The server sends a thin shell; **JavaScript in the browser** builds the UI",
      "After load, clicks and fetches update the page without a full reload — a single-page feel",
      "Great for dashboards and apps (Kambaz). Weaker first paint if you ship an empty shell",
      "React started as a CSR library. Next.js can hydrate a server-rendered page and then behave like CSR",
      "You will use both: Server Components for the first HTML, client components when you need state and events",
    ],
  },
  {
    id: "web-app-se",
    title: "Web application software engineering",
    kind: "content",
    bullets: [
      "A course site is not a homework file. It is an **application**: UI, data, auth, deploy, iterate",
      "We treat labs and Kambaz like product work: small increments, running software every week",
      "Requirements live in the book and on Canvas; the running URL is the deliverable",
      "You will practice the same loop professionals use: code → commit → review → deploy",
      "The stack is the curriculum: HTML → CSS → JS/React → Node/Express → MongoDB",
    ],
  },
  {
    id: "teams",
    title: "Working in teams",
    kind: "content",
    bullets: [
      "**Git** is how a team shares a codebase without overwriting each other",
      "A **branch** is your workspace; a **pull request** is the conversation before it lands on `main`",
      "Review the diff, not the person. Ask for a running URL when the change is visual",
      "Never commit secrets (`.env.local`) or `node_modules`",
      "The final project is team-based. Start practicing PR habits on individual assignments",
    ],
  },
  {
    id: "large-projects",
    title: "Large projects are incremental",
    kind: "content",
    bullets: [
      "Kambaz is too big to build in one sitting — that is the point",
      "Each assignment adds a thin slice: HTML prototype → styles → data → state → API → database",
      "Keep the app **runnable** after every slice. A broken main branch blocks the next lab",
      "Prefer a boring, working increment over a clever rewrite",
      "The book’s checklists are the slice boundaries. Do not skip ahead and leave holes",
    ],
  },
  {
    id: "architecture",
    title: "Architecture: separation of concerns / MVC",
    kind: "content",
    bullets: [
      "**Separation of concerns**: HTML structure, CSS presentation, JS behavior, server data — different jobs",
      "**MVC**: Model (data), View (UI), Controller (glue that handles input and updates the model)",
      "On the client: React components are views; stores / server data are the model",
      "On the server: Express routes are controllers; Mongoose models talk to MongoDB",
      "You do not need a perfect MVC diagram. You do need to know which file owns which job",
    ],
  },
  {
    id: "patterns",
    title: "Design patterns you will see",
    kind: "content",
    bullets: [
      "**Singleton** — one shared instance (a database connection, a store)",
      "**Factory** — a function that creates objects so callers do not `new` the details",
      "**Service** — a module that performs a use case (grade a quiz, list assignments)",
      "**DAO** (data access object) — the only layer that talks to the database",
      "**IoC** (inversion of control) — the framework calls you (`page.tsx`, route handlers) instead of you owning `main()`",
    ],
  },
  {
    id: "next-up",
    title: "Next: install the runtime",
    kind: "title",
    bullets: [
      "You now have the map: Internet → Web → client/server → frameworks → how we build",
      "Deck 2: install Node.js and run a tiny Express `GET /hello`",
    ],
    interactiveHint:
      "Continue to Installing Node.js, or open Chapter 1 in the book for the same story in prose.",
  },
];
