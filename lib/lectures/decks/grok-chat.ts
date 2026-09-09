import type { LectureSlide } from "../types";

export const GROK_CHAT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · Grok chat",
      "completions · sparkle · title",
    ],
  },
  {
    id: "chat-intro",
    title: "Chat is text in, text out",
    kind: "content",
    bullets: [
      "Summarize, write, answer, support, or help with code",
      "You POST a request; the API returns a complete response",
    ],
  },
  {
    id: "openai-client",
    title: "OpenAI SDK pointed at xAI",
    kind: "demo",
    bullets: [
      "`baseURL` is `https://api.x.ai/v1` — same shapes as OpenAI",
    ],
    code: `import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
  timeout: 360000,
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/chat.ts",
    codeAddedLines: [[4, 7]],
  },
  {
    id: "completion",
    title: "chat.completions.create",
    kind: "demo",
    bullets: [
      "Model `grok-4`. Read `choices[0].message`",
    ],
    code: `const completion = await client.chat.completions.create({
  model: "grok-4",
  messages: [
    {
      role: "system",
      content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
    },
    {
      role: "user",
      content: "What is the meaning of life, the universe, and everything?",
    },
  ],
});
console.log(completion.choices[0].message);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/chat.ts",
    codeAddedLines: [[1, 13]],
  },
  {
    id: "stateless",
    title: "The xAI API is stateless",
    kind: "demo",
    bullets: [
      "Resend prior turns if you want context",
      "Roles: system (policy), user (request), assistant (history)",
    ],
    code: `{ "role": "system", "content": [{ "type": "text", "text": "You are a helpful and funny assistant." }] }
{ "role": "user", "content": [{ "type": "text", "text": "Why don't eggs tell jokes?" }] }
{ "role": "assistant", "content": [{ "type": "text", "text": "They'd crack up!" }] }
{ "role": "user", "content": [{ "type": "text", "text": "Can you explain the joke?" }] }`,
    codeLanguage: "json",
  },
  {
    id: "order",
    title: "Role order is flexible",
    kind: "content",
    bullets: [
      "Unlike some providers, xAI lets you mix roles in any order",
      "Two `system` messages, or `user` before `system`, both work",
    ],
  },
  {
    id: "server-client",
    title: "Suggest a course description",
    kind: "demo",
    bullets: [
      "Faculty system prompt. Return only one short paragraph",
    ],
    code: `export const suggestCourseDescription = async (courseName) => {
  const completion = await client.chat.completions.create({
    model: "grok-4",
    messages: [
      { role: "system", content: "You are a faculty developing a course." },
      {
        role: "user",
        content: \`What is a good course description for a course titled "\${courseName}"? Only respond with the description as a single paragraph. Paragraph should be less than 500 characters.\`,
      },
    ],
  });
  return completion.choices[0].message;
};`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 13]],
  },
  {
    id: "route",
    title: "POST /api/xai/course",
    kind: "demo",
    bullets: [
      "`name` → description. Later, `description` → title",
    ],
    code: `import { suggestCourseDescription } from "./client.js";

export default function XaiRoutes(app) {
  const suggestCourseContent = async (req, res) => {
    const { name } = req.body;
    const description = await suggestCourseDescription(name);
    res.json(description);
  };
  app.post("/api/xai/course", suggestCourseContent);
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/routes.js",
    codeAddedLines: [9],
  },
  {
    id: "next-client",
    title: "Next.js posts the course name",
    kind: "demo",
    bullets: [
      "`NEXT_PUBLIC_HTTP_SERVER` plus `/api/xai`",
    ],
    code: `import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const XAI_API = \`\${HTTP_SERVER}/api/xai\`;

export const suggestCourseDescription = async (courseName: string) => {
  const response = await axios.post(\`\${XAI_API}/course\`, { name: courseName });
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/xAI/client.ts",
    codeAddedLines: [[6, 9]],
  },
  {
    id: "sparkle",
    title: "Dashboard sparkle + spinner",
    kind: "demo",
    bullets: [
      "`PiStarFourFill` while idle. `ImSpinner3` while waiting",
    ],
    code: `const [loadingDescription, setLoadingDescription] = useState(false);

<button className="rounded bg-sky-500 px-2 py-2 text-white">
  {loadingDescription ? (
    <ImSpinner3 className="animate-spin" />
  ) : (
    <PiStarFourFill
      onClick={async (event) => {
        event.preventDefault();
        setLoadingDescription(true);
        const message = await xAIClient.suggestCourseDescription(course.name);
        setCourse({ ...course, description: message.content || "" });
        setLoadingDescription(false);
      }}
    />
  )}
</button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/Dashboard/page.tsx",
    codeAddedLines: [1, [7, 15]],
    embed: "grok-sparkle",
  },
  {
    id: "title-suggest",
    title: "Sparkle a title from description",
    kind: "demo",
    bullets: [
      "Same route: send `{ description }` when `name` is empty",
    ],
    code: `export const suggestCourseTitle = async (courseTopic) => {
  const completion = await client.chat.completions.create({
    model: "grok-4",
    messages: [
      { role: "system", content: "You are a faculty developing a course." },
      {
        role: "user",
        content: \`What is a good course title for a course about \${courseTopic}? Only respond with the title.\`,
      },
    ],
  });
  return completion.choices[0].message;
};`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 13]],
  },
  {
    id: "recap",
    title: "Chat recap",
    kind: "content",
    bullets: [
      "`chat.completions.create` model `grok-4`",
      "Stateless — resend roles; order is flexible",
      "`POST /api/xai/course` plus a Dashboard sparkle",
    ],
  },
  {
    id: "next-up",
    title: "Next: images and vision",
    kind: "title",
    bullets: [
      "`grok-2-image`, then `image_url` vision",
      "Zod course structure and upsert",
    ],
  },
];
