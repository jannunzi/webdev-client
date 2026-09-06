import { AI, TOOL } from "../chapter-end/catalog";
import {
  numberedEndMatter,
  type ChapterEndMatterData,
} from "../chapter-end/types";

const sections = numberedEndMatter(6, 6);

export const ch6EndMatter: ChapterEndMatterData = {
  chapter: 6,
  references: {
    ...sections.references,
    lead: "This chapter stored the arrays from Chapter 5 in MongoDB. The linked terms are the database products and libraries you installed; the topics are the modeling and CRUD ideas the DAOs implemented.",
    items: [
      "mongodb",
      "mongoose",
      "mongodb-atlas",
      "mongodb-compass",
      "node-js",
      "express-js",
      "axios",
      "rest",
      "render",
    ],
    topics: [
      "Relational versus document databases",
      "Documents, collections, and connection strings",
      "Mongoose schemas, models, and DAOs",
      "Retrieving, creating, updating, and deleting documents",
      "One-to-many modules and many-to-many enrollments",
      "Session configuration on a remote server",
    ],
  },
  tools: {
    ...sections.tools,
    lead: "Download the local database and Compass from MongoDB, then create an Atlas cluster for the hosted URI. Mongoose is the library the Node server uses; Render and Vercel still host the two deployed apps.",
    items: [
      TOOL.mongodb,
      TOOL.mongoDownload,
      TOOL.compass,
      TOOL.atlas,
      TOOL.mongoose,
      TOOL.node,
      TOOL.express,
      TOOL.render,
      TOOL.vercel,
      TOOL.github,
    ],
  },
  aiTools: {
    ...sections.aiTools,
    lead: "Schemas and predicates are easier to draft with a coding assistant, and Compass can turn a plain-language question into a filter. Read every generated query before you run it against a collection you care about.",
    items: [AI.cursor, AI.claude, AI.copilot, AI.promptGallery, AI.compassNl],
  },
};
