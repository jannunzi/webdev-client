"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string };

export default function ClientPost() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  async function load() {
    const response = await fetch("/api/lab5/todos");
    setTodos(await response.json());
  }
  useEffect(() => {
    load();
  }, []);
  async function addTodo() {
    if (!title.trim()) return;
    await fetch("/api/lab5/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    await load();
  }
  return (
    <div id="wd-lab5-client-post">
      <h4>Client fetch — POST a todo</h4>
      <input
        id="wd-lab5-client-post-title"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="button"
        id="wd-lab5-client-post-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={addTodo}
      >
        Add
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
