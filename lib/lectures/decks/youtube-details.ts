import type { LectureSlide } from "../types";

export const YOUTUBE_DETAILS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · YouTube details",
      "videos.list · URL state · save",
    ],
  },
  {
    id: "client",
    title: "Details uses videos.list",
    kind: "demo",
    bullets: [
      "`part=snippet,contentDetails` and `id=` the `videoId`",
      "Return `items[0]` — one video, not a search list",
    ],
    code: `export const getYouTubeVideoDetails = async (vid: string) => {
  const response = await axios.get(
    \`\${YOUTUBE_API}/videos?part=snippet,contentDetails&id=\${vid}&key=\${YOUTUBE_API_KEY}\`,
  );
  return response.data.items[0];
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "load",
    title: "Fetch details on load",
    kind: "demo",
    bullets: [
      "`useParams()` reads `[vid]`. `useEffect` depends on `vid`",
    ],
    code: `"use client";
import { useParams } from "next/navigation";
import * as ytClient from "../../client";
import { useEffect, useState } from "react";

export default function YouTubeVideoDetails() {
  const { vid } = useParams();
  const [video, setVideo] = useState<any>(null);
  const fetchVideoDetails = async () => {
    const videoDetails = await ytClient.getYouTubeVideoDetails(vid as string);
    setVideo(videoDetails);
  };
  useEffect(() => {
    fetchVideoDetails();
  }, [vid]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
    codeAddedLines: [[13, 15]],
  },
  {
    id: "embed",
    title: "Embed the player",
    kind: "demo",
    bullets: [
      "`https://www.youtube.com/embed/${vid}` inside an iframe",
      "Title and Watch on YouTube still use `snippet`",
    ],
    code: `{video && (
  <div>
    <iframe
      width="100%"
      height="315"
      src={\`https://www.youtube.com/embed/\${vid}\`}
      title={video.snippet.title}
      allowFullScreen
    />
    <h5>{video.snippet.title}</h5>
    <p>{video.snippet.description}</p>
  </div>
)}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
    codeHighlightLines: [6],
  },
  {
    id: "url",
    title: "Encode search in the URL",
    kind: "demo",
    bullets: [
      "`useSearchParams().get(\"search\")` reloads the same query",
      "Search button `router.push`s instead of only calling axios",
    ],
    code: `const searchParams = useSearchParams();
const search = searchParams.get("search");
const router = useRouter();
useEffect(() => {
  if (search) {
    setQuery(search);
    searchVideos(search);
  }
}, [search]);
// button
router.push(\`/courses/\${cid}/youtube/search?search=\${query}\`);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[4, 9], 11],
  },
  {
    id: "lesson",
    title: "Search from the lesson name",
    kind: "demo",
    bullets: [
      "Modules lesson row links `?search=${lesson.name}`",
      "A YouTube icon on `LessonControlButtons`",
    ],
    code: `<Link
  href={\`/courses/\${cid}/youtube/search?search=\${lesson.name}\`}
  className="me-2 text-red-600"
>
  <BsYoutube className="text-xl" />
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/LessonControlButtons.tsx",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-modules",
  },
  {
    id: "schema",
    title: "Add youTubeId on the lesson",
    kind: "demo",
    bullets: [
      "Module schema already nests `lessons[]`",
      "Optional `youTubeId` so a lesson can open Details",
    ],
    code: `lessons: [
  {
    _id: String,
    name: String,
    description: String,
    youTubeId: String,
  },
],`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/schema.js",
    codeAddedLines: [6],
  },
  {
    id: "save",
    title: "POST the video onto the lesson",
    kind: "demo",
    bullets: [
      "Details reads `mid` and `lid` from the query string",
      "DAO sets `lesson.youTubeId = vid` and saves the module",
    ],
    code: `app.post(
  "/api/courses/:cid/modules/:mid/lessons/:lid/youtube/:vid",
  saveYouTubeVideoToLesson,
);

async function saveYouTubeVideoToLesson(cid, mid, lid, vid) {
  const module = await model.findById(mid);
  const lesson = module.lessons.id(lid);
  lesson.youTubeId = vid;
  await module.save();
  return lesson;
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/routes.js",
    codeHighlightLines: [[1, 4], 9],
  },
  {
    id: "recap",
    title: "Details recap",
    kind: "content",
    bullets: [
      "`GET /videos?id=` then embed `/embed/${vid}`",
      "Encode `?search=` so lesson names reopen the same query",
      "Persist `youTubeId` on the lesson through Express + Mongo",
    ],
  },
  {
    id: "next-up",
    title: "Next: ChatGPT on the server",
    kind: "title",
    bullets: [
      "OpenAI SDK, tokens, then responses.create",
      "The key stays in Express — never NEXT_PUBLIC_",
    ],
  },
];
