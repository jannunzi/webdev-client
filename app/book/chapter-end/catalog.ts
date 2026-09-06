import type { ExternalLink } from "./types";

/** Jose's design / ideation set — Chapters 1–2 use most of these. */
export const AI = {
  v0: {
    name: "v0",
    href: "https://v0.app/",
    description:
      "Generates interface mockups and React starting points from a written prompt.",
  },
  stitch: {
    name: "Stitch",
    href: "https://stitch.withgoogle.com/",
    description:
      "Google's design tool for turning a product idea into screen layouts you can iterate on.",
  },
  rocket: {
    name: "Rocket.new",
    href: "https://www.rocket.new/",
    description:
      "Builds a working web app from a short description so you can explore structure before coding by hand.",
  },
  lucide: {
    name: "Lucide",
    href: "https://lucide.dev/",
    description:
      "A consistent open-source icon set you can search and drop into React screens.",
  },
  galileo: {
    name: "Galileo AI",
    href: "https://www.usegalileo.ai/",
    description:
      "Turns a text description into high-fidelity UI designs for early product exploration.",
  },
  promptGallery: {
    name: "Google Prompt Gallery",
    href: "https://ai.google.dev/gemini-api/prompts",
    description:
      "A public collection of Gemini prompt examples you can remix for writing, coding, and multimodal tasks.",
  },
  shadcn: {
    name: "shadcn/ui",
    href: "https://ui.shadcn.com/",
    description:
      "Copy-and-own React components styled with Tailwind for composing a polished interface.",
  },
  figma: {
    name: "Figma",
    href: "https://www.figma.com/",
    description:
      "Collaborative design software for wireframes, mockups, and handing layouts to developers.",
  },
  cursor: {
    name: "Cursor",
    href: "https://cursor.com",
    description:
      "An AI-native editor that reads your project and helps write or refactor TypeScript in place.",
  },
  claude: {
    name: "Claude",
    href: "https://claude.ai",
    description:
      "A conversational assistant for explaining APIs, reviewing code, and drafting implementations.",
  },
  copilot: {
    name: "GitHub Copilot",
    href: "https://github.com/features/copilot",
    description:
      "An AI pair programmer that suggests code as you type in the editor.",
  },
  compassNl: {
    name: "Compass natural-language queries",
    href: "https://www.mongodb.com/docs/compass/query-with-natural-language/",
    description:
      "Turns a plain-language question into a MongoDB filter so you can explore collections without writing every query by hand.",
  },
} as const satisfies Record<string, ExternalLink>;

export const DESIGN_AI_TOOLS: ExternalLink[] = [
  AI.v0,
  AI.stitch,
  AI.rocket,
  AI.lucide,
  AI.galileo,
  AI.promptGallery,
  AI.shadcn,
  AI.figma,
];

