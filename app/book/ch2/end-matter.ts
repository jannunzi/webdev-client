import { DESIGN_AI_TOOLS, TOOL } from "../chapter-end/catalog";
import {
  numberedEndMatter,
  type ChapterEndMatterData,
} from "../chapter-end/types";

const sections = numberedEndMatter(2, 6);

export const ch2EndMatter: ChapterEndMatterData = {
  chapter: 2,
  references: {
    ...sections.references,
    lead: "This chapter is about how a page looks: CSS rules, selectors, the box model, layout, React Icons, and Tailwind utility classes. The linked terms open the in-book pages; the list after that names the CSS and layout ideas you practiced that do not have their own term pages.",
    items: [
      "css",
      "html",
      "react",
      "react-icons",
      "jsx",
      "next-js",
      "tailwind-css",
      "chrome-devtools",
      "github",
      "vercel",
    ],
    topics: [
      "Style attribute versus imported style sheets",
      "ID, class, and document-structure selectors",
      "Foreground and background color, borders, and corners",
      "Padding, margins, and the CSS box model",
      "Dimensions, display, relative, absolute, and fixed position",
      "Z-index, float, flex, and CSS Grid",
      "Media queries and responsive Tailwind breakpoints",
    ],
  },
  tools: {
    ...sections.tools,
    lead: "These are the official references for the styling stack you used in Lab 2 and when restyling Kambaz. Chrome DevTools is the fastest way to see which rule actually won.",
    items: [
      TOOL.css,
      TOOL.tailwind,
      TOOL.reactIcons,
      TOOL.devtools,
      TOOL.next,
      TOOL.github,
      TOOL.vercel,
    ],
  },
  aiTools: {
    ...sections.aiTools,
    lead: "Styling is the chapter where design helpers earn their keep. Use them to try color, spacing, and icon choices, then rebuild the look yourself in CSS or Tailwind so you still understand every class.",
    items: DESIGN_AI_TOOLS,
  },
};
