import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";
import Link from "next/link";

export default function KambazHttp() {
  return (
    <Section
      id="sec-5-11"
      title="5.11 Implementing Kambaz HTTP APIs"
    >
      <p>
        <ChapterLink to={4} />{" "}put courses and modules in Zustand so
        Dashboard, Home, and Modules shared one in-browser array. That
        array is gone when the tab closes. This section moves the source
        of truth behind <code>/api</code>. The screens still use{" "}
        <code>useState</code>{" "}for the form draft and the list they
        display; they <code>fetch</code>{" "}to load and to write. A
        coverage checklist is in <SectionLink to="5.11.9" /> — use it
        after you have walked through the screens, not instead of
        wiring the APIs as you read.
      </p>
      <p>
        The store is still not MongoDB. It is a module-level array
        seeded from the JSON <SectionLink to="3.9.2" />{" "}already uses.
        You will keep that array in the Next.js process{" "}
        <em>and</em>{" "}a twin array in <code>server/</code>. Restart
        either process and that seed returns. That is enough to
        practice HTTP on both models from <SectionLink to="5.7.1" />.
        A later chapter will swap the array for a database without
        changing the URLs.
      </p>

      <Section
        level={3}
        id="sec-5-11-1"
        title="5.11.1 An In-Memory Kambaz Store"
      >
        <p>
          Keep types and the empty course object in a file Client
          Components can import without pulling the mutable arrays into
          the browser bundle. Create{" "}
          <code>app/api/kambaz/types.ts</code>:
        </p>
        <CodeBlock
          language="ts"
          name="kambaz types"
          file="app/api/kambaz/types.ts"
        >{`import type coursesJson from "@/app/(kambaz)/database/courses.json";

export type Course = (typeof coursesJson)[number];

export type Lesson = {
  _id: string;
  name: string;
  description: string;
  module: string;
};

export type CourseModule = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
};

export const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  department: "D123",
  credits: 4,
  description: "New Description",
  image: "/images/reactjs.jpg",
};`}</CodeBlock>
        <p>
          The store itself lives on the server.{" "}
          <code>structuredClone</code>{" "}copies the imported JSON so
          mutations do not edit the module cache. Create{" "}
          <code>app/api/kambaz/store.ts</code>{" "}with{" "}
          <code>get</code>/<code>add</code>/<code>update</code>/
          <code>delete</code>{" "}for courses and modules — the same
          operations Zustand had, now callable only from Route
          Handlers:
        </p>
        <CodeBlock
          language="ts"
          name="kambaz store"
          file="app/api/kambaz/store.ts"
        >{`import coursesJson from "@/app/(kambaz)/database/courses.json";
import modulesJson from "@/app/(kambaz)/database/modules.json";
import {
  emptyCourse,
  type Course,
  type CourseModule,
} from "./types";

export type { Course, CourseModule, Lesson } from "./types";
export { emptyCourse } from "./types";

let courses: Course[] = structuredClone(coursesJson);
let modules: CourseModule[] = structuredClone(
  modulesJson as CourseModule[],
);

export function getCourses(): Course[] {
  return courses;
}

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course._id === id);
}

export function addCourse(course: Partial<Course>): Course {
  const created: Course = {
    ...emptyCourse,
    ...course,
    _id: crypto.randomUUID(),
  };
  courses = [...courses, created];
  return created;
}

export function updateCourse(course: Course): Course | undefined {
  const existing = getCourse(course._id);
  if (!existing) return undefined;
  courses = courses.map((c) => (c._id === course._id ? course : c));
  return course;
}

export function deleteCourse(id: string): Course | undefined {
  const existing = getCourse(id);
  if (!existing) return undefined;
  courses = courses.filter((course) => course._id !== id);
  return existing;
}

export function getModules(courseId?: string): CourseModule[] {
  if (!courseId) return modules;
  return modules.filter((module) => module.course === courseId);
}

export function getModule(id: string): CourseModule | undefined {
  return modules.find((module) => module._id === id);
}

export function addModule(module: {
  name: string;
  course: string;
}): CourseModule {
  const created: CourseModule = {
    _id: crypto.randomUUID(),
    name: module.name,
    description: "",
    course: module.course,
    lessons: [],
  };
  modules = [...modules, created];
  return created;
}

export function updateModule(
  module: CourseModule,
): CourseModule | undefined {
  const existing = getModule(module._id);
  if (!existing) return undefined;
  const updated = { ...existing, ...module };
  modules = modules.map((m) => (m._id === module._id ? updated : m));
  return updated;
}

export function deleteModule(id: string): CourseModule | undefined {
  const existing = getModule(id);
  if (!existing) return undefined;
  modules = modules.filter((module) => module._id !== id);
  return existing;
}`}</CodeBlock>
        <OnYourOwn>
          Confirm{" "}
          <code>addCourse</code>{" "}still assigns{" "}
          <code>crypto.randomUUID()</code>{" "}so two Adds cannot collide
          on <code>_id</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/api/kambaz/store.ts, keep addCourse generating _id with crypto.randomUUID(). Add a short comment above addCourse that says ids are assigned on the server. Do not change the function body.`}
        >
          Ask the assistant to comment the server-side id rule — you
          still confirm UUID generation:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-2"
        title="5.11.2 Courses API"
      >
        <p>
          Collection routes live at{" "}
          <code>app/api/courses/route.ts</code>.{" "}
          <code>GET</code>{" "}lists; <code>POST</code>{" "}creates and
          returns <code>201</code>:
        </p>
        <CodeBlock
          language="ts"
          name="courses"
          file="app/api/courses/route.ts"
        >{`import { addCourse, getCourses } from "../kambaz/store";

export async function GET() {
  return Response.json(getCourses());
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return Response.json(addCourse(body), { status: 201 });
}`}</CodeBlock>
        <p>
          One course lives at{" "}
          <code>app/api/courses/[id]/route.ts</code>. Await{" "}
          <code>params</code>, return <code>404</code>{" "}when the id is
          missing:
        </p>
        <CodeBlock
          language="ts"
          name="course by id"
          file="app/api/courses/[id]/route.ts"
        >{`import {
  deleteCourse,
  getCourse,
  updateCourse,
  type Course,
} from "../../kambaz/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(course);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Course;
  const updated = updateCourse({ ...body, _id: id });
  if (!updated) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = deleteCourse(id);
  if (!deleted) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(deleted);
}`}</CodeBlock>
        <p>
          Confirm <LocalUrl href="/api/courses" />{" "}lists RS101, RS102,
          and RS103, and{" "}
          <LocalUrl href="/api/courses/RS101" />{" "}returns Rocket
          Propulsion.
        </p>
        <OnYourOwn>
          Request{" "}
          <code>/api/courses/nope</code>{" "}and confirm the status is{" "}
          <code>404</code>.
        </OnYourOwn>
        <WithAI
          prompt={`Do not change the course handlers. Tell me the five method-and-path pairs this section created for /api/courses as a short list.`}
        >
          Ask the assistant to recap the five course endpoints — you
          still hit the missing id:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-3"
        title="5.11.3 Dashboard through fetch"
      >
        <p>
          Replace the Zustand hooks on Dashboard with{" "}
          <code>fetch</code>. Keep the form draft in{" "}
          <code>useState</code> — that is still one-screen UI. Load
          courses on mount, and refetch after Add, Update, and Delete.
          Enrollment filtering from <SectionLink to="4.10.5.3" />{" "}stays
          on the client: it reads the same{" "}
          <code>enrollments.json</code>, now applied to the array that
          came from the API.
        </p>
        <CodeBlock
          language="tsx"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`"use client";

import { useEffect, useState } from "react";
import "@/app/labs/lab2/tailwind/utilities.css";
import CourseCard from "./CourseCard";
import { emptyCourse, type Course } from "@/app/api/kambaz/types";
import { useAccountContext } from "../account/AccountContext";
import * as db from "../database";

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const { currentUser } = useAccountContext();

  async function loadCourses() {
    const response = await fetch("/api/courses");
    setCourses(await response.json());
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function addCourse() {
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    await loadCourses();
  }

  async function updateCourse() {
    await fetch(\`/api/courses/\${course._id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    await loadCourses();
  }

  async function deleteCourse(courseId: string) {
    await fetch(\`/api/courses/\${courseId}\`, { method: "DELETE" });
    await loadCourses();
  }

  const visibleCourses = currentUser
    ? courses.filter((c) =>
        db.enrollments.some(
          (enrollment) =>
            enrollment.user === currentUser._id && enrollment.course === c._id,
        ),
      )
    : courses;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={addCourse}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click"
          onClick={updateCourse}
        >
          Update
        </button>
      </h5>
      <input
        className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        id="wd-course-name"
      />
      <textarea
        className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        rows={3}
        value={course.description}
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
        id="wd-course-description"
      />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {visibleCourses.map((c) => (
          <CourseCard
            key={c._id}
            {...c}
            onEdit={() => setCourse(c)}
            onDelete={() => deleteCourse(c._id)}
          />
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The course layout breadcrumb still needs a name. Point it at{" "}
          <code>GET /api/courses/[id]</code>{" "}instead of the Zustand
          store so a course you just created has a title:
        </p>
        <CodeBlock
          language="tsx"
          name="CoursesLayout"
          file="app/(kambaz)/courses/[cid]/layout.tsx"
        >{`"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";
import "@/app/labs/lab2/tailwind/utilities.css";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import type { Course } from "@/app/api/kambaz/types";

export default function CoursesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const [course, setCourse] = useState<Course | undefined>();
  const [showCourseNav, setShowCourseNav] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    fetch(\`/api/courses/\${courseId}\`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then(setCourse);
  }, [courseId]);

  return (
    <div id="wd-courses">
      <h2 className="text-2xl font-semibold text-red-600">
        <FaAlignJustify
          className="me-4 mb-1 inline cursor-pointer text-xl"
          onClick={() => setShowCourseNav(!showCourseNav)}
          title="Toggle course navigation"
        />
        <Breadcrumb course={course} />
      </h2>
      <hr className="my-3" />
      <div className="flex gap-4">
        {showCourseNav ? (
          <div className="hidden w-[140px] shrink-0 md:block">
            <CourseNavigation cid={courseId} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The live dashboard below is the same component as{" "}
          <LocalUrl href="/dashboard" />. Add a course, confirm{" "}
          <LocalUrl href="/api/courses" />{" "}lists it, then Edit, Update,
          and Delete:
        </p>
        <LiveDemo
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
          mode="styled"
        >
          <Dashboard />
        </LiveDemo>
        <OnYourOwn>
          Add a course, open its Home
          from the card, and confirm the breadcrumb shows the name you
          typed — that name came from <code>GET /api/courses/[id]</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/dashboard/page.tsx, keep any extra form fields I added. After the description textarea, add a sample controlled input id="wd-course-number" bound to course.number. Do not rename my personal fields.`}
        >
          Ask the assistant to add one extra sample course field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-4"
        title="5.11.4 Modules API"
      >
        <p>
          Modules are nested under a course in the UI, but the HTTP
          collection is flat: <code>/api/modules</code>{" "}with a{" "}
          <code>course</code>{" "}query to filter.{" "}
          <code>POST</code>{" "}requires <code>name</code>{" "}and{" "}
          <code>course</code>:
        </p>
        <CodeBlock
          language="ts"
          name="modules"
          file="app/api/modules/route.ts"
        >{`import type { NextRequest } from "next/server";
import { addModule, getModules } from "../kambaz/store";

export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get("course") ?? undefined;
  return Response.json(getModules(course));
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; course?: string };
  if (!body.name?.trim() || !body.course) {
    return Response.json(
      { error: "name and course are required" },
      { status: 400 },
    );
  }
  return Response.json(
    addModule({ name: body.name.trim(), course: body.course }),
    { status: 201 },
  );
}`}</CodeBlock>
        <p>
          One module uses the same GET / PUT / DELETE pattern as a
          course. Create <code>app/api/modules/[id]/route.ts</code>{" "}
          mirroring <SectionLink to="5.11.2" />. Open{" "}
          <LocalUrl href="/api/modules?course=RS101" />{" "}and confirm
          only Rocket Propulsion modules appear.
        </p>
        <OnYourOwn>
          POST a module for RS102
          from the browser console or a REST client and confirm it
          does not show up in the RS101 query.
        </OnYourOwn>
        <WithAI
          prompt={`Do not change the modules handlers. Write a sample fetch POST to /api/modules that creates a module named "Sample Week" for course RS101. Include Content-Type and JSON.stringify.`}
        >
          Ask the assistant for a sample POST snippet — you still
          create an RS102 module yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-5"
        title="5.11.5 Modules Screen through fetch"
      >
        <p>
          The Modules page from <SectionLink to="4.10.4" />{" "}keeps the
          dialog, the pencil, and the trash. Swap the Zustand functions
          for <code>fetch</code>. Load with{" "}
          <code>/api/modules?course=${"{courseId}"}</code>. Editing
          still flips a local <code>editing</code>{" "}flag so the input
          can appear; Enter PUTs the name and clears that flag:
        </p>
        <CodeBlock
          language="tsx"
          name="Modules"
          file="app/(kambaz)/courses/[cid]/modules/page.tsx"
        >{`"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";
import Module from "./Module";
import Lesson from "./Lesson";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import type { CourseModule } from "@/app/api/kambaz/types";

export default function Modules() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "RS101";
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [moduleName, setModuleName] = useState("");

  async function loadModules() {
    const response = await fetch(\`/api/modules?course=\${courseId}\`);
    setModules(await response.json());
  }

  useEffect(() => {
    loadModules();
  }, [courseId]);

  async function addModule() {
    if (!moduleName.trim()) return;
    await fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: moduleName, course: courseId }),
    });
    setModuleName("");
    await loadModules();
  }

  async function deleteModule(moduleId: string) {
    await fetch(\`/api/modules/\${moduleId}\`, { method: "DELETE" });
    await loadModules();
  }

  async function updateModule(module: CourseModule) {
    await fetch(\`/api/modules/\${module._id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(module),
    });
    await loadModules();
  }

  function editModule(moduleId: string) {
    setModules((current) =>
      current.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      ),
    );
  }

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules.map((module) => (
          <Module
            key={module._id}
            extra={
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={deleteModule}
                editModule={editModule}
              />
            }
            title={
              module.editing ? (
                <input
                  className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
                  defaultValue={module.name}
                  onChange={(e) =>
                    setModules((current) =>
                      current.map((m) =>
                        m._id === module._id
                          ? { ...m, name: e.target.value }
                          : m,
                      ),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateModule({ ...module, editing: false });
                    }
                  }}
                />
              ) : (
                module.name
              )
            }
          >
            {module.lessons?.map((lesson) => (
              <Lesson key={lesson._id} title={lesson.name} />
            ))}
          </Module>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>
        <p>
          Home already embeds this page, so a module you add here
          appears on Home after a refresh of that screen&apos;s fetch.
          Visit{" "}
          <Link href="/courses/RS101/modules">
            /courses/RS101/modules
          </Link>
          .
        </p>
        <OnYourOwn>
          Add a module on RS101,
          open RS102 Modules, and confirm the new name is not there —
          the query string filtered it out.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/modules/page.tsx, keep my add/delete/update fetch calls. After loadModules, add a sample console.log(courseId, "modules loaded") so I can see the filter in the console. Do not remove my HTTP calls.`}
        >
          Ask the assistant to log the course id after load — you still
          compare RS101 and RS102:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-6"
        title="5.11.6 The Same Routes on Express"
      >
        <p>
          <SectionLink to="5.7.2" />{" "}already has hello and todos on
          Express. Kambaz needs the same course and module URLs there
          so flipping <code>NEXT_PUBLIC_API_BASE</code>{" "}does not 404.
          Seed <code>server/kambazStore.ts</code>{" "}with the same three
          courses and their modules — copy values, do not{" "}
          <code>import</code>{" "}from <code>app/api/kambaz</code>{" "}or
          from <code>Database/*.json</code>. Render&apos;s root directory
          is <code>server/</code>; those Next.js files are not on that
          disk.
        </p>
        <p>
          Mirror the Route Handler contract with{" "}
          <code>app.get</code>{" "}/ <code>app.post</code>{" "}and{" "}
          <code>:id</code>{" "}params. Status codes stay{" "}
          <code>201</code>{" "}on create and{" "}
          <code>404</code>{" "}when the id is missing:
        </p>
        <CodeBlock
          language="ts"
          name="Express courses"
          file="server/index.ts"
        >{`app.get("/api/courses", (_req, res) => {
  res.json(getCourses());
});

app.post("/api/courses", (req, res) => {
  res.status(201).json(addCourse(req.body ?? {}));
});

app.get("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

app.put("/api/courses/:id", (req, res) => {
  const updated = updateCourse({ ...req.body, _id: req.params.id });
  if (!updated) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/courses/:id", (req, res) => {
  const deleted = deleteCourse(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(deleted);
});`}</CodeBlock>
        <p>
          Modules use <code>req.query.course</code>{" "}the way the Route
          Handler used <code>searchParams.get(&quot;course&quot;)</code>.
          Restart Express and open{" "}
          <code>http://localhost:4000/api/courses</code>{" "}and{" "}
          <code>http://localhost:4000/api/modules?course=RS101</code>.
          The JSON shape must match{" "}
          <SectionLink to="5.11.2" />{" "}and{" "}
          <SectionLink to="5.11.4" />{" "}so the existing Dashboard and
          Modules <code>fetch</code>{" "}calls can aim at either host.
        </p>
        <OnYourOwn>
          POST a course to
          localhost:4000 from the browser console and confirm GET{" "}
          <code>/api/courses</code>{" "}on 4000 lists it — and that GET{" "}
          on port 3000 does <em>not</em>, because the stores do not
          share memory.
        </OnYourOwn>
        <WithAI
          prompt={`Do not rewrite my Next.js Route Handlers. In server/index.ts, keep my course routes. Add sample GET/POST /api/modules and GET/PUT/DELETE /api/modules/:id that call getModules, addModule, getModule, updateModule, and deleteModule. Filter GET by req.query.course.`}
        >
          Ask the assistant to add the module routes — you still
          compare the two ports yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-7"
        title="5.11.7 Pointing Kambaz at Render"
      >
        <p>
          <SectionLink to="5.11.3" />{" "}first called{" "}
          <code>fetch(&quot;/api/courses&quot;)</code>{" "}— same origin,
          Route Handlers. Wrap those paths with the helper from{" "}
          <SectionLink to="5.7.4" />{" "}so Dashboard, the course
          layout breadcrumb, and Modules all follow{" "}
          <code>NEXT_PUBLIC_API_BASE</code>:
        </p>
        <CodeBlock
          language="ts"
          name="apiUrl on Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`import { apiUrl } from "@/app/lib/apiUrl";

async function loadCourses() {
  const response = await fetch(apiUrl("/api/courses"));
  setCourses(await response.json());
}

async function addCourse() {
  await fetch(apiUrl("/api/courses"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  await loadCourses();
}`}</CodeBlock>
        <p>
          Modules becomes{" "}
          <code>apiUrl(\`/api/modules?course=${"{courseId}"}\`)</code>.
          The breadcrumb becomes{" "}
          <code>apiUrl(\`/api/courses/${"{courseId}"}\`)</code>. Empty
          base — the default in this book&apos;s live demos — keeps
          everything on Route Handlers.{" "}
          <code>http://localhost:4000</code>{" "}aims at your Express
          process. The Render origin from{" "}
          <SectionLink to="5.8.4" />{" "}aims at the deployed API.
          Restart <code>next dev</code>{" "}after changing the env var.
        </p>
        <p>
          Remember the two stores are not the same memory. A course
          you Add while pointed at Render will not appear if you clear
          the env var and hit Route Handlers, and a Render free
          instance that slept will make the first Dashboard load
          slow. That is the separate-server model working as designed.
        </p>
        <OnYourOwn>
          Point{" "}
          <code>NEXT_PUBLIC_API_BASE</code>{" "}at localhost:4000, Add a
          course on Dashboard, then clear the var and confirm the new
          course is gone (different store). Put the var back and
          confirm it is still on Express.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/dashboard/page.tsx, keep my CRUD. Replace any remaining fetch("/api/courses") strings with apiUrl("/api/courses") and the id URLs with apiUrl(\`/api/courses/\${id}\`). Import apiUrl from @/app/lib/apiUrl. Do not change the UI.`}
        >
          Ask the assistant to wrap the remaining fetches — you still
          flip the env var:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-11-8"
        title="5.11.8 Assignments (On Your Own)"
      >
        <p>
          Assignments stay your work, the same way{" "}
          <SectionLink to="4.10.6" />{" "}left the Zustand store to you.
          Follow the courses and modules pattern on{" "}
          <em>both</em>{" "}server models:
        </p>
        <ul>
          <li>
            Add <code>get</code>/<code>add</code>/<code>update</code>/
            <code>delete</code>{" "}for assignments on the Next.js
            in-memory store <em>and</em>{" "}on{" "}
            <code>server/kambazStore.ts</code>, seeded from the same{" "}
            <code>assignments.json</code>{" "}values (copied, not
            imported into Express).
          </li>
          <li>
            Create <code>/api/assignments</code>{" "}with GET (filter by{" "}
            <code>?course=</code>) and POST, plus{" "}
            <code>/api/assignments/[id]</code>{" "}with GET, PUT, and
            DELETE as Route Handlers.
          </li>
          <li>
            Add the matching Express routes so the same paths work on
            Render.
          </li>
          <li>
            Load the list with <code>fetch(apiUrl(...))</code>{" "}on the
            Assignments screen. + Assignment should POST (or navigate
            to the editor and POST on Save).
          </li>
          <li>
            The editor loads one assignment with GET, Save uses PUT
            (or POST when the id is new), Cancel does not write.
          </li>
          <li>
            Delete removes through{" "}
            <code>DELETE</code>{" "}<code>/api/assignments/[id]</code>.
          </li>
        </ul>
        <p>
          Do not introduce MongoDB. The grader will look for the same{" "}
          <code>wd-</code>{" "}ids from earlier chapters and for network
          calls to <code>/api/assignments</code>{" "}— same-origin or
          prefixed with <code>NEXT_PUBLIC_API_BASE</code>.
        </p>
        <OnYourOwn>
          Create, edit, and delete
          one assignment on RS101 against Route Handlers, then again
          with the base set to Express, and confirm each list matches
          that process&apos;s{" "}
          <code>/api/assignments?course=RS101</code>.
        </OnYourOwn>
        <WithAI
          prompt={`Do not implement the assignments API for me. List the files I should create (Next.js store functions, two route.ts files, Express routes, and the screens to edit) as a short checklist matching Chapter 5's courses and modules pattern on both server models.`}
        >
          Ask the assistant for a file checklist — you still write the
          handlers, Express routes, and screens:
        </WithAI>
      </Section>

      <Section level={3} id="sec-5-11-9" title="5.11.9 Exercises">
        <p>
          Use this checklist to confirm the Kambaz HTTP APIs cover
          every screen in <SectionLink to="5.11" />. Each item points
          back to the section where you wired the worked example. Build
          in order as you read — this list is for checking coverage,
          not a substitute for the walkthroughs. Assignments stay On
          your own.
        </p>
        <ol>
          <li>
            Add the in-memory Kambaz store and types (
            <SectionLink to="5.11.1" />).
          </li>
          <li>
            Implement <code>/api/courses</code>{" "}and{" "}
            <code>/api/courses/[id]</code>{" "}(<SectionLink to="5.11.2" />).
          </li>
          <li>
            Load and mutate Dashboard through <code>fetch</code>{" "}(
            <SectionLink to="5.11.3" />).
          </li>
          <li>
            Point the course breadcrumb at{" "}
            <code>GET /api/courses/[id]</code>{" "}(<SectionLink to="5.11.3" />).
          </li>
          <li>
            Implement <code>/api/modules</code>{" "}and{" "}
            <code>/api/modules/[id]</code>{" "}(<SectionLink to="5.11.4" />).
          </li>
          <li>
            Load and mutate Modules through <code>fetch</code>{" "}(
            <SectionLink to="5.11.5" />).
          </li>
          <li>
            Add matching courses and modules routes on Express (
            <SectionLink to="5.11.6" />).
          </li>
          <li>
            Wrap Kambaz fetches with <code>apiUrl</code>{" "}and point{" "}
            <code>NEXT_PUBLIC_API_BASE</code>{" "}at localhost, then
            Render (<SectionLink to="5.11.7" />).
          </li>
          <li>
            Implement Assignments through <code>/api</code>{" "}on both
            backends (On your own, <SectionLink to="5.11.8" />).
          </li>
        </ol>
      </Section>
    </Section>
  );
}
