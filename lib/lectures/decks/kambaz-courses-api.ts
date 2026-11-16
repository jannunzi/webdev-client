import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#C8102E",
      icon: "database",
      headline: "Courses API",
    },
    bullets: [
      "Chapter 5 · Courses API",
      "CRUD leaves the Zustand store",
    ],
  },
  {
    id: "purpose",
    title: "Saving Courses on the Server",
    kind: "content",
    bullets: [
      "Course Add, Edit, and Delete still live in the browser and reset on refresh",
      "The server now owns the courses list; the Dashboard loads it when it opens",
      "Each change calls a server route, so it survives refresh",
      "The signed-in user still comes from the account context",
    ],
  },
  {
    id: "courses-architecture",
    title: "From the Courses UI to the Database",
    kind: "demo",
    bullets: [
      "The database is an in-memory object. Edits change the arrays, not the JSON files. MongoDB comes later for permanent storage",
    ],
    diagram: "courses-dao",
  },
  {
    id: "dao-intro",
    title: "Filtering Courses by Enrollment",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Courses/dao.ts`, add the functions below",
      "`findAllCourses` is the raw array",
      "`findCoursesForEnrolledUser` joins enrollments on the server",
    ],
  },
  {
    id: "dao",
    title: "Writing the Courses DAO",
    kind: "demo",
    code: `import { v4 as uuidv4 } from "uuid";
export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }
  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
  }
  return { findAllCourses, findCoursesForEnrolledUser };
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeHighlightLines: [[6, 13]],
  },
  {
    id: "url-to-route",
    title: "Fetching Enrolled Courses",
    kind: "content",
    bullets: [
      "The Dashboard calls `GET /api/users/current/courses`",
      "It matches `/api/users/:userId/courses` with `req.params = { userId: \"current\" }`",
      "`current` means the signed-in user, read from the session",
      "The DAO filters courses by that user’s enrollments",
    ],
  },
  {
    id: "routes-intro",
    title: "Defining the Courses Routes",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Courses/routes.ts`, add the routes below",
      "`userId === \"current\"` reads the session — 401 if anonymous",
      "Confirm `http://localhost:4000/api/courses` returns the array",
      "Import into `index.ts` and pass it `app`",
    ],
  },
  {
    id: "routes",
    links: ["http://localhost:4000/api/courses", "http://localhost:4000/api/users/123/courses"],
    title: "Writing the Courses GET Routes",
    kind: "demo",
    code: `import CoursesDao from "./dao";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const findAllCourses = (req, res) => {
    res.json(dao.findAllCourses());
  };
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    res.json(dao.findCoursesForEnrolledUser(userId));
  };
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeHighlightLines: [[9, 16], [19, 20]],
  },
  {
    id: "client",
    title: "Fetching Courses from the Client",
    kind: "demo",
    bullets: [
      "In `courses/client.ts`, add both functions below",
      "`fetchAllCourses` is a plain GET of `/api/courses`",
      "`findMyCourses` sends cookies to `/api/users/current/courses`",
    ],
    code: `import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = \`\${HTTP_SERVER}/api/courses\`;
const USERS_API = \`\${HTTP_SERVER}/api/users\`;
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    \`\${USERS_API}/current/courses\`,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeHighlightLines: [[6, 8], [10, 15]],
  },
  {
    id: "client-dashboard",
    title: "Loading the Dashboard from the Client",
    kind: "demo",
    bullets: [
      "Map `courses`. The enrollment filter is gone",
    ],
    code: `import * as client from "../courses/client";
import { useCoursesStore } from "../store/coursesStore";
...
const { currentUser } = useAccountContext();
const courses = useCoursesStore((state) => state.courses);
const setCourses = useCoursesStore((state) => state.setCourses);
...
useEffect(() => {
  const load = async () => {
    setCourses(await client.findMyCourses());
  };
  load();
}, [currentUser]);
...
{courses.map((course) => (
  ...
))}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, 2, [4, 6], [8, 13], 15, 17],
  },
  {
    id: "client-live",
    title: "Dashboard Loads Enrolled Courses",
    kind: "demo",
    bullets: [
      "Sign in and the enrolled courses come from Express",
      "Sign in as another user and the list reloads",
    ],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "create-dao",
    title: "Adding Course Create and Enroll",
    kind: "demo",
    bullets: [
      "In `Courses/dao.ts`, add create as shown below",
      "In `Enrollments/dao.ts`, add enroll as shown below",
    ],
    codeBlocks: [
      {
        file: "webdev-server/Kambaz/Courses/dao.ts",
        language: "ts",
        code: `function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  db.courses = [...db.courses, newCourse];
  return newCourse;
}`,
        addedLines: [[1, 5]],
      },
      {
        file: "webdev-server/Kambaz/Enrollments/dao.ts",
        language: "ts",
        code: `function enrollUserInCourse(userId, courseId) {
  const { enrollments } = db;
  enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
}`,
        addedLines: [[1, 4]],
      },
    ],
  },
  {
    id: "create-route",
    title: "Enrolling the Course Creator",
    kind: "demo",
    bullets: [
      "In `Courses/routes.ts`, add the route as shown below",
      "The session says who is signed in",
      "Create the course, enroll that user, return the new course",
    ],
    code: "const createCourse = (req, res) => {\n  const currentUser = req.session[\"currentUser\"];\n  const newCourse = dao.createCourse(req.body);\n  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);\n  res.json(newCourse);\n};\napp.post(\"/api/users/current/courses\", createCourse);",
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
  },
  {
    id: "create-flow",
    title: "Creating a Resource with POST",
    kind: "content",
    bullets: [
      "Dashboard Add sends the course draft to the client function",
      "axios POSTs it as JSON to `/api/users/current/courses`, with the cookie",
      "The server reads the user from the session and creates the course",
      "It enrolls that user, then replies with the new course",
      "The Dashboard then reloads its course list",
    ],
  },
  {
    id: "create",
    title: "Posting a New Course from the Client",
    kind: "demo",
    bullets: [
      "In `courses/client.ts`, add the function as shown below",
      "POST the draft to `/api/users/current/courses`",
      "Add, refresh, and the course stays listed while Express runs",
    ],
    code: `export const createCourse = async (course: unknown) => {
  const { data } = await axiosWithCredentials.post(
    \`\${USERS_API}/current/courses\`,
    course,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "courses-store",
    title: "Caching Courses from the Server",
    kind: "demo",
    bullets: [
      "`addCourse` appends the server course and no longer mints `_id`",
    ],
    code: `addCourse: (course) =>
  set((state) => ({
    courses: [...state.courses, course],
  })),
...
setCourses: (courses) => set({ courses }),`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/store/coursesStore.ts",
    codeHighlightLines: [[1, 4], 6],
  },
  {
    id: "course-add-ui",
    title: "Adding the Server Course to the Store",
    kind: "demo",
    code: `const addCourse = useCoursesStore((state) => state.addCourse);
...
const onAddCourse = async () => {
  const newCourse = await client.createCourse(course);
  addCourse(newCourse);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "course-delete-server",
    title: "Deleting a Course on the Server",
    kind: "demo",
    code: `function deleteCourse(courseId) {
  const { courses, enrollments } = db;
  db.courses = courses.filter((course) => course._id !== courseId);
  db.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId,
  );
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Courses/routes.ts",
        code: `const deleteCourse = (req, res) => {
  const { courseId } = req.params;
  dao.deleteCourse(courseId);
  res.sendStatus(200);
};
app.delete("/api/courses/:courseId", deleteCourse);`,
      },
    ],
  },
  {
    id: "course-delete-client",
    title: "Deleting a Course from the Client",
    kind: "demo",
    code: `export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(\`\${COURSES_API}/\${courseId}\`);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "course-delete-ui",
    title: "Removing the Deleted Course",
    kind: "demo",
    code: `const deleteCourse = useCoursesStore((state) => state.deleteCourse);
...
const onDeleteCourse = async (courseId: string) => {
  await client.deleteCourse(courseId);
  deleteCourse(courseId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "course-update-server",
    title: "Updating a Course on the Server",
    kind: "demo",
    code: `function updateCourse(courseId, courseUpdates) {
  const { courses } = db;
  const course = courses.find((course) => course._id === courseId);
  Object.assign(course, courseUpdates);
  return course;
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Courses/routes.ts",
        code: `const updateCourse = (req, res) => {
  const { courseId } = req.params;
  const status = dao.updateCourse(courseId, req.body);
  res.json(status);
};
app.put("/api/courses/:courseId", updateCourse);`,
      },
    ],
  },
  {
    id: "course-update-client",
    title: "Updating a Course from the Client",
    kind: "demo",
    code: `export const updateCourse = async (course: { _id: string }) => {
  const { data } = await axios.put(\`\${COURSES_API}/\${course._id}\`, course);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "course-update-ui",
    title: "Updating the Cached Course",
    kind: "demo",
    code: `const updateCourse = useCoursesStore((state) => state.updateCourse);
...
const onUpdateCourse = async () => {
  const saved = await client.updateCourse(course);
  updateCourse(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "modules-architecture",
    title: "From the Modules UI to the Database",
    kind: "demo",
    bullets: [
      "The database is an in-memory object. Edits change the arrays, not the JSON files. MongoDB comes later for permanent storage",
    ],
    diagram: "modules-dao",
  },
  {
    id: "modules-find-server",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "Finding a Course's Modules",
    kind: "demo",
    code: `function findModulesForCourse(courseId) {
  const { modules } = db;
  return modules.filter((module) => module.course === courseId);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Modules/routes.ts",
        code: `const findModulesForCourse = (req, res) => {
  const { courseId } = req.params;
  res.json(dao.findModulesForCourse(courseId));
};
app.get("/api/courses/:courseId/modules", findModulesForCourse);`,
      },
    ],
  },
  {
    id: "modules-find-client",
    title: "Fetching Modules from the Client",
    kind: "demo",
    code: `export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(\`\${COURSES_API}/\${courseId}/modules\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "modules-store",
    title: "Caching Modules from the Server",
    kind: "demo",
    bullets: [
      "`addModule` appends the server module and no longer mints `_id`",
    ],
    code: `addModule: (module) =>
  set((state) => ({
    modules: [...state.modules, module],
  })),
...
setModules: (modules) => set({ modules }),`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/store/modulesStore.ts",
    codeHighlightLines: [[1, 4], 6],
  },
  {
    id: "modules-load-ui",
    title: "Loading Modules from the Server",
    kind: "demo",
    code: `import * as client from "../../client";
...
const setModules = useModulesStore((state) => state.setModules);
...
useEffect(() => {
  const load = async () => {
    setModules(await client.findModulesForCourse(courseId));
  };
  load();
}, [courseId]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [1, 3, [5, 10]],
  },
  {
    id: "modules-create-server",
    title: "Creating a Module on the Server",
    kind: "demo",
    code: `function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  db.modules = [...db.modules, newModule];
  return newModule;
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Modules/routes.ts",
        code: `const createModuleForCourse = (req, res) => {
  const { courseId } = req.params;
  const module = { ...req.body, course: courseId };
  const newModule = dao.createModule(module);
  res.json(newModule);
};
app.post("/api/courses/:courseId/modules", createModuleForCourse);`,
      },
    ],
  },
  {
    id: "modules-create-client",
    title: "Posting a Module from the Client",
    kind: "demo",
    code: `export const createModuleForCourse = async (
  courseId: string,
  module: unknown,
) => {
  const response = await axios.post(
    \`\${COURSES_API}/\${courseId}/modules\`,
    module,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 9]],
  },
  {
    id: "modules-add-ui",
    title: "Adding the Server Module",
    kind: "demo",
    code: `const addModule = useModulesStore((state) => state.addModule);
...
const onAddModule = async () => {
  const created = await client.createModuleForCourse(courseId, {
    name: moduleName,
  });
  addModule(created);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [1, [3, 8]],
  },
  {
    id: "modules-delete-server",
    title: "Deleting a Module on the Server",
    kind: "demo",
    code: `function deleteModule(moduleId) {
  const { modules } = db;
  db.modules = modules.filter((module) => module._id !== moduleId);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Modules/routes.ts",
        code: `const deleteModule = (req, res) => {
  const { moduleId } = req.params;
  dao.deleteModule(moduleId);
  res.sendStatus(200);
};
app.delete("/api/modules/:moduleId", deleteModule);`,
      },
    ],
  },
  {
    id: "modules-delete-client",
    title: "Deleting a Module from the Client",
    kind: "demo",
    code: `export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(\`\${MODULES_API}/\${moduleId}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "modules-delete-ui",
    title: "Removing the Deleted Module",
    kind: "demo",
    code: `const deleteModule = useModulesStore((state) => state.deleteModule);
...
const onRemoveModule = async (moduleId: string) => {
  await client.deleteModule(moduleId);
  deleteModule(moduleId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "modules-update-server",
    title: "Updating a Module on the Server",
    kind: "demo",
    code: `function updateModule(moduleId, moduleUpdates) {
  const { modules } = db;
  const module = modules.find((module) => module._id === moduleId);
  Object.assign(module, moduleUpdates);
  return module;
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Modules/routes.ts",
        code: `const updateModule = (req, res) => {
  const { moduleId } = req.params;
  const status = dao.updateModule(moduleId, req.body);
  res.json(status);
};
app.put("/api/modules/:moduleId", updateModule);`,
      },
    ],
  },
  {
    id: "modules-update-client",
    title: "Updating a Module from the Client",
    kind: "demo",
    code: `export const updateModule = async (module: { _id: string }) => {
  const { data } = await axios.put(
    \`\${MODULES_API}/\${module._id}\`,
    module,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "modules-update-ui",
    title: "Updating the Cached Module",
    kind: "demo",
    code: `const updateModule = useModulesStore((state) => state.updateModule);
...
const onUpdateModule = async (module) => {
  const saved = await client.updateModule(module);
  updateModule(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "assignments-architecture",
    title: "From Assignments UI to the Database",
    kind: "demo",
    bullets: [
      "Same tiers as modules: page, client, routes, DAO, then Database",
    ],
    diagram: "assignments-dao",
  },
  {
    id: "assignments-find-server",
    title: "Finding a Course's Assignments",
    kind: "demo",
    code: `const findAssignmentsForCourse = (courseId) =>
  db.assignments.filter((assignment) => assignment.course === courseId);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/dao.ts",
    codeBlocks: [
      {
        language: "ts",
        file: "webdev-server/Kambaz/Assignments/routes.ts",
        code: `const findAssignmentsForCourse = (req, res) => {
  res.json(dao.findAssignmentsForCourse(req.params.courseId));
};
app.get(
  "/api/courses/:courseId/assignments",
  findAssignmentsForCourse,
);`,
      },
    ],
  },
  {
    id: "assignments-find-client",
    title: "Fetching Assignments from the Client",
    kind: "demo",
    code: `export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(
    \`\${COURSES_API}/\${courseId}/assignments\`,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "assignments-store",
    title: "Caching Assignments from the Server",
    kind: "demo",
    bullets: [
      "`addAssignment` appends the server assignment and does not mint `_id`",
    ],
    code: `addAssignment: (assignment) =>
  set((state) => ({
    assignments: [...state.assignments, assignment],
  })),
...
setAssignments: (assignments) => set({ assignments }),`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/store/assignmentsStore.ts",
    codeHighlightLines: [[1, 4], 6],
  },
  {
    id: "assignments-load-ui",
    title: "Loading Assignments from the Server",
    kind: "demo",
    code: `const setAssignments = useAssignmentsStore((state) => state.setAssignments);
...
useEffect(() => {
  const load = async () => {
    setAssignments(await client.findAssignmentsForCourse(courseId));
  };
  load();
}, [courseId]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [1, [3, 8]],
  },
  {
    id: "assignments-create-dao",
    title: "Creating an Assignment in the DAO",
    kind: "demo",
    code: `const createAssignment = (assignment) => {
  const created = { ...assignment, _id: uuidv4() };
  db.assignments = [...db.assignments, created];
  return created;
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/dao.ts",
  },
  {
    id: "assignments-create-route",
    title: "Posting an Assignment Route",
    kind: "demo",
    code: `const createAssignmentForCourse = (req, res) => {
  const created = dao.createAssignment({
    ...req.body,
    course: req.params.courseId,
  });
  res.json(created);
};
app.post(
  "/api/courses/:courseId/assignments",
  createAssignmentForCourse,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/routes.ts",
  },
  {
    id: "assignments-create-client",
    title: "Posting an Assignment from the Client",
    kind: "demo",
    code: `export const createAssignmentForCourse = async (
  courseId: string,
  assignment: unknown,
) => {
  const { data } = await axios.post(
    \`\${COURSES_API}/\${courseId}/assignments\`,
    assignment,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 10]],
  },
  {
    id: "assignments-add-ui",
    title: "Adding the Server Assignment",
    kind: "demo",
    code: `const addAssignment = useAssignmentsStore((state) => state.addAssignment);
...
const onAddAssignment = async () => {
  const created = await client.createAssignmentForCourse(courseId, draft);
  addAssignment(created);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "assignments-update-dao",
    title: "Updating an Assignment in the DAO",
    kind: "demo",
    code: `const updateAssignment = (assignmentId, updates) => {
  const assignment = db.assignments.find(
    (item) => item._id === assignmentId,
  );
  Object.assign(assignment, updates);
  return assignment;
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/dao.ts",
  },
  {
    id: "assignments-update-route",
    title: "Updating the Assignment Route",
    kind: "demo",
    code: `const updateAssignment = (req, res) => {
  const saved = dao.updateAssignment(
    req.params.assignmentId,
    req.body,
  );
  res.json(saved);
};
app.put("/api/assignments/:assignmentId", updateAssignment);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/routes.ts",
  },
  {
    id: "assignments-update-client",
    title: "Updating an Assignment from the Client",
    kind: "demo",
    code: `export const updateAssignment = async (
  assignment: { _id: string },
) => {
  const { data } = await axios.put(
    \`\${ASSIGNMENTS_API}/\${assignment._id}\`,
    assignment,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 9]],
  },
  {
    id: "assignments-update-ui",
    title: "Updating the Cached Assignment",
    kind: "demo",
    code: `const updateAssignment = useAssignmentsStore(
  (state) => state.updateAssignment,
);
...
const onUpdateAssignment = async (assignment) => {
  const saved = await client.updateAssignment(assignment);
  updateAssignment(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [[1, 3], [5, 8]],
  },
  {
    id: "assignments-delete-dao",
    title: "Deleting an Assignment in the DAO",
    kind: "demo",
    code: `const deleteAssignment = (assignmentId) => {
  db.assignments = db.assignments.filter(
    (item) => item._id !== assignmentId,
  );
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/dao.ts",
  },
  {
    id: "assignments-delete-route",
    title: "Deleting an Assignment Route",
    kind: "demo",
    code: `const deleteAssignment = (req, res) => {
  dao.deleteAssignment(req.params.assignmentId);
  res.sendStatus(200);
};
app.delete(
  "/api/assignments/:assignmentId",
  deleteAssignment,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Assignments/routes.ts",
  },
  {
    id: "assignments-delete-client",
    title: "Deleting an Assignment from the Client",
    kind: "demo",
    code: `export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(
    \`\${ASSIGNMENTS_API}/\${assignmentId}\`,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "assignments-delete-ui",
    title: "Removing the Deleted Assignment",
    kind: "demo",
    code: `const deleteAssignment = useAssignmentsStore(
  (state) => state.deleteAssignment,
);
...
const onDeleteAssignment = async (assignmentId: string) => {
  await client.deleteAssignment(assignmentId);
  deleteAssignment(assignmentId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/assignments/page.tsx",
    codeHighlightLines: [[1, 3], [5, 8]],
  },
  {
    id: "recap",
    title: "Recap: The Courses API",
    kind: "content",
    bullets: [
      "DAO joins enrollments. Routes expose `/api/courses`",
      "The Zustand store caches what the server returns",
      "Modules / assignments / enrollments follow the same verbs",
    ],
  },
  {
    id: "next-up",
    title: "Next: Deploy the API",
    kind: "title",
    bullets: [
      "A second GitHub repo, Render, then a Vercel env var",
      "`NEXT_PUBLIC_HTTP_SERVER` points at Render",
    ],
  },
];
