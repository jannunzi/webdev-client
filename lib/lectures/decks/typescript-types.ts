import type { LectureSlide } from "../types";

export const TYPESCRIPT_TYPES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · TypeScript Types",
      "§3.5 · describe what each value holds",
    ],
  },
  {
    id: "purpose",
    title: "Implementing TypeScript Types",
    kind: "content",
    bullets: [
      "Files end in `.ts` and `.tsx` because they are written in **TypeScript**",
      "TypeScript is JavaScript plus **types** that describe what each variable, object, and function holds",
      "Your editor uses the types to suggest names and flag mistakes as you type",
      "`next build` refuses to build code whose types do not line up, so a page can work in `npm run dev` and still fail on Vercel",
      "The types are removed when the code runs: the browser only ever sees plain JavaScript",
    ],
  },
  {
    id: "page",
    title: "TypesPage renders every step",
    kind: "content",
    bullets: [
      "Each step adds a small component under `app/labs/lab3/types`",
      "All of them render together at `app/labs/lab3/types/page.tsx`. Open `/labs/lab3/types` as you add each one",
    ],
    code: `import TypeAnnotations from "./TypeAnnotations";
import ObjectTypes from "./ObjectTypes";
import Interfaces from "./Interfaces";
import UnionTypes from "./UnionTypes";
import Enums from "./Enums";
import FunctionTypes from "./FunctionTypes";
import TypedProps from "./TypedProps";
import Narrowing from "./Narrowing";
import AnyVsUnknown from "./AnyVsUnknown";
import UtilityTypes from "./UtilityTypes";

export default function TypesPage() {
  return (
    <div id="wd-lab3-types" className="p-4">
      <h2>TypeScript Types</h2>
      <TypeAnnotations />
      <ObjectTypes />
      <Interfaces />
      <UnionTypes />
      <Enums />
      <FunctionTypes />
      <TypedProps />
      <Narrowing />
      <AnyVsUnknown />
      <UtilityTypes />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/page.tsx",
  },
  {
    id: "annotations",
    title: "Type annotations and inference",
    kind: "content",
    bullets: [
      "A **type annotation** is a colon and a type after a name, like `credits: number`",
      "Primitive types: `string`, `number`, `boolean`. `string[]` is an array of strings",
      "No annotation? TypeScript **infers** the type from the starting value",
    ],
    code: `export default function TypeAnnotations() {
  const course: string = "Web Development";
  const credits: number = 4;
  const isOnline: boolean = false;
  const topics: string[] = ["HTML", "CSS", "JavaScript"];
  const section = "CS5610"; // inferred as string
  const seats = 40; // inferred as number
  return (
    <div id="wd-type-annotations">
      <h4>Type Annotations</h4>
      course = {course} <br />
      credits = {credits} <br />
      isOnline = {isOnline + ""} <br />
      topics = {topics.join(", ")} <br />
      section = {section}, seats = {seats}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/TypeAnnotations.tsx",
  },
  {
    id: "annotations-live",
    title: "TypeAnnotations: live demo",
    kind: "demo",
    bullets: [
      "`next build` refuses code that stores the wrong kind of value in an annotated name",
      "`section` is inferred as `string` and `seats` as `number`, so `seats = \"forty\"` would still be an error",
      "Write an annotation when the type is not obvious from the value, and let inference handle the rest",
    ],
    embed: "ts-type-annotations",
  },
  {
    id: "object-types-intro",
    title: "Object types and type aliases",
    kind: "content",
    bullets: [
      "The `type` keyword gives a name, or **alias**, to a type",
      "Most useful for the shape of an object: each property is listed with its own type",
      "A `?` after a property name makes it **optional**, so an object may leave it out",
    ],
  },
  {
    id: "object-types",
    title: "ObjectTypes.tsx",
    kind: "content",
    code: `type Course = {
  name: string;
  number: string;
  credits: number;
  description?: string;
};

export default function ObjectTypes() {
  const webDev: Course = {
    name: "Web Development",
    number: "CS5610",
    credits: 4,
    description: "Full stack web apps",
  };
  const algorithms: Course = {
    name: "Algorithms",
    number: "CS5800",
    credits: 4,
  };
  return (
    <div id="wd-object-types">
      <h4>Object Types</h4>
      {webDev.number} {webDev.name}: {webDev.description} <br />
      {algorithms.number} {algorithms.name}:{" "}
      {algorithms.description ?? "no description"}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/ObjectTypes.tsx",
  },
  {
    id: "object-types-live",
    title: "ObjectTypes: live demo",
    kind: "demo",
    bullets: [
      "`algorithms` has no `description`, which is allowed because the property is optional",
      "Reading a missing optional property gives `undefined`, so the listing falls back with `??`",
      "Leaving out a required property such as `credits`, or misspelling one, fails the build",
    ],
    embed: "ts-object-types",
  },
  {
    id: "interfaces-intro",
    title: "Interfaces, extends, and &",
    kind: "content",
    bullets: [
      "An `interface` also describes the shape of an object",
      "For objects it works almost the same as a `type` alias",
      "One interface can build on another with `extends`",
      "A `type` alias gets the same result by combining types with `&`",
    ],
  },
  {
    id: "interfaces",
    title: "Interfaces.tsx",
    kind: "content",
    code: `interface Person {
  firstName: string;
  lastName: string;
}

interface Student extends Person {
  nuid: string;
  section: string;
}

type Faculty = Person & { office: string };

export default function Interfaces() {
  const student: Student = {
    firstName: "Alice",
    lastName: "Wonderland",
    nuid: "001234567",
    section: "CS5610-02",
  };
  const faculty: Faculty = {
    firstName: "Bob",
    lastName: "Builder",
    office: "WVH 310",
  };
  return (
    <div id="wd-interfaces">
      <h4>Interfaces</h4>
      {student.firstName} {student.lastName} ({student.nuid}) is in{" "}
      {student.section} <br />
      {faculty.firstName} {faculty.lastName} works in {faculty.office}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/Interfaces.tsx",
  },
  {
    id: "interfaces-live",
    title: "Interfaces: live demo",
    kind: "demo",
    bullets: [
      "`Student` has every property of `Person` plus its own, and so does `Faculty`",
      "Interfaces only describe objects; `type` can also name unions, functions, and primitives",
      "This course mostly uses `type`. Pick one style and use it consistently in a project",
    ],
    embed: "ts-interfaces",
  },
  {
    id: "unions",
    title: "Union and literal types",
    kind: "content",
    bullets: [
      "A **union type** joins types with `|` and means “any one of these”",
      "A **literal type** is a single exact value, such as `\"STUDENT\"`",
      "A union of literals limits a value to a fixed list of choices, like a user’s roles",
    ],
    code: `type Role = "STUDENT" | "FACULTY" | "TA";
type Id = string | number;

export default function UnionTypes() {
  const role: Role = "FACULTY";
  const courseId: Id = "RS101";
  const userId: Id = 123;
  const roles: Role[] = ["STUDENT", "FACULTY", "TA"];
  return (
    <div id="wd-union-types">
      <h4>Union and Literal Types</h4>
      role = {role} <br />
      courseId = {courseId}, userId = {userId} <br />
      roles = {roles.join(" | ")}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/UnionTypes.tsx",
  },
  {
    id: "unions-live",
    title: "UnionTypes: live demo",
    kind: "demo",
    bullets: [
      "Assigning `\"ADMIN\"` to `role` fails the build: it is not one of the three listed values",
      "Your editor suggests the valid values as you type",
      "`Id` accepts either a `string` or a `number`",
    ],
    embed: "ts-union-types",
  },
  {
    id: "enums-intro",
    title: "Enums",
    kind: "content",
    bullets: [
      "An `enum` declares a named set of constants",
      "Each member can be given a value, as in `Grade`, or count up from `0`, as in `Weekday`",
      "You read a member with a dot, like `Grade.A`",
    ],
  },
  {
    id: "enums",
    title: "Enums.tsx",
    kind: "content",
    code: `enum Grade {
  A = "A",
  B = "B",
  C = "C",
}

enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
}

type Status = "OPEN" | "CLOSED";

export default function Enums() {
  const grade: Grade = Grade.A;
  const day: Weekday = Weekday.Wednesday;
  const status: Status = "OPEN";
  return (
    <div id="wd-enums">
      <h4>Enums</h4>
      grade = {grade} <br />
      day = {day} ({Weekday[day]}) <br />
      status = {status}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/Enums.tsx",
  },
  {
    id: "enums-live",
    title: "Enums: live demo",
    kind: "demo",
    bullets: [
      "`Weekday.Wednesday` is the number `2`, and `Weekday[day]` looks the name back up",
      "Unlike other types, an enum also creates a real object that runs in the browser",
      "For plain strings that come from data, like a role in JSON, a union of literals such as `Status` is usually better: no import, and it matches the strings directly",
    ],
    embed: "ts-enums",
  },
  {
    id: "functions-intro",
    title: "Function types",
    kind: "content",
    bullets: [
      "Parameters take annotations the same way variables do",
      "The type after the parameter list is the type the function returns",
      "A `?` makes a parameter optional; a default value makes it optional and fills it in",
      "`void` means the function returns nothing",
      "A type alias can also describe a whole function, like `Operation`",
    ],
  },
  {
    id: "functions",
    title: "FunctionTypes.tsx",
    kind: "content",
    code: `function add(a: number, b: number): number {
  return a + b;
}

const fullName = (first: string, last?: string): string =>
  last ? \`\${first} \${last}\` : first;

const greet = (name: string = "World"): string => \`Hello \${name}\`;

function logMessage(message: string): void {
  console.log(message);
}

type Operation = (a: number, b: number) => number;
const multiply: Operation = (a, b) => a * b;

export default function FunctionTypes() {
  logMessage("FunctionTypes rendered");
  return (
    <div id="wd-function-types">
      <h4>Function Types</h4>
      add(2, 3) = {add(2, 3)} <br />
      fullName(&quot;Alice&quot;) = {fullName("Alice")} <br />
      fullName(&quot;Alice&quot;, &quot;Wonderland&quot;) ={" "}
      {fullName("Alice", "Wonderland")} <br />
      greet() = {greet()} <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/FunctionTypes.tsx",
  },
  {
    id: "functions-live",
    title: "FunctionTypes: live demo",
    kind: "demo",
    bullets: [
      "Calling `add(\"2\", 3)` would fail the build",
      "`multiply` needs no annotations on `a` and `b`: its `Operation` type already declares them",
      "`logMessage` writes to the terminal running `npm run dev`, not the browser console",
    ],
    embed: "ts-function-types",
  },
  {
    id: "badge",
    title: "Typing React props",
    kind: "content",
    bullets: [
      "Props are just an object, so they get an object type, usually named `Props`",
      "`children` has the type `ReactNode`, which covers text, elements, and lists of them",
      "`credits` is optional in `Props` and gets a default in the destructured parameters",
    ],
    code: `import type { ReactNode } from "react";

type Props = {
  number: string;
  credits?: number;
  children: ReactNode;
};

export default function CourseBadge({ number, credits = 4, children }: Props) {
  return (
    <div style={{ border: "1px solid gray", padding: "5px", margin: "5px" }}>
      <strong>{number}</strong> ({credits} credits): {children}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/CourseBadge.tsx",
  },
  {
    id: "props",
    title: "TypedProps renders two badges",
    kind: "content",
    bullets: [
      "`TypedProps` passes `number`, `credits`, and `children` to `CourseBadge`",
    ],
    code: `import CourseBadge from "./CourseBadge";

export default function TypedProps() {
  return (
    <div id="wd-typed-props">
      <h4>Typing React Props</h4>
      <CourseBadge number="CS5610">Web Development</CourseBadge>
      <CourseBadge number="CS5800" credits={3}>
        Algorithms
      </CourseBadge>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/TypedProps.tsx",
  },
  {
    id: "props-live",
    title: "TypedProps: live demo",
    kind: "demo",
    bullets: [
      "Leaving out `number` fails the build",
      "Passing `credits=\"3\"` as a string fails the build too",
      "The editor lists the available props as you type",
    ],
    embed: "ts-typed-props",
  },
  {
    id: "narrowing-intro",
    title: "Null, undefined, and narrowing",
    kind: "content",
    bullets: [
      "TypeScript treats `null` and `undefined` as their own types",
      "A value that might be missing is a union, such as `string | null`, and you check it before use",
      "After a check like `value === null` or `typeof value === \"number\"`, TypeScript **narrows** the type: you can call methods only that type has",
      "`?.` and `??` from §3.4.17 do the same for optional properties",
    ],
  },
  {
    id: "narrowing",
    title: "Narrowing.tsx",
    kind: "content",
    code: `type User = {
  username: string;
  email?: string;
  address?: { city: string };
};

function describe(value: string | number | null): string {
  if (value === null) return "nothing";
  if (typeof value === "number") return \`the number \${value.toFixed(1)}\`;
  return \`the text "\${value.toUpperCase()}"\`;
}

export default function Narrowing() {
  const alice: User = { username: "alice", address: { city: "Boston" } };
  const bob: User = { username: "bob" };
  const nickname: string | undefined = undefined;
  return (
    <div id="wd-narrowing">
      <h4>Null, Undefined, and Narrowing</h4>
      describe(null) = {describe(null)} <br />
      describe(7) = {describe(7)} <br />
      describe(&quot;hi&quot;) = {describe("hi")} <br />
      alice.address?.city = {alice.address?.city} <br />
      bob.address?.city ?? &quot;unknown&quot; ={" "}
      {bob.address?.city ?? "unknown"} <br />
      nickname ?? &quot;none&quot; = {nickname ?? "none"}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/Narrowing.tsx",
  },
  {
    id: "narrowing-live",
    title: "Narrowing: live demo",
    kind: "demo",
    bullets: [
      "Calling `value.toFixed(1)` before the checks would fail: `value` could still be a string or `null`",
      "After each `return`, the remaining possibilities shrink until only `string` is left",
      "`bob` has no `address`, so `?.` gives `undefined` and `??` prints `\"unknown\"`",
    ],
    embed: "ts-narrowing",
  },
  {
    id: "any-unknown-intro",
    title: "any vs unknown",
    kind: "content",
    bullets: [
      "`any` turns type checking off: you can call anything on it, and mistakes only show up when the code runs",
      "`unknown` also accepts any value, but you must narrow it before using it",
      "Use `unknown` for data whose shape you do not control, such as what `JSON.parse` returns from a JSON string, and avoid `any`",
      "The project’s lint rules report `any`, so the listing switches that rule off for one line",
    ],
  },
  {
    id: "any-unknown",
    title: "AnyVsUnknown.tsx",
    kind: "content",
    code: `function lengthOf(value: unknown): number {
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) return value.length;
  return 0;
}

export default function AnyVsUnknown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anything: any = "hello";
  const parsed: unknown = JSON.parse('{"name": "Alice"}');
  const name =
    typeof parsed === "object" && parsed !== null && "name" in parsed
      ? String(parsed.name)
      : "unknown";
  return (
    <div id="wd-any-vs-unknown">
      <h4>any vs unknown</h4>
      anything.toUpperCase() = {anything.toUpperCase()} <br />
      lengthOf(&quot;hello&quot;) = {lengthOf("hello")} <br />
      lengthOf([1, 2, 3]) = {lengthOf([1, 2, 3])} <br />
      lengthOf(42) = {lengthOf(42)} <br />
      parsed name = {name}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/AnyVsUnknown.tsx",
  },
  {
    id: "any-unknown-live",
    title: "AnyVsUnknown: live demo",
    kind: "demo",
    bullets: [
      "`anything.toUpperCase()` works only because the value happens to be a string",
      "If it were a number, the build would still pass and the page would crash",
      "With `unknown`, the `typeof`, `Array.isArray`, and `in` checks are required before the value can be read",
    ],
    embed: "ts-any-vs-unknown",
  },
  {
    id: "utility-intro",
    title: "Utility types: Partial, Record, keyof",
    kind: "content",
    bullets: [
      "TypeScript can build new types from existing ones",
      "`Partial<Course>` is `Course` with every property optional, which fits an update that changes only some fields",
      "`keyof Course` is the union of its property names: `\"name\" | \"number\" | \"credits\"`",
      "`Record<string, number>` is an object whose keys are strings and whose values are numbers",
    ],
  },
  {
    id: "utility",
    title: "UtilityTypes.tsx",
    kind: "content",
    code: `type Course = {
  name: string;
  number: string;
  credits: number;
};

type CourseUpdate = Partial<Course>;
type CourseField = keyof Course;
type Enrollment = Record<string, number>;

export default function UtilityTypes() {
  const course: Course = { name: "Web Dev", number: "CS5610", credits: 4 };
  const update: CourseUpdate = { name: "Web Development" };
  const updated: Course = { ...course, ...update };
  const fields: CourseField[] = ["name", "number", "credits"];
  const enrollment: Enrollment = { CS5610: 120, CS5800: 85 };
  return (
    <div id="wd-utility-types">
      <h4>Utility Types</h4>
      updated.name = {updated.name} <br />
      fields = {fields.map((field) => \`\${field}: \${updated[field]}\`).join(", ")} <br />
      enrollment.CS5610 = {enrollment.CS5610}, enrollment.CS5800 ={" "}
      {enrollment.CS5800}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/types/UtilityTypes.tsx",
  },
  {
    id: "utility-live",
    title: "UtilityTypes: live demo",
    kind: "demo",
    bullets: [
      "`updated[field]` is allowed because `field` can only be one of `Course`’s property names",
      "The values between the angle brackets are **type parameters**: they let one utility type work with any object type you give it",
    ],
    embed: "ts-utility-types",
  },
  {
    id: "recap",
    title: "TypeScript types recap",
    kind: "content",
    bullets: [
      "Annotate what is not obvious; let inference do the rest",
      "`type` and `interface` name object shapes; `?` marks optional properties",
      "Unions of literals limit values to a fixed list; enums are real objects",
      "Narrow `null`, `undefined`, and `unknown` before use; avoid `any`",
    ],
  },
  {
    id: "next-up",
    title: "Next: style from data",
    kind: "title",
    bullets: [
      "Classes and inline styles can follow a variable",
      "§3.6: `className={`wd-bg-${color}`}` and `style={bgBlue}`",
    ],
  },
];
