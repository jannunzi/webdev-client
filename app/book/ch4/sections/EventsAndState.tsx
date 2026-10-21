import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ClickEvent from "@/app/labs/lab4/ClickEvent";
import PassingDataOnEvent from "@/app/labs/lab4/PassingDataOnEvent";
import PassingFunctionsDemo from "@/app/labs/lab4/PassingFunctionsDemo";
import CounterBroken from "@/app/labs/lab4/CounterBroken";
import Counter from "@/app/labs/lab4/Counter";
import BooleanStateVariables from "@/app/labs/lab4/BooleanStateVariables";
import StringStateVariables from "@/app/labs/lab4/StringStateVariables";
import DateStateVariable from "@/app/labs/lab4/DateStateVariable";
import ObjectStateVariable from "@/app/labs/lab4/ObjectStateVariable";
import ArrayStateVariable from "@/app/labs/lab4/ArrayStateVariable";
import ProfileForm from "@/app/labs/lab4/profile/ProfileForm";

export default function EventsAndState() {
  return (
    <>
      <Section
        level={3}
        id="sec-4-2-1"
        title="4.2.1 Handling User Events"
      >
        <p>
          Users interact with the Web application user interface by
          clicking their mouse, typing at their keyboards, and, on mobile
          devices, tapping, swiping, and pinching at the screen. As they
          interact with the graphical user interface, they generate a
          stream of <strong>events</strong> that need to be handled by
          interpreting the user intent, modifying the Web application
          state, and rerendering the user interface to reflect the new
          state so the user can see that their actions are having the
          intended effect. HTML and CSS describe how a screen looks; the
          event stream describes what the user did. A click, a keystroke,
          and a form submit are events, and React listens with attributes
          such as <code>onClick</code>{" "}and <code>onChange</code>. The
          next few sections consider the various types of events users
          generate and how they can be handled. The next three
          subsections cover click events, passing data when handling
          events, and passing functions as parameters.
        </p>
        <p>
          The <code>onClick</code>{" "}attribute declares a function that
          handles clicks. Those listeners only run in the browser, so the
          file that uses them starts with{" "}
          <code>&quot;use client&quot;</code> — the same directive{" "}
          <SectionLink to="3.6.1" />{" "}introduced for pathname-aware
          components. In Next.js, JavaScript files execute on the server
          by default and cannot interact with the user. User interaction
          such as mouse clicks, keyboard typing, and dialog windows all
          need to talk to the browser and the computer hardware, and
          therefore need to run on the client. Files tagged with{" "}
          <code>&quot;use client&quot;</code>{" "}are not executed on the
          server for that interaction; they are sent to the browser to
          execute there. To practice handling a click event, create the{" "}
          <code>ClickEvent</code>{" "}component below and import it from
          the Lab 4 page. Confirm the browser displays as shown and that
          clicking the button opens an alert.
        </p>
        <CodeBlock
          language="tsx"
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event">
      <h2>Click Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-onclick-hello"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Click Hello
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The handler is a function reference:{" "}
          <code>{`onClick={hello}`}</code>, not{" "}
          <code>{`onClick={hello()}`}</code>. Parentheses would call{" "}
          <code>hello</code>{" "}while React is rendering, before anyone
          clicks, and the alert would fire as soon as the page loaded.
          Passing the function by name tells React to invoke it later,
          when the click actually happens. You can also wrap
          several statements in an arrow when one click should call more
          than one function —{" "}
          <code>{`onClick={() => { hello(); lifeIs("Great!"); }}`}</code>{" "}
          — which you will use as soon as a handler needs an argument or
          more than one line of code. Click the button and confirm an
          alert appears:
        </p>
        <LiveDemo
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
          mode="styled"
        >
          <ClickEvent />
        </LiveDemo>
        <OnYourOwn>
          In <code>ClickEvent.tsx</code>, add a second button with its own{" "}
          <code>id</code>{" "}that alerts a greeting that includes your name.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ClickEvent.tsx, keep any extra button I added for myself. After the existing Click Hello button, add a sample button id="wd-onclick-goodbye" that alerts "Goodbye World!" using a goodbye function. Do not rename my personal button.`}
        >
          Paste this prompt so the assistant adds one extra sample click
          handler — leave your named greeting as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-2"
        title="4.2.2 Passing Data on Events"
      >
        <p>
          When handling an event, sometimes we need to pass parameters to
          the function that handles the event — which item to delete,
          which message to show, which two numbers to add. Write a
          function that takes those arguments, then wrap the call in a
          closure, an arrow function that React can invoke later, so the
          argument is not evaluated during render. If you do not wrap the
          function call inside a closure, you risk creating an infinite
          loop or at least running the handler on every render:{" "}
          <code>{`onClick={add(2, 3)}`}</code>{" "}calls{" "}
          <code>add</code>{" "}immediately and passes its return value,
          which is <code>undefined</code>, to <code>onClick</code>. To
          practice passing data when handling events, create the{" "}
          <code>PassingDataOnEvent</code>{" "}component below and import it
          from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(good);
};

export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-pass-data-click"
        className="me-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Pass Data
      </button>
      <button
        type="button"
        onClick={() => lifeIs("Life is Good!")}
        id="wd-pass-data-parameter-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Pass Data Parameter
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first button still uses a function reference because{" "}
          <code>hello</code>{" "}needs no arguments. The second button
          wraps <code>lifeIs(&quot;Life is Good!&quot;)</code>{" "}in an
          arrow so the string is only passed when the user clicks. Use
          that arrow syntax, and not{" "}
          <code>{`onClick={lifeIs("Life is Good!")}`}</code>, whenever
          the handler needs data. Click both buttons and confirm each
          alert matches the argument you passed:
        </p>
        <LiveDemo
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
          mode="styled"
        >
          <PassingDataOnEvent />
        </LiveDemo>
        <OnYourOwn>
          Add a third button that passes a different string of your choosing
          into <code>lifeIs</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingDataOnEvent.tsx, keep any extra button I added. After the existing buttons, add a sample button id="wd-pass-data-course-click" that calls lifeIs("Web Development") through an arrow function. Do not rename my personal button.`}
        >
          Ask the assistant to add one extra sample parameter button:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-3"
        title="4.2.3 Passing Functions"
      >
        <p>
          In JavaScript, functions can be treated as any other constant or
          variable, including passing them as parameters to other
          functions. A child can invoke behavior the parent owns if the
          parent passes the function as a prop. The example below passes
          function <code>sayHello</code>{" "}and a{" "}
          <code>message</code>{" "}string to component{" "}
          <code>PassingFunctions</code>{" "}as attributes, so data flows
          from parent to child. When the button is clicked, the child calls{" "}
          <code>{"theFunction(`From parent: ${message}`)"}</code>, so{" "}
          <code>sayHello</code>{" "}is invoked with a string and data flows
          back from the child to the parent through the callback. That is why the Lab 4 page
          itself is a Client Component: the parent creates the function in
          the browser and hands the child a reference. To practice passing
          functions as parameters, create the{" "}
          <code>PassingFunctions</code>{" "}component below, declare a{" "}
          <code>sayHello</code>{" "}callback on the Lab 4 page that alerts the
          string it receives, pass it as{" "}
          <code>{`theFunction={sayHello}`}</code>{" "}together with{" "}
          <code>{`message="Hello from Lab 4"`}</code>, and confirm it works
          as expected.
        </p>
        <CodeBlock
          language="tsx"
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
        >{`"use client";

export default function PassingFunctions({
  message,
  theFunction,
}: {
  message: string;
  theFunction: (message: string) => void;
}) {
  return (
    <div id="wd-passing-functions">
      <h2>Passing Functions</h2>
      <button
        type="button"
        onClick={() => theFunction(\`From parent: \${message}\`)}
        id="wd-pass-functions-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          On the Lab 4 page the callback is a small function that alerts
          whatever string it receives, and the page passes{" "}
          <code>&quot;Hello from Lab 4&quot;</code>{" "}as the{" "}
          <code>message</code>{" "}attribute. The child does not know what
          the function does; it only knows the type{" "}
          <code>{`(message: string) => void`}</code>{" "}and invokes it on
          click with <code>&quot;From parent: Hello from Lab 4&quot;</code>. That
          same pattern will later let a todo item ask a store to delete a
          row without owning the array itself. Click the button in the
          demo and confirm the parent&apos;s alert shows{" "}
          <code>&quot;From parent: Hello from Lab 4&quot;</code>:
        </p>
        <LiveDemo
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
          mode="styled"
        >
          <PassingFunctionsDemo />
        </LiveDemo>
        <OnYourOwn>
          Pass a second function from <code>page.tsx</code>{" "}that alerts
          your name, and add a second button in{" "}
          <code>PassingFunctions</code>{" "}that calls it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingFunctions.tsx and app/labs/lab4/page.tsx, keep any extra function I passed. Add a sample prop theOtherFunction: () => void and a button id="wd-pass-functions-other-click" that calls it. From page.tsx pass a function that alerts "Sample from parent". Do not rename my personal function.`}
        >
          Ask the assistant to add one extra sample function prop:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-4"
        title="4.2.4 useState and the Counter"
      >
        <p>
          Web applications implemented with React can be considered as a
          set of functions that transform a set of data structures into an
          equivalent user interface. The collection of data structures and
          values is often referred to as an application state. So far we
          have explored React applications that transform a static data
          set into a static user interface. We will now consider how the
          state can change over time as users interact with the user
          interface and how those state changes can be represented on the
          screen. Users interact with an application by clicking,
          dragging, and typing, filling out forms, clicking buttons, and
          scrolling through data. As they interact they create a stream of
          events that can be handled by a set of event-handling functions,
          often referred to as controllers. Controllers handle user events
          and convert them into changes in the application&apos;s state.
          Applications render those state changes into corresponding
          changes in the user interface. In Web applications, user
          interface changes consist of changes to the{" "}
          <OfficialLink href="https://dom.spec.whatwg.org/">
            DOM
          </OfficialLink>
          .
        </p>
        <p>
          Updating the DOM with JavaScript is slow and can degrade the
          performance of Web applications. React optimizes the process by
          creating a <strong>virtual DOM</strong>, a more compact and
          efficient version of the real DOM. When React renders something
          on the screen, it first updates the virtual DOM, and then
          converts these changes into updates to the actual DOM. To avoid
          unnecessary and slow updates, React only updates the real DOM if
          there have been changes to the virtual DOM. We can participate
          in this process of state change and DOM updates by using the{" "}
          <OfficialLink href="https://react.dev/reference/react/useState">
            useState
          </OfficialLink>{" "}
          hook. The hook is used to declare state variables that we want
          to affect the DOM rendering. The next subsections declare
          integer, boolean, string, date, object, and array state
          variables with that same hook. The syntax of the hook is a
          pair:
        </p>
        <CodeBlock language="tsx">{`const [stateVariable, setStateVariable] = useState(initialStateValue);`}</CodeBlock>
        <p>
          The <code>useState</code>{" "}hook takes as argument the initial
          value of a state variable and returns an array whose first item
          is the initialized state variable and whose second item is a
          mutator function that allows updating it. The array destructor
          syntax is commonly used to bind these items to local constants
          as shown above. The mutator function not only changes the value
          of the state variable, but it also notifies React that it should
          check if the state has caused changes to the virtual DOM and
          therefore make changes to the actual DOM. A plain{" "}
          <code>let</code>{" "}can change in memory and the heading will
          not move, because React does not know to paint again. To
          illustrate the point of the virtual DOM and how changes in
          state affect the actual DOM, create{" "}
          <code>CounterBroken.tsx</code>{" "}first so the failure is
          visible. A <code>count</code>{" "}variable is initialized and
          rendered on the screen. Buttons Up and Down update the variable
          in memory, but the heading stays at 7 because as far as React is
          concerned there have been no changes to the virtual DOM. Open
          the browser console and click the buttons: each click logs the
          new <code>count</code>, while the heading stays at 7.
        </p>
        <CodeBlock
          language="tsx"
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
        >{`"use client";

export default function CounterBroken() {
  let count = 7;
  return (
    <div id="wd-counter-broken">
      <h2>Broken Counter: {count}</h2>
      <button
        type="button"
        onClick={() => {
          count++;
          console.log(count);
        }}
        id="wd-counter-broken-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => {
          count--;
          console.log(count);
        }}
        id="wd-counter-broken-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
          mode="styled"
        >
          <CounterBroken />
        </LiveDemo>
        <p>
          For the DOM to be updated as expected, we need to tell React
          that changes to a particular variable are indeed relevant to
          changes in the DOM. To do this, use the{" "}
          <code>useState</code>{" "}hook to declare the state variable, and
          update it using the mutator function. Calling the setter queues
          a new render with the new value. Implement the{" "}
          <code>Counter</code>{" "}component below, import it in Lab 4, and
          confirm it works as expected. Do the same with the rest of the
          exercises that follow.
        </p>
        <CodeBlock
          language="tsx"
          name="Counter"
          file="app/labs/lab4/Counter.tsx"
        >{`"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  return (
    <div id="wd-counter">
      <h2>Counter: {count}</h2>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Up and Down and confirm the heading changes. The mutator
          is called with the next integer, React compares the virtual DOM
          to the previous tree, and the heading is the part that actually
          writes to the real DOM. That is the same integer you will
          rebuild with Context, Zustand, and Redux so the three APIs stay
          comparable:
        </p>
        <LiveDemo name="Counter" file="app/labs/lab4/Counter.tsx" mode="styled">
          <Counter />
        </LiveDemo>
        <OnYourOwn>
          Add a Reset button that sets the counter back to 7.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/Counter.tsx, keep any extra button I added. After Down, add a sample button id="wd-counter-reset-click" that calls setCount(7). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset after your own control:
        </WithAI>

        <Section
          level={3}
          id="sec-4-2-4-1"
          title="4.2.4.1 Hooks"
        >
          <p>
            <code>useState</code>{" "}is the first hook this chapter
            builds on, so this is a good moment to say exactly what a
            hook is. A <strong>hook</strong>{" "}is a function whose name
            starts with <code>use</code>{" "}and that a component calls to
            get something React or Next.js provides. A{" "}
            <strong>render</strong>{" "}is one call of your component
            function that produces its JSX; React renders a component
            when it first appears and again whenever its state or props
            change. An ordinary local variable is created fresh on every
            render, which is why <code>CounterBroken</code>{" "}kept
            showing 7. <code>useState</code>{" "}is the hook that{" "}
            <strong>remembers a value between renders</strong>: React
            stores the value for the component, hands the latest one back
            on each render, and renders again when the setter is called.
          </p>
          <p>
            The second hook this chapter uses is{" "}
            <code>useEffect</code>. An <strong>effect</strong>{" "}is code
            that reaches outside the component, such as reading the
            window size or asking the browser for the user&apos;s
            location. <code>useEffect(fn, deps)</code>{" "}runs{" "}
            <code>fn</code>{" "}after React has rendered and painted the
            screen, and runs it again only when one of the values in the{" "}
            <code>deps</code>{" "}array changes. You have already seen it
            at work in <SectionLink to="3.6.3" />: the window object demo
            used <code>useState</code>{" "}to hold the size and{" "}
            <code>useEffect</code>{" "}to read <code>window</code>{" "}and
            listen for resizes only in the browser, and the geolocation
            demo used <code>useState</code>{" "}to hold the coordinates and
            the status message.
          </p>
          <p>
            Every hook follows the same rules. Call hooks only at the top
            level of a component, never inside loops, conditions, or
            nested functions, so React sees the same hooks in the same
            order on every render. And most hooks need a Client
            Component, because they depend on the browser or on state
            that changes while the page is open; that is why each
            component that used one so far started with{" "}
            <code>&quot;use client&quot;</code>.
          </p>
          <p>
            These are the hooks the book has used so far, and what each
            one returns:
          </p>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300">
                <th className="py-1 pe-4">Hook</th>
                <th className="py-1 pe-4">From</th>
                <th className="py-1">Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-1 pe-4"><code>usePathname()</code></td>
                <td className="py-1 pe-4"><code>next/navigation</code></td>
                <td className="py-1">The current URL path as a string, such as <code>/courses/1234/home</code>.</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1 pe-4"><code>useSearchParams()</code></td>
                <td className="py-1 pe-4"><code>next/navigation</code></td>
                <td className="py-1">A read-only object for the query string; <code>.get(&quot;name&quot;)</code>{" "}returns one value or <code>null</code>.</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1 pe-4"><code>useParams()</code></td>
                <td className="py-1 pe-4"><code>next/navigation</code></td>
                <td className="py-1">An object with the route&apos;s dynamic segments, such as <code>{"{ cid: \"1234\" }"}</code>{" "}for <code>[cid]</code>.</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1 pe-4"><code>useState(initial)</code></td>
                <td className="py-1 pe-4"><code>react</code></td>
                <td className="py-1">A pair: the current value and a setter that changes it and renders again.</td>
              </tr>
              <tr>
                <td className="py-1 pe-4"><code>useEffect(fn, deps)</code></td>
                <td className="py-1 pe-4"><code>react</code></td>
                <td className="py-1">Nothing; it schedules <code>fn</code>{" "}to run after render, and <code>fn</code>{" "}may return a cleanup function.</td>
              </tr>
            </tbody>
          </table>
          <p>
            The first three are hooks the Next.js team wrote; the last
            two come with React. Nothing makes them special beyond their
            names and the rules above, and the rest of this chapter builds
            on <code>useState</code>{" "}and <code>useEffect</code>.
          </p>
        </Section>

      </Section>

      <Section
        level={3}
        id="sec-4-2-5"
        title="4.2.5 Boolean State Variables"
      >
        <p>
          The <code>useState</code>{" "}hook works with all JavaScript data
          types and structures including booleans, integers, strings,
          numbers, arrays, and objects. The exercise below illustrates
          using the hook with boolean state variables. The variable is
          used to hide or show a DIV as well as render a checkbox as
          checked or not. Also note the use of <code>onChange</code>{" "}
          on the checkbox to set the value of the state variable: bind{" "}
          <code>checked</code>{" "}to the current boolean and toggle it
          when the user clicks. Boolean state is a natural fit for
          checkboxes and for markup that should appear only when a flag is
          true. To practice with boolean state, create the{" "}
          <code>BooleanStateVariables</code>{" "}component below and import
          it from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          id="wd-boolean-checkbox"
        />
        Done
      </label>
      {done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The paragraph chooses its text with a ternary on{" "}
          <code>done</code>. The checkbox is a controlled input:{" "}
          <code>checked={"{done}"}</code>{" "}shows the current flag, and{" "}
          <code>onChange</code>{" "}writes the opposite value back into
          state. The yellow banner uses the same short-circuit you
          practiced in <SectionLink to="3.2.4" />: when{" "}
          <code>done</code>{" "}is true the DIV appears; when it is false
          the right-hand side never runs. Toggle the checkbox and confirm
          the heading, the box, and the banner all move together:
        </p>
        <LiveDemo
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
          mode="styled"
        >
          <BooleanStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a second boolean (for example <code>urgent</code>) with its
          own checkbox and a short message that appears only when it is
          true.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/BooleanStateVariables.tsx, keep any extra boolean I added. After the Done checkbox, add const [saved, setSaved] = useState(false), a checkbox id="wd-boolean-saved", and {saved && <div>Saved</div>}. Do not rename my personal boolean.`}
        >
          Ask the assistant to add one extra sample boolean:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-6"
        title="4.2.6 String State Variables"
      >
        <p>
          The <code>StringStateVariables</code>{" "}exercise illustrates
          using <code>useState</code>{" "}with string state variables. A{" "}
          <strong>controlled</strong> input uses <code>value</code>{" "}for
          what the field shows and <code>onChange</code>{" "}to write each
          keystroke back into state. The input field&apos;s value is
          initialized to the <code>firstName</code>{" "}state variable. The{" "}
          <code>onChange</code>{" "}attribute invokes the{" "}
          <code>setFirstName</code>{" "}mutator to update the state
          variable. The <code>e.target.value</code>{" "}contains the value
          of the input field and is used to update the current value of
          the state variable. Using <code>defaultValue</code>{" "}would
          leave the field uncontrolled after the first render — the
          heading and the input could drift apart. Lab 1 used{" "}
          <code>defaultValue</code>{" "}because there was no state yet;
          from here on, bind <code>value</code>. To practice with string
          state, create the <code>StringStateVariables</code>{" "}component
          below and import it from the Lab 4 page. Confirm the browser
          displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        className="w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        id="wd-first-name"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          This is two-way data binding for a text field: the paragraph
          reads <code>firstName</code>, the input writes it on every
          keystroke, and React rerenders so both stay in sync. Type in the
          input and watch the paragraph update:
        </p>
        <LiveDemo
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
          mode="styled"
        >
          <StringStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>lastName</code>{" "}state string and a second controlled
          input. Show both names together under the heading.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/StringStateVariables.tsx, keep any extra string I added. After firstName, add const [nickName, setNickName] = useState("JD") with a controlled input id="wd-nick-name" and interpolate nickName under firstName. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample string field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-7"
        title="4.2.7 Date State Variables"
      >
        <p>
          The <code>DateStateVariable</code>{" "}component illustrates how
          to work with date state variables. The{" "}
          <code>startDate</code>{" "}state variable is initialized to a
          fixed local date,{" "}
          <code>new Date(2026, 0, 15, 10, 30)</code>. Those arguments are
          the year, month, day, hour, and minute. Months count from 0, so
          this is January 15, 2026 at 10:30. A <code>Date</code>&apos;s text
          is not what an HTML date input expects. HTML date inputs speak{" "}
          <code>YYYY-MM-DD</code>. A JavaScript <code>Date</code>{" "}does
          not. The <code>dateObjectToHtmlDateString</code>{" "}function
          converts a <code>Date</code>{" "}object into that format so the
          field&apos;s <code>value</code>{" "}attribute matches what the
          browser picker requires. Changes in the date field are handled
          by the <code>onChange</code>{" "}attribute, which passes the
          field&apos;s <code>YYYY-MM-DD</code>{" "}text to{" "}
          <code>htmlDateStringToDate</code>. That function reads the year,
          month, and day as numbers and builds a local{" "}
          <code>Date</code>{" "}with{" "}
          <code>new Date(year, month - 1, day, 0, 0)</code>, then updates
          the state with the <code>setStartDate</code>{" "}mutator. To
          practice with date state, create the{" "}
          <code>DateStateVariable</code>{" "}component below and import it
          from the Lab 4 page. Confirm the browser displays as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

function htmlDateStringToDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0);
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date(2026, 0, 15, 10, 30));
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{startDate.toDateString()}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(htmlDateStringToDate(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first heading shows the date as text; the second shows the{" "}
          <code>YYYY-MM-DD</code>{" "}string the picker understands. Pick a
          new date and confirm both headings update. Assignment due dates
          and course start dates in Kambaz will use this same conversion
          later:
        </p>
        <LiveDemo
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
          mode="styled"
        >
          <DateStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add an <code>endDate</code>{" "}state value and a second date input.
          Show both formatted strings.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/DateStateVariable.tsx, keep any extra date I added. After startDate, add const [dueDate, setDueDate] = useState(new Date(2026, 0, 22, 10, 30)) with a type="date" input id="wd-due-date" bound the same way as startDate. Do not rename my personal date.`}
        >
          Ask the assistant to add one extra sample date field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-8"
        title="4.2.8 Object State Variables"
      >
        <p>
          The <code>ObjectStateVariable</code>{" "}component demonstrates
          how to work with object state variables. We declare a{" "}
          <code>person</code>{" "}object state variable with initial
          property values <code>name</code>{" "}and <code>age</code>. The
          object is rendered on the screen using{" "}
          <code>JSON.stringify</code>{" "}so you can see the changes in
          real time. Two input fields are initialized to the object&apos;s{" "}
          <code>person.name</code>{" "}string property and the object&apos;s{" "}
          <code>person.age</code>{" "}number property. As the user types,
          the <code>onChange</code>{" "}attribute updates the object&apos;s
          property using the <code>setPerson</code>{" "}mutator. The object
          is updated by creating a new object copied from the previous
          value using the spread operator{" "}
          <code>{`{ ...person }`}</code>, and then overriding the{" "}
          <code>name</code>{" "}or <code>age</code>{" "}property with the
          new <code>target.value</code>. When the state value is an
          object, replace it with a new one rather than editing the old
          one in place. Writing{" "}
          <code>person.name = e.target.value</code>{" "}would edit the old
          object in place, and React may skip the render because the
          reference did not change. To practice with object state, create
          the <code>ObjectStateVariable</code>{" "}component below and
          import it from the Lab 4 page. Confirm the browser displays as
          shown.
        </p>
        <CodeBlock
          language="tsx"
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        id="wd-person-name"
      />
      <input
        type="number"
        className="block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) || 0 })
        }
        id="wd-person-age"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Each keystroke builds a new object: the spread copies every
          field you did not touch, and the named field overrides the one
          you did. The age field parses the string from the number input
          so the property stays a number. Type in either field and watch
          the JSON preview update:
        </p>
        <LiveDemo
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
          mode="styled"
        >
          <ObjectStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>city</code>{" "}property to the person object and a
          controlled input that updates it with the spread pattern.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ObjectStateVariable.tsx, keep any extra field I added. Add a sample city: "Boston" on the initial person object and a controlled input id="wd-person-city" that sets city with { ...person, city: e.target.value }. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample object field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-9"
        title="4.2.9 Array State Variables"
      >
        <p>
          The <code>ArrayStateVariable</code>{" "}component demonstrates
          how to work with array state variables. An array of integers is
          declared as a state variable, and functions{" "}
          <code>addElement</code>{" "}and <code>deleteElement</code>{" "}
          add and remove elements. We render the array as a map of line
          items in an unordered list. We render the array&apos;s value and
          a Delete button for each element. Clicking Delete calls{" "}
          <code>deleteElement</code>{" "}and passes the index of the
          element we want to remove. That function computes a new array
          filtering out the element by its position and updates the state
          variable to contain a new array without the element we filtered
          out. Clicking Add Element invokes{" "}
          <code>addElement</code>, which computes a new array with a copy
          of the previous array spread at the beginning and a new random
          element at the end. Arrays follow the same
          replace-don&apos;t-mutate rule as objects: compute a new array,
          append with spread, and remove with <code>filter</code>. The
          Delete button receives the index through an arrow so it is not
          called during render. To practice with array state, create the{" "}
          <code>ArrayStateVariable</code>{" "}component below, import it
          from the Lab 4 page, and confirm it works as expected. Style the
          list with Tailwind so the output renders as shown.
        </p>
        <CodeBlock
          language="tsx"
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button
        type="button"
        onClick={addElement}
        id="wd-add-element-click"
        className="mb-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add Element
      </button>
      <ul className="m-0 max-w-xs list-none p-0">
        {array.map((item, index) => (
          <li
            key={\`\${item}-\${index}\`}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 bg-green-50 px-3 py-1"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => deleteElement(index)}
              id={\`wd-delete-element-\${index}-click\`}
              className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
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
          Add a few random numbers, then delete one from the middle, and
          confirm the list redraws without mutating the old array in
          place. Kambaz courses and modules will use this same spread and{" "}
          <code>filter</code>{" "}pattern inside a Zustand store:
        </p>
        <LiveDemo
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
          mode="styled"
        >
          <ArrayStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a Clear button that sets the array back to{" "}
          <code>[1, 2, 3, 4, 5]</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ArrayStateVariable.tsx, keep any extra button I added. After Add Element, add a sample button id="wd-clear-array-click" that calls setArray([1, 2, 3, 4, 5]). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Clear after your own control:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-10"
        title="4.2.10 Putting It Together: A Profile Form"
      >
        <p>
          The last few sections each used one kind of state at a time. A real form mixes them. This section builds a profile page — the screen where a person enters and edits facts about themselves — that combines every kind of state from <SectionLink to="4.2.5" />{" "}through <SectionLink to="4.2.9" />: <em>strings</em>{" "}for the first name, last name, and password; a <em>date</em>{" "}for the date of birth; a <em>string chosen from a fixed list</em>{" "}for the role; a <em>boolean</em>{" "}for a newsletter checkbox; an <em>array</em>{" "}for a set of topic checkboxes; and a string picked with <em>radio buttons</em>{" "}for the theme. All of them live together in one <em>object</em>, the profile.
        </p>
        <p>
          Before the user&apos;s data is saved, the form runs <em>validation</em>: a check that every field holds an acceptable value. When the user clicks Save, the form validates the whole profile. Each invalid field shows an <em>error message</em>{" "}directly under it, and an <em>alert</em>{" "}— a highlighted banner at the top of the form — says how many fields need fixing, or that the profile was saved. We build it in four steps.
        </p>
        <p>
          <strong>Step 1: the data and the rules.</strong>{" "}Start with a plain TypeScript file that has no React in it. A <em>type</em>{" "}describes the shape of a value; <code>Profile</code>{" "}lists every field and its type. <code>Role</code>{" "}is a <em>union type</em>: the role may only be one of the listed strings, and the empty string means &quot;not chosen yet&quot;. <code>Date | null</code>{" "}means the date of birth is either a <code>Date</code>{" "}or <code>null</code>{" "}while the date field is empty. <code>ProfileErrors</code>{" "}uses two built-in helper types: <code>Record&lt;keyof Profile, string&gt;</code>{" "}is an object with one string per profile field, and <code>Partial</code>{" "}makes every one of those keys optional, so a field with no problem simply has no entry. <code>emptyProfile</code>{" "}is the starting value. <code>dateToHtml</code>{" "}and <code>htmlToDate</code>{" "}are the same <code>YYYY-MM-DD</code>{" "}conversions from <SectionLink to="4.2.7" />, extended so an empty field maps to <code>null</code>. Finally, <code>validateProfile</code>{" "}is a <em>pure function</em>{" "}— it only reads its argument and returns a new value — that returns one message per invalid field. Because it has no React in it, any version of the form can reuse it:
        </p>
        <CodeBlock
          language="ts"
          name="profile"
          file="app/labs/lab4/profile/profile.ts"
        >{`export type Role = "" | "STUDENT" | "TA" | "FACULTY";
export type Theme = "light" | "dark";

export type Profile = {
  firstName: string;
  lastName: string;
  password: string;
  dob: Date | null;
  role: Role;
  newsletter: boolean;
  topics: string[];
  theme: Theme;
};

export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export const TOPICS = ["HTML", "CSS", "React"];

export const emptyProfile: Profile = {
  firstName: "",
  lastName: "",
  password: "",
  dob: null,
  role: "",
  newsletter: false,
  topics: [],
  theme: "light",
};

export function dateToHtml(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

export function htmlToDate(text: string) {
  if (!text) return null;
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function validateProfile(profile: Profile) {
  const errors: ProfileErrors = {};
  if (profile.firstName.trim() === "") {
    errors.firstName = "First name is required.";
  }
  if (profile.lastName.trim() === "") {
    errors.lastName = "Last name is required.";
  }
  if (profile.password.length < 8) {
    errors.password = "Password needs at least 8 characters.";
  }
  if (!profile.dob || profile.dob > new Date()) {
    errors.dob = "Pick a date of birth in the past.";
  }
  if (profile.role === "") {
    errors.role = "Choose a role.";
  }
  if (profile.topics.length === 0) {
    errors.topics = "Pick at least one topic.";
  }
  return errors;
}`}</CodeBlock>
        <p>
          <strong>Step 2: the fields.</strong>{" "}<code>ProfileFields</code>{" "}draws every input and receives everything it needs as props: the current <code>profile</code>, the <code>errors</code>{" "}to show, and an <code>update</code>{" "}function that takes a <code>Partial&lt;Profile&gt;</code>{" "}— just the fields that changed. Each input is <em>controlled</em>, as in <SectionLink to="4.2.6" />: its <code>value</code>{" "}(or <code>checked</code>) comes from state and its <code>onChange</code>{" "}calls <code>update</code>. The <code>&lt;select&gt;</code>{" "}element is a drop-down list of <code>&lt;option&gt;</code>{" "}elements; the first option has an empty value so the form can tell when no role was picked. <code>e.target.value as Role</code>{" "}tells TypeScript the chosen value is one of the <code>Role</code>{" "}strings. The topic checkboxes add or remove a topic from the <code>topics</code>{" "}array with the same spread and <code>filter</code>{" "}calls as <SectionLink to="4.2.9" />. Radio buttons that share a <code>name</code>{" "}attribute form a group where only one can be selected. A <code>&lt;fieldset&gt;</code>{" "}groups related inputs and its <code>&lt;legend&gt;</code>{" "}is the group&apos;s caption. The <code>prefix</code>{" "}prop builds every <code>wd-*</code>{" "}id, so the same fields can appear several times on one page without repeating an id. Under each field, <code>{"{errors.firstName && <p>...</p>}"}</code>{" "}shows the message only when there is one. Notice that <code>ProfileFields</code>{" "}does not start with{" "}<code>&quot;use client&quot;</code>: modules imported by a Client Component already run on the client, so the directive is only needed at the server/client boundary, on the file a server page imports.
        </p>
        <CodeBlock
          language="tsx"
          name="ProfileFields"
          file="app/labs/lab4/profile/ProfileFields.tsx"
        >{`import {
  dateToHtml,
  htmlToDate,
  TOPICS,
  type Profile,
  type ProfileErrors,
  type Role,
} from "./profile";

const input = "block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5";
const error = "text-sm text-red-600";

export default function ProfileFields({
  prefix,
  profile,
  errors,
  update,
}: {
  prefix: string;
  profile: Profile;
  errors: ProfileErrors;
  update: (changes: Partial<Profile>) => void;
}) {
  const toggleTopic = (topic: string) =>
    update({
      topics: profile.topics.includes(topic)
        ? profile.topics.filter((t) => t !== topic)
        : [...profile.topics, topic],
    });
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={\`\${prefix}-first-name\`}>First name</label>
      <input
        id={\`\${prefix}-first-name\`}
        className={input}
        value={profile.firstName}
        onChange={(e) => update({ firstName: e.target.value })}
      />
      {errors.firstName && <p className={error}>{errors.firstName}</p>}

      <label htmlFor={\`\${prefix}-last-name\`}>Last name</label>
      <input
        id={\`\${prefix}-last-name\`}
        className={input}
        value={profile.lastName}
        onChange={(e) => update({ lastName: e.target.value })}
      />
      {errors.lastName && <p className={error}>{errors.lastName}</p>}

      <label htmlFor={\`\${prefix}-password\`}>Password</label>
      <input
        id={\`\${prefix}-password\`}
        type="password"
        className={input}
        value={profile.password}
        onChange={(e) => update({ password: e.target.value })}
      />
      {errors.password && <p className={error}>{errors.password}</p>}

      <label htmlFor={\`\${prefix}-dob\`}>Date of birth</label>
      <input
        id={\`\${prefix}-dob\`}
        type="date"
        className={input}
        value={dateToHtml(profile.dob)}
        onChange={(e) => update({ dob: htmlToDate(e.target.value) })}
      />
      {errors.dob && <p className={error}>{errors.dob}</p>}

      <label htmlFor={\`\${prefix}-role\`}>Role</label>
      <select
        id={\`\${prefix}-role\`}
        className={input}
        value={profile.role}
        onChange={(e) => update({ role: e.target.value as Role })}
      >
        <option value="">Choose a role</option>
        <option value="STUDENT">Student</option>
        <option value="TA">Teaching assistant</option>
        <option value="FACULTY">Faculty</option>
      </select>
      {errors.role && <p className={error}>{errors.role}</p>}

      <label className="flex items-center gap-2">
        <input
          id={\`\${prefix}-newsletter\`}
          type="checkbox"
          checked={profile.newsletter}
          onChange={() => update({ newsletter: !profile.newsletter })}
        />
        Email me the newsletter
      </label>

      <fieldset id={\`\${prefix}-topics\`}>
        <legend>Topics</legend>
        {TOPICS.map((topic) => (
          <label key={topic} className="mr-4 inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={profile.topics.includes(topic)}
              onChange={() => toggleTopic(topic)}
            />
            {topic}
          </label>
        ))}
      </fieldset>
      {errors.topics && <p className={error}>{errors.topics}</p>}

      <fieldset id={\`\${prefix}-theme\`}>
        <legend>Theme</legend>
        <label className="mr-4 inline-flex items-center gap-1">
          <input
            type="radio"
            name={\`\${prefix}-theme\`}
            checked={profile.theme === "light"}
            onChange={() => update({ theme: "light" })}
          />
          Light
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            name={\`\${prefix}-theme\`}
            checked={profile.theme === "dark"}
            onChange={() => update({ theme: "dark" })}
          />
          Dark
        </label>
      </fieldset>
    </div>
  );
}`}</CodeBlock>
        <p>
          <strong>Step 3: the alert.</strong>{" "}<code>ProfileAlert</code>{" "}shows nothing until the form has been submitted. After that it counts the keys of <code>errors</code>{" "}with <code>Object.keys</code>: zero means the profile is valid and the banner says so; otherwise it says how many fields to fix. The <code>role=&quot;alert&quot;</code>{" "}attribute asks screen readers to announce the banner as soon as it appears, and <code>role=&quot;status&quot;</code>{" "}marks the quieter success message:
        </p>
        <CodeBlock
          language="tsx"
          name="ProfileAlert"
          file="app/labs/lab4/profile/ProfileAlert.tsx"
        >{`import type { ProfileErrors } from "./profile";

export default function ProfileAlert({
  id,
  submitted,
  errors,
}: {
  id: string;
  submitted: boolean;
  errors: ProfileErrors;
}) {
  if (!submitted) return null;
  const count = Object.keys(errors).length;
  if (count === 0) {
    return (
      <div id={id} role="status" className="mb-3 rounded bg-green-100 p-2 text-green-800">
        Profile saved.
      </div>
    );
  }
  return (
    <div id={id} role="alert" className="mb-3 rounded bg-red-100 p-2 text-red-800">
      Please fix {count} {count === 1 ? "field" : "fields"} below.
    </div>
  );
}`}</CodeBlock>
        <p>
          <strong>Step 4: the form and its state.</strong>{" "}<code>ProfileForm</code>{" "}owns three state variables: the <code>profile</code>{" "}object, the latest <code>errors</code>, and a <code>submitted</code>{" "}boolean. <code>update</code>{" "}copies the profile and overwrites only the changed fields with <code>{"{ ...profile, ...changes }"}</code>, the object-spread pattern from <SectionLink to="4.2.8" />. A form&apos;s <code>onSubmit</code>{" "}runs when the user clicks a <code>type=&quot;submit&quot;</code>{" "}button or presses Enter in a field. By default the browser would then reload the page, so <code>save</code>{" "}first calls <code>e.preventDefault()</code>{" "}to stop that, then stores the result of <code>validateProfile</code>. The <code>noValidate</code>{" "}attribute turns off the browser&apos;s own built-in checks so that our messages are the only ones shown. The <code>&lt;pre&gt;</code>{" "}prints the profile object so you can watch every type change as you type; a real page would never print a password like this. Create the four files and render <code>ProfileForm</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ProfileForm"
          file="app/labs/lab4/profile/ProfileForm.tsx"
        >{`"use client";

import { useState, type FormEvent } from "react";
import { emptyProfile, validateProfile, type Profile, type ProfileErrors } from "./profile";
import ProfileFields from "./ProfileFields";
import ProfileAlert from "./ProfileAlert";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (changes: Partial<Profile>) =>
    setProfile({ ...profile, ...changes });
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return (
    <form id="wd-profile-form" onSubmit={save} noValidate>
      <h2>Profile</h2>
      <ProfileAlert id="wd-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </form>
  );
}`}</CodeBlock>
        <p>
          Click Save with the form empty and confirm each field shows its message and the banner counts six fields. Fill in the fields one at a time and save again; the count drops until the banner reports the profile saved. Notice the date, checkboxes, and radios each update a different type inside the same object:
        </p>
        <LiveDemo
          name="ProfileForm"
          file="app/labs/lab4/profile/ProfileForm.tsx"
          mode="styled"
        >
          <ProfileForm />
        </LiveDemo>
      </Section>
    </>
  );
}
