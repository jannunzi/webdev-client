"use client";

import { useState } from "react";
import { httpServer } from "@/app/lib/httpServer";

export default function WorkingWithArrays() {
  const HTTP_SERVER = httpServer();
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    completed: false,
  });
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a
        id="wd-retrieve-todos"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={API}
      >
        Get Todos
      </a>
      <h4 className="mt-3">Retrieving an Item from an Array by ID</h4>
      <a
        id="wd-retrieve-todo-by-id"
        className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${API}/${todo.id}`}
      >
        Get Todo by ID
      </a>
      <input
        id="wd-todo-id"
        className="rounded border border-neutral-300 px-2 py-1"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <h4 className="mt-3">Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <h4 className="mt-3">Creating new Items in an Array</h4>
      <a
        id="wd-create-todo"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${API}/create`}
      >
        Create Todo
      </a>
      <h4 className="mt-3">Removing from an Array</h4>
      <a
        id="wd-remove-todo"
        className="mr-2 rounded bg-red-600 px-3 py-1.5 text-sm text-white"
        href={`${API}/${todo.id}/delete`}
      >
        Remove Todo with ID = {todo.id}
      </a>
      <h4 className="mt-3">Updating an Item in an Array</h4>
      <a
        id="wd-update-todo-title"
        className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${API}/${todo.id}/title/${todo.title}`}
      >
        Update Todo
      </a>
      <input
        className="mr-2 rounded border border-neutral-300 px-2 py-1"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <div className="mt-2">
        <a
          id="wd-update-todo-completed"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${API}/${todo.id}/completed/${todo.completed}`}
        >
          Complete Todo ID = {todo.id}
        </a>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) =>
            setTodo({ ...todo, completed: e.target.checked })
          }
        />
      </div>
      <div className="mt-2">
        <a
          id="wd-update-todo-description"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${API}/${todo.id}/description/${todo.description}`}
        >
          Describe Todo ID = {todo.id}
        </a>
        <input
          className="rounded border border-neutral-300 px-2 py-1"
          value={todo.description}
          onChange={(e) =>
            setTodo({ ...todo, description: e.target.value })
          }
        />
      </div>
      <hr />
    </div>
  );
}
