import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import Classes from "@/app/labs/lab3/Classes";
import Styles from "@/app/labs/lab3/Styles";
import ClientComponentDemo from "@/app/labs/lab3/ClientComponentDemo";
import ServerComponentDemo from "@/app/labs/lab3/ServerComponentDemo";
import Add from "@/app/labs/lab3/Add";
import Square from "@/app/labs/lab3/Square";
import Highlight from "@/app/labs/lab3/Highlight";
import PathParameters from "@/app/labs/lab3/PathParameters";
import TodoList from "@/app/labs/lab3/todos/TodoList";
import Link from "next/link";

export default function StylingAndComponents() {
  return (
    <>
      <Section id="sec-3-5" title="3.5 Dynamic Styling">
        <p>
          <ChapterLink to={2} />{" "}styled tags with CSS files and Tailwind
          classes. JavaScript can choose those classes — or a style object —
          at render time, so the look follows the data.
        </p>

        <Section
          level={3}
          id="sec-3-5-1"
          title="3.5.1 Working with HTML Classes"
        >
          <p>
            Start with static classes, then build the class name from a
            variable, then pick a class with a ternary. Create{" "}
            <code>Classes.css</code>{" "}and <code>Classes.tsx</code>{" "}in{" "}
            <code>app/labs/lab3</code>:
          </p>
          <CodeBlock
            language="css"
            name="Classes styles"
            file="app/labs/lab3/Classes.css"
          >{`.wd-bg-yellow {
  background-color: lightyellow;
}
.wd-bg-blue {
  background-color: lightblue;
}
.wd-bg-red {
  background-color: lightcoral;
}
.wd-bg-green {
  background-color: lightgreen;
}
.wd-fg-black {
  color: black;
}
.wd-padding-10px {
  padding: 10px;
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="Classes"
            file="app/labs/lab3/Classes.tsx"
          >{`import "./Classes.css";

export default function Classes() {
  const color = "blue";
  const dangerous = true;
  return (
    <div id="wd-classes">
      <h2>Classes</h2>
      <div className="wd-bg-yellow wd-fg-black wd-padding-10px">
        Yellow background
      </div>
      <div className="wd-bg-blue wd-fg-black wd-padding-10px">
        Blue background
      </div>
      <div className="wd-bg-red wd-fg-black wd-padding-10px">
        Red background
      </div>
      <div className={\`wd-bg-\${color} wd-fg-black wd-padding-10px\`}>
        Dynamic Blue background
      </div>
      <div
        className={\`\${dangerous ? "wd-bg-red" : "wd-bg-green"} wd-fg-black wd-padding-10px\`}
      >
        Dangerous background
      </div>
      <hr />
    </div>
  );
}`}</CodeBlock>
          <p>
            Importing <code>Classes.css</code>{" "}loads the rules. The fourth
            box concatenates <code>wd-bg-</code>{" "}with the{" "}
            <code>color</code>{" "}constant. The fifth box picks{" "}
            <code>wd-bg-red</code>{" "}or <code>wd-bg-green</code>{" "}from{" "}
            <code>dangerous</code>. Flip that flag to see the background
            change:
          </p>
          <LiveDemo
            mode="styled"
            name="Classes"
            file="app/labs/lab3/Classes.tsx"
          >
            <Classes />
          </LiveDemo>
          <p>
            <strong>On your own.</strong>{" "}Set <code>color</code>{" "}to{" "}
            <code>&quot;yellow&quot;</code>{" "}and <code>dangerous</code>{" "}to{" "}
            <code>false</code>, confirm the last two boxes change, then
            restore the values above.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-3-5-2"
          title="3.5.2 Working with the Style Attribute"
        >
          <p>
            The JSX <code>style</code>{" "}attribute takes a JavaScript object
            of camelCase CSS properties — the same object you used in{" "}
            <SectionLink to="2.1.1" />. Spread smaller objects into larger
            ones so padding and color are reused. Create{" "}
            <code>Styles.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="Styles"
            file="app/labs/lab3/Styles.tsx"
          >{`export default function Styles() {
  const colorBlack = { color: "black" };
  const padding10px = { padding: "10px" };
  const bgBlue = {
    backgroundColor: "lightblue",
    color: "black",
    ...padding10px,
  };
  const bgRed = {
    backgroundColor: "lightcoral",
    ...colorBlack,
    ...padding10px,
  };
  return (
    <div id="wd-styles">
      <h2>Styles</h2>
      <div
        style={{
          backgroundColor: "lightyellow",
          color: "black",
          padding: "10px",
        }}
      >
        Yellow background
      </div>
      <div style={bgRed}>Red background</div>
      <div style={bgBlue}>Blue background</div>
    </div>
  );
}`}</CodeBlock>
          <p>
            Double curly braces on the yellow box are one pair to enter a
            JSX expression and one pair for the object literal. The red and
            blue boxes pass a named object instead:
          </p>
          <LiveDemo mode="styled" name="Styles" file="app/labs/lab3/Styles.tsx">
            <Styles />
          </LiveDemo>
          <p>
            <strong>On your own.</strong>{" "}Declare a <code>bgGreen</code>{" "}
            object (spread <code>colorBlack</code>{" "}and{" "}
            <code>padding10px</code>) and apply it to a fourth box.
          </p>
        </Section>

        <Section level={3} id="sec-3-5-3" title="3.5.3 Exercises">
          <p>
            Confirm Lab 3 covers dynamic styling in{" "}
            <SectionLink to="3.5" />.
          </p>
          <ol>
            <li>
              Create <code>Classes.css</code>{" "}and <code>Classes.tsx</code>{" "}
              with static, concatenated, and ternary class names (3.5.1).
            </li>
            <li>
              Create <code>Styles.tsx</code>{" "}with inline and spread style
              objects (3.5.2).
            </li>
          </ol>
        </Section>
      </Section>

      <Section
        id="sec-3-6"
        title="3.6 Client and Server Components"
      >
        <p>
          Next.js components run on the server by default. They can read
          files and environment variables, then send HTML to the browser.
          They cannot use browser APIs, React state, or hooks such as{" "}
          <code>usePathname</code>. Add{" "}
          <code>&quot;use client&quot;</code>{" "}at the top of a file to opt
          into a <strong>Client Component</strong> that runs in the
          browser.
        </p>

        <Section
          level={3}
          id="sec-3-6-1"
          title="3.6.1 Client Components"
        >
          <p>
            The directive must be the first statement in the file. Without
            it, <code>usePathname</code>{" "}fails at build or render time
            because that hook is not available on the server. Create{" "}
            <code>ClientComponentDemo.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientComponentDemo"
            file="app/labs/lab3/ClientComponentDemo.tsx"
          >{`"use client";

import { usePathname } from "next/navigation";

export default function ClientComponentDemo() {
  const pathname = usePathname();
  return (
    <div id="wd-client-component-demo">
      <h1>Client Component Demo</h1>
      <p>Current pathname: {pathname}</p>
    </div>
  );
}`}</CodeBlock>
          <p>
            Embedded in this book page, the pathname is the book route.
            Open it from <LocalUrl href="/labs/lab3" />{" "}to see{" "}
            <code>/labs/lab3</code>:
          </p>
          <LiveDemo
            name="ClientComponentDemo"
            file="app/labs/lab3/ClientComponentDemo.tsx"
          >
            <ClientComponentDemo />
          </LiveDemo>
          <p>
            <strong>On your own.</strong>{" "}Temporarily remove{" "}
            <code>&quot;use client&quot;</code>{" "}and confirm the error,
            then put the directive back.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-3-6-2"
          title="3.6.2 Server Components"
        >
          <p>
            Omit <code>&quot;use client&quot;</code>{" "}and the file stays a
            Server Component. It can import <code>node:fs</code>{" "}and read{" "}
            <code>process</code>. Adding the client directive would make
            those APIs unavailable. Create{" "}
            <code>ServerComponentDemo.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerComponentDemo"
            file="app/labs/lab3/ServerComponentDemo.tsx"
          >{`import fs from "node:fs";
import path from "node:path";

export default function ServerComponentDemo() {
  const platform = process.platform;
  const nodeVersion = process.version;
  const serverRenderTime = new Date().toLocaleTimeString();
  const lab3Dir = path.join(process.cwd(), "app/labs/lab3");
  let files: string[] = [];
  try {
    files = fs.readdirSync(lab3Dir);
  } catch (error) {
    console.error("Error reading lab3 directory:", error);
    files = [];
  }
  return (
    <div id="wd-server-component-demo">
      <h1>Server Component Demo</h1>
      <h2>Server Render Time</h2>
      <p>Rendered on server at: {serverRenderTime}</p>
      <h2>Server Information</h2>
      <pre>
        {JSON.stringify({ platform, nodeVersion, serverRenderTime }, null, 2)}
      </pre>
      <h2>Filesystem Access Demo</h2>
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}`}</CodeBlock>
          <p>
            The file list is whatever sits in{" "}
            <code>app/labs/lab3</code>{" "}on the machine that rendered this
            page — a capability the browser does not have:
          </p>
          <LiveDemo
            name="ServerComponentDemo"
            file="app/labs/lab3/ServerComponentDemo.tsx"
          >
            <ServerComponentDemo />
          </LiveDemo>
          <p>
            Import both demos into Lab 3. A useful mental box: server
            components fetch and format data; client components handle
            hooks, clicks, and anything that reads the address bar.
          </p>
          <p>
            The <code>try</code>/<code>catch</code>{" "}around{" "}
            <code>readdirSync</code>{" "}is how JavaScript handles a call that
            might throw. If the folder is missing, the{" "}
            <code>catch</code>{" "}logs the error and leaves{" "}
            <code>files</code>{" "}as an empty array instead of crashing the
            page. Use this pattern whenever Node I/O — and later, a network
            call — can fail.
          </p>
          <p>
            <strong>On your own.</strong>{" "}Log one extra{" "}
            <code>process</code>{" "}field (for example{" "}
            <code>process.arch</code>) into the JSON the component
            stringifies.
          </p>
        </Section>

        <Section level={3} id="sec-3-6-3" title="3.6.3 Exercises">
          <p>
            Confirm Lab 3 includes both a client demo and a server demo
            from <SectionLink to="3.6" />. Import each component into{" "}
            <code>app/labs/lab3/page.tsx</code>. Complete each
            section&apos;s <strong>On your own</strong>{" "}prompt as well.
          </p>
          <ol>
            <li>
              Create <code>ClientComponentDemo.tsx</code>{" "}with{" "}
              <code>&quot;use client&quot;</code>{" "}as the first statement
              and <code>usePathname</code>{" "}from{" "}
              <code>next/navigation</code>{" "}(3.6.1).
            </li>
            <li>
              Create <code>ServerComponentDemo.tsx</code>{" "}with no client
              directive. Read <code>process.platform</code>{" "}and{" "}
              <code>process.version</code>, and list files in{" "}
              <code>app/labs/lab3</code>{" "}with <code>node:fs</code>{" "}
              (3.6.2). Keep the <code>try</code>/<code>catch</code>{" "}
              around <code>readdirSync</code>.
            </li>
            <li>
              Import both demos into <code>page.tsx</code>{" "}and confirm
              the client demo shows the Lab 3 pathname while the server
              demo shows a file list the browser could not have produced.
            </li>
          </ol>
        </Section>
      </Section>

      <Section id="sec-3-7" title="3.7 Parameterizing Components">
        <p>
          HTML attributes become a props object. Destructure{" "}
          <code>a</code>{" "}and <code>b</code>{" "}from that object — the same
          parameter destructuring as <SectionLink to="3.4.15" />. Create{" "}
          <code>Add.tsx</code>{" "}and render{" "}
          <code>{`<Add a={3} b={4} />`}</code>{" "}from Lab 3:
        </p>
        <CodeBlock
          language="tsx"
          name="Add"
          file="app/labs/lab3/Add.tsx"
        >{`export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>
      a = {a}
      b = {b}
      <br />
      a + b = {a + b}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The braces around <code>3</code>{" "}and <code>4</code>{" "}pass
          numbers, not the strings <code>&quot;3&quot;</code>{" "}and{" "}
          <code>&quot;4&quot;</code>. The sum is <code>7</code>:
        </p>
        <LiveDemo name="Add" file="app/labs/lab3/Add.tsx">
          <Add a={3} b={4} />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Render a second{" "}
          <code>{`<Add a={10} b={20} />`}</code>{" "}on the Lab 3 page and
          confirm it prints <code>30</code>.
        </p>

        <Section
          level={3}
          id="sec-3-7-1"
          title="3.7.1 Child Components"
        >
          <p>
            Props are not the only channel. Content between a
            component&apos;s opening and closing tags arrives as{" "}
            <code>children</code> — the same pattern as wrapping a
            paragraph in <code>&lt;h1&gt;</code>. Create{" "}
            <code>Square.tsx</code>{" "}that treats its children as a number:
          </p>
          <CodeBlock
            language="tsx"
            name="Square"
            file="app/labs/lab3/Square.tsx"
          >{`import { ReactNode } from "react";

export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}`}</CodeBlock>
          <p>
            On the Lab 3 page, render{" "}
            <code>{`<Square>4</Square>`}</code>{" "}under a heading. The child
            text <code>4</code>{" "}becomes <code>16</code>:
          </p>
          <LiveDemo name="Square" file="app/labs/lab3/Square.tsx">
            <p>
              Square of 4 = <Square>4</Square>
            </p>
          </LiveDemo>
          <p>
            <code>Highlight</code>{" "}wraps arbitrary children in a yellow
            span with red text — formatting, not arithmetic:
          </p>
          <CodeBlock
            language="tsx"
            name="Highlight"
            file="app/labs/lab3/Highlight.tsx"
          >{`import { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <span
      id="wd-highlight"
      style={{ backgroundColor: "yellow", color: "red" }}
    >
      {children}
    </span>
  );
}`}</CodeBlock>
          <LiveDemo name="Highlight" file="app/labs/lab3/Highlight.tsx">
            <Highlight>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Highlight>
          </LiveDemo>
          <p>
            <strong>On your own.</strong>{" "}Wrap a sentence of your own in{" "}
            <code>Highlight</code>{" "}on the Lab 3 page, and render{" "}
            <code>{`<Square>9</Square>`}</code>{" "}next to the square of 4.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-3-7-2"
          title="3.7.2 Working with the Pathname"
        >
          <p>
            <code>usePathname</code>{" "}returns the current URL path so
            navigation can highlight the active screen. The Labs table of
            contents is already a client component: it maps a{" "}
            <code>LINKS</code>{" "}array and applies Tailwind classes when a
            link&apos;s <code>match</code>{" "}function says the pathname
            belongs to that lab — no Bootstrap <code>Nav</code>{" "}pills. Read
            the file you already maintain:
          </p>
          <CodeBlock
            language="tsx"
            name="TOC"
            file="app/labs/TOC.tsx"
          >{`"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/labs", id: "wd-home-link", label: "Home", match: (p: string) => p === "/labs" },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1", match: (p: string) => p.endsWith("/lab1") || p.includes("/lab1/") },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2", match: (p: string) => p.includes("/lab2") },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3", match: (p: string) => p.includes("/lab3") },
  { href: "/", id: "wd-kambaz-link", label: "Kambaz", match: () => false },
] as const;

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            id={link.id}
            className={
              link.match(pathname)
                ? "rounded bg-blue-600 px-2 py-0.5 text-white no-underline"
                : undefined
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/labs/lab1/intermediates" id="wd-lab1-intermediates-link">
          Lab 1 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch1" id="wd-book-ch1-link">
          Book Ch1
        </Link>
      </li>
      <li>
        <Link href="/labs/lab2/intermediates" id="wd-lab2-intermediates-link">
          Lab 2 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch2" id="wd-book-ch2-link">
          Book Ch2
        </Link>
      </li>
      <li>
        <Link href="/labs/lab3/intermediates" id="wd-lab3-intermediates-link">
          Lab 3 Steps
        </Link>
      </li>
      <li>
        <Link href="/book/ch3" id="wd-book-ch3-link">
          Book Ch3
        </Link>
      </li>
    </ul>
  );
}`}</CodeBlock>
          <p>
            The file starts with <code>&quot;use client&quot;</code>{" "}because{" "}
            <code>usePathname</code>{" "}reads the address bar. Each mapped{" "}
            <code>Link</code>{" "}uses <code>key={"{link.id}"}</code>. Visit{" "}
            <LocalUrl href="/labs/lab3" />{" "}and confirm the Lab 3 item
            picks up the blue pill classes; Lab 1 and Lab 2 should do the
            same on their routes.
          </p>
          <p>
            <strong>On your own.</strong>{" "}If Lab 3 is not yet in{" "}
            <code>LINKS</code>, add it with a <code>match</code>{" "}that
            uses <code>includes(&quot;/lab3&quot;)</code>, and confirm the
            highlight follows you between labs.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-3-7-3"
          title="3.7.3 Encoding Path Parameters"
        >
          <p>
            Dynamic folders in the App Router —{" "}
            <code>[a]</code>{" "}and <code>[b]</code> — capture path segments
            as parameters. A client page reads them with{" "}
            <code>useParams</code>. Create{" "}
            <code>app/labs/lab3/add/[a]/[b]/page.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="AddPathParameters"
            file="app/labs/lab3/add/[a]/[b]/page.tsx"
          >{`"use client";

