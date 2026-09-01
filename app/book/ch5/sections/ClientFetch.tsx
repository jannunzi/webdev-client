import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import ClientGet from "@/app/labs/lab5/intermediates/5-4-1-ClientGet";
import ClientPost from "@/app/labs/lab5/intermediates/5-4-2-ClientPost";
import ClientCrud from "@/app/labs/lab5/intermediates/5-4-3-ClientCrud";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function ClientFetch() {
  return (
    <Section id="sec-5-4" title="5.4 Fetching from Client Components">
      <p>
        The handlers exist. The UI still has to call them.{" "}
        <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">
          <code>fetch</code>
        </OfficialLink>{" "}
        is the browser function that sends an HTTP request and returns a
        Promise for the <code>Response</code>. You already used it to
        prove each handler works. This section builds a small todo UI
        that <em>lives</em>{" "}on those requests: load on mount, create
        from a form, then edit and delete in place — the same shape
        Kambaz Dashboard will use for courses.
      </p>
      <p>
        <code>fetch</code>{" "}is a side effect. It does not belong in the
        function body next to <code>useState</code> — that would fire
        on every render. It belongs in <code>useEffect</code>{" "}(
        <SectionLink to="4.7" />) when you load, and in click handlers
        when the user asks to change something. After a mutation,
        either update local state with the JSON you got back, or{" "}
        <code>GET</code>{" "}the collection again. The labs refetch: one
        <code>load</code>{" "}function, call it on mount and after every
        write.
      </p>

      <Section
        level={3}
        id="sec-5-4-1"
        title="5.4.1 Fetching on Mount"
      >
        <p>
          Create <code>5-4-1-ClientGet.tsx</code>. An empty dependency
          array means the effect runs after the first paint, not after
          every keystroke:
        </p>
        <CodeBlock
          language="tsx"
          name="ClientGet"
          file="app/labs/lab5/intermediates/5-4-1-ClientGet.tsx"
        >{`"use client";

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
}`}</CodeBlock>
        <p>
          The list is whatever the in-memory store holds right now —
          including todos you posted in <SectionLink to="5.3.4" />:
        </p>
        <LiveDemo
          name="ClientGet"
          file="app/labs/lab5/intermediates/5-4-1-ClientGet.tsx"
          mode="styled"
        >
          <ClientGet />
        </LiveDemo>
        <OnYourOwn>
          Show a{" "}
          <code>Loading…</code>{" "}paragraph until the first{" "}
          <code>fetch</code>{" "}resolves, then hide it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-4-1-ClientGet.tsx, keep any Loading paragraph I added. Add a sample count line Todos: {todos.length} above the ul. Do not remove my loading state.`}
        >
          Ask the assistant to show a sample count — you still add the
          loading line:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-4-2"
        title="5.4.2 POST from a Form"
      >
        <p>
          A controlled input plus a button is enough to create. After
          the <code>POST</code>, call <code>load</code>{" "}again so the
          list includes the new id from the server — do not invent an
          id on the client:
        </p>
        <CodeBlock
          language="tsx"
          name="ClientPost"
          file="app/labs/lab5/intermediates/5-4-2-ClientPost.tsx"
        >{`"use client";

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
}`}</CodeBlock>
        <p>
          Type a title, click Add, and confirm the item appears without
          a refresh:
        </p>
        <LiveDemo
          name="ClientPost"
          file="app/labs/lab5/intermediates/5-4-2-ClientPost.tsx"
          mode="styled"
        >
          <ClientPost />
        </LiveDemo>
        <OnYourOwn>
          Disable the Add button
          while the <code>POST</code>{" "}is in flight so a double-click
          cannot create two todos.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-4-2-ClientPost.tsx, keep any disabled-while-saving logic I added. After a successful POST, also set a sample status string lastAdded to the title that was posted and show it under the list. Do not remove my disable flag.`}
        >
          Ask the assistant to echo the last posted title — you still
          guard the double-click:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-4-3"
        title="5.4.3 Updating and Deleting"
      >
        <p>
          PUT and DELETE close the CRUD loop. Edit in a controlled
          input bound to the array in state, then PUT that title. Delete
          sends the id in the path. Create{" "}
          <code>5-4-3-ClientCrud.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ClientCrud"
          file="app/labs/lab5/intermediates/5-4-3-ClientCrud.tsx"
        >{`"use client";

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
    await fetch(\`/api/lab5/todos/\${todo.id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todo.title }),
    });
    await load();
  }
  async function removeTodo(id: string) {
    await fetch(\`/api/lab5/todos/\${id}\`, { method: "DELETE" });
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
}`}</CodeBlock>
        <p>
          The onChange spread is the same array-of-objects pattern as{" "}
          <SectionLink to="4.2.9" />. Save writes through HTTP so a
          refresh still sees the new title — until the server process
          restarts and the in-memory array reseeds:
        </p>
        <LiveDemo
          name="ClientCrud"
          file="app/labs/lab5/intermediates/5-4-3-ClientCrud.tsx"
          mode="styled"
        >
          <ClientCrud />
        </LiveDemo>
        <OnYourOwn>
          After Delete, if the
          response is not <code>ok</code>, leave the item on screen and
          show an error string instead of refetching a stale success.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab5/intermediates/5-4-3-ClientCrud.tsx, keep any delete-error handling I added. After a successful Save, set a sample savedId state to todo.id and display Saved {savedId} under the list. Do not remove my error string.`}
        >
          Ask the assistant to show a sample saved id — you still handle
          a failed delete:
        </WithAI>
      </Section>
    </Section>
  );
}
