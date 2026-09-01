"use client";

import { useState } from "react";

type Todo = { id: string; title: string };

export default function PostHandler() {
  const [title, setTitle] = useState("Read Chapter 5");
  const [created, setCreated] = useState<Todo | null>(null);
  async function createTodo() {
    const response = await fetch("/api/lab5/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setCreated(await response.json());
  }
  return (
    <div id="wd-lab5-post-handler">
      <h4>POST /api/lab5/todos</h4>
      <input
        id="wd-lab5-post-title"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="button"
        id="wd-lab5-post-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={createTodo}
      >
        Create
      </button>
      <pre>{JSON.stringify(created, null, 2)}</pre>
      <hr />
    </div>
  );
}
