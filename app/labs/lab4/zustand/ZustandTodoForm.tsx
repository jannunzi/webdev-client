"use client";

import { useTodoStore } from "./todoStore";

export default function ZustandTodoForm() {
  const todo = useTodoStore((state) => state.todo);
  const setTodo = useTodoStore((state) => state.setTodo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  return (
    <div id="wd-zustand-todo-form" className="mb-3 flex flex-wrap gap-2">
      <input
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        id="wd-zustand-todo-title"
      />
      <button
        type="button"
        onClick={() => addTodo(todo)}
        id="wd-zustand-add-todo-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => updateTodo(todo)}
        id="wd-zustand-update-todo-click"
        className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Update
      </button>
    </div>
  );
}
