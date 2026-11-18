/**
 * Courses that already teach AI inside software engineering.
 * Notes say what a future CS5500 might borrow. Not a catalog of every course.
 */

export type Cs5500AiCourse = {
  name: string;
  school: string;
  url: string;
  note: string;
  /** Extra public link named in the note, such as a course book. */
  links?: { label: string; url: string }[];
};

export const cs5500AiCourses: Cs5500AiCourse[] = [
  {
    name: "CMU 17-313 Foundations of Software Engineering (Fall 2026)",
    school: "Carnegie Mellon University",
    url: "https://cmu-313.github.io/",
    note: "Week-1 lectures on AI usage and responsible AI in software engineering. The semester project is built on opencode, an open-source AI coding agent in TypeScript. P4 is property-based tests with AI attribution. P5 is mutation testing plus an Agent failure case with a prompt and response transcript. AI is allowed for code, AI-written prose is discouraged, and quizzes are closed-notes.",
  },
  {
    name: "CS146S The Modern Software Developer",
    school: "Stanford University",
    url: "https://themodernsoftware.dev/",
    note: "A whole course on AI-native development: coding agents, MCP, agent skills, and spec-driven development.",
  },
  {
    name: "CSE 403 Software Engineering (Autumn 2026)",
    school: "University of Washington",
    url: "https://courses.cs.washington.edu/courses/cse403/26au/",
    note: "A classic team-project course with an in-class AI-assisted coding exercise and a GenAI deliverable.",
  },
  {
    name: "CS169A (Fall 2026)",
    school: "University of California, Berkeley",
    url: "https://cs169.org/fa26",
    note: "Agile, BDD, and TDD, with a reading on AI-assisted development.",
    links: [{ label: "Book", url: "https://saasbook.info/" }],
  },
  {
    name: "CS50x academic honesty",
    school: "Harvard University",
    url: "https://cs50.harvard.edu/x/honesty/",
    note: "A course-tuned AI tutor, the CS50 Duck, is allowed. General AI tools are not allowed for answers.",
  },
];
