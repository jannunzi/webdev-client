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
import { Suspense } from "react";
import PathnameDemo from "@/app/labs/lab3/client-apis/PathnameDemo";
import SearchParamsDemo from "@/app/labs/lab3/client-apis/SearchParamsDemo";
import WindowDemo from "@/app/labs/lab3/client-apis/WindowDemo";
import GeolocationDemo from "@/app/labs/lab3/client-apis/GeolocationDemo";
import MapEmbed from "@/app/labs/lab3/client-apis/MapEmbed";
import ClientIpDemo from "@/app/labs/lab3/client-apis/ClientIpDemo";
import ServerTimeDemo from "@/app/labs/lab3/server-apis/ServerTimeDemo";
import OsDemo from "@/app/labs/lab3/server-apis/OsDemo";
import EnvDemo from "@/app/labs/lab3/server-apis/EnvDemo";
import ChildProcessDemo from "@/app/labs/lab3/server-apis/ChildProcessDemo";
import Add from "@/app/labs/lab3/Add";
import Square from "@/app/labs/lab3/Square";
import Highlight from "@/app/labs/lab3/Highlight";
import PathParameters from "@/app/labs/lab3/PathParameters";
import TodoList from "@/app/labs/lab3/todos/TodoList";
import Link from "next/link";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH3_LAB_EXERCISES } from "../../exercise-lists/catalogs";

