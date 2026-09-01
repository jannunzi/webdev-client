import type { QuizQuestion } from "./types";

/** Curated self-check bank for Chapter 4 labs. The quiz draws 10. */
export const CH4_LAB_QUESTIONS: QuizQuestion[] = [
  {
    id: "4-use-client",
    section: "4.2.1",
    kind: "syntax",
    prompt:
      "Which directive must appear at the top of a file that uses onClick or useState?",
    choices: [
      { id: "a", text: '"use server"' },
      { id: "b", text: '"use client"' },
      { id: "c", text: '"use hook"' },
      { id: "d", text: '"use strict"' },
    ],
    answer: "b",
    explanation:
      "Event handlers and hooks run in the browser. The file that uses them starts with \"use client\".",
  },
  {
    id: "4-onclick-reference",
    section: "4.2.1",
    kind: "concept",
    prompt:
      "Why is onClick={hello} correct and onClick={hello()} usually wrong?",
    choices: [
      { id: "a", text: "hello() is not a function" },
      {
        id: "b",
        text: "hello() runs during render and passes the return value to onClick; hello is a function reference for later",
      },
      { id: "c", text: "React forbids parentheses in JSX" },
      { id: "d", text: "onClick only accepts strings" },
    ],
    answer: "b",
    explanation:
      "Parentheses call the function immediately while React is rendering. Pass the function itself so React can call it on the click.",
  },
  {
    id: "4-pass-data-arrow",
    section: "4.2.2",
    kind: "syntax",
    prompt:
      "How do you pass an argument into an event handler without calling it during render?",
    choices: [
      { id: "a", text: "onClick={lifeIs(\"Good\")}" },
      { id: "b", text: "onClick={() => lifeIs(\"Good\")}" },
      { id: "c", text: "onClick=\"lifeIs(Good)\"" },
      { id: "d", text: "onClick={lifeIs}" },
    ],
    answer: "b",
    explanation:
      "An arrow delays the call until the event. onClick={lifeIs(\"Good\")} runs lifeIs during render. onClick={lifeIs} cannot pass the string.",
  },
  {
    id: "4-broken-let",
    section: "4.2.4",
    kind: "concept",
    prompt:
      "A counter uses let count = 7 and count++ in onClick. Why does the heading stay at 7?",
    choices: [
      { id: "a", text: "let cannot store numbers" },
      {
        id: "b",
        text: "React does not re-render when a local variable changes; useState's setter queues a new render",
      },
      { id: "c", text: "Buttons cannot change variables" },
      { id: "d", text: "count++ is illegal in TypeScript" },
    ],
    answer: "b",
    explanation:
      "The increment happens, but React only re-renders when state or props change. useState's setter is how you tell React to paint again.",
  },
  {
    id: "4-usestate-pair",
    section: "4.2.4",
    kind: "blank",
    prompt:
      "useState returns a pair: the current value and a _____ that queues a new render.",
    answer: "setter",
    accept: [
      "mutator",
      "setter function",
      "set function",
      "dispatcher",
      "setCount",
    ],
    explanation:
      "The second item is the setter (sometimes called a mutator). Calling it with a new value schedules a re-render.",
  },
  {
    id: "4-controlled-value",
    section: "4.2.6",
    kind: "concept",
    prompt:
      "For a text field bound to useState, which attributes keep the input and the heading in sync?",
    choices: [
      { id: "a", text: "defaultValue only" },
      { id: "b", text: "value and onChange" },
      { id: "c", text: "checked and htmlFor" },
      { id: "d", text: "name and id" },
    ],
    answer: "b",
    explanation:
      "A controlled input uses value for what the field shows and onChange to write e.target.value back into state. defaultValue leaves the field uncontrolled after the first paint.",
  },
  {
    id: "4-object-spread",
    section: "4.2.8",
    kind: "snippet",
    prompt: "Which update creates a new person object so React notices the change?",
    code: `const [person, setPerson] = useState({ name: "Peter", age: 24 });`,
    choices: [
      { id: "a", text: "person.name = e.target.value;" },
      { id: "b", text: "setPerson({ ...person, name: e.target.value });" },
      { id: "c", text: "person = { name: e.target.value };" },
      { id: "d", text: "setPerson(person);" },
    ],
    answer: "b",
    explanation:
      "State objects must be replaced. Spread copies the previous fields, then name overrides the copy. Mutating person.name in place may skip the render.",
  },
  {
    id: "4-array-filter",
    section: "4.2.9",
    kind: "puzzle",
    prompt: "What is array after deleteElement(1) if it started as [1, 2, 3]?",
    code: `const deleteElement = (index: number) => {
  setArray(array.filter((_item, i) => i !== index));
};`,
    choices: [
      { id: "a", text: "[1, 2, 3]" },
      { id: "b", text: "[1, 3]" },
      { id: "c", text: "[2, 3]" },
      { id: "d", text: "[1, 2]" },
    ],
    answer: "b",
    explanation:
      "filter keeps items whose index is not 1, so 2 (the middle value) is removed and [1, 3] remains.",
  },
  {
    id: "4-lift-state",
    section: "4.3.1",
    kind: "concept",
    prompt:
      "A parent shows Counter {counter} and a child increments it. Where should useState live?",
    choices: [
      { id: "a", text: "Only in the child — parents cannot show child data" },
      {
        id: "b",
        text: "In the parent, which passes counter and setCounter down",
      },
      { id: "c", text: "In Redux — sharing through a parent is not allowed" },
      { id: "d", text: "In document.title" },
    ],
    answer: "b",
    explanation:
      "Declare the pair in the closest common parent. The child receives the value and the setter as props and does not own a second copy.",
  },
  {
    id: "4-prop-drilling",
    section: "4.3.2",
    kind: "blank",
    prompt:
      "Forwarding props through a component that does not use them is called prop _____.",
    answer: "drilling",
    accept: ["drill", "prop drilling"],
    explanation:
      "Prop drilling is passing values through layers that only forward them. Context or Zustand can skip those layers when the drill is real.",
  },
  {
    id: "4-query-vs-path",
    section: "4.3.3",
    kind: "concept",
    prompt:
      "Which URL strategy is a better fit for optional filters such as search text?",
    choices: [
      { id: "a", text: "Path parameters in [a]/[b] folders" },
      { id: "b", text: "Query parameters after ?" },
      { id: "c", text: "localStorage only" },
      { id: "d", text: "HTTP headers" },
    ],
    answer: "b",
    explanation:
      "Query strings are optional name/value pairs. Path parameters identify the resource (a course id). Search and pagination belong after ?.",
  },
  {
    id: "4-search-params",
    section: "4.3.3",
    kind: "syntax",
    prompt:
      "Which hook reads a=5 from /labs/lab4/url-encoding/query-params?a=5&b=10?",
    choices: [
      { id: "a", text: "useParams" },
      { id: "b", text: "useSearchParams" },
      { id: "c", text: "useState" },
      { id: "d", text: "usePathname" },
    ],
    answer: "b",
    explanation:
      "useSearchParams decodes the query string. useParams reads [a] and [b] folders. Wrap useSearchParams in Suspense.",
  },
  {
    id: "4-context-when",
    section: "4.4",
    kind: "concept",
    prompt: "When is React Context the wrong tool?",
    choices: [
      { id: "a", text: "A theme or signed-in user in a subtree" },
      {
        id: "b",
        text: "A list such as todos or modules that changes on every keystroke",
      },
      { id: "c", text: "Avoiding prop drilling for a stable course id" },
      { id: "d", text: "Values that change rarely" },
    ],
    answer: "b",
    explanation:
      "Every context consumer re-renders when the value changes. Use Context for stable subtree data. Put lists that change often in Zustand.",
  },
  {
    id: "4-context-provider",
    section: "4.4",
    kind: "snippet",
    prompt: "What happens if a child calls useCounterContext outside CounterProvider?",
    code: `export function useCounterContext() {
  const value = useContext(CounterContext);
  if (!value) {
    throw new Error("useCounterContext must be used inside CounterProvider");
  }
  return value;
}`,
    choices: [
      { id: "a", text: "It returns { count: 0 }" },
      { id: "b", text: "It throws" },
      { id: "c", text: "It silently uses Redux" },
      { id: "d", text: "It creates a new provider" },
    ],
    answer: "b",
    explanation:
      "The hook checks for a missing provider and throws so you notice the tree is wired wrong instead of reading null.",
  },
  {
    id: "4-zustand-hook",
    section: "4.5.1",
    kind: "concept",
    prompt: "How does a component read Zustand state?",
    choices: [
      { id: "a", text: "It must wrap the tree in a Provider" },
      { id: "b", text: "It calls a hook such as useCounterStore((s) => s.count)" },
      { id: "c", text: "It imports the JSON file again" },
      { id: "d", text: "It uses useSelector from react-redux" },
    ],
    answer: "b",
    explanation:
      "Zustand is a hook. Select the fields you need so the component re-renders when those fields change. No provider is required.",
  },
  {
    id: "4-zustand-set",
    section: "4.5.1",
    kind: "syntax",
    prompt: "Inside create(), how do you increment count based on the previous state?",
    choices: [
      { id: "a", text: "count++" },
      { id: "b", text: "set((state) => ({ count: state.count + 1 }))" },
      { id: "c", text: "dispatch(up())" },
      { id: "d", text: "setCount(count + 1)" },
    ],
    answer: "b",
    explanation:
      "Zustand's set can take a function of the previous state and return the fields to merge. count++ would mutate in place.",
  },
  {
    id: "4-redux-dispatch",
    section: "4.6",
    kind: "syntax",
    prompt: "In Redux Toolkit, what does the Up button call?",
    choices: [
      { id: "a", text: "setCount(count + 1)" },
      { id: "b", text: "dispatch(up())" },
      { id: "c", text: "up()" },
      { id: "d", text: "store.count += 1" },
    ],
    answer: "b",
    explanation:
      "You dispatch the action creator from the slice. Calling up() alone returns an action object; dispatch sends it to the reducer.",
  },
  {
    id: "4-redux-provider",
    section: "4.6",
    kind: "concept",
    prompt: "What does Redux need that Zustand does not?",
    choices: [
      { id: "a", text: "A Provider around components that call useSelector" },
      { id: "b", text: "JSON files" },
      { id: "c", text: '"use client"' },
      { id: "d", text: "Tailwind" },
    ],
    answer: "a",
    explanation:
      "configureStore creates the store; Provider makes it available. Zustand stores are modules you import as hooks.",
  },
  {
    id: "4-useeffect-deps",
    section: "4.7",
    kind: "concept",
    prompt:
      "useEffect(() => { document.title = name; }, [name]) runs again when:",
    choices: [
      { id: "a", text: "Every mouse move" },
      { id: "b", text: "After paint, whenever name changes" },
      { id: "c", text: "Only if count also changes" },
      { id: "d", text: "Never — effects cannot touch the document" },
    ],
    answer: "b",
    explanation:
      "Effects run after React paints. The dependency array lists values that should re-run the effect. [name] re-runs when name changes.",
  },
  {
    id: "4-useeffect-empty",
    section: "4.7",
    kind: "syntax",
    prompt: "What does an empty dependency array [] mean?",
    choices: [
      { id: "a", text: "Run the effect after every render" },
      { id: "b", text: "Run the effect only after the first paint" },
      { id: "c", text: "Skip the effect forever" },
      { id: "d", text: "Run the effect before render" },
    ],
    answer: "b",
    explanation:
      "[] means no reactive values. The effect runs once after mount. Omit the array and it runs after every paint.",
  },
  {
    id: "4-kambaz-store",
    section: "4.10.1",
    kind: "concept",
    prompt:
      "Why does this chapter put Kambaz courses in Zustand instead of useState on the Dashboard?",
    choices: [
      { id: "a", text: "useState cannot store arrays" },
      {
        id: "b",
        text: "Home and other screens need the same list; Dashboard useState would be invisible there",
      },
      { id: "c", text: "Zustand is required by Next.js" },
      { id: "d", text: "JSON files cannot be imported into Zustand" },
    ],
    answer: "b",
    explanation:
      "State in Dashboard dies at that page. A Zustand store is a module any Client Component can subscribe to, so Home sees new courses too.",
  },
  {
    id: "4-prevent-default",
    section: "4.10.2",
    kind: "concept",
    prompt:
      "Edit and Delete sit inside a Link on a course card. Why call event.preventDefault()?",
    choices: [
      { id: "a", text: "To stop React from rendering" },
      {
        id: "b",
        text: "To stop the Link from navigating so the click can edit or delete instead",
      },
      { id: "c", text: "To convert the button into a checkbox" },
      { id: "d", text: "Zustand requires preventDefault on every click" },
    ],
    answer: "b",
    explanation:
      "A click bubbles to the Link and would open the course. preventDefault keeps the user on the dashboard so the store can update.",
  },
  {
    id: "4-nav-toggle-usestate",
    section: "4.10.3",
    kind: "concept",
    prompt:
      "The hamburger that shows and hides Course Navigation should use:",
    choices: [
      { id: "a", text: "Zustand — all UI flags belong in the app store" },
      {
        id: "b",
        text: "useState in the course layout — the flag is local to that screen",
      },
      { id: "c", text: "Redux Toolkit only" },
      { id: "d", text: "A new JSON file" },
    ],
    answer: "b",
    explanation:
      "A show/hide flag is one-layout UI state. Putting it in Zustand would be replacing useState on a single counter — the table in 4.10 says not to.",
  },
  {
    id: "4-spa-acronym",
    section: "4.1",
    kind: "acronym",
    prompt: "In this course, SPA stands for:",
    choices: [
      { id: "a", text: "Server Page Application" },
      { id: "b", text: "Single Page Application" },
      { id: "c", text: "State Provider API" },
      { id: "d", text: "Static Path Array" },
    ],
    answer: "b",
    explanation:
      "A Single Page Application loads one HTML document and swaps views as the URL changes, which is why client state can survive navigation inside the app until a full reload.",
  },
  {
    id: "4-controlled-blank",
    section: "4.2.6",
    kind: "blank",
    prompt:
      "An input whose displayed text always comes from React state is called a _____ component (or controlled input).",
    answer: "controlled",
    accept: ["controlled input", "controlled field", "controlled form"],
    explanation:
      "Controlled means value={state} plus onChange that writes back. Uncontrolled fields use defaultValue and keep their own DOM value.",
  },
];
