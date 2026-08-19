import type { QuizQuestion } from "./types";

/** Curated self-check bank for Chapter 3 labs. The quiz draws 10. */
export const CH3_LAB_QUESTIONS: QuizQuestion[] = [
  {
    id: "3-var-let-const",
    section: "3.2.1",
    kind: "concept",
    prompt:
      "Which declaration is block-scoped and cannot be reassigned?",
    choices: [
      { id: "a", text: "var" },
      { id: "b", text: "let" },
      { id: "c", text: "const" },
      { id: "d", text: "function" },
    ],
    answer: "c",
    explanation:
      "const is block-scoped and not reassigned. let is block-scoped but can change. var is the older function-scoped form.",
  },
  {
    id: "3-strict-equals",
    section: "3.2.3",
    kind: "syntax",
    prompt:
      "Which comparison should you use so that both value and type must match?",
    choices: [
      { id: "a", text: "==" },
      { id: "b", text: "===" },
      { id: "c", text: "=" },
      { id: "d", text: "!===" },
    ],
    answer: "b",
    explanation:
      "=== (and !==) compare value and type. == coerces types, so null == undefined is true even though they are different values.",
  },
  {
    id: "3-boolean-jsx",
    section: "3.2.2",
    kind: "concept",
    prompt:
      "Why does the lab write booleanVariable + \"\" instead of interpolating the boolean alone?",
    choices: [
      { id: "a", text: "JavaScript forbids booleans inside components" },
      {
        id: "b",
        text: "JSX does not render a bare boolean, so concatenating an empty string turns it into visible text",
      },
      { id: "c", text: "typeof only works on strings" },
      { id: "d", text: "The + \"\" operator converts numbers to booleans" },
    ],
    answer: "b",
    explanation:
      "A boolean in curly braces produces nothing on the page. Concatenating \"\" coerces it to \"true\" or \"false\".",
  },
  {
    id: "3-ternary",
    section: "3.2.5",
    kind: "snippet",
    prompt: "What does this JSX render when loggedIn is false?",
    code: `{loggedIn ? <p>Welcome</p> : <p>Please login</p>}`,
    choices: [
      { id: "a", text: "Welcome" },
      { id: "b", text: "Please login" },
      { id: "c", text: "Both paragraphs" },
      { id: "d", text: "Nothing" },
    ],
    answer: "b",
    explanation:
      "A ternary picks the value after ? when the predicate is true, and the value after : when it is false.",
  },
  {
    id: "3-short-circuit",
    section: "3.2.6",
    kind: "concept",
    prompt:
      "In {loggedIn && <h2>Welcome Inline</h2>}, when does the heading appear?",
    choices: [
      { id: "a", text: "Always — && ignores the left side" },
      {
        id: "b",
        text: "Only when loggedIn is true; otherwise the right-hand side is skipped",
      },
      { id: "c", text: "Only when loggedIn is false" },
      { id: "d", text: "Only in client components" },
    ],
    answer: "b",
    explanation:
      "&& short-circuits: a falsy left side never evaluates the heading, so nothing renders.",
  },
  {
    id: "3-typeof-null",
    section: "3.2.7",
    kind: "puzzle",
    prompt: "What does typeof null return in JavaScript?",
    choices: [
      { id: "a", text: '"null"' },
      { id: "b", text: '"undefined"' },
      { id: "c", text: '"object"' },
      { id: "d", text: '"boolean"' },
    ],
    answer: "c",
    explanation:
      "A well-known quirk: typeof null is \"object\". typeof undefined is \"undefined\". null is an assigned empty value; undefined means nothing was assigned.",
  },
  {
    id: "3-es6-acronym",
    section: "3.3.1",
    kind: "acronym",
    prompt: "What does ES6 refer to?",
    choices: [
      { id: "a", text: "Embedded Stylesheet 6" },
      { id: "b", text: "ECMAScript 2015 (the 6th edition of ECMAScript)" },
      { id: "c", text: "Express Server 6" },
      { id: "d", text: "Error Syntax 6" },
    ],
    answer: "b",
    explanation:
      "ES6 is ECMAScript 2015. It introduced arrow functions, let/const, template literals, and modules.",
  },
  {
    id: "3-spa-acronym",
    section: "3.1",
    kind: "acronym",
    prompt: "What does SPA stand for in this chapter?",
    choices: [
      { id: "a", text: "Server Page Application" },
      { id: "b", text: "Style Property Attribute" },
      { id: "c", text: "Single Page Application" },
      { id: "d", text: "Static Package Archive" },
    ],
    answer: "c",
    explanation:
      "A Single Page Application loads one HTML document and React swaps views as the URL changes, without a full reload for every screen.",
  },
  {
    id: "3-arrow-syntax",
    section: "3.3.1",
    kind: "syntax",
    prompt: "Which snippet is a valid ES6 arrow function?",
    choices: [
      { id: "a", text: "function subtract(a, b) = a - b;" },
      { id: "b", text: "const subtract = (a: number, b: number) => { return a - b; };" },
      { id: "c", text: "const subtract(a, b) { return a - b; }" },
      { id: "d", text: "arrow subtract(a, b) => a - b;" },
    ],
    answer: "b",
    explanation:
      "Arrow functions are stored in a const (or let). Parameters go in parentheses; => separates them from the body.",
  },
  {
    id: "3-implied-return",
    section: "3.3.2",
    kind: "syntax",
    prompt:
      "Which implied-return arrow is equivalent to (a, b) => { return a * b; }?",
    choices: [
      { id: "a", text: "(a, b) => a * b" },
      { id: "b", text: "(a, b) => return a * b" },
      { id: "c", text: "(a, b) { a * b }" },
      { id: "d", text: "function (a, b) => a * b" },
    ],
    answer: "a",
    explanation:
      "When the body is a single expression, drop the braces and the return — the expression is the return value.",
  },
  {
    id: "3-template-literal",
    section: "3.3.3",
    kind: "snippet",
    prompt: "Which string uses a template literal?",
    choices: [
      { id: "a", text: '"Welcome home " + username' },
      { id: "b", text: "'Welcome home ${username}'" },
      { id: "c", text: "`Welcome home ${username}`" },
      { id: "d", text: "Welcome home {username}" },
    ],
    answer: "c",
    explanation:
      "Template literals use backticks. ${…} embeds an expression. Single and double quotes do not interpolate.",
  },
  {
    id: "3-react-key",
    section: "3.4.4",
    kind: "concept",
    prompt:
      "When you map an array to JSX list items, why does each sibling need a key?",
    choices: [
      { id: "a", text: "HTML forbids <li> without a key attribute" },
      {
        id: "b",
        text: "React uses key to match items across renders so it updates the right DOM node",
      },
      { id: "c", text: "key is required only for numbers, not strings" },
      { id: "d", text: "Next.js uses key to build the URL" },
    ],
    answer: "b",
    explanation:
      "Without a stable key, React warns and can reuse the wrong node. Prefer a unique id from your data; the lab uses key={todo} because those strings are unique.",
  },
  {
    id: "3-map-vs-filter",
    section: "3.4.7",
    kind: "concept",
    prompt: "What is the difference between map and filter?",
    choices: [
      {
        id: "a",
        text: "map returns a new array of transformed items; filter returns a new array of items that pass a predicate",
      },
      { id: "b", text: "filter transforms items; map deletes them" },
      { id: "c", text: "They are two names for the same function" },
      { id: "d", text: "map works only on strings; filter works only on numbers" },
    ],
    answer: "a",
    explanation:
      "map applies a function to every item. filter keeps items whose predicate is true. find returns the first match, not an array.",
  },
  {
    id: "3-find-undefined",
    section: "3.4.5",
    kind: "concept",
    prompt: "What does find return when no item matches the predicate?",
    choices: [
      { id: "a", text: "null" },
      { id: "b", text: "-1" },
      { id: "c", text: "undefined" },
      { id: "d", text: "an empty array" },
    ],
    answer: "c",
    explanation:
      "find returns the first matching element or undefined. findIndex returns -1 when nothing matches.",
  },
  {
    id: "3-json-acronym",
    section: "3.4.10",
    kind: "acronym",
    prompt: "What does JSON stand for?",
    choices: [
      { id: "a", text: "Java Syntax Object Network" },
      { id: "b", text: "JavaScript Object Notation" },
      { id: "c", text: "Just Simple Object Names" },
      { id: "d", text: "Joined String of Nodes" },
    ],
    answer: "b",
    explanation:
      "JSON is JavaScript Object Notation. JSON.stringify turns a value into text; JSON.parse turns text back into a value.",
  },
  {
    id: "3-spread-override",
    section: "3.4.13",
    kind: "puzzle",
    prompt: "What is obj3.b after this snippet?",
    code: `const obj1 = { a: 1, b: 2, c: 3 };
const obj3 = { ...obj1, b: 4 };`,
    choices: [
      { id: "a", text: "2 — spread always wins" },
      { id: "b", text: "4 — the later property overrides the copy" },
      { id: "c", text: "undefined" },
      { id: "d", text: "[2, 4]" },
    ],
    answer: "b",
    explanation:
      "Spread copies obj1 into a new object, then b: 4 overwrites the copied b: 2. Later properties win on a name collision.",
  },
  {
    id: "3-destructure-object",
    section: "3.4.14",
    kind: "blank",
    prompt:
      "Unpacking properties from an object (or items from an array) into distinct variables is called _____.",
    answer: "destructuring",
    accept: [
      "destructure",
      "destructing",
      "object destructuring",
      "destructuring assignment",
    ],
    explanation:
      "The operation is destructuring. Lab files keep the assignment spelling Destructing.tsx.",
  },
  {
    id: "3-destructure-array",
    section: "3.4.14",
    kind: "syntax",
    prompt:
      'After const [first, second, third] = ["one", "two", "three"], what is second?',
    choices: [
      { id: "a", text: '"one"' },
      { id: "b", text: '"two"' },
      { id: "c", text: '"three"' },
      { id: "d", text: "undefined" },
    ],
    answer: "b",
    explanation:
      "Array destructuring unpacks by position: first is index 0, second is index 1, third is index 2.",
  },
  {
    id: "3-includes-some-every",
    section: "3.4.8",
    kind: "concept",
    prompt:
      "Which method asks whether at least one item passes a predicate?",
    choices: [
      { id: "a", text: "includes" },
      { id: "b", text: "every" },
      { id: "c", text: "some" },
      { id: "d", text: "filter" },
    ],
    answer: "c",
    explanation:
      "some is true if any item passes. every requires all items. includes checks for a specific value, not a predicate.",
  },
  {
    id: "3-reduce",
    section: "3.4.9",
    kind: "puzzle",
    prompt: "What is sum?",
    code: `const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, n) => total + n, 0);`,
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "5" },
      { id: "c", text: "15" },
      { id: "d", text: "[1, 2, 3, 4, 5]" },
    ],
    answer: "c",
    explanation:
      "reduce folds the array into one value. Starting at 0, it adds each n: 0+1+2+3+4+5 = 15.",
  },
  {
    id: "3-optional-chaining",
    section: "3.4.17",
    kind: "syntax",
    prompt:
      "Which expression reads city only if address exists, without throwing if it is missing?",
    choices: [
      { id: "a", text: "house.address.city" },
      { id: "b", text: "house.address?.city" },
      { id: "c", text: "house.address??.city" },
      { id: "d", text: "house?.address.city" },
    ],
    answer: "b",
    explanation:
      "?. stops at the first null or undefined. house.address.city throws if address is missing. ?? supplies a default for nullish values.",
  },
  {
    id: "3-nullish",
    section: "3.4.17",
    kind: "concept",
    prompt: "When does ?? use the right-hand default?",
    choices: [
      {
        id: "a",
        text: "When the left side is null or undefined — not when it is 0 or \"\"",
      },
      { id: "b", text: "When the left side is any falsy value, including 0" },
      { id: "c", text: "Only when the left side is false" },
      { id: "d", text: "Never — ?? is an alias for ||" },
    ],
    answer: "a",
    explanation:
      "Nullish coalescing treats only null and undefined as missing. || would also replace 0 and empty strings.",
  },
  {
    id: "3-use-client",
    section: "3.6.1",
    kind: "syntax",
    prompt:
      "How do you opt a Next.js file into a Client Component so it can call usePathname?",
    choices: [
      { id: "a", text: "export const client = true;" },
      { id: "b", text: "Put \"use client\" as the first statement in the file" },
      { id: "c", text: "import { client } from \"next/client\"" },
      { id: "d", text: "Rename the file to *.client.tsx" },
    ],
    answer: "b",
    explanation:
      "\"use client\" at the top of the file makes it a Client Component. Without it, usePathname fails because the hook is not available on the server.",
  },
  {
    id: "3-client-vs-server",
    section: "3.6.1",
    kind: "concept",
    prompt:
      "Which statement matches the chapter’s box of client vs server components?",
    choices: [
      {
        id: "a",
        text: "Server components can use usePathname; client components can use fs",
      },
      {
        id: "b",
        text: "Server components can read the filesystem and process; client components can use hooks and the address bar",
      },
      { id: "c", text: "Both kinds can import node:fs" },
      { id: "d", text: "Client is the Next.js default" },
    ],
    answer: "b",
    explanation:
      "Server is the default. It can use fs and process. Client needs \"use client\" and is where hooks such as usePathname belong.",
  },
  {
    id: "3-children",
    section: "3.7.1",
    kind: "concept",
    prompt:
      "Where does the 4 in <Square>4</Square> show up inside the Square function?",
    choices: [
      { id: "a", text: "As props.a" },
      { id: "b", text: "As the children prop" },
      { id: "c", text: "As a path parameter named square" },
      { id: "d", text: "It does not — children only work on HTML tags" },
    ],
    answer: "b",
    explanation:
      "Content between a component’s tags is the children prop. Square converts that child to a number and returns its square.",
  },
  {
    id: "3-use-params",
    section: "3.7.3",
    kind: "syntax",
    prompt:
      "Which hook reads the [a] and [b] segments from /labs/lab3/add/1/2 in a Client Component?",
    choices: [
      { id: "a", text: "usePathname()" },
      { id: "b", text: "useParams()" },
      { id: "c", text: "useSearchParams()" },
      { id: "d", text: "useRouter()" },
    ],
    answer: "b",
    explanation:
      "useParams returns the dynamic-route segments. usePathname returns the whole path string. parseInt converts those strings to numbers before adding.",
  },
  {
    id: "3-json-import",
    section: "3.7.4",
    kind: "syntax",
    prompt: "How does TodoList load the array in todos.json?",
    choices: [
      { id: "a", text: "fetch(\"/todos.json\")" },
      { id: "b", text: "import todos from \"./todos.json\"" },
      { id: "c", text: "JSON.parse(todos.json)" },
      { id: "d", text: "require.todos()" },
    ],
    answer: "b",
    explanation:
      "Next.js lets you import JSON as a value. TodoList then maps that array onto TodoItem with key={todo.title}.",
  },
  {
    id: "3-key-todo",
    section: "3.7.4",
    kind: "snippet",
    prompt: "Which map call gives React a stable key for each todo?",
    code: `{todos.map((todo) => (
  ???
))}`,
    choices: [
      { id: "a", text: "<TodoItem todo={todo} />" },
      { id: "b", text: "<TodoItem key={todo.title} todo={todo} />" },
      { id: "c", text: "<TodoItem key={Math.random()} todo={todo} />" },
      { id: "d", text: "<TodoItem index={todo} />" },
    ],
    answer: "b",
    explanation:
      "Pass key on the component you return from map. A random key changes every render and defeats matching. Prefer a unique field from the data.",
  },
  {
    id: "3-default-export",
    section: "3.4.16",
    kind: "syntax",
    prompt:
      "Which import statement loads the default export from Math.ts?",
    choices: [
      { id: "a", text: 'import { Math } from "./Math"' },
      { id: "b", text: 'import Math from "./Math"' },
      { id: "c", text: 'import * as Math from "./Math.add"' },
      { id: "d", text: 'import default Math from "./Math"' },
    ],
    answer: "b",
    explanation:
      "A default export is imported without braces. Named exports use braces: import { add } from \"./Math\". Next.js page.tsx files must default-export the page component.",
  },
  {
    id: "3-default-param",
    section: "3.7.4",
    kind: "concept",
    prompt:
      "In TodoItem, what does todo = { title: \"Buy milk\", … } in the parameter list do?",
    choices: [
      { id: "a", text: "It always overwrites the todo the parent passes" },
      {
        id: "b",
        text: "It is a default parameter — that object is used only when the parent omits todo",
      },
      { id: "c", text: "It names the component Buy milk" },
      { id: "d", text: "It serializes the todo to JSON" },
    ],
    answer: "b",
    explanation:
      "Default parameters fill in a value when the argument is missing. Destructured props work the same way: { a, b = 0 }.",
  },
  {
    id: "3-try-catch",
    section: "3.6.2",
    kind: "concept",
    prompt:
      "Why does ServerComponentDemo wrap fs.readdirSync in try/catch?",
    choices: [
      { id: "a", text: "try/catch is required to import node:fs" },
      {
        id: "b",
        text: "readdirSync throws if the folder is missing; catch logs the error and leaves files as [] instead of crashing the page",
      },
      { id: "c", text: "try/catch turns the file into a Client Component" },
      { id: "d", text: "Without try/catch, JSON.stringify cannot run" },
    ],
    answer: "b",
    explanation:
      "try runs the risky call. catch handles a throw so the component can still render. Use it for Node I/O — and later, network calls — that can fail.",
  },
];
