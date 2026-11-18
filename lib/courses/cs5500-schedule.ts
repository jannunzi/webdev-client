/**
 * Draft 14-week CS5500 schedule. AI enhancements per week are not written yet.
 */

export type Cs5500Week = {
  week: number;
  title: string;
  lessons: string[];
  reading: string;
  assignment: string;
  basedOn: string;
};

export const cs5500ScheduleNote =
  "Draft based on CMU 17-313 Fall 2026 and Software Engineering at Google; AI enhancements per week to come.";

export const sweAtGoogle = {
  title: "Software Engineering at Google: Lessons Learned from Programming Over Time",
  editors: "Titus Winters, Tom Manshreck, and Hyrum Wright (eds.)",
  url: "https://abseil.io/resources/swe-book",
  why: "It is free online and is CMU 17-313's named supplementary reading. Its chapters cover teams, metrics, code review, docs, testing, version control, builds, static analysis, dependencies, CI/CD, and deprecation.",
  slidesNote:
    "Specs, architecture, and property-based testing use CMU 17-313's lecture slides.",
  optional:
    "Ousterhout's A Philosophy of Software Design is an optional design supplement.",
};

export const cs5500Schedule: Cs5500Week[] = [
  {
    week: 1,
    title: "Introduction to software engineering & responsible AI use",
    lessons: [
      "Software engineering vs. programming: time, scale, trade-offs",
      "When AI helps learning and when it bypasses it",
      "Responsible AI use: verifying output, ownership of AI-written code",
      "Course tooling: GitHub, Slack, dev containers",
    ],
    reading: "SWE at Google ch. 1 \"What Is Software Engineering?\"",
    assignment:
      "P1A Build checkpoint (individual): fork, build and run an existing open-source codebase.",
    basedOn:
      "CMU 17-313 \"Intro + Pitch about AI usage\", \"Responsible AI use in SE\", P1A; UW CSE 403 Introduction.",
  },
  {
    week: 2,
    title: "Onboarding a legacy codebase: Git, code archaeology & refactoring",
    lessons: [
      "Reading unfamiliar code and code archaeology",
      "Git flow, branches, pull requests",
      "Code smells and refactoring",
      "Self-directed language learning (TypeScript)",
    ],
    reading: "ch. 16 \"Version Control and Branch Management\"; ch. 8 \"Style Guides and Rules\".",
    assignment:
      "P1B Starter task (individual): refactor a reported code smell and open a PR.",
    basedOn:
      "CMU P1B, Recitation \"Learning TypeScript\"; UW CSE 403 Version control and Git.",
  },
  {
    week: 3,
    title: "Project planning, teams & communication",
    lessons: [
      "Software process: SDLC, agile/Scrum basics",
      "Team contracts, roles and meetings",
      "Communication tools and running a team",
      "User stories and a project board",
    ],
    reading: "ch. 2 \"How to Work Well on Teams\".",
    assignment:
      "Team contract; P2A Team process & planning (team): user stories, task breakdown, GitHub Project board.",
    basedOn:
      "CMU \"Project Planning\", \"Teams and Communication\", P2A; UW CSE 403 SDLC, Scrum and teams; Berkeley CS169A.",
  },
  {
    week: 4,
    title: "Metrics, estimation & learning from failure",
    lessons: [
      "Measuring productivity and quality; metric pitfalls",
      "Effort estimation",
      "Case study: Boeing 737 MAX",
      "Turning goals into measurable signals",
    ],
    reading: "ch. 7 \"Measuring Engineering Productivity\".",
    assignment: "P2A due; estimation exercise.",
    basedOn:
      "CMU \"Case Study 737MAX\", \"Metrics\", Estimation recitation; UW CSE 403 Joel Test.",
  },
  {
    week: 5,
    title: "Requirements & software specifications",
    lessons: [
      "Functional vs. quality requirements",
      "User stories, use cases and acceptance criteria",
      "Writing precise specifications",
      "Traceability from requirement to test",
    ],
    reading: "CMU 17-313 Software Specifications slides.",
    assignment: "P2B Sprint 1 begins (team).",
    basedOn:
      "CMU \"Software Specifications\", P2B; UW CSE 403 Requirements and use cases; Berkeley CS169A BDD.",
  },
  {
    week: 6,
    title: "Design docs, documentation & design quality",
    lessons: [
      "Writing and reviewing design documents",
      "Modular design and abstraction",
      "Documentation as a product",
      "Diagnosing team dysfunction",
    ],
    reading: "ch. 10 \"Documentation\".",
    assignment: "Sprint 1 design doc.",
    basedOn:
      "CMU \"Design Docs\", \"Team Dysfunction\" recitation; UW CSE 403 Design and style, Data modelling.",
  },
  {
    week: 7,
    title: "Unit testing & test doubles",
    lessons: [
      "Why and what to test; the test pyramid",
      "Writing good unit tests",
      "Mocks, stubs and fakes",
      "TDD basics",
    ],
    reading: "ch. 11 \"Testing Overview\", ch. 12 \"Unit Testing\", ch. 13 \"Test Doubles\".",
    assignment: "P2B Sprint 1 due with team checkpoint presentation.",
    basedOn:
      "CMU \"Unit Testing\", P2B checkpoint; UW CSE 403 Test automation; Berkeley CS169A TDD.",
  },
  {
    week: 8,
    title: "Test input generation & test oracles",
    lessons: [
      "Fuzz testing and input generation",
      "The oracle problem",
      "Integration and larger tests",
      "Coverage and its limits",
    ],
    reading: "ch. 14 \"Larger Testing\".",
    assignment: "P2C Sprint 2 begins (team).",
    basedOn: "CMU \"Fuzz testing and input generation\", \"Testing Oracles\".",
  },
  {
    week: 9,
    title: "Property-based testing & midterm",
    lessons: [
      "Properties vs. examples",
      "Writing generators",
      "Shrinking counterexamples",
      "Midterm review",
    ],
    reading: "CMU 17-313 Property-based Testing slides.",
    assignment: "P2C Sprint 2 due; Midterm.",
    basedOn: "CMU \"Property-based Testing I/II\", Midterm.",
  },
  {
    week: 10,
    title: "Architecture, usability & requirements elicitation",
    lessons: [
      "Architecture styles; monoliths vs. microservices",
      "Usability engineering",
      "Stakeholder interviews",
      "Turning interview evidence into requirements",
    ],
    reading: "CMU 17-313 Architecture and Usability slides.",
    assignment:
      "P3 Elicit (team): interviews and requirements with acceptance criteria.",
    basedOn:
      "CMU \"Microservices/Architecture\", \"Usability and Interviews\", P3; UW CSE 403 Architecture.",
  },
  {
    week: 11,
    title: "Builds, containers, CI/CD & deployment",
    lessons: [
      "Build systems and dependencies",
      "Docker and containerization",
      "Continuous integration pipelines",
      "Continuous delivery and deployment challenges",
    ],
    reading:
      "ch. 18 \"Build Systems and Build Philosophy\", ch. 23 \"Continuous Integration\", ch. 24 \"Continuous Delivery\".",
    assignment:
      "P4 Specify & Fix (team): property-based tests traced to requirements, running in CI; note which properties AI wrote.",
    basedOn:
      "CMU \"CI-CD and Deployment Challenges\", Docker and CI/CD recitations, P4; UW CSE 403 Build systems.",
  },
  {
    week: 12,
    title: "Code review, static analysis & mutation testing",
    lessons: [
      "Code review practice",
      "Static analysis tools and false positives",
      "Mutation testing to judge test quality",
      "Debugging",
    ],
    reading: "ch. 9 \"Code Review\", ch. 20 \"Static Analysis\".",
    assignment:
      "P5 Break & Fix (team): mutants plus a Stryker run; \"Agent failure case\" showing an AI-written property that let a mutant survive.",
    basedOn:
      "CMU \"Static Analysis\", P5; UW CSE 403 Mutation testing, Debugging, Program analysis.",
  },
  {
    week: 13,
    title: "Ethics, open source & dependencies",
    lessons: [
      "Ethics and professional responsibility",
      "Open-source licenses, communities and contributing",
      "Dependency management",
      "Difficult conversations on teams",
    ],
    reading: "ch. 4 \"Engineering for Equity\", ch. 21 \"Dependency Management\".",
    assignment: "P6 Open-source excursion: project selection and checkpoint (team).",
    basedOn: "CMU \"Ethics\", \"Open Source\", \"Difficult Conversations\", P6.",
  },
  {
    week: 14,
    title: "Reliable releases & final presentations",
    lessons: [
      "Releasing software reliably",
      "Deprecation and maintenance",
      "Retrospectives",
      "Final project presentations",
    ],
    reading: "ch. 15 \"Deprecation\"; review ch. 24.",
    assignment: "P6 final report, team presentation and individual reflection.",
    basedOn:
      "CMU \"Reliably Releasing Software\", Final Presentations; Berkeley CS169A retrospectives.",
  },
];
