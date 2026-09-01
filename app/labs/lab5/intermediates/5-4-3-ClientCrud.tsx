"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string };

export default function ClientCrud() {
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
  async function saveTodo(todo: Todo) {
    await fetch(`/api/lab5/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todo.title }),
    });
    await load();
  }
  async function removeTodo(id: string) {
    await fetch(`/api/lab5/todos/${id}`, { method: "DELETE" });
    await load();
  }
  return (
    <div id="wd-lab5-client-crud">
      <h4>Client fetch — todo CRUD</h4>
      <input
        id="wd-lab5-crud-title"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="button"
        id="wd-lab5-crud-add-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={addTodo}
      >
        Add
      </button>
      <ul className="mt-2 list-none p-0">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2">
            <input
              className="mr-2 rounded border border-neutral-300 px-2 py-1"
              value={todo.title}
              onChange={(e) =>
                setTodos((current) =>
                  current.map((t) =>
                    t.id === todo.id ? { ...t, title: e.target.value } : t,
                  ),
                )
              }
            />
            <button
              type="button"
              className="mr-2 rounded bg-yellow-400 px-2 py-1 text-sm"
              onClick={() => saveTodo(todo)}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded bg-red-600 px-2 py-1 text-sm text-white"
              onClick={() => removeTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