export const TOOL = {
  node: {
    name: "Node.js",
    href: "https://nodejs.org/",
    description:
      "The JavaScript runtime you install so Next.js, npm, and later the Express server can run on your machine.",
  },
  npm: {
    name: "npm",
    href: "https://www.npmjs.com/",
    description:
      "The package manager that ships with Node.js and installs the libraries this course's projects depend on.",
  },
  vscode: {
    name: "Visual Studio Code",
    href: "https://code.visualstudio.com",
    description:
      "A free code editor with a large extension ecosystem; a solid default if you are not using Cursor.",
  },
  cursor: {
    name: "Cursor",
    href: "https://cursor.com",
    description:
      "An AI-native editor, based on VS Code, that can read this project and help write or refactor TypeScript.",
  },
  chrome: {
    name: "Google Chrome",
    href: "https://www.google.com/chrome/",
    description:
      "The browser this course assumes for DevTools, the React extension, and checking your deployed site.",
  },
  devtools: {
    name: "Chrome DevTools",
    href: "https://developer.chrome.com/docs/devtools",
    description:
      "Chrome's built-in inspector for HTML, CSS, the console, and the Network panel.",
  },
  git: {
    name: "Git",
    href: "https://git-scm.com/",
    description:
      "The version-control tool you use locally to commit before you push the project to GitHub.",
  },
  github: {
    name: "GitHub",
    href: "https://github.com/",
    description:
      "The host for your remote Git repository and the place Vercel and Render connect when you deploy.",
  },
  next: {
    name: "Next.js",
    href: "https://nextjs.org/",
    description:
      "The React framework this course uses for pages, layouts, and later the HTTP server routes.",
  },
  react: {
    name: "React",
    href: "https://react.dev/",
    description:
      "The UI library that turns components and JSX into the screens you build in the labs.",
  },
  vercel: {
    name: "Vercel",
    href: "https://vercel.com/",
    description:
      "The host for the Next.js client; connect the GitHub repo here to put the UI on the public Web.",
  },
  css: {
    name: "CSS (MDN)",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    term: "CSS",
    description:
      "MDN's CSS reference — properties, selectors, and the box model you used to style Lab 2.",
  },
  tailwind: {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com/",
    description:
      "The utility-class CSS framework you apply in className strings instead of writing every rule by hand.",
  },
  reactIcons: {
    name: "React Icons",
    href: "https://react-icons.github.io/react-icons/",
    description:
      "A React wrapper around popular icon sets so you can import icons as components.",
  },
  javascript: {
    name: "JavaScript (MDN)",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    term: "JavaScript",
    description:
      "MDN's JavaScript reference for the language syntax, arrays, and functions you write in Lab 3.",
  },
  typescript: {
    name: "TypeScript",
    href: "https://www.typescriptlang.org/",
    description:
      "The typed JavaScript language this course writes in; the handbook is the official syntax reference.",
  },
  reduxToolkit: {
    name: "Redux Toolkit",
    href: "https://redux-toolkit.js.org/",
    description:
      "The official Redux helper library for a shared store, slices, and dispatch.",
  },
  zustand: {
    name: "Zustand",
    href: "https://zustand.docs.pmnd.rs/",
    description:
      "A small React store you compare with Context and Redux for shared client state.",
  },
  reactDevtools: {
    name: "React Developer Tools",
    href: "https://react.dev/learn/react-developer-tools",
    description:
      "A browser extension that shows the React component tree and the current props and state.",
  },
  express: {
    name: "Express",
    href: "https://expressjs.com/",
    description:
      "The Node.js HTTP framework the sibling webdev-server uses for REST routes.",
  },
  axios: {
    name: "axios",
    href: "https://axios-http.com/",
    description:
      "A promise-based HTTP client the React app uses to call the server.",
  },
  nodemon: {
    name: "nodemon",
    href: "https://nodemon.io/",
    description:
      "A development helper that restarts the Node server whenever you save a file.",
  },
  render: {
    name: "Render",
    href: "https://render.com/",
    description:
      "The host for the Node/Express API so the deployed client has a public server URL.",
  },
  routeHandlers: {
    name: "Next.js Route Handlers",
    href: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
    term: "Route Handlers",
    description:
      "Next.js App Router endpoints that can answer HTTP from the same project as the UI.",
  },
  mongodb: {
    name: "MongoDB",
    href: "https://www.mongodb.com/",
    description:
      "The document database this chapter stores Kambaz collections in.",
  },
  mongoDownload: {
    name: "MongoDB Community Server",
    href: "https://www.mongodb.com/try/download/community",
    description:
      "The installer for a local MongoDB instance you run on your own machine.",
  },
  compass: {
    name: "MongoDB Compass",
    href: "https://www.mongodb.com/products/tools/compass",
    description:
      "A desktop GUI for browsing collections, writing queries, and inspecting documents.",
  },
  atlas: {
    name: "MongoDB Atlas",
    href: "https://www.mongodb.com/atlas",
    description:
      "MongoDB's hosted cluster; you copy a connection string into the server environment.",
  },
  mongoose: {
    name: "Mongoose",
    href: "https://mongoosejs.com/",
    description:
      "The Node.js library that defines schemas and talks to MongoDB from Express.",
  },
} as const satisfies Record<string, ExternalLink>;
