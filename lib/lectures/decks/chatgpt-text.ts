import type { LectureSlide } from "../types";

export const CHATGPT_TEXT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · ChatGPT text",
      "Instructions · roles · parse",
    ],
  },
  {
    id: "instructions",
    title: "Instructions set the personality",
    kind: "demo",
    bullets: [
      "`instructions` is the system policy for this request",
    ],
    code: `const response = await client.responses.create({
  model: "gpt-4.1",
  instructions: "Talk like a pirate. Keep answers short.",
  input: "Hello, ChatGPT",
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/hello.js",
    codeAddedLines: [3],
  },
  {
    id: "roles",
    title: "Conversation roles",
    kind: "content",
    bullets: [
      "`developer` — system policy / instructions",
      "`user` — the human prompt",
      "`assistant` — prior model replies you feed back in",
    ],
  },
  {
    id: "conversation",
    title: "Pass the conversation as input[]",
    kind: "demo",
    bullets: [
      "The API is stateless — you resend the transcript",
    ],
    code: `const response = await client.responses.create({
  model: "gpt-4.1",
  input: [
    { role: "developer", content: "Talk like a pirate." },
    { role: "user", content: "What is Node.js?" },
    { role: "assistant", content: "Arr, Node be JavaScript on a server." },
    { role: "user", content: "And Express?" },
  ],
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/conversation.js",
    codeAddedLines: [[3, 8]],
  },
  {
    id: "zod",
    title: "Structured output with zod",
    kind: "demo",
    bullets: [
      "`responses.parse` plus `zodTextFormat` locks the JSON",
    ],
    code: `import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const response = await client.responses.parse({
  model: "gpt-4.1",
  input: [
    { role: "system", content: "Extract the event." },
    {
      role: "user",
      content: "Alice and Bob are going to a science fair on Friday.",
    },
  ],
  text: { format: zodTextFormat(CalendarEvent, "event") },
});

console.log(response.output_parsed);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/calendar.js",
    codeAddedLines: [1, 2, [4, 8], 10, 19, 22],
  },
  {
    id: "cot",
    title: "Chain of thought stays hidden",
    kind: "demo",
    bullets: [
      "Ask for steps in the schema; return only `final_answer` to the UI",
    ],
    code: `const Step = z.object({ explanation: z.string(), output: z.string() });
const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const response = await client.responses.parse({
  model: "gpt-4.1",
  input: [{ role: "user", content: "how can I solve 8x + 7 = -23" }],
  text: { format: zodTextFormat(MathReasoning, "math") },
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/math.js",
    codeAddedLines: [1, [2, 5], 7],
  },
  {
    id: "extract",
    title: "Extract research papers as JSON",
    kind: "demo",
    bullets: ["Same parse pattern — schema first, then `output_parsed`"],
    code: `const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/extract.js",
  },
  {
    id: "ui-schema",
    title: "Generate a UI description",
    kind: "demo",
    bullets: ["`z.lazy` lets a node nest children of the same type"],
    code: `const UI = z.lazy(() =>
  z.object({
    type: z.enum(["div", "button", "header", "section"]),
    label: z.string(),
    children: z.array(UI),
    attributes: z.array(
      z.object({ name: z.string(), value: z.string() }),
    ),
  }),
);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/ui.js",
  },
  {
    id: "moderation",
    title: "Moderate before you store a prompt",
    kind: "demo",
    bullets: [
      "`moderations.create` flags disallowed input",
    ],
    code: `const moderation = await client.moderations.create({
  model: "omni-moderation-latest",
  input: userText,
});

if (moderation.results[0].flagged) {
  throw new Error("Prompt failed moderation");
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/moderate.js",
    codeAddedLines: [[1, 4], [6, 8]],
  },
  {
    id: "recap",
    title: "Text recap",
    kind: "content",
    bullets: [
      "Roles: developer / user / assistant in `input[]`",
      "`responses.parse` plus `zodTextFormat`",
      "`moderations.create` before storage",
    ],
  },
  {
    id: "next-up",
    title: "Next: chat UI and course AI",
    kind: "title",
    bullets: [
      "Express chat, vision, TTS — then Kambaz suggest",
      "Next.js talks to Express; Express talks to OpenAI",
    ],
  },
];
