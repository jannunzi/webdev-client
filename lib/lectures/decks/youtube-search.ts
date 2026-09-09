import type { LectureSlide } from "../types";

export const YOUTUBE_SEARCH_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Project · YouTube search",
      "GET /search · then render cards",
    ],
  },
  {
    id: "endpoint",
    title: "Search needs q, key, and part",
    kind: "demo",
    bullets: [
      "URL: `https://www.googleapis.com/youtube/v3/search`",
      "`q` is the keyword. `part=snippet` includes title and thumbs",
    ],
    code: `https://www.googleapis.com/youtube/v3/search?q=boats&key=YOUR_KEY&part=snippet`,
    codeLanguage: "text",
  },
  {
    id: "response",
    title: "items hold videoId and snippet",
    kind: "demo",
    bullets: [
      "`kind` is `youtube#searchListResponse`",
      "Each item: `id.videoId` plus `snippet.title` and thumbnails",
    ],
    code: `{
  "kind": "youtube#searchListResponse",
  "pageInfo": { "totalResults": 467105, "resultsPerPage": 5 },
  "items": [
    {
      "id": { "kind": "youtube#video", "videoId": "PQ-GWgMnifE" },
      "snippet": {
        "title": "BENETEAU Swift Trawler 54: ...",
        "description": "Welcome aboard the Swift Trawler 54 ...",
        "thumbnails": {
          "high": { "url": "https://i.ytimg.com/vi/PQ-GWgMnifE/hqdefault.jpg" }
        }
      }
    }
  ]
}`,
    codeLanguage: "json",
    codeHighlightLines: [5, [6, 12]],
  },
  {
    id: "nav",
    title: "Add a YouTube link to Kambaz",
    kind: "demo",
    bullets: [
      "Course nav already lists Home, Modules, Assignments",
      "Path is `YouTube/Search` under the course id",
    ],
    code: `{
  label: "YouTube",
  path: "YouTube/Search",
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "client",
    title: "Create a YouTube API client",
    kind: "demo",
    bullets: [
      "Read the env base and key. Return `response.data.items`",
    ],
    code: `import axios from "axios";
const YOUTUBE_API = process.env.NEXT_PUBLIC_YOUTUBE_API;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const search = async (query: string) => {
  const response = await axios.get(
    \`\${YOUTUBE_API}/search?part=snippet&q=\${query}&key=\${YOUTUBE_API_KEY}\`,
  );
  return response.data.items;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/client.ts",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "screen",
    title: "Search screen holds query state",
    kind: "demo",
    bullets: [
      "`\"use client\"` because `useState` and the click handler",
      "`searchVideos` calls the client and `setVideos`",
    ],
    code: `"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as ytClient from "../client";

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const { cid } = useParams();
  const searchVideos = async () => {
    const videos = await ytClient.search(query);
    setVideos(videos);
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeAddedLines: [[8, 14]],
  },
  {
    id: "field",
    title: "A field and a Search button",
    kind: "demo",
    bullets: [
      "Controlled input. Button calls `searchVideos`",
      "Tailwind instead of Bootstrap `form-control`",
    ],
    code: `return (
  <div>
    <h2>YouTube Video Search</h2>
    <button
      className="mb-2 float-right w-1/4 rounded bg-blue-600 px-3 py-2 text-white"
      onClick={() => { searchVideos(); }}
    >
      Search
    </button>
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="mb-2 w-3/4 rounded border px-3 py-2"
    />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    embed: "youtube-search",
  },
  {
    id: "cards",
    title: "Map items to thumbnail cards",
    kind: "demo",
    bullets: [
      "Key is `video.id.videoId`. Thumb is `snippet.thumbnails.high.url`",
      "Watch opens YouTube. Details stays in Kambaz",
    ],
    code: `{videos.map((video) => (
  <div key={video.id.videoId} className="w-1/3 p-2">
    <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
    <h5>{video.snippet.title}</h5>
    <p>{video.snippet.description}</p>
    <a href={\`https://www.youtube.com/watch?v=\${video.id.videoId}\`} target="_blank">
      Watch Video
    </a>
    <Link href={\`/courses/\${cid}/youtube/details/\${video.id.videoId}\`}>
      View Details
    </Link>
  </div>
))}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/youtube/search/page.tsx",
    codeHighlightLines: [1, 3, [9, 11]],
  },
  {
    id: "recap",
    title: "Search recap",
    kind: "content",
    bullets: [
      "`GET /search?part=snippet&q=&key=` returns `items`",
      "axios client, then `useState` for query and videos",
      "Cards link to `/youtube/details/[vid]` next",
    ],
  },
  {
    id: "next-up",
    title: "Next: video details",
    kind: "title",
    bullets: [
      "`GET /videos` by id, embed the player, encode search",
      "Then save a `youTubeId` on the lesson",
    ],
  },
];
