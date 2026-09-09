import type { LectureSlide } from "../types";

export const GROK_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · Integrating with Grok",
      "xAI · tokens · grok-4-latest",
    ],
  },
  {
    id: "video",
    title: "Optional Next.js walkthrough",
    kind: "content",
    bullets: [
      "Drive slides are the lecture. This video is stack alignment only",
      "`https://youtu.be/rwE57Cdk1fA` — Next.js + Grok AI",
      "Next.js calls Express. The xAI key stays in server `.env`",
    ],
  },
  {
    id: "intro",
    title: "Grok is xAI's family of LLMs",
    kind: "content",
    bullets: [
      "Inspired by the Hitchhiker's Guide — maximally truth-seeking",
      "The same models power Grok.com, the apps, and Grok on X",
      "Developers call `https://api.x.ai/v1`",
    ],
  },
  {
    id: "tokens",
    title: "Tokens and tokenizers",
    kind: "content",
    bullets: [
      "A token is one or more characters — the unit of price",
      "A tokenizer splits the prompt before inference",
      "Common words are often one token; rarer words split",
      "`Flint` can be two tokens; `Michigan` can be one",
    ],
  },
  {
    id: "key",
    title: "Create an xAI API key",
    kind: "content",
    bullets: [
      "Name the key, create it, copy it once",
      "Add paid credits — the free quota is not enough for class",
      "Test from your laptop with curl before writing Node",
    ],
  },
  {
    id: "curl",
    title: "curl chat/completions",
    kind: "demo",
    bullets: [
      "Model `grok-4-latest`. Bearer is the key — use a placeholder",
    ],
    code: `curl https://api.x.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_XAI_API_KEY" \\
  -d '{
    "messages": [
      { "role": "system", "content": "You are a test assistant." },
      { "role": "user", "content": "Testing. Just say hi and hello world and nothing else." }
    ],
    "model": "grok-4-latest",
    "stream": false,
    "temperature": 0
  }'`,
    codeLanguage: "bash",
    codeHighlightLines: [1, 3, 9],
  },
  {
    id: "response",
    title: "Typical curl response",
    kind: "demo",
    bullets: ["`choices[0].message.content` is `hi and hello world`"],
    code: `{
  "id": "84c41e00-0642-f911-0382-8044e4127378",
  "object": "chat.completion",
  "model": "grok-4-0709",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "hi and hello world"
    },
    "finish_reason": "stop"
  }]
}`,
    codeLanguage: "json",
    codeHighlightLines: [[7, 10]],
  },
  {
    id: "install",
    title: "Install the xAI libraries",
    kind: "demo",
    bullets: [
      "`ai` plus `@ai-sdk/xai` for `generateText`",
      "`openai` plus `zod` for chat and structured output later",
    ],
    code: `cd webdev-server
npm install ai
npm install @ai-sdk/xai
npm install openai
npm install zod`,
    codeLanguage: "bash",
  },
  {
    id: "env",
    title: "Add XAI keys to server .env",
    kind: "demo",
    bullets: [
      "Server-only. Never `NEXT_PUBLIC_XAI_API_KEY`",
    ],
    code: `XAI_BASE_URL=https://api.x.ai/v1
XAI_API_KEY=YOUR_XAI_API_KEY`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [[1, 2]],
    interactiveHint:
      "Jose's Drive deck includes a live-looking secret. Do not copy any real key into the repo.",
  },
  {
    id: "meaning",
    title: "generateText — meaning of life",
    kind: "demo",
    bullets: [
      "`xai(\"grok-4\")` plus a system line and a prompt",
    ],
    code: `import "dotenv/config";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

const result = await generateText({
  model: xai("grok-4"),
  system: "You are Grok, a highly intelligent, helpful AI assistant.",
  prompt: "What is the meaning of life, the universe, and everything?",
});

console.log(result.text);`,
    codeLanguage: "typescript",
    codeFile: "webdev-server/xai/meaning.ts",
    codeAddedLines: [2, 3, [5, 9], 11],
  },
  {
    id: "recap",
    title: "Grok key recap",
    kind: "content",
    bullets: [
      "Tokens, a key, and paid credits",
      "curl `https://api.x.ai/v1/chat/completions`",
      "`generateText` with `xai(\"grok-4\")`",
    ],
  },
  {
    id: "next-up",
    title: "Next: chat completions",
    kind: "title",
    bullets: [
      "OpenAI SDK pointed at `api.x.ai`",
      "Then a Dashboard sparkle for course copy",
    ],
  },
];