import { useParams } from "next/navigation";

export default function AddPathParameters() {
  const { a, b } = useParams();
  return (
    <div id="wd-add-path-parameters">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}`}</CodeBlock>
          <p>
            Path values are strings (or string arrays), so{" "}
            <code>parseInt</code>{" "}turns them into numbers. Link to that
            route from a <code>PathParameters</code>{" "}component you import
            into Lab 3:
          </p>
          <CodeBlock
            language="tsx"
            name="PathParameters"
            file="app/labs/lab3/PathParameters.tsx"
          >{`import Link from "next/link";

export default function PathParameters() {
  return (
    <div id="wd-path-parameters">
      <h2>Path Parameters</h2>
      <Link href="/labs/lab3/add/1/2">1 + 2</Link>
      <br />
      <Link href="/labs/lab3/add/3/4">3 + 4</Link>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="PathParameters"
            file="app/labs/lab3/PathParameters.tsx"
          >
            <PathParameters />
          </LiveDemo>
          <p>
            Click <Link href="/labs/lab3/add/1/2">1 + 2</Link>{" "}and confirm
            the URL is <code>/labs/lab3/add/1/2</code>{" "}and the page prints{" "}
            <code>1 + 2 = 3</code>. The second link should print{" "}
            <code>3 + 4 = 7</code>.
          </p>
          <p>
            <strong>On your own.</strong>{" "}Add a third link that encodes two
            numbers of your choice and confirm the add page sums them.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-3-7-4"
          title="3.7.4 Rendering a Data Structure"
        >
          <p>
            Arrays, JSON, <code>map</code>, keys, default parameters, and
            parameterized components come together as a todo list — still
            throwaway Lab 3 code, now combining the ideas instead of
            introducing a new one. In{" "}
            <code>app/labs/lab3/todos</code>, create{" "}
            <code>TodoItem.tsx</code>{" "}that receives one todo as a prop.
            The <code>todo = {"{ … }"}</code>{" "}in the parameter list is a{" "}
            <strong>default parameter</strong>{" "}(
            <SectionLink to="3.4.15" />
            ): if the parent omits <code>todo</code>, the milk item is
            used.
          </p>
          <CodeBlock
            language="tsx"
            name="TodoItem"
            file="app/labs/lab3/todos/TodoItem.tsx"
          >{`type Todo = {
  done: boolean;
  title: string;
  status: string;
};

const TodoItem = ({
  todo = { done: true, title: "Buy milk", status: "COMPLETED" },
}: {
  todo?: Todo;
}) => {
  return (
    <li className="flex items-center gap-2 border-b py-1">
      <input type="checkbox" className="me-2" defaultChecked={todo.done} />
      {todo.title} ({todo.status})
    </li>
  );
};

export default TodoItem;`}</CodeBlock>
          <p>
            Store the list next to the component as JSON. Next.js lets you
            import JSON as a value:
          </p>
          <CodeBlock
            language="json"
            name="todos"
            file="app/labs/lab3/todos/todos.json"
          >{`[
  { "title": "Buy milk", "status": "CANCELED", "done": true },
  { "title": "Pickup the kids", "status": "IN PROGRESS", "done": false },
  { "title": "Walk the dog", "status": "DEFERRED", "done": false }
]`}</CodeBlock>
          <p>
            <code>TodoList</code>{" "}maps that array onto{" "}
            <code>TodoItem</code>, using <code>todo.title</code>{" "}as the{" "}
            <code>key</code>{" "}(
            <SectionLink to="3.4.4" />
            ) because the titles are unique in this file:
          </p>
          <CodeBlock
            language="tsx"
            name="TodoList"
            file="app/labs/lab3/todos/TodoList.tsx"
          >{`import TodoItem from "./TodoItem";
import todos from "./todos.json";

export default function TodoList() {
  return (
    <>
      <h3>Todo List</h3>
      <ul className="list-none p-0">
        {todos.map((todo) => (
          <TodoItem key={todo.title} todo={todo} />
        ))}
      </ul>
      <hr />
    </>
  );
}`}</CodeBlock>
          <p>
            Import <code>TodoList</code>{" "}into Lab 3. Each row is a checkbox
            whose default matches <code>todo.done</code>:
          </p>
          <LiveDemo name="TodoList" file="app/labs/lab3/todos/TodoList.tsx">
            <TodoList />
          </LiveDemo>
          <p>
            <strong>On your own.</strong>{" "}Add a fourth object to{" "}
            <code>todos.json</code>{" "}with a unique title and confirm a
            fourth row appears — then put a <code>key</code>{" "}on every
            mapped <code>TodoItem</code>{" "}if it is missing. Log the{" "}
            <code>todos</code>{" "}array from <code>TodoList.tsx</code>{" "}and
            confirm the objects appear in the console (
            <SectionLink to="3.4.12" />
            ).
          </p>
        </Section>

        <Section level={3} id="sec-3-7-5" title="3.7.5 Exercises">
          <p>
            Confirm Lab 3 covers parameterization in{" "}
            <SectionLink to="3.7" />. Complete each section&apos;s{" "}
            <strong>On your own</strong>{" "}prompt as well.
          </p>
          <ol>
            <li>
              Create <code>Add.tsx</code>{" "}and render{" "}
              <code>{`<Add a={3} b={4} />`}</code>{" "}from{" "}
              <code>page.tsx</code>{" "}(3.7).
            </li>
            <li>
              Create <code>Square.tsx</code>{" "}and{" "}
              <code>Highlight.tsx</code>{" "}that wrap{" "}
              <code>children</code>{" "}(3.7.1).
            </li>
            <li>
              Highlight the active lab in <code>app/labs/TOC.tsx</code>{" "}
              with <code>usePathname</code>{" "}and Tailwind{" "}
              <code>className</code>{" "}(3.7.2).
            </li>
            <li>
              Create the <code>add/[a]/[b]</code>{" "}page and{" "}
              <code>PathParameters.tsx</code>{" "}links (3.7.3).
            </li>
            <li>
              Create <code>todos/TodoItem.tsx</code>{" "}with a default{" "}
              <code>todo</code>{" "}prop, <code>todos/todos.json</code>{" "}with
              at least three items, and <code>todos/TodoList.tsx</code>{" "}
              that maps with <code>key={"{todo.title}"}</code>{" "}(3.7.4).
            </li>
          </ol>
        </Section>
      </Section>
    </>
  );
}