export default function StylingAndComponents() {
  return (
    <>
      <Section id="sec-3-5" title="3.5 Dynamic Styling">
        <p>
          <ChapterLink to={2} />{" "}styled tags with CSS files and Tailwind
          classes. React can generate content dynamically based on
          algorithms written in JavaScript, and we can also dynamically
          style that content by programmatically controlling the classes
          and styles applied to it so the look follows the data. In the
          next couple of exercises we first learn to work with classes and
          then with styles.
        </p>

        <Section
          level={3}
          id="sec-3-5-1"
          title="3.5.1 Working with HTML Classes"
        >
          <p>
            Let&apos;s start practicing simple things, like classes and
            styles. Start with static classes, then build the class name
            from a variable, then pick a class with a ternary. Under the{" "}
            <code>app/labs/lab3</code>{" "}folder, create a new component{" "}
            <code>Classes</code>{" "}with a matching styling file. From the
            Lab 3 component, import the new <code>Classes</code>{" "}
            component and confirm it renders as shown:
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
            Import <code>Classes</code>{" "}into <code>app/labs/lab3/page.tsx</code>{" "}and
            render it after <code>OptionalChaining</code>. The page does not
            import <code>Classes.css</code>; <code>Classes.tsx</code>{" "}does:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.5.1)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Set <code>color</code>{" "}to{" "}
            <code>&quot;yellow&quot;</code>{" "}and <code>dangerous</code>{" "}to{" "}
            <code>false</code>, confirm the last two boxes change, then
            restore the values above. Then add a box of your own after the
            fifth: a new <code>const</code>{" "}picks{" "}
            <code>wd-bg-green</code>{" "}or <code>wd-bg-yellow</code>{" "}with a
            ternary, and the box text names the color it shows. The
            Classes section then has six colored boxes.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/Classes.tsx, keep color as "blue" and dangerous as true. After the existing boxes, add a sixth div whose className uses a new const shade = "green" as \`wd-bg-\${shade} wd-fg-black wd-padding-10px\` and the text "Dynamic Green background". Do not flip color or dangerous.`}
          >
            Ask the assistant to add one more dynamic-class box, Dynamic
            Green background, after yours. The Classes section then has
            seven colored boxes, and <code>color</code>{" "}and{" "}
            <code>dangerous</code>{" "}keep their values:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-5-2"
          title="3.5.2 Working with the Style Attribute"
        >
          <p>
            In React, the <code>style</code>{" "}attribute accepts a
            JavaScript object where the properties are CSS properties —
            camelCase, the same object you used in{" "}
            <SectionLink to="2.1.1" /> — and the values are CSS values.
            Spread smaller objects into larger ones so padding and color
            are reused. To practice how this works, implement the{" "}
            <code>Styles</code>{" "}component below and then import it into
            the Lab 3 component. The component declares constant objects
            that can be applied to elements using the <code>style</code>{" "}
            attribute. Alternatively, the <code>style</code>{" "}attribute
            accepts an object literal, which results in a double
            curly-bracket syntax. Refresh the browser and confirm it
            renders as expected:
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
            Import <code>Styles</code>{" "}into <code>app/labs/lab3/page.tsx</code>{" "}and render
            it last:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.5.2)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Declare a <code>bgGreen</code>{" "}object with{" "}
            <code>backgroundColor: &quot;lightgreen&quot;</code>{" "}that
            spreads <code>colorBlack</code>{" "}and <code>padding10px</code>,
            and apply it to a fourth box with the text{" "}
            <code>Green background</code>. The Styles section then has four
            colored boxes.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/Styles.tsx, keep bgGreen if I already added it. After the existing boxes, add const bgGray = { backgroundColor: "lightgray", ...colorBlack, ...padding10px } and a fifth div style={bgGray} with the text "Gray background". Do not overwrite bgGreen.`}
          >
            Paste this prompt so the assistant adds a fifth box, Gray
            background. Your green box stays:
          </WithAI>
        </Section>
      </Section>

      <Section
        id="sec-3-6"
        title="3.6 Client and Server Components"
      >
        <p>
          In Next.js, all components are Server Components by default.
          This means they execute only on the server during rendering,
          producing HTML that is sent to the browser. Server Components
          are fast, secure, and can directly access server-only resources
          such as the filesystem or environment variables, but they cannot
          use browser-specific features like interactivity, state, or DOM
          APIs, including hooks such as <code>usePathname</code>. If you
          need interactivity or browser APIs, you must explicitly turn a
          component into a <strong>Client Component</strong>{" "}by adding{" "}
          <code>&quot;use client&quot;</code>{" "}at the top of the file.
          Client Components are still rendered once on the server to
          produce the first HTML, then hydrate and keep running in the
          browser. That is what allows hooks, event handlers, and browser
          globals — but they lose direct server access such as the
          filesystem. The two simple examples below highlight exactly what
          each side can and cannot do.
        </p>

        <Section
          level={3}
          id="sec-3-6-1"
          title="3.6.1 Client Components"
        >
          <p>
            This Client Component below is marked with the{" "}
            <code>&quot;use client&quot;</code>{" "}directive at the top.
            The directive must be the first statement in the file. Next.js
            still renders the component on the server for the first HTML
            (open View Source on <code>/labs/lab3</code>{" "}and you will find
            the pathname text there), then hydrates it so it keeps running
            in the browser. The directive is what allows client features
            such as hooks from <code>next/navigation</code>. In this
            example, the component uses the <code>usePathname()</code>{" "}
            hook to read the current route. Hooks like this only work in
            Client Components: remove the directive and{" "}
            <code>next dev</code>{" "}or <code>next build</code>{" "}stops with an
            error saying the hook needs <code>&quot;use client&quot;</code>.
            The code renders a simple heading and displays the current
            pathname. Create <code>ClientComponentDemo.tsx</code>, import it
            into Lab 3, and confirm it renders as shown:
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
            Import <code>ClientComponentDemo</code>{" "}into{" "}
            <code>app/labs/lab3/page.tsx</code>{" "}and render it last. The Lab 3 page itself
            stays a Server Component — no <code>&quot;use client&quot;</code>{" "}there —
            and it can still render a Client Component:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.6.1)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Temporarily remove <code>&quot;use client&quot;</code>{" "}and
            confirm the error, then put the directive back. Then add a
            second paragraph under the pathname that shows its length,{" "}
            <code>{`<p>Pathname length: {pathname.length}</p>`}</code>{" "}—
            on <code>/labs/lab3</code>{" "}it reads{" "}
            <code>Pathname length: 10</code>.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/ClientComponentDemo.tsx, keep "use client" as the first statement. After the pathname paragraph, add a second <p>Last segment: {pathname.split("/").pop()}</p>. Do not remove the directive.`}
          >
            Ask the assistant to show the last path segment. On{" "}
            <code>/labs/lab3</code>{" "}the new line reads{" "}
            <code>Last segment: lab3</code>:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-6-2"
          title="3.6.2 Server Components"
        >
          <p>
            By default, Next.js pages and components are Server Components
            and are marked by omitting the{" "}
            <code>&quot;use client&quot;</code>{" "}directive, making the
            file execute exclusively on the server. The server component
            below demonstrates server-only capabilities by accessing
            Node.js globals like the <code>process</code>{" "}object and using{" "}
            <code>fs.readdirSync()</code>{" "}to list files from{" "}
            <code>app/labs/lab3</code>{" "}on the server&apos;s filesystem.
            Adding <code>&quot;use client&quot;</code>{" "}would cause a
            build failure, as APIs like <code>process</code>{" "}and{" "}
            <code>fs</code>{" "}are unavailable in the browser environment.
            Create <code>ServerComponentDemo.tsx</code>, import it into
            Lab 3, and confirm it renders as shown:
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
            Import <code>ServerComponentDemo</code>{" "}into{" "}
            <code>app/labs/lab3/page.tsx</code>{" "}after <code>ClientComponentDemo</code>, so both
            demos are on the page:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.6.2)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
    </div>
  );
}`}</CodeBlock>
          <p>
            A useful mental box: server components fetch and format data;
            client components handle hooks, clicks, and anything that reads
            the address bar.
          </p>
          <p>
            On your Vercel deployment, Lab 3 is prerendered when the site
            is built, so the render time and the file list show the moment
            of the build and don&apos;t change on refresh. In{" "}
            <code>npm run dev</code>{" "}the page renders on every request, so
            the time updates there.
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
          <OnYourOwn>
            Add <code>process.arch</code>{" "}to the object the component
            stringifies, next to <code>platform</code>,{" "}
            <code>nodeVersion</code>, and <code>serverRenderTime</code>. The
            Server Information block then shows four keys, including{" "}
            <code>&quot;arch&quot;</code>.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/ServerComponentDemo.tsx, keep any extra process field I already added. Include process.pid in the JSON.stringify object next to platform, nodeVersion, and serverRenderTime. Do not remove my extra field or the try/catch around readdirSync.`}
          >
            Paste this prompt so the assistant adds <code>process.pid</code>{" "}
            to the sample JSON — leave your extra field as the personal bit:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-6-3"
          title="3.6.3 More Client-Only APIs"
        >
          <p>
            <SectionLink to="3.6.1" />{" "}used one client-only hook. The browser offers many more features that exist only on the user&apos;s machine. An <strong>API</strong>{" "}(application programming interface) is a set of functions and objects a program can call; a <strong>client-only API</strong>{" "}is one that exists only in the browser, so only a Client Component can call it. In this section you build six small Client Components, one concept each, in a new folder <code>app/labs/lab3/client-apis</code>. They all go on their own page, <code>/labs/lab3/client-apis</code>, so the main Lab 3 page stays as it is. Add them one at a time and check each demo before moving on.
          </p>
          <h4 className="mt-6 font-semibold">Step 1: usePathname</h4>
          <p>
            A <strong>pathname</strong>{" "}is the part of the URL after the host and before any <code>?</code>, for example <code>/labs/lab3/client-apis</code>. A <strong>hook</strong>{" "}is a React function whose name starts with <code>use</code>{" "}and that may only be called at the top of a component. <code>usePathname()</code>{" "}from <code>next/navigation</code>{" "}returns the current pathname. This version also splits it into <strong>segments</strong>, the pieces between the slashes:
          </p>
          <CodeBlock
            language="tsx"
            name="PathnameDemo"
            file="app/labs/lab3/client-apis/PathnameDemo.tsx"
          >{`"use client";

import { usePathname } from "next/navigation";

export default function PathnameDemo() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");
  return (
    <div id="wd-pathname-demo">
      <h3>usePathname</h3>
      <p>Pathname: {pathname}</p>
      <p>Segments: {JSON.stringify(segments)}</p>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="PathnameDemo"
            file="app/labs/lab3/client-apis/PathnameDemo.tsx"
          >
            <PathnameDemo />
          </LiveDemo>
          <p>
            In this book the pathname is the book route; on your page it is <code>/labs/lab3/client-apis</code>{" "}and the segments are <code>[&quot;labs&quot;,&quot;lab3&quot;,&quot;client-apis&quot;]</code>.
          </p>
          <p>
            Render it from a new page at <code>app/labs/lab3/client-apis/page.tsx</code>{" "}and open <LocalUrl href="/labs/lab3/client-apis" />:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 1)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import PathnameDemo from "./PathnameDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 2: useSearchParams</h4>
          <p>
            The <strong>query string</strong>{" "}is the part of a URL after <code>?</code>, made of <code>name=value</code>{" "}pairs joined by <code>&amp;</code>, as in <code>?name=Alice</code>. Each pair is a <strong>search parameter</strong>. The <code>useSearchParams()</code>{" "}hook returns an object whose <code>get(&quot;name&quot;)</code>{" "}method reads one parameter, or <code>null</code>{" "}if it is missing; the <code>??</code>{" "}operator (<SectionLink to="3.4.17" />) supplies a default:
          </p>
          <CodeBlock
            language="tsx"
            name="SearchParamsDemo"
            file="app/labs/lab3/client-apis/SearchParamsDemo.tsx"
          >{`"use client";

import { useSearchParams } from "next/navigation";

export default function SearchParamsDemo() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "stranger";
  return (
    <div id="wd-search-params-demo">
      <h3>useSearchParams</h3>
      <p>Hello, {name}!</p>
      <p>Query string: {searchParams.toString() || "(empty)"}</p>
      <a href="?name=Alice">Say hi to Alice</a>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="SearchParamsDemo"
            file="app/labs/lab3/client-apis/SearchParamsDemo.tsx"
          >
            <Suspense fallback={<p>Loading query string...</p>}>
              <SearchParamsDemo />
            </Suspense>
          </LiveDemo>
          <p>
            Click the link and the greeting changes without a server round trip. <strong>Prerendering</strong>{" "}means Next.js builds a page&apos;s HTML ahead of time, at <code>next build</code>; at that moment there is no visitor and therefore no query string. So Next.js requires any component that calls <code>useSearchParams</code>{" "}on a prerendered page to sit inside a <code>&lt;Suspense&gt;</code>{" "}boundary. <code>Suspense</code>, imported from <code>react</code>, renders its <code>fallback</code>{" "}in the prerendered HTML and swaps in the real component once the browser knows the URL. Without it, <code>next build</code>{" "}fails with a &quot;Missing Suspense boundary with useSearchParams&quot; error.
          </p>
          <p>
            Add <code>SearchParamsDemo</code>{" "}to the page, inside its own <code>Suspense</code>{" "}boundary:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 2)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 3: The window object</h4>
          <p>
            In the browser, the global <code>window</code>{" "}object represents the open tab. <code>window.location</code>{" "}describes the current URL: its <code>protocol</code>{" "}(<code>http:</code>{" "}or <code>https:</code>), its <code>host</code>{" "}(domain plus port), and its <code>port</code>{" "}(empty when the protocol&apos;s default port is used). <code>window.innerWidth</code>{" "}and <code>innerHeight</code>{" "}give the visible size in pixels. <code>window</code>{" "}does not exist on the server, and the first HTML is rendered on the server, so reading it during render would crash there or produce HTML that differs from the browser&apos;s. React calls that mismatch a <strong>hydration error</strong>: <strong>hydration</strong>{" "}is React attaching to the server&apos;s HTML in the browser, and it expects both renders to match. The fix is <code>useEffect</code>. <code>useState</code>{" "}holds a value that triggers a re-render when it changes; <code>useEffect(fn, [])</code>{" "}runs <code>fn</code>{" "}once, only in the browser, after the first render. Inside it, <code>addEventListener(&quot;resize&quot;, update)</code>{" "}registers a <strong>listener</strong>, a function the browser calls every time the window is resized, and <code>requestAnimationFrame(update)</code>{" "}asks the browser to call <code>update</code>{" "}once before its next repaint, which fills in the first values. The function returned from the effect is the <strong>cleanup</strong>, which removes the listener when the component goes away:
          </p>
          <CodeBlock
            language="tsx"
            name="WindowDemo"
            file="app/labs/lab3/client-apis/WindowDemo.tsx"
          >{`"use client";

import { useEffect, useState } from "react";

type WindowInfo = {
  protocol: string;
  host: string;
  port: string;
  width: number;
  height: number;
};

export default function WindowDemo() {
  const [info, setInfo] = useState<WindowInfo | null>(null);
  useEffect(() => {
    const update = () =>
      setInfo({
        protocol: window.location.protocol,
        host: window.location.host,
        port: window.location.port || "(default)",
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div id="wd-window-demo">
      <h3>The window object</h3>
      {info ? (
        <ul>
          <li>Protocol: {info.protocol}</li>
          <li>Host: {info.host}</li>
          <li>Port: {info.port}</li>
          <li>
            Window size: {info.width} x {info.height}
          </li>
        </ul>
      ) : (
        <p>Loading window info...</p>
      )}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="WindowDemo"
            file="app/labs/lab3/client-apis/WindowDemo.tsx"
          >
            <WindowDemo />
          </LiveDemo>
          <p>
            Resize the browser window and watch the size update. The first render on both server and browser shows &quot;Loading window info...&quot;, so the HTML matches and there is no hydration error.
          </p>
          <p>
            Add <code>WindowDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 3)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";
import WindowDemo from "./WindowDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
      <WindowDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 4: navigator.geolocation</h4>
          <p>
            <code>window.navigator</code>{" "}(usually written just <code>navigator</code>) describes the browser itself. <code>navigator.geolocation</code>{" "}is the <strong>Geolocation API</strong>, which asks the device for its latitude and longitude. Because location is private, the browser first shows a <strong>permission prompt</strong>{" "}and the user may refuse. <code>getCurrentPosition(success, failure, options)</code>{" "}takes two <strong>callbacks</strong>{" "}(functions to call later): the first receives the position, the second receives an error whose <code>code</code>{" "}equals <code>PERMISSION_DENIED</code>{" "}when the user says no. The component first checks that the API exists at all, and calls it only from a button click so the prompt never appears unasked. On success it also writes the coordinates into the query string with <code>window.history.replaceState</code>, which changes the URL without reloading the page or adding a Back-button entry; Next.js keeps <code>useSearchParams</code>{" "}in sync with it:
          </p>
          <CodeBlock
            language="tsx"
            name="GeolocationDemo"
            file="app/labs/lab3/client-apis/GeolocationDemo.tsx"
          >{`"use client";

import { useState } from "react";

type Coords = { lat: number; lon: number };

export default function GeolocationDemo() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState("Click the button to share your location.");
  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation is not available in this browser.");
      return;
    }
    setStatus("Waiting for permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: Number(position.coords.latitude.toFixed(4)),
          lon: Number(position.coords.longitude.toFixed(4)),
        };
        setCoords(next);
        setStatus("Location found.");
        window.history.replaceState(null, "", \`?lat=\${next.lat}&lon=\${next.lon}\`);
      },
      (error) => {
        setCoords(null);
        setStatus(
          error.code === error.PERMISSION_DENIED
            ? "Permission denied. That's fine; the demo still works without it."
            : \`Could not get your location: \${error.message}\`,
        );
      },
      { timeout: 10000 },
    );
  };
  return (
    <div id="wd-geolocation-demo">
      <h3>navigator.geolocation</h3>
      <button type="button" onClick={locate}>
        Find my location
      </button>
      <p>{status}</p>
      {coords && (
        <p>
          Latitude: {coords.lat}, Longitude: {coords.lon}
        </p>
      )}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="GeolocationDemo"
            file="app/labs/lab3/client-apis/GeolocationDemo.tsx"
          >
            <GeolocationDemo />
          </LiveDemo>
          <p>
            Click the button, then try again after blocking location in the site settings: the message explains what happened instead of failing silently. Coordinates are rounded to four decimals (about 10 meters).
          </p>
          <p>
            Add <code>GeolocationDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 4)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";
import WindowDemo from "./WindowDemo";
import GeolocationDemo from "./GeolocationDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
      <WindowDemo />
      <GeolocationDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 5: An OpenStreetMap iframe</h4>
          <p>
            An <code>&lt;iframe&gt;</code>{" "}(inline frame) embeds another web page inside yours. OpenStreetMap is a free, community-made world map, and its embed page needs no account or key. The page takes a <strong>bounding box</strong>{" "}(<code>bbox</code>: west, south, east and north edges in degrees) and a <code>marker</code>. This component reads <code>lat</code>{" "}and <code>lon</code>{" "}from the query string with <code>useSearchParams</code>{" "}from Step 2, which is where Step 4 put them, and falls back to Northeastern University&apos;s Boston campus when they are missing or not numbers:
          </p>
          <CodeBlock
            language="tsx"
            name="MapEmbed"
            file="app/labs/lab3/client-apis/MapEmbed.tsx"
          >{`"use client";

import { useSearchParams } from "next/navigation";

const DEFAULT_LAT = 42.3398;
const DEFAULT_LON = -71.0892;

export default function MapEmbed() {
  const searchParams = useSearchParams();
  const lat = Number(searchParams.get("lat") ?? DEFAULT_LAT);
  const lon = Number(searchParams.get("lon") ?? DEFAULT_LON);
  const valid = Number.isFinite(lat) && Number.isFinite(lon);
  const center = valid ? { lat, lon } : { lat: DEFAULT_LAT, lon: DEFAULT_LON };
  const d = 0.01;
  const bbox = [center.lon - d, center.lat - d, center.lon + d, center.lat + d].join(",");
  const src = \`https://www.openstreetmap.org/export/embed.html?bbox=\${bbox}&layer=mapnik&marker=\${center.lat},\${center.lon}\`;
  return (
    <div id="wd-map-embed">
      <h3>OpenStreetMap iframe</h3>
      <p>
        Showing {center.lat}, {center.lon}
        {searchParams.has("lat") ? "" : " (default location)"}
      </p>
      <iframe title="Map" src={src} width="100%" height="300" style={{ border: 0 }} />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="MapEmbed"
            file="app/labs/lab3/client-apis/MapEmbed.tsx"
          >
            <Suspense fallback={<p>Loading map...</p>}>
              <MapEmbed />
            </Suspense>
          </LiveDemo>
          <p>
            Click <strong>Find my location</strong>{" "}in Step 4 and allow access: the map recenters on you, because both components share the URL.
          </p>
          <p>
            Add <code>MapEmbed</code>{" "}to the page, inside its own <code>Suspense</code>{" "}boundary:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 5)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";
import WindowDemo from "./WindowDemo";
import GeolocationDemo from "./GeolocationDemo";
import MapEmbed from "./MapEmbed";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
      <WindowDemo />
      <GeolocationDemo />
      <Suspense fallback={<p>Loading map...</p>}>
        <MapEmbed />
      </Suspense>
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 6: The client&apos;s public IP address</h4>
          <p>
            An <strong>IP address</strong>{" "}is the number that identifies a machine on the internet. Your device&apos;s <strong>public IP</strong>{" "}is the address other servers see, usually your router&apos;s, and the browser has no API that reports it. The component asks a free, keyless <strong>endpoint</strong>{" "}(a URL that returns data), <code>https://api.ipify.org?format=json</code>, which echoes the caller&apos;s IP as JSON. <code>fetch</code>{" "}sends the request and returns a <strong>promise</strong>, a value that arrives later; each <code>.then</code>{" "}runs when the previous step finishes, and <code>.catch</code>{" "}runs if anything fails, such as no network or an ad blocker, so the page shows a message instead of breaking:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientIpDemo"
            file="app/labs/lab3/client-apis/ClientIpDemo.tsx"
          >{`"use client";

import { useEffect, useState } from "react";

export default function ClientIpDemo() {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then((data: { ip: string }) => setIp(data.ip))
      .catch((err: Error) => setError(err.message));
  }, []);
  return (
    <div id="wd-client-ip-demo">
      <h3>Public IP address</h3>
      {error ? (
        <p>Could not look up your IP: {error}</p>
      ) : (
        <p>Your public IP: {ip ?? "Looking up..."}</p>
      )}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ClientIpDemo"
            file="app/labs/lab3/client-apis/ClientIpDemo.tsx"
          >
            <ClientIpDemo />
          </LiveDemo>
          <p>
            Keep in mind that every server you contact already sees this address, including your own Next.js server. Asking a third party from the browser shares the visitor&apos;s IP with that third party, so when you need it, reading it on the server is often the better choice.
          </p>
          <p>
            Add <code>ClientIpDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientApis (after step 6)"
            file="app/labs/lab3/client-apis/page.tsx"
          >{`import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";
import WindowDemo from "./WindowDemo";
import GeolocationDemo from "./GeolocationDemo";
import MapEmbed from "./MapEmbed";
import ClientIpDemo from "./ClientIpDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
      <WindowDemo />
      <GeolocationDemo />
      <Suspense fallback={<p>Loading map...</p>}>
        <MapEmbed />
      </Suspense>
      <ClientIpDemo />
    </div>
  );
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-3-6-4"
          title="3.6.4 More Server-Only APIs"
        >
          <p>
            <SectionLink to="3.6.2" />{" "}used <code>process</code>{" "}and <code>fs</code>{" "}on the server. This section adds seven small Server Components, one concept each, in <code>app/labs/lab3/server-apis</code>, rendered on their own page, <code>/labs/lab3/server-apis</code>. A <strong>server-only API</strong>{" "}is one that exists only in Node.js, so only a Server Component can call it. Add them one at a time. Demos that read the current request or change on every visit can&apos;t be prerendered into this book, so their demo shows the reference site&apos;s own <code>/labs/lab3/server-apis</code>{" "}page in a frame.
          </p>
          <h4 className="mt-6 font-semibold">Step 1: Server time vs client time</h4>
          <p>
            The server and the browser each have their own clock and time zone. The Server Component formats the server&apos;s time in UTC (Coordinated Universal Time, the zone-free reference clock). It renders a small Client Component, <code>ClientTime</code>, that reads the browser&apos;s clock inside <code>useEffect</code>{" "}and, with <code>setInterval</code>, again every second (1000 milliseconds){" "}(<SectionLink to="3.6.3" />{" "}Step 3), so the server&apos;s HTML and the browser&apos;s first render match. Create <code>ClientTime.tsx</code>{" "}first:
          </p>
          <CodeBlock
            language="tsx"
            name="ClientTime"
            file="app/labs/lab3/server-apis/ClientTime.tsx"
          >{`"use client";

import { useEffect, useState } from "react";

export default function ClientTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return <p>Browser time: {time ?? "(waiting for the browser...)"}</p>;
}`}</CodeBlock>
          <p>
            Then create <code>ServerTimeDemo.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerTimeDemo"
            file="app/labs/lab3/server-apis/ServerTimeDemo.tsx"
          >{`import ClientTime from "./ClientTime";

export default function ServerTimeDemo() {
  const serverTime = new Date().toLocaleTimeString("en-US", { timeZone: "UTC" });
  return (
    <div id="wd-server-time-demo">
      <h3>Server time vs client time</h3>
      <p>Server time (UTC): {serverTime}</p>
      <ClientTime />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ServerTimeDemo"
            file="app/labs/lab3/server-apis/ServerTimeDemo.tsx"
          >
            <ServerTimeDemo />
          </LiveDemo>
          <p>
            This book is prerendered, so here the server time is when the site was built and the browser time is now. On a page that renders on every request the two are only milliseconds apart, but may still show different hours if the zones differ.
          </p>
          <p>
            Render it from a new page at <code>app/labs/lab3/server-apis/page.tsx</code>{" "}and open <LocalUrl href="/labs/lab3/server-apis" />:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 1)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 2: The os module</h4>
          <p>
            <code>node:os</code>{" "}is the Node.js <strong>module</strong>{" "}(a file of code you can import) that describes the operating system the server runs on: its <code>hostname</code>{" "}(the machine&apos;s name), <code>platform</code>, <code>uptime()</code>{" "}in seconds since boot, <code>cpus()</code>{" "}(one entry per processor core) and <code>freemem()</code>{" "}in bytes. The browser can&apos;t see any of this:
          </p>
          <CodeBlock
            language="tsx"
            name="OsDemo"
            file="app/labs/lab3/server-apis/OsDemo.tsx"
          >{`import os from "node:os";

export default function OsDemo() {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    uptimeMinutes: Math.round(os.uptime() / 60),
    cpuCount: os.cpus().length,
    freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
  };
  return (
    <div id="wd-os-demo">
      <h3>The os module</h3>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="OsDemo"
            file="app/labs/lab3/server-apis/OsDemo.tsx"
          >
            <OsDemo />
          </LiveDemo>
          <p>
            On Vercel the hostname belongs to a short-lived cloud machine, not to your laptop.
          </p>
          <p>
            Add <code>OsDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 2)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 3: process.env</h4>
          <p>
            An <strong>environment variable</strong>{" "}is a named setting given to a program from outside its code; in Node.js they are properties of <code>process.env</code>. They are the usual home for <strong>secrets</strong>{" "}such as passwords and keys, because Next.js never sends a server-only variable to the browser: only variables whose names start with <code>NEXT_PUBLIC_</code>{" "}are copied into browser code. This demo uses a harmless variable, <code>LAB3_SERVER_MESSAGE</code>, with a fallback when it isn&apos;t set. The Server Component prints it, then renders a Client Component that tries to read the same variable. Never print a real secret like this. Create <code>EnvClientCheck.tsx</code>{" "}first:
          </p>
          <CodeBlock
            language="tsx"
            name="EnvClientCheck"
            file="app/labs/lab3/server-apis/EnvClientCheck.tsx"
          >{`"use client";

export default function EnvClientCheck() {
  const value = process.env.LAB3_SERVER_MESSAGE;
  return <p>In the browser: {value ?? "undefined"}</p>;
}`}</CodeBlock>
          <p>
            Then create <code>EnvDemo.tsx</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="EnvDemo"
            file="app/labs/lab3/server-apis/EnvDemo.tsx"
          >{`import EnvClientCheck from "./EnvClientCheck";

export default function EnvDemo() {
  const message = process.env.LAB3_SERVER_MESSAGE ?? "hello from the server (fallback)";
  return (
    <div id="wd-env-demo">
      <h3>process.env</h3>
      <p>On the server: {message}</p>
      <EnvClientCheck />
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="EnvDemo"
            file="app/labs/lab3/server-apis/EnvDemo.tsx"
          >
            <EnvDemo />
          </LiveDemo>
          <p>
            The server line shows the message; the browser line shows <code>undefined</code>. To set your own value, add <code>LAB3_SERVER_MESSAGE=hi</code>{" "}to a file named <code>.env.local</code>{" "}in the project root and restart <code>npm run dev</code>.
          </p>
          <p>
            Add <code>EnvDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 3)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 4: headers()</h4>
          <p>
            Every request a browser sends carries <strong>headers</strong>, name-value lines describing the request. <code>user-agent</code>{" "}names the browser and operating system. <code>x-forwarded-for</code>{" "}is added by <strong>proxies</strong>{" "}(servers that pass requests along, like Vercel&apos;s edge network) and lists the client&apos;s IP first. <code>headers()</code>{" "}from <code>next/headers</code>{" "}reads them. It returns a promise, so the component is an <code>async</code>{" "}function and uses <code>await</code>, which pauses until the promise&apos;s value is ready. Server Components may be <code>async</code>; Client Components may not:
          </p>
          <CodeBlock
            language="tsx"
            name="RequestHeadersDemo"
            file="app/labs/lab3/server-apis/RequestHeadersDemo.tsx"
          >{`import { headers } from "next/headers";

export default async function RequestHeadersDemo() {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "(none)";
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() ?? "(unknown, e.g. on localhost)";
  return (
    <div id="wd-request-headers-demo">
      <h3>headers()</h3>
      <p>User agent: {userAgent}</p>
      <p>Your IP as the server sees it: {ip}</p>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="RequestHeadersDemo"
            file="app/labs/lab3/server-apis/RequestHeadersDemo.tsx"
          >
            <iframe title="wd-request-headers-demo" src="/labs/lab3/server-apis#wd-request-headers-demo" className="w-full" style={{ height: 260, border: 0 }} />
          </LiveDemo>
          <p>
            Compare the IP with Step 6 of <SectionLink to="3.6.3" />: the server sees the same address without asking anyone else. On <code>npm run dev</code>{" "}there is no proxy, so the IP is unknown. Because <code>headers()</code>{" "}depends on the request, Next.js renders this page <strong>dynamically</strong>, on every request, instead of prerendering it at build time.
          </p>
          <p>
            Add <code>RequestHeadersDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 4)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";
import RequestHeadersDemo from "./RequestHeadersDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
      <RequestHeadersDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 5: Fetching data on the server</h4>
          <p>
            A Server Component can call other servers with <code>fetch</code>{" "}before any HTML is sent. Open-Meteo is a free weather service that needs no key; this request asks for the current temperature and wind in Boston. The <code>try</code>/<code>catch</code>{" "}from <SectionLink to="3.6.2" />{" "}turns a network failure into a message. The <code>{"next: { revalidate: 1800 }"}</code>{" "}option lets Next.js <strong>cache</strong>{" "}(keep and reuse) the answer for 1800 seconds, 30 minutes, so repeated visits don&apos;t call Open-Meteo every time:
          </p>
          <CodeBlock
            language="tsx"
            name="WeatherDemo"
            file="app/labs/lab3/server-apis/WeatherDemo.tsx"
          >{`const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=42.34&longitude=-71.09" +
  "&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph";

type Weather = { current: { time: string; temperature_2m: number; wind_speed_10m: number } };

export default async function WeatherDemo() {
  let weather: Weather | null = null;
  let error: string | null = null;
  try {
    const response = await fetch(WEATHER_URL, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    weather = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "unknown error";
  }
  return (
    <div id="wd-weather-demo">
      <h3>Weather in Boston (Open-Meteo)</h3>
      {weather ? (
        <ul>
          <li>Temperature: {weather.current.temperature_2m} °F</li>
          <li>Wind: {weather.current.wind_speed_10m} mph</li>
          <li>Measured at (UTC): {weather.current.time}</li>
        </ul>
      ) : (
        <p>Weather is unavailable right now: {error}</p>
      )}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="WeatherDemo"
            file="app/labs/lab3/server-apis/WeatherDemo.tsx"
          >
            <iframe title="wd-weather-demo" src="/labs/lab3/server-apis#wd-weather-demo" className="w-full" style={{ height: 240, border: 0 }} />
          </LiveDemo>
          <p>
            The browser never contacts Open-Meteo; it only receives the finished HTML.
          </p>
          <p>
            Add <code>WeatherDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 5)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";
import RequestHeadersDemo from "./RequestHeadersDemo";
import WeatherDemo from "./WeatherDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
      <RequestHeadersDemo />
      <WeatherDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 6: Reading and writing a file</h4>
          <p>
            <code>node:fs/promises</code>{" "}is the promise version of <code>fs</code>: <code>readFile</code>{" "}and <code>writeFile</code>{" "}return promises you <code>await</code>. The counter lives in a text file under <code>os.tmpdir()</code>, the operating system&apos;s folder for temporary files, and <code>path.join</code>{" "}builds the full file name. A missing file throws, so <code>catch</code>{" "}starts the count at 0. <code>await connection()</code>{" "}from <code>next/server</code>{" "}tells Next.js this component must run on every request, so the page is dynamic and never prerendered:
          </p>
          <CodeBlock
            language="tsx"
            name="VisitCounterDemo"
            file="app/labs/lab3/server-apis/VisitCounterDemo.tsx"
          >{`import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { connection } from "next/server";

const COUNTER_FILE = path.join(os.tmpdir(), "lab3-visits.txt");

export default async function VisitCounterDemo() {
  await connection();
  let visits = 0;
  try {
    visits = Number(await fs.readFile(COUNTER_FILE, "utf8")) || 0;
  } catch {
    visits = 0;
  }
  visits += 1;
  try {
    await fs.writeFile(COUNTER_FILE, String(visits));
  } catch (error) {
    console.error("Could not save the visit count:", error);
  }
  return (
    <div id="wd-visit-counter-demo">
      <h3>Visit counter</h3>
      <p>This page has been rendered {visits} times.</p>
      <p>Counter file: {COUNTER_FILE}</p>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="VisitCounterDemo"
            file="app/labs/lab3/server-apis/VisitCounterDemo.tsx"
          >
            <iframe title="wd-visit-counter-demo" src="/labs/lab3/server-apis#wd-visit-counter-demo" className="w-full" style={{ height: 220, border: 0 }} />
          </LiveDemo>
          <p>
            Run it with <code>npm run dev</code>{" "}and refresh: the count keeps rising, even across restarts, because the file stays on your disk. On serverless hosting such as Vercel your code runs on short-lived machines where only <code>/tmp</code>{" "}is writable, and that folder is temporary and not shared between machines, so the count resets often and can jump around. A file is fine for a demo, not for data you need to keep.
          </p>
          <p>
            Add <code>VisitCounterDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 6)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";
import RequestHeadersDemo from "./RequestHeadersDemo";
import WeatherDemo from "./WeatherDemo";
import VisitCounterDemo from "./VisitCounterDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
      <RequestHeadersDemo />
      <WeatherDemo />
      <VisitCounterDemo />
    </div>
  );
}`}</CodeBlock>
          <h4 className="mt-6 font-semibold">Step 7: child_process</h4>
          <p>
            <code>node:child_process</code>{" "}starts another program on the server, called a <strong>child process</strong>. <code>execFile(program, args)</code>{" "}runs one program with a fixed list of arguments and collects what it prints; <code>promisify</code>{" "}from <code>node:util</code>{" "}wraps it so it returns a promise. This demo only ever runs <code>node --version</code>. Never build the program name or its arguments from user input such as a query string or form field: anyone could then run commands on your server. Fixed arguments with <code>execFile</code>{" "}keep that door closed:
          </p>
          <CodeBlock
            language="tsx"
            name="ChildProcessDemo"
            file="app/labs/lab3/server-apis/ChildProcessDemo.tsx"
          >{`import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export default async function ChildProcessDemo() {
  let output: string;
  try {
    const { stdout } = await execFileAsync("node", ["--version"]);
    output = stdout.trim();
  } catch (error) {
    output = \`Could not run node: \${error instanceof Error ? error.message : "unknown error"}\`;
  }
  return (
    <div id="wd-child-process-demo">
      <h3>child_process</h3>
      <p>Output of node --version: {output}</p>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ChildProcessDemo"
            file="app/labs/lab3/server-apis/ChildProcessDemo.tsx"
          >
            <ChildProcessDemo />
          </LiveDemo>
          <p>
            If the host has no <code>node</code>{" "}program on its path, the <code>catch</code>{" "}shows the error instead of crashing the page.
          </p>
          <p>
            Add <code>ChildProcessDemo</code>{" "}to the page:
          </p>
          <CodeBlock
            language="tsx"
            name="ServerApis (after step 7)"
            file="app/labs/lab3/server-apis/page.tsx"
          >{`import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";
import RequestHeadersDemo from "./RequestHeadersDemo";
import WeatherDemo from "./WeatherDemo";
import VisitCounterDemo from "./VisitCounterDemo";
import ChildProcessDemo from "./ChildProcessDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
      <RequestHeadersDemo />
      <WeatherDemo />
      <VisitCounterDemo />
      <ChildProcessDemo />
    </div>
  );
}`}</CodeBlock>
        </Section>
      </Section>

      <Section id="sec-3-7" title="3.7 Parameterizing Components">
        <p>
          React components can be parameterized by using the familiar HTML
          attribute syntax, which passes attribute values to the
          component&apos;s function as an object map parameter. The
          following <code>Add</code>{" "}component can receive properties{" "}
          <code>a</code>{" "}and <code>b</code>{" "}deconstructed from the
          attributes — the same parameter destructuring as{" "}
          <SectionLink to="3.4.15" />. Implement the <code>Add</code>{" "}
          component below and confirm that passing it{" "}
          <code>a={"{3}"}</code>{" "}and <code>b={"{4}"}</code>{" "}results in{" "}
          <code>a + b = 7</code>. Note that the values of <code>a</code>{" "}
          and <code>b</code>{" "}are destructed from the object parameter in
          the <code>Add</code>{" "}function parameter list. Render{" "}
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
      b = {b} <br />
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
          Import <code>Add</code>{" "}into <code>app/labs/lab3/page.tsx</code>{" "}and render it
          with its two props after <code>ServerComponentDemo</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab3 (after 3.7)"
          file="app/labs/lab3/page.tsx"
        >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
    </div>
  );
}`}</CodeBlock>
        <OnYourOwn>
          Render a second{" "}
          <code>{`<Add a={10} b={20} />`}</code>{" "}on the Lab 3 page and
          confirm it prints <code>30</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab3/page.tsx, keep <Add a={3} b={4} /> and any <Add a={10} b={20} /> I added. Render one more sample <Add a={7} b={8} /> under those. Do not change Add.tsx.`}
        >
          Ask the assistant to render one extra sample{" "}
          <code>{`<Add a={7} b={8} />`}</code>{" "}— leave the 10 + 20 instance
          as yours:
        </WithAI>

        <Section
          level={3}
          id="sec-3-7-1"
          title="3.7.1 Child Components"
        >
          <p>
            In the previous section we discussed passing data to a
            component through attributes. Another way to pass data to a
            component is in its body, that is, between the opening and
            closing tag of the element. In HTML it is common to wrap
            content with specific tags to add certain formatting. For
            instance the tags <code>h1</code>{" "}and <code>p</code>{" "}format
            the content in their bodies with specific font sizes and
            margins — they take the content in the body and return a
            transformed version. We can implement React components the
            same way. The content in the body of a React component is
            passed to the component function as a parameter called{" "}
            <code>children</code>. For instance, the <code>Square</code>{" "}
            component below takes a number in its body and returns the
            square of the number. Import the new component, use it to
            compute the square of 4, and confirm it renders the correct
            result:
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
            <code>{`<Square>4</Square>`}</code>{" "}under an{" "}
            <code>{`<h4>Square of 4</h4>`}</code>{" "}heading, with an{" "}
            <code>{`<hr />`}</code>{" "}after it. The child text{" "}
            <code>4</code>{" "}becomes <code>16</code>:
          </p>
          <LiveDemo name="Square" file="app/labs/lab3/Square.tsx">
            <h4>Square of 4</h4>
            <Square>4</Square>
            <hr />
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
            Import both <code>Square</code>{" "}and <code>Highlight</code>{" "}into{" "}
            <code>app/labs/lab3/page.tsx</code>. The square of 4 sits under its own{" "}
            <code>&lt;h4&gt;</code>{" "}heading, followed by a rule and the
            highlighted sentence:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.7.1)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Wrap a sentence of your own in{" "}
            <code>Highlight</code>{" "}on the Lab 3 page, and render{" "}
            <code>{`<Square>9</Square>`}</code>{" "}next to the square of 4.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/page.tsx, keep any Highlight sentence I wrote and any <Square>9</Square> I added. After the sample Square of 4, add <p>Square of 5 = <Square>5</Square></p> and one more <Highlight>Children can be any JSX</Highlight>. Do not change my personal sentence.`}
          >
            Ask the assistant to add one extra sample highlight and square —
            leave your sentence as the personal bit:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-3-7-2"
          title="3.7.2 Working with the Pathname"
        >
          <p>
            <code>usePathname</code>{" "}returns the current URL path from
            the address bar so a Client Component can adapt to where the
            user is — which screen, which lab, which section. One common
            use is highlighting the active item in a nav, and that is what
            the Labs table of contents does next. Your Chapter 1{" "}
            <code>app/labs/TOC.tsx</code>{" "}is still a Server Component
            with the links written out by hand: no{" "}
            <code>&quot;use client&quot;</code>, no <code>LINKS</code>, and no{" "}
            <code>match</code>. <strong>Replace the whole file</strong>{" "}with
            the client version below. It maps a <code>LINKS</code>{" "}array,
            and when a link&apos;s <code>match</code>{" "}function says the
            pathname belongs to that lab, it gives that link an inline style
            object (<SectionLink to="3.5.2" />) and{" "}
            <code>aria-current=&quot;page&quot;</code>. The Labs pages
            don&apos;t load Tailwind, so Tailwind classes would have no
            visible effect here. If your Chapter 1 TOC has extra links you
            added yourself, add each one to <code>LINKS</code>{" "}with{" "}
            <code>match: () =&gt; false</code>:
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

const activeStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  borderRadius: "4px",
  padding: "2px 8px",
  textDecoration: "none",
};

export default function TOC() {
  const pathname = usePathname() ?? "";
  return (
    <ul>
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <li key={link.id}>
            <Link
              href={link.href}
              id={link.id}
              style={active ? activeStyle : undefined}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}`}</CodeBlock>
          <p>
            The file starts with <code>&quot;use client&quot;</code>{" "}because{" "}
            <code>usePathname</code>{" "}reads the address bar. Each mapped{" "}
            <code>li</code>{" "}uses <code>key={"{link.id}"}</code>. Visit{" "}
            <LocalUrl href="/labs/lab3" />{" "}and confirm the Lab 3 item is
            a blue pill with white text while the other links stay plain
            blue links; Lab 1 and Lab 2 should do the same on their routes.
            The book&apos;s own Labs menu on this site has extra course-site
            links (book chapters, intermediate steps) that your project
            doesn&apos;t have, so leave those out.
          </p>
          <OnYourOwn>
            Make sure the TOC shows on every Lab page (it lives in{" "}
            <code>app/labs/layout.tsx</code>) and lists Home, Lab 1, Lab 2,
            Lab 3, and Kambaz. Open <code>/labs/lab1</code>, then{" "}
            <code>/labs/lab3</code>: on each page only that lab&apos;s link is
            the blue pill, and the pill moves when you change labs.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/TOC.tsx, keep the existing LINKS entries including Lab 3. After the Kambaz object, add { href: "https://kambaz.dev/book/ch3", id: "wd-book-ch3-link", label: "Book Ch3", match: () => false } so the TOC links to this chapter of the book. Do not remove or rename my Lab 3 link, and keep the active style on the current lab.`}
          >
            Paste this prompt so the assistant adds a Book Ch3 link to the
            TOC. It opens this chapter on kambaz.dev and is never
            highlighted; Lab 3 is still the pill on <code>/labs/lab3</code>:
          </WithAI>
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
      <Link href="/labs/lab3/add/1/2">1 + 2</Link> <br />
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
            Import <code>PathParameters</code>{" "}into <code>app/labs/lab3/page.tsx</code>{" "}and
            render it after the <code>Highlight</code>. The{" "}
            <code>add/[a]/[b]/page.tsx</code>{" "}route is a page of its own, so
            Lab 3 does not import it:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.7.3)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import PathParameters from "./PathParameters";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
      <PathParameters />
    </div>
  );
}`}</CodeBlock>
          <p>
            Click <Link href="/labs/lab3/add/1/2">1 + 2</Link>{" "}and confirm
            the URL is <code>/labs/lab3/add/1/2</code>{" "}and the page prints{" "}
            <code>1 + 2 = 3</code>. The second link should print{" "}
            <code>3 + 4 = 7</code>.
          </p>
          <OnYourOwn>
            Add a third <code>Link</code>{" "}to{" "}
            <code>/labs/lab3/add/&lt;a&gt;/&lt;b&gt;</code>{" "}with two numbers
            of your choice, with link text such as <code>10 + 15</code>.
            Clicking it opens a page that prints the sum, for example{" "}
            <code>10 + 15 = 25</code>. Path Parameters then shows three
            links.
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/PathParameters.tsx, keep the 1+2 and 3+4 links and any third link I added. After them, add <Link href="/labs/lab3/add/5/6">5 + 6</Link>. Do not change app/labs/lab3/add/[a]/[b]/page.tsx or overwrite my numbers.`}
          >
            Ask the assistant to add a sample 5 + 6 link — leave the third
            pair of numbers as yours:
          </WithAI>
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
            Store the list next to the component as JSON — Next.js lets you
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
            whose default matches <code>todo.done</code>. The Tailwind
            classes on <code>TodoItem</code>{" "}and <code>TodoList</code>{" "}do
            nothing on your Labs pages, which don&apos;t load Tailwind, so
            your list looks like the plain demo below — that is expected:
          </p>
          <LiveDemo name="TodoList" file="app/labs/lab3/todos/TodoList.tsx">
            <TodoList />
          </LiveDemo>
          <p>
            Import <code>TodoList</code>{" "}from its subfolder,{" "}
            <code>./todos/TodoList</code>, and render it last. <code>TodoItem</code>{" "}is
            rendered inside <code>TodoList</code>, so the page does not import it.
            This is the finished Lab 3 page — the same file{" "}
            <SectionLink to="3.7.5" />{" "}lists:
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (after 3.7.4)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import PathParameters from "./PathParameters";
import TodoList from "./todos/TodoList";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
      <PathParameters />
      <TodoList />
    </div>
  );
}`}</CodeBlock>
          <OnYourOwn>
            Add a fourth object to <code>todos.json</code>{" "}with a unique
            title, a status, and <code>&quot;done&quot;: false</code>. The
            Todo List then shows four checkbox rows, at least one checked
            and at least one unchecked. Keep a <code>key</code>{" "}on every
            mapped <code>TodoItem</code>. Log the <code>todos</code>{" "}array
            from <code>TodoList.tsx</code>{" "}and confirm the objects appear
            in the console (
            <SectionLink to="3.4.12" />
            ).
          </OnYourOwn>
          <WithAI
            prompt={`In app/labs/lab3/todos/todos.json, keep any fourth todo I added. Append one more sample object { "title": "Email the TA", "status": "COMPLETED", "done": true } with a unique title. In app/labs/lab3/todos/TodoList.tsx, keep key={todo.title} on every TodoItem and add console.log(todos) if it is missing. Do not change my personal todo title.`}
          >
            Paste this prompt so the assistant adds one extra sample todo and
            the console log — leave your fourth title as the personal bit:
          </WithAI>
        </Section>

        <Section level={3} id="sec-3-7-5" title="3.7.5 Exercises">
          <p>
            Use this checklist to confirm Lab 3 covers every JavaScript
            topic in <SectionLink to="3.2" />–<SectionLink to="3.7" />.
            Import each component into <code>app/labs/lab3/page.tsx</code>{" "}
            in order. Each topic is listed once, with Lab,{" "}
            <strong>On your own</strong>, and <strong>With AI</strong>{" "}
            nested as a/b/c. Each item says what your deployed{" "}
            <code>/labs/lab3</code>{" "}page must show. Give every mapped JSX
            sibling a <code>key</code>, and keep the <code>wd-*</code>{" "}ids
            from the listings — the ids help us test your work, but a
            missing id never costs points on its own.
          </p>
          <p>
            When you are done, the Lab 3 page imports and renders every
            component in book order, each under its own heading. Your On
            your own and With AI additions live inside those components (or
            right after them on the page, for the extra{" "}
            <code>Add</code>, <code>Square</code>, and{" "}
            <code>Highlight</code>{" "}instances):
          </p>
          <CodeBlock
            language="tsx"
            name="Lab3 (complete)"
            file="app/labs/lab3/page.tsx"
          >{`import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import NullUndefined from "./NullUndefined";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import IncludesSomeEvery from "./IncludesSomeEvery";
import ReduceFunction from "./ReduceFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import Spreader from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import OptionalChaining from "./OptionalChaining";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponentDemo";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import PathParameters from "./PathParameters";
import TodoList from "./todos/TodoList";

export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <NullUndefined />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <IncludesSomeEvery />
      <ReduceFunction />
      <JsonStringify />
      <House />
      <Spreader />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <OptionalChaining />
      <Classes />
      <Styles />
      <ClientComponentDemo />
      <ServerComponentDemo />
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Highlight>
      <PathParameters />
      <TodoList />
    </div>
  );
}`}</CodeBlock>
          <NestedExerciseList groups={CH3_LAB_EXERCISES} />
        </Section>
      </Section>
    </>
  );
}
