import type { LectureSlide } from "../types";

export const CHATGPT_UI_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · ChatGPT UI",
      "Chat · vision · TTS · course AI",
    ],
  },
  {
    id: "routes",
    title: "Express chat route",
    kind: "demo",
    bullets: [
      "The browser never holds `OPENAI_API_KEY`",
    ],
    code: `export default function (app) {
  app.post("/api/openai/chat", async (req, res) => {
    const { messages } = req.body;
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: messages,
    });
    res.json({ text: response.output_text });
  });
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/routes.js",
    codeAddedLines: [2, [4, 7], 8],
  },
  {
    id: "client",
    title: "Next.js client — httpServer()",
    kind: "demo",
    bullets: [
      "`NEXT_PUBLIC_REMOTE_SERVER` is the Express origin, not the key",
    ],
    code: `"use client";

import axios from "axios";
const http = axios.create({
  baseURL: \`\${process.env.NEXT_PUBLIC_REMOTE_SERVER}/api/openai\`,
});

export const chat = async (
  messages: { role: string; content: string }[],
) => {
  const { data } = await http.post("/chat", { messages });
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/openai/client.ts",
    codeAddedLines: [[4, 6], [8, 13]],
  },
  {
    id: "page",
    title: "Chat page posts the transcript",
    kind: "demo",
    bullets: [
      "Append the user turn, POST, then append the assistant turn",
    ],
    code: `"use client";
import { useState } from "react";
import { chat } from "./client";

export default function OpenAIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const send = async () => {
    const next = [...messages, { role: "user", content: input }];
    const { text } = await chat(next);
    setMessages([...next, { role: "assistant", content: text }]);
    setInput("");
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/openai/page.tsx",
    codeAddedLines: [[11, 16]],
    embed: "openai-chat",
  },
  {
    id: "image",
    title: "Image generation on Express",
    kind: "demo",
    bullets: ["`images.generate` returns `b64_json` you can render as a data URL"],
    code: `app.post("/api/openai/image", async (req, res) => {
  const image = await client.images.generate({
    model: "gpt-image-1",
    prompt: req.body.prompt,
  });
  res.json({ b64: image.data[0].b64_json });
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/routes.js",
    codeAddedLines: [[2, 5]],
  },
  {
    id: "vision",
    title: "Vision — send an image_url",
    kind: "demo",
    bullets: [
      "`input_text` plus `input_image` in the same user turn",
    ],
    code: `const response = await client.responses.create({
  model: "gpt-4.1",
  input: [{
    role: "user",
    content: [
      { type: "input_text", text: "what is in this image?" },
      {
        type: "input_image",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
      },
    ],
  }],
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/vision.js",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "tts",
    title: "Text to speech writes an mp3",
    kind: "demo",
    bullets: [
      "`fs` is server-only — never import it from a client component",
    ],
    code: `import fs from "fs";
import path from "path";

const mp3 = await client.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
});
const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(path.resolve("./speech.mp3"), buffer);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/tts.js",
    codeAddedLines: [1, [4, 8], 10],
  },
  {
    id: "stt",
    title: "Speech to text",
    kind: "demo",
    bullets: ["`createReadStream` stays on Express"],
    code: `import fs from "fs";

const transcription = await client.audio.transcriptions.create({
  file: fs.createReadStream("speech.mp3"),
  model: "gpt-4o-mini-transcribe",
});
console.log(transcription.text);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/openai/stt.js",
    codeAddedLines: [[3, 6]],
  },
  {
    id: "course-ai",
    title: "Suggest a course from a description",
    kind: "demo",
    bullets: [
      "Parse into `CourseSchema`, then `dao.createCourse`",
    ],
    code: `app.post("/api/courses/ai", async (req, res) => {
  const { description } = req.body;
  const response = await client.responses.parse({
    model: "gpt-4.1",
    input: \`Suggest a course title and number for: \${description}\`,
    text: { format: zodTextFormat(CourseSchema, "course") },
  });
  const course = await dao.createCourse(response.output_parsed);
  res.json(course);
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeAddedLines: [1, [3, 7], 8],
  },
  {
    id: "module-ai",
    title: "Suggest a module for a course",
    kind: "demo",
    bullets: ["Same parse pattern on `/api/modules/ai`"],
    code: `app.post("/api/modules/ai", async (req, res) => {
  const { cid, topic } = req.body;
  const response = await client.responses.parse({
    model: "gpt-4.1",
    input: \`Suggest a module about \${topic} for course \${cid}\`,
    text: { format: zodTextFormat(ModuleSchema, "module") },
  });
  res.json(await dao.createModule({
    ...response.output_parsed,
    course: cid,
  }));
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Modules/routes.js",
    codeAddedLines: [1],
  },
  {
    id: "recap",
    title: "ChatGPT UI recap",
    kind: "content",
    bullets: [
      "POST `/api/openai/chat` from Next.js",
      "Images, vision, TTS, and STT stay on Express",
      "`POST /api/courses/ai` and `/api/modules/ai`",
    ],
  },
  {
    id: "next-up",
    title: "Next: Grok on xAI",
    kind: "title",
    bullets: [
      "Same chat idea, now `https://api.x.ai/v1`",
      "curl, then `generateText` with `grok-4`",
    ],
  },
];
