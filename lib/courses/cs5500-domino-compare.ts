/**
 * Summary comparison of Molly Domino's Spring 2026 Northeastern CS5500
 * with CMU 17-313. Summary level only; the instructor is credited.
 * Overlap figures are rough topic-title estimates, not a syllabus audit.
 */

export type Cs5500GradeItem = {
  item: string;
  pct: number;
};

export type Cs5500DominoUnit = {
  unit: string;
  cmu: string;
};

export type Cs5500StructureDiff = {
  dimension: string;
  cs5500: string;
  cmu: string;
};

export type Cs5500AiEnhancement = {
  unit: string;
  ideas: string[];
};

export type Cs5500CompareSource = {
  label: string;
  url: string;
};

export const cs5500DominoCompareTitle =
  "Northeastern CS5500 (Spring 2026, Molly Domino) compared with CMU 17-313";

export const cs5500DominoCourse = {
  term: "Spring 2026",
  instructor: "Molly Domino",
  format:
    "Weekly class; semester-long team project for an external client; two-week sprints",
  grading: [
    { item: "Participation", pct: 10 },
    { item: "Reflections and homework", pct: 25 },
    { item: "Process documents", pct: 25 },
    { item: "Semester project", pct: 40 },
  ] satisfies Cs5500GradeItem[],
  exams: "None (no quizzes or exams)",
  aiPolicy: "LLM-generated code is allowed if cited with the tool and prompt",
};

export const cs5500DominoUnits: Cs5500DominoUnit[] = [
  { unit: "Introductions & Git", cmu: "Intro (partial: no AI pitch)" },
  { unit: "Requirements gathering", cmu: "Software Specifications; P3 Elicit (partial)" },
  { unit: "Decomposition on a large open-source codebase", cmu: "Open Source (partial)" },
  { unit: "SDLC, agile, teams, technical debt", cmu: "Project Planning; Teams and Communication" },
  { unit: "Design patterns & Gilded Rose refactoring", cmu: "P1B refactoring (patterns only in CS5500)" },
  { unit: "Self-teaching a new language (TypeScript)", cmu: "Recitation: Learning TypeScript" },
  { unit: "Code review & software quality", cmu: "Static Analysis (partial)" },
  { unit: "Testing, Playwright, CircleCI", cmu: "Unit Testing; CI/CD (no fuzzing, oracles, or PBT)" },
  { unit: "Feature flags, ethics, research papers", cmu: "Ethics; Reliably Releasing Software (partial)" },
  { unit: "Client demo & hand-off docs", cmu: "P6 final presentations (different: client-graded)" },
];

/** Rough topic-title estimates against 27 CMU topics. Not a line-by-line audit. */
export const cs5500DominoOverlap = {
  cmuTopics: 27,
  full: 8,
  partial: 14,
  none: 5,
  weightedPct: 55,
  touchedPct: 81,
  fullyMatchedPct: 30,
  note: "These are rough topic-title estimates.",
};

/** Which weeks of the proposed 14-week schedule her units already cover. */
export const cs5500DominoScheduleMap =
  "Her units cover our weeks 1, 2, 3, 5, 6, 7, 11, 12 and 13, while weeks 4, 8-10 and 14 have little or no counterpart.";

export const cs5500OnlyCmu = [
  "AI-usage lectures and an AI-agent codebase (opencode)",
  "Fuzzing, test oracles, property-based testing",
  "Hands-on mutation testing and red team",
  "Docker",
  "Productivity metrics, estimation, 737 MAX case",
  "Architecture/microservices, usability",
  "Open-source contribution project",
  "Midterms and quizzes",
];

export const cs5500OnlyDomino = [
  "Real external client who grades part of the project",
  "GoF design patterns and MVC",
  "Detailed SDLC survey (Waterfall, Spiral, Scrum, Kanban, XP)",
  "Software quality theory (ISO, clean code, CK metrics, formal reviews)",
  "Code review as its own topic",
  "Playwright UI testing",
  "Feature flags",
  "Reading and presenting a research paper",
  "Résumés and technical interviews",
];

export const cs5500StructureDiffs: Cs5500StructureDiff[] = [
  {
    dimension: "Codebase",
    cs5500: "Client or greenfield project per team",
    cmu: "One shared OSS codebase (opencode)",
  },
  {
    dimension: "Teams",
    cs5500: "Self-selected, larger teams",
    cmu: "Assigned, 3-5",
  },
  {
    dimension: "Process",
    cs5500: "Sprint plan + PR + reflection each 2 weeks; living SRS",
    cmu: "Planning, two sprints, checkpoints, team contract",
  },
  {
    dimension: "Testing",
    cs5500: "Lecture coverage; no testing deliverable",
    cmu: "P4 property-based tests, P5 mutation testing",
  },
  {
    dimension: "Individual check",
    cs5500: "Individual PRs, reflections, peer grades",
    cmu: "Midterms, quizzes, individual components",
  },
  {
    dimension: "AI",
    cs5500: "Allowed if cited; not taught",
    cmu: "Taught; AI attribution and agent failure case graded",
  },
];

export const cs5500AiEnhancements: Cs5500AiEnhancement[] = [
  {
    unit: "Intro & Git",
    ideas: [
      "Start an AI-use log that extends the citation rule: tool, prompt, what was kept",
      "Have a model explain a Git error, then reproduce the fix",
    ],
  },
  {
    unit: "Requirements",
    ideas: [
      "Ask a model for missing stakeholders or constraints; record rejected suggestions",
      "Never paste NDA or client-confidential material into a tool",
    ],
  },
  {
    unit: "Decomposition",
    ideas: [
      "Check an AI explanation of a module against a real call site",
      "Compare an AI task breakdown with the team's own",
    ],
  },
  {
    unit: "SDLC & sprints",
    ideas: [
      "Draft the sprint proposal from stand-up notes; replace estimates the team rejects",
    ],
  },
  {
    unit: "Design patterns & refactoring",
    ideas: [
      "Compare two AI pattern-based refactors and record the tradeoff",
      "Keep characterization tests green across the change",
      "One slice AI-off, one AI-on",
    ],
  },
  {
    unit: "Code review & quality",
    ideas: [
      "AI review comments tied to a line; author accepts, rejects or rewrites each",
      "Confirm AI-flagged smells with a metric or linter",
    ],
  },
  {
    unit: "Testing & CI",
    ideas: [
      "Delete generated tests that pass on deliberately broken code",
      "Treat generated Playwright tests as untrusted until each assertion is explained",
      "Explain a failed CI log and reproduce it locally",
      "Optional: one property-based test and an agent failure case, CMU style",
    ],
  },
  {
    unit: "Feature flags & ethics",
    ideas: [
      "Add AI licensing, attribution and data-leak cases to the ethics discussion",
    ],
  },
  {
    unit: "Research paper",
    ideas: [
      "Offer AI-in-SE papers; check every AI summary against the paper",
    ],
  },
  {
    unit: "Final hand-off",
    ideas: [
      "Draft README and API spec from code; delete any claim not verified by running it",
    ],
  },
];

export const cs5500DominoSources: Cs5500CompareSource[] = [
  {
    label: "Canvas CS5500.39467.202630 (Northeastern login required)",
    url: "https://northeastern.instructure.com/courses/246151",
  },
  { label: "CMU 17-313 schedule", url: "https://cmu-313.github.io/" },
  { label: "CMU 17-313 projects", url: "https://cmu-313.github.io/assignments/" },
  { label: "CMU 17-313 syllabus", url: "https://cmu-313.github.io/syllabus/" },
];
