import { projectDocHref } from "./docs";

export const projectOverview = {
  intro: [
    "For the final project, students will collaborate in teams of up to five members, or work individually, to develop a sophisticated web application. This project builds on the skills and technologies explored throughout the semester, offering an opportunity to integrate and apply your knowledge in a practical, real-world context.",
    "You may choose ONE of the following options. Full requirements — screens, fields, roles, and original screenshots — are on this site for each option.",
  ],
  options: [
    {
      id: "quizzes" as const,
      href: projectDocHref("quizzes"),
      title: "Kambaz Quizzes Final Project",
      summary:
        "Extend the Kambaz learning management system by developing a Quizzes section, enhancing the platform with interactive assessment features to support seamless online learning.",
    },
    {
      id: "pazza" as const,
      href: projectDocHref("pazza"),
      title: "Kambaz Pazza Final Project",
      summary:
        "Integrate Pazza, a Q&A platform inspired by a popular service, into the existing Kambaz project using the course full-stack (Next.js client + Node/Express API + MongoDB), focusing on feature integration and full-stack development.",
    },
    {
      id: "open-ended" as const,
      href: projectDocHref("open-ended"),
      title: "Open-Ended Web Application Final Project",
      summary:
        "Design and build an original, interactive full-stack web application of your own choosing, centered around meaningful integration with at least one external third-party API and including user interaction features that enable sharing, collaboration, discussion, or community engagement.",
    },
  ],
  ai: {
    heading: "Optional AI Integration",
    note: "Applicable to all projects, highly encouraged.",
    paragraphs: [
      "For any chosen project, you may enhance your application by integrating an AI service (for example the Grok API, OpenAI, Gemini, or similar) to add intelligent features such as content generation, recommendations, chat assistance, summarization, or automated moderation.",
      "If you implement AI, document the usage clearly and make sure it adds meaningful value to the user experience. AI is a complement to the full-stack work, not a substitute for it.",
    ],
  },
  cadence: [
    "Each project will challenge you to manage complex codebases, implement dynamic features, and ensure seamless functionality, preparing you for real-world web development scenarios.",
    "Begin early and apply skills incrementally after each module (HTML/CSS prototype → client state → API → Mongo). Do not wait until the last couple of weeks.",
  ],
};

export const deliverables = {
  heading: "Common deliverables",
  paragraphs: [
    "Every option shares the same hand-in shape. Exact checklists and the due date are on the syllabus agenda — this page does not replace those calendars.",
    "Align the public landing page with the assignment language used throughout the course: reviewers should see who built the work and where the source lives.",
  ],
  items: [
    "A deployed client (Vercel or equivalent) that stays up through grading.",
    "A deployed HTTP API (for example Render) wired to the client.",
    "A public GitHub repository (or equivalent) with a clear README.",
    "A landing page that lists team member names, course sections, and repository links.",
    "The course stack: HTML, CSS, Tailwind, Next.js / React, Zustand, Node / Express, MongoDB.",
    "A short design and user document (NUpath writing-intensive expectation), as described on the syllabus.",
  ],
};
