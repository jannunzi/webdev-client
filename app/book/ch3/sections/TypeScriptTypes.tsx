import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import TypeAnnotations from "@/app/labs/lab3/types/TypeAnnotations";
import ObjectTypes from "@/app/labs/lab3/types/ObjectTypes";
import Interfaces from "@/app/labs/lab3/types/Interfaces";
import UnionTypes from "@/app/labs/lab3/types/UnionTypes";
import Enums from "@/app/labs/lab3/types/Enums";
import FunctionTypes from "@/app/labs/lab3/types/FunctionTypes";
import TypedProps from "@/app/labs/lab3/types/TypedProps";
import Narrowing from "@/app/labs/lab3/types/Narrowing";
import AnyVsUnknown from "@/app/labs/lab3/types/AnyVsUnknown";
import UtilityTypes from "@/app/labs/lab3/types/UtilityTypes";

export default function TypeScriptTypes() {
  return (
    <Section id="sec-3-5" title="3.5 TypeScript Types">
      <p>
        The files in this course end in <code>.ts</code>{" "}and{" "}
        <code>.tsx</code>{" "}because they are written in TypeScript:
        JavaScript plus <strong>types</strong>{" "}that describe what each
        variable, object, and function holds. Your editor uses the types to
        suggest names and flag mistakes as you type, and{" "}
        <code>next build</code>{" "}refuses to build code whose types do not
        line up, which is why a page can work in <code>npm run dev</code>{" "}
        and still fail on Vercel. The types are removed when the code runs,
        so the browser only ever sees plain JavaScript. Each step below adds
        a small component under <code>app/labs/lab3/types</code>, and all of
        them render together on a page at{" "}
        <code>app/labs/lab3/types/page.tsx</code>:
      </p>
        <CodeBlock
          language="tsx"
          name="TypesPage"
          file="app/labs/lab3/types/page.tsx"
        >{`import TypeAnnotations from "./TypeAnnotations";
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
}`}</CodeBlock>
      <p>
        Open <LocalUrl href="/labs/lab3/types" />{" "}as you add each
        component.
      </p>
      <Section id="sec-3-5-1" title="3.5.1 Type Annotations" level={3}>
        <p>
          A <strong>type annotation</strong>{" "}is a colon and a type after a
          variable or parameter name. It tells TypeScript what kind of value
          the name may hold, and <code>next build</code>{" "}refuses code that
          stores anything else there. The primitive types are{" "}
          <code>string</code>, <code>number</code>, and <code>boolean</code>,
          and adding <code>[]</code>{" "}after a type, as in{" "}
          <code>string[]</code>, makes an array of that type. Create{" "}
          <code>app/labs/lab3/types/TypeAnnotations.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="TypeAnnotations"
          file="app/labs/lab3/types/TypeAnnotations.tsx"
        >{`export default function TypeAnnotations() {
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
}`}</CodeBlock>
        <p>
          The last two constants have no annotation. TypeScript{" "}
          <strong>infers</strong>{" "}their types from the values they start
          with, so <code>section</code>{" "}is a <code>string</code>{" "}and{" "}
          <code>seats</code>{" "}is a <code>number</code>, and assigning{" "}
          <code>seats = &quot;forty&quot;</code>{" "}later would still be an
          error. Write an annotation when the type is not obvious from the
          value, and let inference handle the rest:
        </p>
        <LiveDemo name="TypeAnnotations" file="app/labs/lab3/types/TypeAnnotations.tsx">
          <TypeAnnotations />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-2" title="3.5.2 Object Types and Type Aliases" level={3}>
        <p>
          The <code>type</code>{" "}keyword gives a name, or{" "}
          <strong>alias</strong>, to a type, which is most useful for the
          shape of an object. Each property is listed with its own type, and
          a <code>?</code>{" "}after the property name makes it optional, so
          an object may leave it out. Create <code>ObjectTypes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ObjectTypes"
          file="app/labs/lab3/types/ObjectTypes.tsx"
        >{`type Course = {
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
}`}</CodeBlock>
        <p>
          <code>algorithms</code>{" "}has no <code>description</code>, which is
          allowed because the property is optional. Reading an optional
          property gives <code>undefined</code>{" "}when it is missing, so the
          listing falls back with <code>??</code>. Leaving out a required
          property such as <code>credits</code>, or misspelling one, fails
          the build:
        </p>
        <LiveDemo name="ObjectTypes" file="app/labs/lab3/types/ObjectTypes.tsx">
          <ObjectTypes />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-3" title="3.5.3 Interfaces" level={3}>
        <p>
          An <code>interface</code>{" "}also describes the shape of an object.
          For objects it works almost the same as a <code>type</code>{" "}alias,
          and one interface can build on another with{" "}
          <code>extends</code>. A <code>type</code>{" "}alias gets the same
          result by combining types with <code>&amp;</code>. Create{" "}
          <code>Interfaces.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Interfaces"
          file="app/labs/lab3/types/Interfaces.tsx"
        >{`interface Person {
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
}`}</CodeBlock>
        <p>
          <code>Student</code>{" "}has every property of <code>Person</code>{" "}
          plus its own, and so does <code>Faculty</code>. Interfaces only
          describe objects, while <code>type</code>{" "}can also name unions,
          functions, and primitives, which is why this book mostly uses{" "}
          <code>type</code>. Pick one style and use it consistently in a
          project:
        </p>
        <LiveDemo name="Interfaces" file="app/labs/lab3/types/Interfaces.tsx">
          <Interfaces />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-4" title="3.5.4 Union and Literal Types" level={3}>
        <p>
          A <strong>union type</strong>{" "}joins types with <code>|</code>{" "}
          and means &quot;any one of these.&quot; A{" "}
          <strong>literal type</strong>{" "}is a single exact value, such as{" "}
          <code>&quot;STUDENT&quot;</code>. A union of literals limits a value
          to a fixed list of choices, like the roles a user can have. Create{" "}
          <code>UnionTypes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="UnionTypes"
          file="app/labs/lab3/types/UnionTypes.tsx"
        >{`type Role = "STUDENT" | "FACULTY" | "TA";
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
}`}</CodeBlock>
        <p>
          Assigning <code>&quot;ADMIN&quot;</code>{" "}to <code>role</code>{" "}
          would fail the build because it is not one of the three listed
          values, and your editor suggests the valid ones as you type.{" "}
          <code>Id</code>{" "}accepts either a <code>string</code>{" "}or a{" "}
          <code>number</code>:
        </p>
        <LiveDemo name="UnionTypes" file="app/labs/lab3/types/UnionTypes.tsx">
          <UnionTypes />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-5" title="3.5.5 Enums" level={3}>
        <p>
          An <code>enum</code>{" "}declares a named set of constants. Each
          member can be given a value, as in <code>Grade</code>, or left to
          count up from <code>0</code>, as in <code>Weekday</code>. You read
          a member with a dot, like <code>Grade.A</code>. Create{" "}
          <code>Enums.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Enums"
          file="app/labs/lab3/types/Enums.tsx"
        >{`enum Grade {
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
}`}</CodeBlock>
        <p>
          <code>Weekday.Wednesday</code>{" "}is the number <code>2</code>, and{" "}
          <code>Weekday[day]</code>{" "}looks the name back up. Unlike other
          types, an enum also creates a real object that runs in the
          browser. When the values are plain strings that come from data,
          such as a user&apos;s role in JSON, a union of literals like{" "}
          <code>Status</code>{" "}is usually the better choice: it needs no
          import and matches the strings directly:
        </p>
        <LiveDemo name="Enums" file="app/labs/lab3/types/Enums.tsx">
          <Enums />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-6" title="3.5.6 Function Types" level={3}>
        <p>
          Function parameters take annotations the same way variables do,
          and the type after the parameter list is the type the function
          returns. A <code>?</code>{" "}makes a parameter optional, a default
          value makes it optional and fills it in, and <code>void</code>{" "}
          means the function returns nothing. A type alias can also describe
          a whole function. Create <code>FunctionTypes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="FunctionTypes"
          file="app/labs/lab3/types/FunctionTypes.tsx"
        >{`function add(a: number, b: number): number {
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
}`}</CodeBlock>
        <p>
          Calling <code>add(&quot;2&quot;, 3)</code>{" "}would fail the build.{" "}
          <code>multiply</code>{" "}needs no annotations on <code>a</code>{" "}
          and <code>b</code>{" "}because its <code>Operation</code>{" "}type
          already declares them. <code>logMessage</code>{" "}writes to the
          console of the terminal running <code>npm run dev</code>, since
          this is a Server Component:
        </p>
        <LiveDemo name="FunctionTypes" file="app/labs/lab3/types/FunctionTypes.tsx">
          <FunctionTypes />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-7" title="3.5.7 Typing React Props" level={3}>
        <p>
          A component&apos;s props are just an object, so they are typed with
          an object type, usually named <code>Props</code>. The{" "}
          <code>children</code>{" "}prop, like the one the <code>Square</code>{" "}
          and <code>Box</code>{" "}components receive in{" "}
          <SectionLink to="3.8.1" />, has the type <code>ReactNode</code>,
          which covers text, elements, and lists of them. Create{" "}
          <code>CourseBadge.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="CourseBadge"
          file="app/labs/lab3/types/CourseBadge.tsx"
        >{`import type { ReactNode } from "react";

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
}`}</CodeBlock>
        <p>
          <code>credits</code>{" "}is optional in <code>Props</code>{" "}and gets
          a default in the destructured parameters. Then create{" "}
          <code>TypedProps.tsx</code>{" "}to render two badges:
        </p>
        <CodeBlock
          language="tsx"
          name="TypedProps"
          file="app/labs/lab3/types/TypedProps.tsx"
        >{`import CourseBadge from "./CourseBadge";

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
}`}</CodeBlock>
        <p>
          Leaving out <code>number</code>{" "}or passing{" "}
          <code>credits=&quot;3&quot;</code>{" "}as a string fails the build,
          and the editor lists the available props as you type:
        </p>
        <LiveDemo name="TypedProps" file="app/labs/lab3/types/TypedProps.tsx">
          <TypedProps />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-8" title="3.5.8 Null, Undefined, and Narrowing" level={3}>
        <p>
          TypeScript treats <code>null</code>{" "}and <code>undefined</code>{" "}
          as their own types, so a value that might be missing is written
          as a union such as <code>string | null</code>. Before you use it,
          you check it. After a check like <code>if (value === null)</code>{" "}
          or <code>typeof value === &quot;number&quot;</code>, TypeScript{" "}
          <strong>narrows</strong>{" "}the type and lets you call methods that
          only that type has. The optional chaining <code>?.</code>{" "}and
          nullish coalescing <code>??</code>{" "}operators from{" "}
          <SectionLink to="3.4.17" />{" "}do the same for optional
          properties. Create <code>Narrowing.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Narrowing"
          file="app/labs/lab3/types/Narrowing.tsx"
        >{`type User = {
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
}`}</CodeBlock>
        <p>
          Inside <code>describe</code>, calling{" "}
          <code>value.toFixed(1)</code>{" "}before the checks would fail,
          because <code>value</code>{" "}could still be a string or{" "}
          <code>null</code>. After each <code>return</code>, the remaining
          possibilities shrink until only <code>string</code>{" "}is left:
        </p>
        <LiveDemo name="Narrowing" file="app/labs/lab3/types/Narrowing.tsx">
          <Narrowing />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-9" title="3.5.9 any vs unknown" level={3}>
        <p>
          The type <code>any</code>{" "}turns type checking off for a value:
          you can call anything on it, and mistakes only show up when the
          code runs. The type <code>unknown</code>{" "}also accepts any value,
          but you must narrow it before using it. Use <code>unknown</code>{" "}
          for data whose shape you do not control, such as the result of{" "}
          <code>JSON.parse</code>, and avoid <code>any</code>. The project&apos;s
          ESLint setup reports <code>any</code>, so the listing switches that
          rule off for one line. Create <code>AnyVsUnknown.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="AnyVsUnknown"
          file="app/labs/lab3/types/AnyVsUnknown.tsx"
        >{`function lengthOf(value: unknown): number {
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
}`}</CodeBlock>
        <p>
          <code>anything.toUpperCase()</code>{" "}works here only because the
          value happens to be a string; if it were a number, the build would
          still pass and the page would crash. With <code>unknown</code>,
          the <code>typeof</code>, <code>Array.isArray</code>, and{" "}
          <code>in</code>{" "}checks are required before the value can be
          read:
        </p>
        <LiveDemo name="AnyVsUnknown" file="app/labs/lab3/types/AnyVsUnknown.tsx">
          <AnyVsUnknown />
        </LiveDemo>
      </Section>
      <Section id="sec-3-5-10" title="3.5.10 Utility Types: Partial, Record, and keyof" level={3}>
        <p>
          TypeScript can build new types from existing ones.{" "}
          <code>Partial&lt;Course&gt;</code>{" "}is the <code>Course</code>{" "}
          object type from Step 2 with every property made optional, which
          fits an update that changes only some fields.{" "}
          <code>keyof Course</code>{" "}is the union of its property names,{" "}
          <code>&quot;name&quot; | &quot;number&quot; | &quot;credits&quot;</code>.{" "}
          <code>Record&lt;string, number&gt;</code>{" "}is an object whose keys
          are strings and whose values are numbers. Create{" "}
          <code>UtilityTypes.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="UtilityTypes"
          file="app/labs/lab3/types/UtilityTypes.tsx"
        >{`type Course = {
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
      fields = {fields.map((field) => \`\${field}: \${updated[field]}\`).join(", ")}{" "}
      <br />
      enrollment.CS5610 = {enrollment.CS5610}, enrollment.CS5800 ={" "}
      {enrollment.CS5800}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>updated[field]</code>{" "}is allowed because <code>field</code>{" "}
          can only be one of <code>Course</code>&apos;s property names. The
          values between the angle brackets are type parameters: they let one
          utility type work with any object type you give it:
        </p>
        <LiveDemo name="UtilityTypes" file="app/labs/lab3/types/UtilityTypes.tsx">
          <UtilityTypes />
        </LiveDemo>
      </Section>
    </Section>
  );
}
