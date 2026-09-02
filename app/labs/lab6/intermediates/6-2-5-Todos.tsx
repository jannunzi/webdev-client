"use client";

import { useState } from "react";
import {
  createTodo,
  deleteTodo,
  fetchTodoById,
  fetchTodos,
  updateTodo,
} from "../client";

type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  description?: string;
};

export default function Lab6Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("Learn Mongoose");
  const [selected, setSelected] = useState<string>("");
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const data = (await fetchTodos()) as Todo[];
    setTodos(data);
    setMessage(`Retrieved ${data.length} todos`);
  };

  return (
    <div id="wd-lab6-todos">
      <h3>Lab 6 todos (Mongoose CRUD)</h3>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          id="wd-lab6-fetch-todos"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          onClick={refresh}
        >
          Find all
        </button>
        <button
          type="button"
          id="wd-lab6-fetch-completed"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          onClick={async () => {
            const data = (await fetchTodos(true)) as Todo[];
            setTodos(data);
            setMessage(`Completed: ${data.length}`);
          }}
        >
          Find completed
        </button>
        <button
          type="button"
          id="wd-lab6-create-todo"
          className="rounded bg-green-600 px-3 py-1.5 text-sm text-white"
          onClick={async () => {
            await createTodo({ title, completed: false });
            await refresh();
          }}
        >
          Create
        </button>
      </div>
      <input
        id="wd-lab6-todo-title"
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p id="wd-lab6-todo-message" className="text-sm text-neutral-600">
        {message}
      </p>
      <ul className="m-0 list-none p-0">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="mb-1 flex flex-wrap items-center gap-2 rounded border border-neutral-200 px-2 py-1"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={async () => {
                  await updateTodo(todo._id, { completed: !todo.completed });
                  await refresh();
                }}
              />
              <span className={todo.completed ? "line-through" : undefined}>
                {todo.title}
              </span>
            </label>
            <button
              type="button"
              className="rounded bg-neutral-200 px-2 py-0.5 text-xs"
              onClick={async () => {
                const one = await fetchTodoById(todo._id);
                setSelected(JSON.stringify(one));
              }}
            >
              By id
            </button>
            <button
              type="button"
              className="rounded bg-red-600 px-2 py-0.5 text-xs text-white"
              onClick={async () => {
                await deleteTodo(todo._id);
                await refresh();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selected ? (
        <pre className="mt-2 overflow-x-auto text-xs">{selected}</pre>
      ) : null}
      <hr />
    </div>
  );
}
