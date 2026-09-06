import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_API_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Courses API",
      "§5.4.5 · CRUD leaves the Zustand store",
    ],
  },
  {
    id: "purpose",
    title: "Courses leave the Zustand store",
    kind: "content",
    bullets: [
      "Chapter 4 Zustand was the published list. Refresh still resets it",
      "Express owns the array. Dashboard `useEffect` fetches on load",
      "AccountContext still holds who is signed in",
    ],
  },
  {
    id: "dao",
    title: "Courses DAO filters enrollments",
    kind: "demo",
    bullets: [
      "`findAllCourses` is the raw array",
      "`findCoursesForEnrolledUser` joins enrollments on the server",
    ],
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
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/dao.js",
    codeHighlightLines: [[6, 13]],
  },
  {
    id: "routes",
    title: "GET /api/courses and mine",
    kind: "demo",
    bullets: [
      "`userId === \"current\"` reads the session — 401 if anonymous",
      "Confirm `http://localhost:4000/api/courses` returns the array",
    ],
    code: `import CoursesDao from "./dao.js";
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
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeHighlightLines: [[9, 16], [19, 20]],
  },
  {
    id: "client",
    title: "Dashboard fetches on load",
    kind: "demo",
    bullets: [
      "`findMyCourses` uses cookies. Drop client-side enrollment filters",
      "`currentUser` is a `useEffect` dependency so a new sign-in reloads",
    ],
    code: `import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";
const axiosWithCredentials = axios.create({ withCredentials: true });
const COURSES_API = \`\${httpServer()}/api/courses\`;
const USERS_API = \`\${httpServer()}/api/users\`;
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
    id: "create",
    title: "POST enrolls the creator",
    kind: "demo",
    bullets: [
      "POST `/api/users/current/courses` creates and enrolls",
      "Add, refresh, and the new course is still listed while Express runs",
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
    title: "Modules nest under a course",
    kind: "content",
    bullets: [
      "§5.4.6: `GET/POST /api/courses/:courseId/modules`",
      "`PUT/DELETE /api/modules/:moduleId` — nested in the UI, flat on the server",
      "Assignments and enrollments are On your own — same DAO + client pattern",
    ],
    code: `app.get("/api/courses/:courseId/modules", findModulesForCourse);
app.post("/api/courses/:courseId/modules", createModuleForCourse);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Modules/routes.js",
  },
  {
    id: "recap",
    title: "Courses API recap",
    kind: "content",
    bullets: [
      "DAO joins enrollments. Routes expose `/api/courses`",
      "Dashboard state is fetched, not Zustand seed data",
      "Modules / assignments / enrollments follow the same verbs",
    ],
  },
  {
    id: "next-up",
    title: "Next: deploy the API",
    kind: "title",
    bullets: [
      "A second GitHub repo, Render, then a Vercel env var",
      "§5.5: `NEXT_PUBLIC_HTTP_SERVER` points at Render",
    ],
  },
];
