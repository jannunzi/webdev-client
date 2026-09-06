import { AI, TOOL } from "../chapter-end/catalog";
import {
  numberedEndMatter,
  type ChapterEndMatterData,
} from "../chapter-end/types";

const sections = numberedEndMatter(4, 13);

export const ch4EndMatter: ChapterEndMatterData = {
  chapter: 4,
  references: {
    ...sections.references,
    lead: "Client state is the subject of this chapter: local values in a component, shared values in a store, and the events that change them. The linked terms are the React APIs and libraries you installed; the topics are the patterns the labs practiced.",
    items: [
      "usestate",
      "useeffect",
      "react-context",
      "redux-toolkit",
      "zustand",
      "react",
      "javascript",
      "next-js",
      "react-developer-tools",
    ],
    topics: [
      "User events and passing data or functions to handlers",
      "Boolean, string, date, object, and array state",
      "Sharing state between parent and child",
      "Prop drilling",
      "Encoding state in the URL",
      "Reducers, actions, useSelector, and dispatch",
      "Local state versus shared application state",
    ],
  },
  tools: {
    ...sections.tools,
    lead: "These official docs match the four state tools the chapter compares. React Developer Tools is the easiest way to see which component owns a value after you click.",
    items: [
      TOOL.react,
      TOOL.reduxToolkit,
      TOOL.zustand,
      TOOL.reactDevtools,
      TOOL.next,
      TOOL.devtools,
      TOOL.github,
      TOOL.vercel,
    ],
  },
  aiTools: {
    ...sections.aiTools,
    lead: "State bugs are easier to talk through than to stare at. A coding assistant can help you choose between useState, Context, and a store — verify every suggestion against the live counter and todo labs.",
    items: [AI.cursor, AI.claude, AI.copilot, AI.promptGallery],
  },
};
