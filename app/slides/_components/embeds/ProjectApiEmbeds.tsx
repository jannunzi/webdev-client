"use client";

import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { PiStarFourFill } from "react-icons/pi";
import LectureDemoFrame from "./LectureDemoFrame";

const MOCK_VIDEOS = [
  {
    id: "PQ-GWgMnifE",
    title: "BENETEAU Swift Trawler 54",
    description: "Welcome aboard the Swift Trawler 54.",
    thumb: "https://i.ytimg.com/vi/PQ-GWgMnifE/hqdefault.jpg",
  },
  {
    id: "KSfs9fJW1rY",
    title: "Next.js + YouTube classroom demo",
    description: "Search, details, then save a youTubeId.",
    thumb: "https://i.ytimg.com/vi/KSfs9fJW1rY/hqdefault.jpg",
  },
];

export function YouTubeSearchEmbed() {
  const [query, setQuery] = useState("boats");
  const [videos, setVideos] = useState(MOCK_VIDEOS);

  return (
    <LectureDemoFrame label="youtube/search/page.tsx" url="/courses/CS1234/youtube/search">
      <div className="font-sans text-sm">
        <h3 className="mt-0 mb-2 text-base font-semibold">YouTube Video Search</h3>
        <div className="mb-3 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-3/4 rounded border px-3 py-2"
            aria-label="Search query"
          />
          <button
            type="button"
            className="w-1/4 rounded bg-blue-600 px-3 py-2 text-white"
            onClick={() => setVideos(MOCK_VIDEOS)}
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={video.thumb} alt="" className="aspect-video w-full object-cover" />
              <div className="p-2">
                <h4 className="mt-0 mb-1 text-sm font-semibold">{video.title}</h4>
                <p className="mb-0 text-xs text-neutral-600">{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function OpenAIChatEmbed() {
  const [input, setInput] = useState("Hello, ChatGPT");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([
    { role: "user", content: "Hello, ChatGPT" },
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);

  return (
    <LectureDemoFrame label="openai/page.tsx" url="/openai">
      <div className="font-sans text-sm">
        <div className="mb-3 space-y-2">
          {messages.map((message, index) => (
            <p key={`${message.role}-${index}`} className="mb-0">
              <b>{message.role}:</b> {message.content}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded border px-3 py-2"
            aria-label="Chat message"
          />
          <button
            type="button"
            className="rounded bg-neutral-900 px-3 py-2 text-white"
            onClick={() => {
              if (!input.trim()) return;
              setMessages((current) => [
                ...current,
                { role: "user", content: input },
                {
                  role: "assistant",
                  content: "Mock reply — the live call stays on Express.",
                },
              ]);
              setInput("");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </LectureDemoFrame>
  );
}

export function GrokSparkleEmbed() {
  const [name, setName] = useState("Web Development");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <LectureDemoFrame label="Dashboard/page.tsx" url="/Dashboard">
      <div className="font-sans text-sm">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Course title
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mb-3 w-full rounded border px-3 py-2"
        />
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Description
        </label>
        <div className="flex gap-2">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            type="button"
            className="self-start rounded bg-sky-500 px-3 py-3 text-white"
            aria-label="Suggest description"
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => {
                setDescription(
                  `A mock Grok suggestion for "${name}": build Next.js screens, then call Express so the xAI key never ships to the browser.`,
                );
                setLoading(false);
              }, 400);
            }}
          >
            {loading ? (
              <ImSpinner3 className="animate-spin text-lg" />
            ) : (
              <PiStarFourFill className="text-lg" />
            )}
          </button>
        </div>
      </div>
    </LectureDemoFrame>
  );
}
