"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string };

export default function PutDelete() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState("");
  async function load() {
    const response = await fetch("/api/lab5/todos");
    setTodos(await response.json());
  }
  useEffect(() => {
    load();
  }, []);
  async function renameFirst() {
    const first = todos[0];
    if (!first) return;
    const response = await fetch(`/api/lab5/todos/${first.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${first.title} (edited)` }),
    });
    setStatus(`PUT ${response.status}`);
    await load();
  }
  async function removeLast() {
    const last = todos[todos.length - 1];
    if (!last) return;
    const response = await fetch(`/api/lab5/todos/${last.id}`, {
      method: "DELETE",
    });
    setStatus(`DELETE ${response.status}`);
    await load();
  }
  return (
    <div id="wd-lab5-put-delete">
      <h4>PUT and DELETE /api/lab5/todos/:id</h4>
      <button
        type="button"
        id="wd-lab5-put-click"
        className="mr-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
        onClick={renameFirst}
      >
        Rename first
      </button>
      <button
        type="button"
        id="wd-lab5-delete-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={removeLast}
      >
        Delete last
      </button>
      <p>{status}</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
