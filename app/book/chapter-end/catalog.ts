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
    href: "https://cursor.com/",
    description:
      "An AI-native editor that reads your project and helps write or refactor TypeScript in place.",
  },
  claude: {
    name: "Claude",
    href: "https://claude.ai/",
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
  node: { name: "Node.js", href: "https://nodejs.org/" },
  npm: { name: "npm", href: "https://www.npmjs.com/" },
  vscode: { name: "Visual Studio Code", href: "https://code.visualstudio.com/" },
  cursor: { name: "Cursor", href: "https://cursor.com/" },
  chrome: { name: "Google Chrome", href: "https://www.google.com/chrome/" },
  devtools: {
    name: "Chrome DevTools",
    href: "https://developer.chrome.com/docs/devtools",
  },
  git: { name: "Git", href: "https://git-scm.com/" },
  github: { name: "GitHub", href: "https://github.com/" },
  next: { name: "Next.js", href: "https://nextjs.org/" },
  react: { name: "React", href: "https://react.dev/" },
  vercel: { name: "Vercel", href: "https://vercel.com/" },
  css: {
    name: "CSS (MDN)",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  tailwind: { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
  reactIcons: {
    name: "React Icons",
    href: "https://react-icons.github.io/react-icons/",
  },
  javascript: {
    name: "JavaScript (MDN)",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  typescript: { name: "TypeScript", href: "https://www.typescriptlang.org/" },
  reduxToolkit: {
    name: "Redux Toolkit",
    href: "https://redux-toolkit.js.org/",
  },
  zustand: { name: "Zustand", href: "https://zustand.docs.pmnd.rs/" },
  reactDevtools: {
    name: "React Developer Tools",
    href: "https://react.dev/learn/react-developer-tools",
  },
  express: { name: "Express", href: "https://expressjs.com/" },
  axios: { name: "axios", href: "https://axios-http.com/" },
  nodemon: { name: "nodemon", href: "https://nodemon.io/" },
  render: { name: "Render", href: "https://render.com/" },
  routeHandlers: {
    name: "Next.js Route Handlers",
    href: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
  },
  mongodb: { name: "MongoDB", href: "https://www.mongodb.com/" },
  mongoDownload: {
    name: "MongoDB Community Server",
    href: "https://www.mongodb.com/try/download/community",
  },
  compass: {
    name: "MongoDB Compass",
    href: "https://www.mongodb.com/products/tools/compass",
  },
  atlas: { name: "MongoDB Atlas", href: "https://www.mongodb.com/atlas" },
  mongoose: { name: "Mongoose", href: "https://mongoosejs.com/" },
} as const satisfies Record<string, ExternalLink>;
