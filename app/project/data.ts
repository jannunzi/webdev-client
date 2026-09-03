export const projectOverview = {
  intro: [
    "For the final project, students will collaborate in teams of up to five members, or work individually, to develop a sophisticated web application. This project builds on the skills and technologies explored throughout the semester, offering an opportunity to integrate and apply your knowledge in a practical, real-world context.",
    "You may choose ONE of the following options. Detailed requirements for each option are provided in the respective project requirements documents on Canvas.",
  ],
  options: [
    {
      id: "quizzes",
      title: "Kambaz Quizzes Final Project",
      summary:
        "Extend the Kambaz learning management system by developing a Quizzes section, enhancing the platform with interactive assessment features to support seamless online learning.",
    },
    {
      id: "pazza",
      title: "Kambaz Pazza Final Project",
      summary:
        "Integrate Pazza, a Q&A platform inspired by a popular service, into the existing Kambaz project using the course full-stack (Next.js client + Node/Express API + MongoDB), focusing on feature integration and full-stack development.",
    },
    {
      id: "open-ended",
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

export const quizzesDetail = {
  heading: "Kambaz Quizzes",
  paragraphs: [
    "This option extends Kambaz with a Quizzes section comparable to a learning-management quiz tool. Faculty (and TAs, if the requirements document says so) create, configure, and publish quizzes; students take published quizzes, submit attempts, and review results.",
    "Typical screens include a course quiz list, quiz details and settings, a question editor, a student taking view, and an attempts or results view. Common question types in the Canvas requirements are multiple choice, true/false, and fill in the blank. Persist quizzes, questions, and attempts in MongoDB; expose them through the Express API; and render the UI in Next.js with Tailwind and Zustand.",
    "Use the published Quizzes requirements document on Canvas for the authoritative screens, fields, and role rules. Do not invent extra grading schemes beyond that document.",
  ],
};

export const pazzaDetail = {
  heading: "Kambaz Pazza",
  paragraphs: [
    "Pazza is a course Q&A forum inspired by Piazza. Integrate it into the existing Kambaz application so enrolled users can post questions and notes, follow threads, search, and organize conversations by folder or topic.",
    "The emphasis is feature integration and a complete full-stack path: Next.js screens, a Node/Express API, and MongoDB documents for posts, follows, and related data. Instructors and TAs typically can endorse answers or mark official follow-ups when the Canvas requirements call for it.",
    "Pazza still extends Kambaz — keep account, course, and enrollment behavior consistent with the semester’s assignments. Follow the Pazza requirements document on Canvas for screens and the data model.",
  ],
};

export const openEndedDetail = {
  heading: "Open-Ended Web Application",
  paragraphs: [
    "Propose and build an original interactive full-stack application around a problem you care about. It must use the course stack (Next.js, Tailwind, Zustand, Express, and MongoDB) and must integrate at least one external third-party API in a meaningful way — a token call that does not affect the product is not enough.",
    "The application must also include user-facing features that enable sharing, collaboration, discussion, or community engagement. Check Canvas for any proposal or approval steps before you commit to this option.",
    "Scope should be comparable to finishing Quizzes or Pazza on top of Kambaz: a real, deployed product with sign-in, persisted data, and a path a reviewer can exercise without installing anything.",
  ],
};

export const deliverables = {
  heading: "Common deliverables",
  paragraphs: [
    "Every option shares the same hand-in shape. Exact checklists and the due date are on Canvas and on the syllabus agenda — this page does not replace those calendars.",
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
