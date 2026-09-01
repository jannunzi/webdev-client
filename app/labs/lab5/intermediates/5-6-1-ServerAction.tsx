"use client";

import { useState } from "react";
import { addTodoAction } from "../actions";

type Todo = { id: string; title: string };

export default function ServerActionDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  async function onSubmit(formData: FormData) {
    const next = await addTodoAction(formData);
    setTodos(next);
  }
  return (
    <div id="wd-lab5-server-action">
      <h4>Server Action — add a todo</h4>
      <form action={onSubmit}>
        <input
          name="title"
          id="wd-lab5-action-title"
          className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
          placeholder="Title"
        />
        <button
          type="submit"
          id="wd-lab5-action-submit"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Add via Server Action
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
