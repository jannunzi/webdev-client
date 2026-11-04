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
    title: "Fetching Courses on Dashboard Load",
    kind: "demo",
    bullets: [
      "In `courses/client.ts`, add the functions as shown below",
      "`findMyCourses` uses cookies. Drop client-side enrollment filters",
      "`currentUser` is a `useEffect` dependency so a new sign-in reloads",
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
  const { data } = await axiosWithCredentials.get(\`\${USERS_API}/current/courses\`);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeHighlightLines: [[6, 12]],
    embed: "kambaz-styled-dashboard",
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
    id: "modules-oyo",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "Nesting Module Routes Under a Course",
    kind: "content",
    bullets: [
      "`GET/POST /api/courses/:courseId/modules`",
      "`PUT/DELETE /api/modules/:moduleId` — nested in the UI, flat on the server",
      "Assignments and enrollments are On your own — same DAO + client pattern",
    ],
    code: `app.get("/api/courses/:courseId/modules", findModulesForCourse);
app.post("/api/courses/:courseId/modules", createModuleForCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
  },
  {
    id: "recap",
    title: "Recap: The Courses API",
    kind: "content",
    bullets: [
      "DAO joins enrollments. Routes expose `/api/courses`",
      "Dashboard state is fetched, not Zustand seed data",
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
