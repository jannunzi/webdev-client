import { AI, TOOL } from "../chapter-end/catalog";
import {
  numberedEndMatter,
  type ChapterEndMatterData,
} from "../chapter-end/types";

const sections = numberedEndMatter(3, 11);

export const ch3EndMatter: ChapterEndMatterData = {
  chapter: 3,
  references: {
    ...sections.references,
    lead: "This chapter turned hardcoded markup into data-driven screens. The linked terms are the languages and libraries you wrote in; the topics are the JavaScript and React techniques the labs walked through.",
    items: [
      "javascript",
      "typescript",
      "spa",
      "react",
      "jsx",
      "next-js",
      "dom",
      "html",
    ],
    topics: [
      "Variables, constants, types, and booleans",
      "Conditionals, the ternary operator, and short-circuit output",
      "Arrow functions, implied return, and template literals",
      "Arrays: map, find, filter, reduce, includes, some, and every",
      "Objects, JSON.stringify, spread, and destructuring",
      "Optional chaining and nullish coalescing",
      "Dynamic class and style values",
      "Client Components and Server Components",
      "Pathname, path parameters, and rendering a data structure",
    ],
  },
  tools: {
    ...sections.tools,
    lead: "Keep these language and library docs nearby while you write Lab 3. The JavaScript and TypeScript handbooks are the best place to confirm what a method returns before you map it into JSX.",
    items: [
      TOOL.javascript,
      TOOL.typescript,
      TOOL.react,
      TOOL.next,
      TOOL.devtools,
      TOOL.node,
      TOOL.github,
      TOOL.vercel,
    ],
  },
  aiTools: {
    ...sections.aiTools,
    lead: "Once the work is arrays, functions, and data-driven components, coding assistants are more useful than mockup tools. Ask them to explain a method or sketch a map — then type the code yourself so the syntax stays yours.",
    items: [AI.cursor, AI.claude, AI.copilot, AI.promptGallery, AI.v0],
  },
};
