"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string };

export default function ClientGet() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    fetch("/api/lab5/todos")
      .then((response) => response.json())
      .then(setTodos);
  }, []);
  return (
    <div id="wd-lab5-client-get">
      <h4>Client fetch — GET todos</h4>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
