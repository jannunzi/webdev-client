import type { LectureSlide } from "../types";

export const CHATGPT_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · Integrating with ChatGPT",
      "GPT-4 · tokens · OpenAI SDK",
    ],
  },
  {
    id: "gpt",
    title: "GPT-4 is a large language model",
    kind: "content",
    bullets: [
      "Generative Pre-trained Transformer — next-token prediction",
      "You send a prompt; the model returns a completion",
      "Use it for chat, extraction, classification, and code",
      "Docs: `https://platform.openai.com/docs/overview`",
    ],
  },
  {
    id: "tokens",
    title: "Tokens are the unit you pay for",
    kind: "content",
    bullets: [
      "A token is a chunk of text — not always a whole word",
      "`hello world!` can be tokens `hello`, ` world`, `!`",
      "A tokenizer splits the prompt before inference",
      "You pay for input tokens plus output tokens",
    ],
  },
  {
    id: "prompts",
    title: "Prompt strategies",
    kind: "content",
    bullets: [
      "Zero-shot — just ask; no examples",
      "Few-shot — include a couple of input/output examples",
      "Chain of thought — ask the model to reason step by step",
      "Designing the prompt is how you program GPT-4",
    ],
  },
  {
    id: "install",
    title: "Install the official OpenAI SDK",
    kind: "demo",
    bullets: [
      "The SDK lives on `webdev-server`, not in the Next.js app",
    ],
    code: `cd webdev-server
npm install openai`,
    codeLanguage: "bash",
  },
  {
    id: "env",
    title: "Server .env — never NEXT_PUBLIC_",
    kind: "demo",
    bullets: [
      "A public prefix would ship the key to every browser",
      "Replace the placeholder. Never paste a live `sk-` key",
    ],
    code: `OPENAI_API_KEY=your-api-key-here`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    interactiveHint:
      "Jose's Drive deck includes a live-looking secret. Do not copy any real key into the repo.",
  },
  {
    id: "hello",
    title: "Hello ChatGPT — responses.create",
    kind: "demo",
    bullets: [
      "`output_text` is the completion string",
    ],
    code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await client.responses.create({
  model: "gpt-4.1",
  input: "Hello, ChatGPT",
});

console.log(response.output_text);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/hello.js",
    codeAddedLines: [1, [3, 5], [7, 10], 12],
  },
  {
    id: "run",
    title: "Run the hello script",
    kind: "demo",
    bullets: ["Typical output: `Hello! How can I help you today?`"],
    code: `cd webdev-server
node openai/hello.js`,
    codeLanguage: "bash",
  },
  {
    id: "why-server",
    title: "Why the key stays on Express",
    kind: "content",
    bullets: [
      "Browser `NEXT_PUBLIC_OPENAI_API_KEY` is extractable",
      "Anyone with the key can spend your tokens",
      "Next.js calls `/api/openai/...`; Express holds `OPENAI_API_KEY`",
      "You control rate limits and moderation on the server",
    ],
  },
  {
    id: "recap",
    title: "ChatGPT key recap",
    kind: "content",
    bullets: [
      "Tokens = input plus output chunks you pay for",
      "`npm install openai` on the server",
      "`client.responses.create` plus `output_text`",
    ],
  },
  {
    id: "next-up",
    title: "Next: roles and structured JSON",
    kind: "title",
    bullets: [
      "Instructions, developer/user/assistant, then zod",
      "Moderation before you store a prompt",
    ],
  },
];
