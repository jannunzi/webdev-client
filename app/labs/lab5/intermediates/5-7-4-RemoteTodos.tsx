"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/lib/apiUrl";

type Todo = { id: string; title: string };

export default function RemoteTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  async function load() {
    try {
      const response = await fetch(apiUrl("/api/lab5/todos"));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setTodos(await response.json());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function addTodo() {
    if (!title.trim()) return;
    await fetch(apiUrl("/api/lab5/todos"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    await load();
  }
  return (
    <div id="wd-lab5-remote-todos">
      <h4>Remote (or same-origin) todo POST</h4>
      <p>
        POST <code>{apiUrl("/api/lab5/todos")}</code>
      </p>
      {error ? <p id="wd-lab5-remote-todos-error">{error}</p> : null}
      <input
        id="wd-lab5-remote-todo-title"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="button"
        id="wd-lab5-remote-todo-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={addTodo}
      >
        Add on current API
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
