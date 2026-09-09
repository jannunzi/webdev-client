import type { LectureSlide } from "../types";

export const GROK_IMAGES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "GENERATING IMAGES",
    kind: "title",
    bullets: [
      "**grok-2-image** · vision · zod",
    ],
  },
  {
    id: "endpoint",
    title: "Image Generation Endpoint",
    kind: "content",
    bullets: [
      "`https://api.x.ai/v1/images/generations`",
      "Chat stays on **`/v1/chat/completions`**",
      "Same `baseURL` `https://api.x.ai/v1` — model **`grok-2-image`**",
      "The result is a **JPG** URL",
    ],
  },
  {
    id: "generate",
    title: "Image Generation API",
    kind: "demo",
    bullets: ["`response.data[0].url` is the hosted **JPG**"],
    code: `import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const response = await openai.images.generate({
  model: "grok-2-image",
  prompt: "A cat in a tree",
});
console.log(response.data[0].url);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/image-generate.js",
    codeAddedLines: [[9, 12]],
  },
  {
    id: "course-image",
    title: "COURSE AI IMAGE",
    kind: "title",
    bullets: [
      "Sparkle suggests a course image from **title + description**",
    ],
  },
  {
    id: "schema",
    title: "Add New Course image Field",
    kind: "demo",
    bullets: ["Dashboard can store the generated **URL**"],
    code: `const courseSchema = new mongoose.Schema(
  {
    _id: String,
    image: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
  },
  { collection: "courses" },
);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Courses/schema.js",
    codeAddedLines: [4],
  },
  {
    id: "suggest-image",
    title: "Describe Prompt",
    kind: "demo",
    bullets: [
      "POST **`{ name, description }`** when both are present",
    ],
    code: `export const suggestAnImageForCourse = async (courseName, courseDescription) => {
  const response = await client.images.generate({
    model: "grok-2-image",
    prompt: \`Generate an 700 by 400 image for a course titled "\${courseName}" with the description: \${courseDescription}\`,
  });
  return response.data[0].url;
};`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "vision-title",
    title: "UNDERSTANDING IMAGES",
    kind: "title",
    bullets: [
      "Same chat path. Content is **`image_url`** plus text",
    ],
  },
  {
    id: "vision",
    title: "Image Understanding Endpoint",
    kind: "demo",
    bullets: [
      "`detail`: **`auto`**, **`low`**, or **`high`** (more tokens, more nuance)",
      "JPG/PNG, **20MiB** max. Same `/v1/chat/completions`",
    ],
    code: `const completion = await openai.chat.completions.create({
  model: "grok-4",
  messages: [{
    role: "user",
    content: [
      { type: "image_url", image_url: { url: image_url, detail: "high" } },
      { type: "text", text: "What's in this image?" },
    ],
  }],
});
console.log(completion.choices[0].message.content);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/image-understand-openai.js",
    codeAddedLines: [6],
  },
  {
    id: "vision-xai",
    title: "Understanding Images with xAI API",
    kind: "demo",
    bullets: ["`generateText` with `{ type: \"image\" }`"],
    code: `const result = await generateText({
  model: xai("grok-4"),
  messages: [{
    role: "user",
    content: [
      { type: "image", image: imageUrl },
      { type: "text", text: "What's in this image?" },
    ],
  }],
});
console.log(result.text);`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/image-understand-xai.js",
    codeAddedLines: [6],
  },
  {
    id: "structured-title",
    title: "STRUCTURED OUTPUT",
    kind: "title",
    bullets: [
      "JSON that matches a **Zod** schema",
    ],
  },
  {
    id: "invoice",
    title: "Declare Schema with ZOD",
    kind: "demo",
    bullets: [
      "`chat.completions.parse` plus **`zodResponseFormat`**",
    ],
    code: `import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const InvoiceSchema = z.object({
  vendor_name: z.string(),
  invoice_number: z.string(),
  total_amount: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP"]),
});

const completion = await client.chat.completions.parse({
  model: "grok-4",
  messages: [
    { role: "system", content: "Extract the invoice into JSON." },
    { role: "user", content: rawInvoice },
  ],
  response_format: zodResponseFormat(InvoiceSchema, "invoice"),
});
const invoice = completion.choices[0].message.parsed;`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/structured-output-invoice.js",
    codeAddedLines: [1, 2, [4, 9], 11, 17],
  },
  {
    id: "course-struct",
    title: "STRUCTURED COURSE",
    kind: "title",
    bullets: [
      "Suggest **modules and lessons** for a course",
    ],
  },
  {
    id: "course-schema",
    title: "Declare Zod Course Schema",
    kind: "demo",
    bullets: ["Same shapes you already store in **Mongo**"],
    code: `const LessonSchema = z.object({
  _id: z.string().describe("Unique identifier for the lesson"),
  name: z.string().describe("Title of the lesson"),
  description: z.string().describe("Description of the lesson"),
});
const ModuleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  lessons: z.array(LessonSchema),
});
const CourseSchema = z.object({
  _id: z.string(),
  image: z.string(),
  name: z.string(),
  description: z.string(),
  modules: z.array(ModuleSchema),
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/client.js",
    codeAddedLines: [[1, 18]],
  },
  {
    id: "upsert",
    title: "Add upsertCourse DAO",
    kind: "demo",
    bullets: [
      "`findOneAndUpdate` with **`upsert: true`**",
    ],
    code: `async function upsertCourse(course) {
  const query = { _id: course._id };
  const update = { $set: course };
  return model.findOneAndUpdate(query, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/Kambaz/Courses/dao.js",
    codeAddedLines: [[1, 9]],
  },
  {
    id: "modules-route",
    title: "Create Course Structure Route",
    kind: "demo",
    bullets: [
      "Load the course, parse a structure, **upsert**, return it",
    ],
    code: `app.get("/api/xai/course/:cid/modules", async (req, res) => {
  const { cid } = req.params;
  const course = await courseDao.findCourseById(cid);
  const courseStructure = await suggestCourseStructure(
    course.name, course.description,
  );
  const updated = await courseDao.upsertCourse({
    ...courseStructure.choices[0].message.parsed,
    _id: cid,
  });
  res.json(updated);
});`,
    codeLanguage: "javascript",
    codeFile: "webdev-server/xai/routes.js",
    codeAddedLines: [1, [7, 10]],
  },
  {
    id: "modules-ui",
    title: "Add Suggest Button",
    kind: "demo",
    bullets: [
      "Modules page calls GET, then **`setModules`** on the store",
    ],
    code: `const [loading, setLoading] = useState(false);
const { cid } = useParams();

const onSuggestCourseStructure = async () => {
  setLoading(true);
  const course = await xAIClient.suggestCourseStructure(cid as string);
  setModules(course.modules);
  setLoading(false);
};

<button
  className="float-right rounded bg-green-600 px-3 py-2 text-white"
  onClick={onSuggestCourseStructure}
>
  {loading && <ImSpinner3 className="me-2 animate-spin" />}
  Suggest Course Structure
</button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeAddedLines: [[4, 9], [15, 16]],
    embed: "grok-modules",
  },
];
