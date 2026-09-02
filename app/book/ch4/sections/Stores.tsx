import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ContextExamples from "@/app/labs/lab4/context/ContextExamples";
import ZustandExamples from "@/app/labs/lab4/zustand/ZustandExamples";
import ReduxExamples from "@/app/labs/lab4/redux/ReduxExamples";

export default function Stores() {
  return (
    <>
      <Section id="sec-4-4" title="4.4 React Context">
        <p>
          Context lets a parent publish a value that any descendant can
          read without listing it on every component in between. That is
          the right tool for a theme, the signed-in user, or the current
          course id — data that is stable and read in a subtree. It is the
          wrong tool for a list that every keystroke rewrites: every
          consumer re-renders when the value changes. Put todos, modules,
          and courses in Zustand instead. Kambaz will use this same
          provider pattern for who is signed in (
          <SectionLink to="4.10.5" />
          ), not for the course list.
        </p>
        <p>
          The pattern is a context, a provider that holds{" "}
          <code>useState</code>, and a hook that throws if you forget the
          provider:
        </p>
        <CodeBlock
          language="tsx"
          name="CounterContext"
          file="app/labs/lab4/context/CounterContext.tsx"
        >{`"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CounterContextValue = {
  count: number;
  setCount: (count: number) => void;
};

const CounterContext = createContext<CounterContextValue | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(7);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  const value = useContext(CounterContext);
  if (!value) {
    throw new Error("useCounterContext must be used inside CounterProvider");
  }
  return value;
}`}</CodeBlock>
        <p>
          Two siblings can then share the counter without either receiving{" "}
          <code>count</code>{" "}as a prop:
        </p>
        <CodeBlock
          language="tsx"
          name="ContextCounterRead"
          file="app/labs/lab4/context/ContextCounterRead.tsx"
        >{`"use client";

import { useCounterContext } from "./CounterContext";

export default function ContextCounterRead() {
  const { count } = useCounterContext();
  return (
    <div id="wd-context-counter-read">
      <h3>Reader: {count}</h3>
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="ContextCounterWrite"
          file="app/labs/lab4/context/ContextCounterWrite.tsx"
        >{`"use client";

import { useCounterContext } from "./CounterContext";

export default function ContextCounterWrite() {
  const { count, setCount } = useCounterContext();
  return (
    <div id="wd-context-counter-write">
      <h3>Writer</h3>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-context-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-context-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="ContextExamples"
          file="app/labs/lab4/context/ContextExamples.tsx"
        >{`"use client";

import { CounterProvider } from "./CounterContext";
import ContextCounterRead from "./ContextCounterRead";
import ContextCounterWrite from "./ContextCounterWrite";

export default function ContextExamples() {
  return (
    <div id="wd-context-examples">
      <h2>React Context</h2>
      <p>
        Two siblings share one counter without the parent passing props
        through the middle.
      </p>
      <CounterProvider>
        <ContextCounterRead />
        <ContextCounterWrite />
      </CounterProvider>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="ContextExamples"
          file="app/labs/lab4/context/ContextExamples.tsx"
          mode="styled"
        >
          <ContextExamples />
        </LiveDemo>
        <p>
          Import <code>ContextExamples</code>{" "}from the Lab 4 page. Click
          Up in the writer and confirm the reader heading updates. The
          official{" "}
          <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
            Context
          </OfficialLink>{" "}
          guide covers the same provider / consumer split.
        </p>
        <OnYourOwn>
          Add a Reset control that sets the context count back to 7. Keep
          the Kambaz database out of Context — that list belongs in the
          Zustand store in <SectionLink to="4.5" />.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/context/ContextCounterWrite.tsx, keep any extra button I added. After Down, add a sample button id="wd-context-reset-click" that calls setCount(7). Do not put courses or todos in this context. Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset on the writer:
        </WithAI>

        <Section
          level={3}
          id="sec-4-4-2"
          title="4.4.2 Implementing a React Context Todo List (On Your Own)"
        >
          <p>
            The PDF asks you to rebuild the todo list with Context —
            the same CRUD you will later do with Redux and Zustand —
            so you can feel the difference. A{" "}
            <code>todosContext</code> holds the array and the add /
            update / delete functions. A{" "}
            <code>ReactContextTodoList</code> renders the list. Wrap
            it in the provider on a Context examples page.
          </p>
          <OnYourOwn>
            Implement <code>todosContext.ts</code> and{" "}
            <code>ReactContextTodoList.tsx</code>. Add, edit titles,
            and delete items. Do not put Kambaz courses in this
            context.
          </OnYourOwn>
          <WithAI
            prompt={`Create app/labs/lab4/context/todosContext.ts and ReactContextTodoList.tsx with add/update/delete for { id, title } todos, wrap the list in a provider, and import it from ContextExamples. Keep any extra context I already added. Do not store Kambaz courses here.`}
          >
            After you sketch the context, you can ask the assistant
            for a sample list — leave the design as yours:
          </WithAI>
        </Section>
      </Section>

      <Section id="sec-4-5" title="4.5 Zustand">
        <p>
          Zustand is a small store you import as a hook. There is no
          provider to wrap the tree, no action types, and no boilerplate
          slice file unless you want one. Components subscribe to the
          fields they read, so a todo title change does not have to
          re-render a counter. This is the store Kambaz will use for
          courses and modules in <SectionLink to="4.10" />, while the
          signed-in user lives in Context.
        </p>

        <Section
          level={3}
          id="sec-4-5-1"
          title="4.5.1 Zustand Counter"
        >
          <p>
            The store is created with <code>create</code>. State and
            functions live on the same object, and you select each field
            so the component re-renders only when that field changes:
          </p>
          <CodeBlock
            language="tsx"
            name="counterStore"
            file="app/labs/lab4/zustand/counterStore.ts"
          >{`"use client";

import { create } from "zustand";

type CounterStore = {
  count: number;
  up: () => void;
  down: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 7,
  up: () => set((state) => ({ count: state.count + 1 })),
  down: () => set((state) => ({ count: state.count - 1 })),
}));`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandCounter"
            file="app/labs/lab4/zustand/ZustandCounter.tsx"
          >{`"use client";

import { useCounterStore } from "./counterStore";

export default function ZustandCounter() {
  const count = useCounterStore((state) => state.count);
  const up = useCounterStore((state) => state.up);
  const down = useCounterStore((state) => state.down);
  return (
    <div id="wd-zustand-counter">
      <h3>Zustand Counter: {count}</h3>
      <button
        type="button"
        onClick={up}
        id="wd-zustand-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={down}
        id="wd-zustand-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-5-2"
          title="4.5.2 Zustand Todo List"
        >
          <p>
            The todo list is the same CRUD you will apply to Kambaz
            courses: an array in the store, a draft object for the form,
            and functions that add, update, and delete.{" "}
            <code>ZustandTodoForm</code>{" "}and{" "}
            <code>ZustandTodoItem</code>{" "}do not receive those functions as
            props — they call the store hook themselves:
          </p>
          <CodeBlock
            language="tsx"
            name="todoStore"
            file="app/labs/lab4/zustand/todoStore.ts"
          >{`"use client";

import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type TodoStore = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
};

const emptyTodo: Todo = { id: "-1", title: "Learn Zustand", done: false };

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [
    { id: "1", title: "Learn HTML", done: true },
    { id: "2", title: "Learn CSS", done: true },
    { id: "3", title: "Learn JavaScript", done: false },
  ],
  todo: emptyTodo,
  setTodo: (todo) => set({ todo }),
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, { ...todo, id: crypto.randomUUID() }],
      todo: emptyTodo,
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
      todo: emptyTodo,
    })),
}));`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandTodoForm"
            file="app/labs/lab4/zustand/ZustandTodoForm.tsx"
          >{`"use client";

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
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandTodoItem"
            file="app/labs/lab4/zustand/ZustandTodoItem.tsx"
          >{`"use client";

import { useTodoStore, type Todo } from "./todoStore";

export default function ZustandTodoItem({ todo }: { todo: Todo }) {
  const setTodo = useTodoStore((state) => state.setTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  return (
    <li
      id={\`wd-zustand-todo-\${todo.id}\`}
      className="mb-1 flex items-center justify-between rounded border border-neutral-200 px-3 py-1"
    >
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={todo.done} readOnly />
        <span className={todo.done ? "line-through" : undefined}>{todo.title}</span>
      </label>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => setTodo(todo)}
          className="rounded bg-yellow-400 px-2 py-0.5 text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
        >
          Delete
        </button>
      </span>
    </li>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ZustandTodoList"
            file="app/labs/lab4/zustand/ZustandTodoList.tsx"
          >{`"use client";

import { useTodoStore } from "./todoStore";
import ZustandTodoForm from "./ZustandTodoForm";
import ZustandTodoItem from "./ZustandTodoItem";

export default function ZustandTodoList() {
  const todos = useTodoStore((state) => state.todos);
  return (
    <div id="wd-zustand-todo-list">
      <h3>Zustand Todo List</h3>
      <ZustandTodoForm />
      <ul className="m-0 max-w-lg list-none p-0">
        {todos.map((todo) => (
          <ZustandTodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
          <p>
            Gather the counter and list in{" "}
            <code>ZustandExamples</code>{" "}and import that from Lab 4:
          </p>
          <CodeBlock
            language="tsx"
            name="ZustandExamples"
            file="app/labs/lab4/zustand/ZustandExamples.tsx"
          >{`"use client";

import ZustandCounter from "./ZustandCounter";
import ZustandTodoList from "./ZustandTodoList";

export default function ZustandExamples() {
  return (
    <div id="wd-zustand-examples">
      <h2>Zustand</h2>
      <ZustandCounter />
      <ZustandTodoList />
      <hr />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ZustandExamples"
            file="app/labs/lab4/zustand/ZustandExamples.tsx"
            mode="styled"
          >
            <ZustandExamples />
          </LiveDemo>
          <p>
            Add a todo, click Edit, change the title, click Update, then
            Delete. Confirm the list redraws without props from a parent.
            See the{" "}
            <OfficialLink href="https://zustand.docs.pmnd.rs/">
              Zustand documentation
            </OfficialLink>{" "}
            for selectors and the <code>set</code>{" "}API.
          </p>
          <OnYourOwn>
            Add a <code>toggleDone(id)</code>{" "}function to the store and a
            checkbox in <code>ZustandTodoItem</code>{" "}that calls it instead
            of a read-only box.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/zustand/todoStore.ts and ZustandTodoItem.tsx, keep any extra function I added. Add a sample toggleDone(id: string) that maps todos and flips done for the matching id. Wire the item checkbox onChange to toggleDone(todo.id). Do not rename my personal function.`}
          >
            Ask the assistant to add a sample toggle after your own extra
            action:
          </WithAI>
        </Section>
      </Section>

      <Section id="sec-4-6" title="4.6 Redux Toolkit">
        <p>
          The PDF&apos;s 4.3 is <strong>Managing Application State
          with Redux</strong>: install, a Hello reducer, a counter that
          dispatches events, passing data to a reducer, then a todo
          list split into form / item / list. Those labs are here so
          the spine is complete. You will not port Kambaz to Redux —
          Zustand holds courses and modules, Context holds who is
          signed in — but you should be able to read a slice when you
          meet one.
        </p>
        <p>
          <code>useState</code> stays inside a component. Lifting it
          through many parents creates an explicit dependency on every
          file in the chain. Redux puts that state in a store any
          subscribed component can read.
        </p>

        <Section
          level={3}
          id="sec-4-6-1"
          title="4.6.1 Installing Redux and a Hello World reducer"
        >
          <p>
            You already ran{" "}
            <code>npm install @reduxjs/toolkit react-redux</code> in{" "}
            <SectionLink to="4.2" />. A Hello reducer is a store
            field with no actions — proof the provider and selector
            are wired:
          </p>
          <CodeBlock
            language="tsx"
            name="helloReducer"
            file="app/labs/lab4/redux/helloReducer.ts"
          >{`"use client";
import { createSlice } from "@reduxjs/toolkit";
const helloSlice = createSlice({
  name: "hello",
  initialState: { message: "Hello Redux" },
  reducers: {},
});
export default helloSlice.reducer;`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="HelloRedux"
            file="app/labs/lab4/redux/HelloRedux.tsx"
          >{`"use client";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function HelloRedux() {
  const { message } = useSelector((state: RootState) => state.helloReducer);
  return (
    <div id="wd-hello-redux">
      <h3>Hello Redux</h3>
      <h4>{message}</h4>
    </div>
  );
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-6-2"
          title="4.6.2 Counter Redux — dispatching events to reducers"
        >
        <p>
          A slice groups a piece of state with the functions that update
          it. Inside those functions you may write what looks like a
          mutation; Immer (bundled with Toolkit) turns it into a new
          object. The counter you already built with{" "}
          <code>useState</code> becomes <code>up</code> and{" "}
          <code>down</code> actions:
        </p>
        <CodeBlock
          language="tsx"
          name="counterReducer"
          file="app/labs/lab4/redux/counterReducer.ts"
        >{`"use client";

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 7 },
  reducers: {
    up: (state) => {
      state.count += 1;
    },
    down: (state) => {
      state.count -= 1;
    },
  },
});

export const { up, down } = counterSlice.actions;
export default counterSlice.reducer;`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="store"
          file="app/labs/lab4/redux/store.ts"
        >{`"use client";

import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./helloReducer";
import counterReducer from "./counterReducer";
import addReducer from "./addReducer";
import todosReducer from "./todosReducer";

export const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
    addReducer,
    todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`}</CodeBlock>
        <p>
          Unlike Zustand, Redux needs a <code>Provider</code>{" "}around the
          components that call <code>useSelector</code>. Wrap the demo in
          that provider so Lab 4 does not have to wrap the whole page:
        </p>
        <CodeBlock
          language="tsx"
          name="CounterRedux"
          file="app/labs/lab4/redux/CounterRedux.tsx"
        >{`"use client";

import { useDispatch, useSelector } from "react-redux";
import { down, up } from "./counterReducer";
import type { RootState } from "./store";

export default function CounterRedux() {
  const { count } = useSelector((state: RootState) => state.counterReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-redux-counter">
      <h3>Redux Counter: {count}</h3>
      <button
        type="button"
        onClick={() => dispatch(up())}
        id="wd-redux-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => dispatch(down())}
        id="wd-redux-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Add a <code>reset</code> reducer that sets{" "}
            <code>count</code> back to 7, export it from the slice,
            and dispatch it from a button.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab4/redux/counterReducer.ts and CounterRedux.tsx, keep any extra reducer I added. Add a sample reset reducer that sets state.count = 7, export it, and add a button id="wd-redux-reset-click" that dispatches reset(). Do not rename my personal reducer.`}
          >
            Ask the assistant to add a sample Reset after your own extra
            action:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-4-6-3"
          title="4.6.3 Passing Data to Reducers"
        >
          <p>
            Actions can carry a payload. Keep <code>a</code> and{" "}
            <code>b</code> as local <code>useState</code>, then
            dispatch one object to an <code>add</code> reducer that
            writes <code>sum</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="addReducer"
            file="app/labs/lab4/redux/addReducer.ts"
          >{`"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const addSlice = createSlice({
  name: "add",
  initialState: { sum: 0 },
  reducers: {
    add: (state, action: PayloadAction<{ a: number; b: number }>) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});
export const { add } = addSlice.actions;
export default addSlice.reducer;`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-6-4"
          title="4.6.4 Implementing a Todo List with Redux"
        >
          <p>
            The PDF builds the list with <code>useState</code> first,
            then splits form / item / list, then moves the array into
            a todos reducer. The worked example here is already split:
            a slice with <code>addTodo</code>,{" "}
            <code>deleteTodo</code>, and <code>updateTodo</code>, and
            a component that dispatches those actions. That is the
            same CRUD Kambaz will do — this book does it with Zustand
            in <SectionLink to="4.10" />.
          </p>
          <CodeBlock
            language="tsx"
            name="ReduxExamples"
            file="app/labs/lab4/redux/ReduxExamples.tsx"
          >{`"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import HelloRedux from "./HelloRedux";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import ReduxTodos from "./ReduxTodos";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div id="wd-redux-examples">
        <h2>Redux Toolkit</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
        <ReduxTodos />
        <hr />
      </div>
    </Provider>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ReduxExamples"
            file="app/labs/lab4/redux/ReduxExamples.tsx"
            mode="styled"
          >
            <ReduxExamples />
          </LiveDemo>
          <p>
            Hello, counter, add-with-payload, and todos share one
            store and one <code>Provider</code>. That extra setup is
            why this course puts Kambaz on Zustand. The{" "}
            <OfficialLink href="https://redux-toolkit.js.org/">
              Redux Toolkit
            </OfficialLink>{" "}
            quick start matches this slice-and-store shape.
          </p>
          <OnYourOwn>
            Split <code>ReduxTodos</code> into a form component and
            an item component, as the PDF does in 4.3.5.1.
          </OnYourOwn>
        </Section>
      </Section>
    </>
  );
}
