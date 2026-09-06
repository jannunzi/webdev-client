import { AI, TOOL } from "../chapter-end/catalog";
import {
  numberedEndMatter,
  type ChapterEndMatterData,
} from "../chapter-end/types";

const sections = numberedEndMatter(5, 8);

export const ch5EndMatter: ChapterEndMatterData = {
  chapter: 5,
  references: {
    ...sections.references,
    lead: "This chapter moved data out of the browser and onto an HTTP server. The linked terms are the Node, Express, and Next.js pieces you configured; the topics are the request shapes and server habits the labs practiced.",
    items: [
      "express-js",
      "node-js",
      "axios",
      "cors",
      "ajax",
      "route-handlers",
      "next-public",
      "nodemon",
      "render",
      "rest",
      "http",
      "api",
      "next-js",
      "github",
      "vercel",
    ],
    topics: [
      "Sibling webdev-server project on port 4000",
      "Path parameters, query parameters, and JSON request bodies",
      "Remote objects and remote arrays",
      "Asynchronous HTTP from a React client",
      "Sessions and account routes",
      "Environment variables for the public server URL",
    ],
  },
  tools: {
    ...sections.tools,
    lead: "Install and deploy from these official sites. Express and Node.js are the server; axios is the client; Render hosts the API; Vercel still hosts the Next.js UI.",
    items: [
      TOOL.node,
      TOOL.express,
      TOOL.nodemon,
      TOOL.axios,
      TOOL.routeHandlers,
      TOOL.devtools,
      TOOL.render,
      TOOL.github,
      TOOL.vercel,
    ],
  },
  aiTools: {
    ...sections.aiTools,
    lead: "HTTP status codes, CORS headers, and route order are the kind of details a coding assistant can talk through while you watch the Network panel. Treat generated Express snippets as drafts — the sibling server still has to run on your machine.",
    items: [AI.cursor, AI.claude, AI.copilot, AI.promptGallery],
  },
};
