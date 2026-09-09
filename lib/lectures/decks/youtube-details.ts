import type { LectureSlide } from "../types";

export const YOUTUBE_DETAILS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "DETAILS SCREEN",
    kind: "title",
    bullets: [
      "`videos.list` · embed · **URL state** · save",
    ],
  },
  {
    id: "client",
    title: "Implement Video Details API Client",
    kind: "demo",
    bullets: [
      "`part=snippet,contentDetails` and **`id=`** the `videoId`",
      "Return **`items[0]`** — one video, not a search list",
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
    title: "Fetch Details on Load",
    kind: "demo",
    bullets: [
      "`useParams()` reads **`[vid]`**. `useEffect` depends on `vid`",
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
    title: "Embed Video",
    kind: "demo",
    bullets: [
      "`https://www.youtube.com/embed/${vid}` inside an **iframe**",
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
  </div>
)}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
    codeHighlightLines: [6],
    embed: "youtube-details",
  },
  {
    id: "render",
    title: "Render Video Title, Description, and Link",
    kind: "demo",
    bullets: ["Title and **Watch on YouTube** still use `snippet`"],
    code: `<h5>{video.snippet.title}</h5>
<p>{video.snippet.description}</p>
<a target="_blank" rel="noopener noreferrer"
   href={\`https://www.youtube.com/watch?v=\${vid}\`}>
  Watch on YouTube
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
  },
  {
    id: "url-state",
    title: "ENCODING URL STATE",
    kind: "title",
    bullets: [
      "`?search=` reloads the same query",
      "Lesson names can **deep-link** search",
    ],
  },
  {
    id: "search-params",
    title: "If Search Parameter Encoded, Do the Search",
    kind: "demo",
    bullets: [
      "`useSearchParams().get(\"search\")` reads the query",
      "`searchVideos(keyword || query)`",
    ],
    code: `const searchParams = useSearchParams();
const search = searchParams.get("search");
const router = useRouter();
const searchVideos = async (keyword: string) => {
  const response = await ytClient.search(keyword || query);
  setVideos(response);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "use-effect",
    title: "If Search Parameter Encoded, Do the Search",
    kind: "demo",
    bullets: ["`useEffect` depends on **`search`**"],
    code: `useEffect(() => {
  if (search) {
    setQuery(search);
    searchVideos(search);
  }
}, [search]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "router",
    title: "router to Encode Search in URL",
    kind: "demo",
    bullets: [
      "Search button **`router.push`**s instead of only calling axios",
    ],
    code: `<IoChevronBack onClick={() => router.back()} />
<button
  className="mb-2 float-right w-1/4 rounded bg-blue-600 px-3 py-2 text-white"
  onClick={() => {
    router.push(\`/courses/\${cid}/youtube/search?search=\${query}\`);
  }}
>
  Search
</button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeHighlightLines: [5],
  },
  {
    id: "back-details",
    title: "Add a Back Button in Details",
    kind: "demo",
    bullets: ["`IoChevronBack` calls **`router.back()`**"],
    code: `import { IoChevronBack } from "react-icons/io5";
import { useRouter, useParams } from "next/navigation";

export default function YouTubeVideoDetails() {
  const router = useRouter();
  if (!video) return <div>Loading...</div>;
  return (
    <div>
      <h2>
        <IoChevronBack onClick={() => router.back()} />
        {video.snippet.title}
      </h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
    codeAddedLines: [10],
  },
  {
    id: "lessons",
    title: "VIDEO LESSONS",
    kind: "title",
    bullets: [
      "A YouTube icon on **`LessonControlButtons`**",
      "Search from the **lesson name**",
    ],
  },
  {
    id: "lesson-icon",
    title: "Search Videos from Lesson Name (1/3)",
    kind: "demo",
    bullets: [
      "Modules lesson row links `?search=${lesson.name}`",
    ],
    code: `export default function LessonControlButtons(
  { lesson }: { lesson: any },
) {
  const { cid } = useParams();
  return (
    <div className="float-right">
      <Link
        href={\`/courses/\${cid}/youtube/search?search=\${lesson.name}\`}
        className="me-2 text-red-600"
      >
        <BsYoutube className="text-xl" />
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/LessonControlButtons.tsx",
    codeAddedLines: [[7, 12]],
    embed: "youtube-lesson",
  },
  {
    id: "lesson-map",
    title: "Search Videos from Lesson Name (2/3)",
    kind: "demo",
    bullets: ["Pass **`lesson`** into the control buttons"],
    code: `{module.lessons &&
  module.lessons.map((lesson: any) => (
    <li key={lesson._id}>
      {lesson.name}
      <LessonControlButtons lesson={lesson} />
    </li>
  ))}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [5],
    embed: "kambaz-styled-modules",
  },
  {
    id: "schema",
    title: "Add YouTube ID in Schema",
    kind: "demo",
    bullets: [
      "Optional **`youTubeId`** so a lesson can open Details",
      "Modules stay their **own collection** — nest `youTubeId` on each lesson",
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
    id: "if-id",
    title: "If youTubeId, Show Details",
    kind: "demo",
    bullets: [
      "Has **`youTubeId`** → Details. Otherwise show the name",
    ],
    code: `{lesson.youTubeId ? (
  <Link href={\`/courses/\${cid}/youtube/details/\${lesson.youTubeId}\`}>
    {lesson.name}
  </Link>
) : (
  lesson.name
)}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [1, 2],
  },
  {
    id: "store",
    title: "STORE VIDEOS IN DB",
    kind: "title",
    bullets: [
      "Pass **`mid`** and **`lid`** through the query string",
      "POST the **video id** onto the lesson",
    ],
  },
  {
    id: "pass-ids",
    title: "Pass Module and Lesson ID to Search",
    kind: "demo",
    bullets: ["YouTube icon now encodes **`mid`** and **`lid`**"],
    code: `export default function LessonControlButtons({ lesson, moduleId }) {
  return (
    <Link
      href={\`/courses/\${cid}/youtube/search?search=\${lesson.name}&mid=\${moduleId}&lid=\${lesson._id}\`}
      className="me-2 text-red-600"
    >
      <BsYoutube className="text-xl" />
    </Link>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/LessonControlButtons.tsx",
    codeHighlightLines: [4],
  },
  {
    id: "read-search",
    title: "Read Module and Lesson IDs in Search",
    kind: "demo",
    bullets: ["`useSearchParams` reads **`mid`** and **`lid`**"],
    code: `const moduleId = searchParams.get("mid");
const lessonId = searchParams.get("lid");`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[1, 2]],
  },
  {
    id: "pass-details",
    title: "Pass Module and Lesson IDs to Details",
    kind: "demo",
    bullets: ["View Details keeps **`mid`** and **`lid`** on the URL"],
    code: `<Link
  className="ms-2 rounded bg-neutral-600 px-3 py-2 text-white"
  href={\`/courses/\${cid}/youtube/details/\${video.id.videoId}?mid=\${moduleId}&lid=\${lessonId}\`}
>
  View Details
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeHighlightLines: [3],
  },
  {
    id: "post-client",
    title: "Post YouTube Video ID To Server",
    kind: "demo",
    bullets: ["Client **POST**s cid / mid / lid / vid"],
    code: `export const saveYouTubeVideoToLesson = async (
  courseId: string, moduleId: string,
  lessonId: string, videoId: string,
) => {
  const response = await axios.post(
    \`\${process.env.NEXT_PUBLIC_HTTP_SERVER}/api/courses/\${courseId}/modules/\${moduleId}/lessons/\${lessonId}/youtube/\${videoId}\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/client.ts",
    codeAddedLines: [[1, 10]],
  },
  {
    id: "save-ui",
    title: "Save YouTube Video ID to Server",
    kind: "demo",
    bullets: [
      "Details reads **`mid`** and **`lid`**, then saves",
    ],
    code: `const moduleId = searchParams.get("mid");
const lessonId = searchParams.get("lid");
const saveYouTubeVideoToLesson = async () => {
  await ytClient.saveYouTubeVideoToLesson(cid, moduleId, lessonId, vid);
  router.push(\`/courses/\${cid}/modules\`);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/details/[vid]/page.tsx",
    codeAddedLines: [[3, 6]],
  },
  {
    id: "dao",
    title: "Save the Video ID in the Lesson",
    kind: "demo",
    bullets: [
      "DAO sets **`lesson.youTubeId = vid`** and saves the module",
    ],
    code: `async function saveYouTubeVideoToLesson(cid, mid, lid, vid) {
  const module = await model.findById(mid);
  const lesson = module.lessons.id(lid);
  lesson.youTubeId = vid;
  await module.save();
  return lesson;
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/dao.js",
    codeHighlightLines: [4],
    diagram: "youtube-save-flow",
  },
  {
    id: "route",
    title: "In Server, Parse Video ID from URL POST",
    kind: "demo",
    bullets: ["Express reads **`:cid :mid :lid :vid`**"],
    code: `const saveYouTubeVideoToLesson = async (req, res) => {
  const { cid, mid, lid, vid } = req.params;
  const status = await dao.saveYouTubeVideoToLesson(cid, mid, lid, vid);
  res.send(status);
};
app.post(
  "/api/courses/:cid/modules/:mid/lessons/:lid/youtube/:vid",
  saveYouTubeVideoToLesson,
);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/routes.js",
    codeHighlightLines: [[6, 8]],
  },
];
