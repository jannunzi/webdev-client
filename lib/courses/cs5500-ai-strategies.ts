/**
 * Proposals for using AI tools in a future CS5500 offering.
 * Not assigned work.
 */

export type Cs5500AiTopic = {
  id: string;
  title: string;
  suggestions: string[];
};

export const cs5500AiSection = {
  title: "Bringing AI into the CS5500 topics",
  status: "proposals" as const,
  lede: "Proposals for Summer 2027. These are not assignments.",
  topics: [
    {
      id: "requirements",
      title: "Requirements and user stories",
      suggestions: [
        "Draft user stories from a short interview transcript, then edit the acceptance criteria yourself.",
        "Ask a model which actor or edge case is missing, and record which suggestions you reject.",
        "Compare two generated story sets for the same prompt and mark which one a stakeholder could accept.",
      ],
    },
    {
      id: "design",
      title: "Design and architecture",
      suggestions: [
        "Ask for two architectures for the same requirements and write down the tradeoff you choose.",
        "Paste a component sketch and ask which dependency is a cycle or a single point of failure.",
        "List failure modes for one boundary (API, queue, or database) and keep only the ones you can test.",
      ],
    },
    {
      id: "review",
      title: "Code review",
      suggestions: [
        "Run a model over a diff and require each comment to name the line it objects to.",
        "Accept, reject, or rewrite each comment the way you would a teammate’s review.",
        "Limit one pass to a single concern: error handling, naming, or tests.",
      ],
    },
    {
      id: "testing",
      title: "Testing (unit, property-based, and test generation)",
      suggestions: [
        "Generate unit tests for a function you wrote, and delete any test that still passes when the code is wrong.",
        "Ask for a property and a generator, then run the property-based tests.",
        "Treat generated tests as untrusted until you can explain the assertion.",
      ],
    },
    {
      id: "debugging",
      title: "Debugging",
      suggestions: [
        "Paste a failing test and stack trace and ask for three hypotheses before any patch.",
        "Require a check that would confirm or kill each hypothesis.",
        "Apply one suggested edit only while the failing test is still red, then re-run it.",
      ],
    },
    {
      id: "refactoring",
      title: "Refactoring and legacy code",
      suggestions: [
        "Ask for a behavior-preserving refactor and keep a test green across the change.",
        "Ask a model to explain an unfamiliar module, then check that explanation against a call site.",
        "Write a characterization test before you change code you do not yet understand.",
      ],
    },
    {
      id: "vcs",
      title: "Version control and CI/CD",
      suggestions: [
        "Draft a commit message and a pull-request description from the diff, then cut anything the diff does not show.",
        "Ask a model to explain a failed CI log and the command to re-run locally.",
        "Propose one pipeline step (lint, test, or typecheck) and say what that step does not catch.",
      ],
    },
    {
      id: "process",
      title: "Teamwork and process (agile)",
      suggestions: [
        "Turn sprint notes into a standup or retro, and delete anything the team did not say.",
        "Ask for a task breakdown with estimates, then replace any estimate the team rejects.",
        "Restate a teammate’s proposal in your own words before you reply.",
      ],
    },
    {
      id: "docs",
      title: "Documentation",
      suggestions: [
        "Draft a README section from the code, then delete any claim you did not check by running the project.",
        "Ask for an API example and run that example.",
        "Keep a changelog line only when it names a change a user can see.",
      ],
    },
    {
      id: "security",
      title: "Security and quality",
      suggestions: [
        "Ask which inputs a handler might mishandle, then confirm each one in the code.",
        "List inputs a property test or fuzzer should try, and add the ones you can assert.",
        "Do not paste secrets, private repositories, or student data into a tool.",
      ],
    },
    {
      id: "ethics",
      title: "Ethics, licensing, and responsible AI use",
      suggestions: [
        "Check the license of a snippet before you commit it.",
        "Name the tool you used and what you kept.",
        "Leave out generated code you cannot explain, test, or attribute.",
      ],
    },
  ] satisfies Cs5500AiTopic[],
  assessments: [
    "Submit the prompt, the transcript, and a short critique of what you kept and what you threw out.",
    "Do one slice with AI off and the same slice with AI on, and write what changed.",
    "Verify AI output with tests you wrote, or with a test you can make fail on purpose.",
  ],
};
