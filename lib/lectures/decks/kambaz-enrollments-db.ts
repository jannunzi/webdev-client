import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

function sectionSlide(id: string, headline: string): LectureSlide {
  return {
    id,
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
      icon: "database",
      headline,
    },
    bullets: ["Chapter 6 · Enrollments M:N", headline],
  };
}

export const KAMBAZ_ENROLLMENTS_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
      icon: "database",
      headline: "Enrollments",
    },
    bullets: [
      "Chapter 6 · Enrollments M:N",
      "A mapping collection",
    ],
  },
  {
    id: "purpose",
    title: "Many users, many courses",
    kind: "content",
    bullets: [
      "One user takes many courses, and one course has many users",
      "Storing a list on both sides means two writes, and the second write can fail",
      "An enrollments document stores one user id and one course id",
    ],
    diagram: "enrollments-mn",
  },
  {
    id: "enroll-picture",
    title: "Enrollments from People to Mongo",
    kind: "demo",
    bullets: [
      "People and the Dashboard ask the courses client, and the client calls the course routes.",
      "Those routes call the Enrollments DAO, which reads and writes the enrollments collection.",
    ],
    diagram: "enroll-stack",
  },
  {
    id: "schema",
    title: "Refs name the two models",
    kind: "demo",
    bullets: [
      "`ref` stores the id, not a copy of the other document",
      "`populate` uses that name to load `CourseModel` or `UserModel`",
    ],
    code: `import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, ref: "CourseModel" },
  user: { type: String, ref: "UserModel" },
  grade: Number,
  letterGrade: String,
  enrollmentDate: Date,`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/schema.ts",
    codeHighlightLines: [[4, 5]],
  },
  {
    id: "schema-rest",
    title: "Status and the collection",
    kind: "demo",
    code: `  status: {
    type: String,
    enum: ["ENROLLED", "DROPPED", "COMPLETED"],
    default: "ENROLLED",
  },
},
{ collection: "enrollments" });
export default enrollmentSchema;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/schema.ts",
    codeStartLine: 9,
    codeHighlightLines: [7],
  },
  {
    id: "model",
    title: "EnrollmentModel from the schema",
    kind: "demo",
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("EnrollmentModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/model.ts",
    codeHighlightLines: [3],
  },
  {
    id: "dao-skeleton",
    title: "Enrollments DAO implements database CRUD",
    kind: "demo",
    bullets: [
      "Import `model`. The DAO functions close over it when they find and write enrollments",
      "Export the function. Courses routes create it once",
    ],
    code: `import model from "./model";

export default function EnrollmentsDao() {
  return {};
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "routes-wire",
    title: "Courses routes create the DAO",
    kind: "demo",
    bullets: [
      "Import it next to the courses DAO",
      "Course routes call `enrollmentsDao` to enroll, unenroll, and list people",
    ],
    code: `import CoursesDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";

const dao = CoursesDao();
const enrollmentsDao = EnrollmentsDao();`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [2, 5],
  },
  sectionSlide("section-reading", "Enrolled Courses"),
  {
    id: "read-path",
    title: "`GET` enrolled courses",
    kind: "demo",
    bullets: [
      "populate replaces the course id on each enrollment with the course document.",
      "The Dashboard can then show the course name instead of only an id.",
    ],
    diagram: "enroll-read",
  },
  {
    id: "populate",
    title: "Enrollments DAO finds a user's courses",
    kind: "demo",
    bullets: [
      "`populate(\"course\")` replaces the id with the course document",
      "`map` returns the array the Dashboard already expects",
      "Export `findCoursesForUser` on the DAO",
    ],
    code: `async function findCoursesForUser(userId) {
  const enrollments = await model
    .find({ user: userId })
    .populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}
return { findCoursesForUser };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeHighlightLines: [2, 4],
    codeAddedLines: [[1, 7]],
    diagram: "enroll-read",
    diagramFocus: "dao",
  },
  {
    id: "read-route",
    title: "`GET` current user's courses",
    kind: "demo",
    code: `const findCoursesForEnrolledUser = async (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await enrollmentsDao.findCoursesForUser(userId);
  res.json(courses);
};
app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeHighlightLines: [11, 14],
    diagram: "enroll-read",
    diagramFocus: "routes",
  },
  {
    id: "read-client",
    title: "Client asks for my courses",
    kind: "demo",
    code: `export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    \`\${USERS_API}/current/courses\`,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
    diagram: "enroll-read",
    diagramFocus: "client",
  },
  {
    id: "read-ui",
    title: "Dashboard loads my courses",
    kind: "demo",
    code: `const setCourses = useCoursesStore((state) => state.setCourses);
...
useEffect(() => {
  const load = async () => {
    setCourses(await client.findMyCourses());
  };
  load();
}, [currentUser]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [[3, 8]],
    diagram: "enroll-read",
    diagramFocus: "ui",
  },
  {
    id: "read-result",
    title: "Dashboard shows my courses",
    kind: "demo",
    bullets: [
      "Each card is a course document that populate attached to an enrollment.",
    ],
    diagram: "enroll-read-result",
  },
  sectionSlide("section-joins", "Deleting Joins"),
  {
    id: "joins-path",
    title: "`DELETE` a course and its joins",
    kind: "demo",
    bullets: [
      "Deleting a course also deletes its enrollments, or those rows would point at a missing course.",
      "`deleteMany({ course })` removes every enrollment whose course field is that course id.",
    ],
    diagram: "enroll-joins",
  },
  {
    id: "delete-course",
    title: "Enrollments DAO deletes a course's rows",
    kind: "demo",
    bullets: [
      "Otherwise Dashboard tries to populate a course id that is gone",
      "Export `unenrollAllUsersFromCourse`",
    ],
    code: `function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}
return { findCoursesForUser, unenrollAllUsersFromCourse };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 4]],
    diagram: "enroll-joins",
    diagramFocus: "dao",
  },
  {
    id: "delete-course-route",
    title: "`DELETE` course drops the joins",
    kind: "demo",
    code: `const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 6]],
    diagram: "enroll-joins",
    diagramFocus: "routes",
  },
  {
    id: "delete-client",
    title: "Client still deletes the course",
    kind: "demo",
    code: `export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(\`\${COURSES_API}/\${courseId}\`);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
    diagram: "enroll-joins",
    diagramFocus: "client",
  },
  {
    id: "delete-ui",
    title: "Delete still drops the card",
    kind: "demo",
    code: `const deleteCourse = useCoursesStore((state) => state.deleteCourse);
...
const onDeleteCourse = async (courseId: string) => {
  await client.deleteCourse(courseId);
  deleteCourse(courseId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [[3, 6]],
    diagram: "enroll-joins",
    diagramFocus: "ui",
  },
  {
    id: "joins-result",
    title: "Course and its rows are gone",
    kind: "demo",
    bullets: [
      "The enrollments whose course was the deleted course are gone from the collection.",
    ],
    diagram: "enroll-joins-result",
  },
  sectionSlide("section-enrolling", "Enrolling"),
  {
    id: "enroll-create-path",
    title: "`POST` enrolls the user",
    kind: "demo",
    bullets: [
      "Enroll sends `POST /api/users/:uid/courses/:cid.`",
      "The DAO inserts one enrollment document with that user id and that course id.",
    ],
    diagram: "enroll-create",
  },
  {
    id: "enroll-dao",
    title: "Enrollments DAO enrolls a user",
    kind: "demo",
    bullets: [
      "`_id` is `userId-courseId`, so the pair stays unique",
      "Export `enrollUserInCourse` on the DAO",
    ],
    code: `function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: \`\${userId}-\${courseId}\`,
  });
}
return {
  findCoursesForUser, unenrollAllUsersFromCourse,
  enrollUserInCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 7], 10],
    diagram: "enroll-create",
    diagramFocus: "dao",
  },
  {
    id: "create-enroll",
    title: "Create also enrolls you",
    kind: "demo",
    bullets: [
      "After creating the course, we can enroll the current user with `enrollUserInCourse`",
    ],
    code: `const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  const currentUser = req.session["currentUser"];
  enrollmentsDao.enrollUserInCourse(
    currentUser._id, newCourse._id);
  res.json(newCourse);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[3, 5]],
    diagram: "enroll-create",
    diagramFocus: "routes",
  },
  {
    id: "enroll-route",
    title: "`POST` enrolls the session user",
    kind: "demo",
    code: `const enrollUserInCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
  res.send(status);
};
app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 9]],
    diagram: "enroll-create",
    diagramFocus: "routes",
  },
  {
    id: "enroll-client",
    title: "Enrolling from the Client",
    kind: "demo",
    code: `export const enrollIntoCourse = async (
  userId: string,
  courseId: string,
) => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 9]],
    diagram: "enroll-create",
    diagramFocus: "client",
  },
  {
    id: "fetch-all",
    title: "Fetching every course",
    kind: "demo",
    bullets: [
      "`axios.get` sends `GET /api/courses`",
      "`fetchAllCourses` returns the course documents",
    ],
    code: `export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeHighlightLines: [[1, 4]],
  },
  {
    id: "dash-imports",
    title: "Dashboard imports the client",
    kind: "demo",
    bullets: [
      "`import * as client` loads the course client functions",
      "`useCoursesStore` reads the cached course list",
      "`useAccountContext` supplies `currentUser`",
    ],
    code: `"use client";

import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";
import { useAccountContext } from "../account/AccountContext";
import * as client from "../courses/client";
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [11],
  },
  {
    id: "dash-state",
    title: "Courses and enrolled ids",
    kind: "demo",
    bullets: [
      "`setCourses` replaces the Zustand course cache",
      "`useState` creates `enrolledIds` and `setEnrolledIds`",
      "`currentUser` is the signed-in user",
    ],
    code: `export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const setCourses = useCoursesStore((state) => state.setCourses);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const { currentUser } = useAccountContext();
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 13,
    codeHighlightLines: [5],
  },
  {
    id: "enroll-refresh",
    title: "Dashboard reloads from the server",
    kind: "demo",
    bullets: [
      "`fetchAllCourses` loads every course into `setCourses`",
      "`findMyCourses` returns this user's courses, and `setEnrolledIds` stores their ids",
      "`useEffect` calls `reload` when `currentUser` changes",
    ],
    code: `  const reload = async () => {
    setCourses(await client.fetchAllCourses());
    const mine = await client.findMyCourses();
    setEnrolledIds(mine.map((item) => item._id));
  };

  useEffect(() => {
    reload();
  }, [currentUser]);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 20,
    codeHighlightLines: [4, [7, 9]],
  },
  {
    id: "dash-handlers",
    title: "Handlers write, then reload",
    kind: "demo",
    bullets: [
      "`createCourse` posts the form, then `reload` refetches",
      "`updateCourse` saves the course, then `reload` refetches",
      "`deleteCourse` removes the course, then `reload` refetches",
    ],
    code: `  const onAddCourse = async () => {
    await client.createCourse(course);
    await reload();
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    await reload();
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    await reload();
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 30,
    codeHighlightLines: [3, 8, 13],
  },
  {
    id: "dash-add",
    title: "Add calls the create handler",
    kind: "demo",
    bullets: [
      "`onClick` calls `onAddCourse`",
    ],
    code: `  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={onAddCourse}
        >
          Add
        </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 45,
    codeHighlightLines: [11],
  },
  {
    id: "dash-update",
    title: "Update calls the save handler",
    kind: "demo",
    bullets: [
      "`onClick` calls `onUpdateCourse`",
    ],
    code: `        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click"
          onClick={onUpdateCourse}
        >
          Update
        </button>
      </h5>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 59,
    codeHighlightLines: [5],
  },
  {
    id: "dash-fields",
    title: "Course name and description",
    kind: "demo",
    bullets: [
      "`setCourse` stores the name and the description",
    ],
    code: `      <input
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
      />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 68,
    codeHighlightLines: [4, [11, 13]],
  },
  {
    id: "dash-list",
    title: "Published course count",
    kind: "demo",
    bullets: [
      "`courses.length` counts the courses in the cache",
    ],
    code: `      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 83,
    codeHighlightLines: [2],
  },
  {
    id: "dash-cards",
    title: "Cards receive the enrolled ids",
    kind: "demo",
    bullets: [
      "Each card gets `enrolledIds` and `onChange`",
      "`onChange` is `reload`",
      "`onDelete` calls `onDeleteCourse` with the course id",
    ],
    code: `        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            enrolledIds={enrolledIds}
            onChange={reload}
            onEdit={() => setCourse(c)}
            onDelete={() => onDeleteCourse(c._id)}
          />
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 90,
    codeHighlightLines: [5, 6, 8],
  },
  sectionSlide("section-unenrolling", "Unenrolling"),
  {
    id: "enroll-unenroll-path",
    title: "`DELETE` unenrolls the user",
    kind: "demo",
    bullets: [
      "Unenroll sends `DELETE /api/users/:uid/courses/:cid.`",
      "The DAO deletes the one enrollment that pairs this user with this course.",
    ],
    diagram: "enroll-unenroll",
  },
  {
    id: "unenroll-dao",
    title: "Enrollments DAO drops one enrollment",
    kind: "demo",
    bullets: ["`deleteOne({ user, course })` removes that pair. Export it"],
    code: `function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
return {
  findCoursesForUser, unenrollAllUsersFromCourse,
  enrollUserInCourse, unenrollUserFromCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 3], 6],
    diagram: "enroll-unenroll",
    diagramFocus: "dao",
  },
  {
    id: "unenroll-route",
    title: "`DELETE` unenrolls the session",
    kind: "demo",
    code: `const unenrollUserFromCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao
    .unenrollUserFromCourse(uid, cid);
  res.send(status);
};
app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 10]],
    diagram: "enroll-unenroll",
    diagramFocus: "routes",
  },
  {
    id: "unenroll-client",
    title: "Unenrolling from the Client",
    kind: "demo",
    code: `export const unenrollFromCourse = async (
  userId: string,
  courseId: string,
) => {
  const response = await axiosWithCredentials.delete(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 9]],
    diagram: "enroll-unenroll",
    diagramFocus: "client",
  },
  {
    id: "card-imports",
    title: "CourseCard imports",
    kind: "demo",
    bullets: [
      "`coursesClient` is `enrollIntoCourse` and `unenrollFromCourse`",
      "`Course` is the course document type",
    ],
    code: `import Link from "next/link";
import Image from "next/image";
import * as coursesClient from "../courses/client";
import { useAccountContext } from "../account/AccountContext";
import type { Course } from "../store/coursesStore";
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [3, 4],
  },
  {
    id: "card-props",
    title: "CourseCard props",
    kind: "demo",
    bullets: [
      "`enrolledIds` is the list `setEnrolledIds` stored",
      "`onChange` is the dashboard `reload`",
      "`onEdit` and `onDelete` come from the Dashboard",
    ],
    code: `export default function CourseCard({
  course,
  enrolledIds,
  onChange,
  onEdit,
  onDelete,
}: {
  course: Course;
  enrolledIds: string[];
  onChange: () => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 7,
    codeHighlightLines: [3, 4],
  },
  {
    id: "enroll-enrolled",
    title: "Card reads enrolled ids",
    kind: "demo",
    bullets: [
      "`useAccountContext` reads `currentUser`",
      "`enrolledIds.includes` checks this `course._id`",
      "`enrolled` is null when `currentUser` is missing",
    ],
    code: `  const { currentUser } = useAccountContext();
  const enrolled = currentUser
    ? enrolledIds.includes(course._id)
    : null;
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 20,
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "enroll-ui",
    title: "Enroll writes, then reloads",
    kind: "demo",
    bullets: [
      "`enrollIntoCourse` posts the user id and the course id",
      "`onChange` runs `reload`",
    ],
    code: `  const onEnroll = async () => {
    if (!currentUser || enrolled) return;
    await coursesClient.enrollIntoCourse(
      currentUser._id,
      course._id,
    );
    await onChange();
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 25,
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "unenroll-ui",
    title: "Unenroll deletes, then reloads",
    kind: "demo",
    bullets: [
      "`unenrollFromCourse` deletes that user and course pair",
      "`onChange` runs `reload`, and the id leaves `enrolledIds`",
    ],
    code: `  const onUnenroll = async () => {
    if (!currentUser || !enrolled) return;
    await coursesClient.unenrollFromCourse(
      currentUser._id,
      course._id,
    );
    await onChange();
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 34,
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "card-frame",
    title: "Card link and image",
    kind: "demo",
    bullets: [
      "`Link` opens this course's home screen",
    ],
    code: `  return (
    <div className={
      "wd-dashboard-course w-[300px] max-w-full overflow-hidden " +
      "rounded-lg border border-neutral-200 bg-white shadow-sm"
    }>
      <Link
        href={\`/courses/\${course._id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        <Image
          src={course.image}
          width={300}
          height={160}
          alt={course.name}
          className="h-40 w-full object-cover"
        />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 43,
    codeHighlightLines: [7],
  },
  {
    id: "card-text",
    title: "Card title and description",
    kind: "demo",
    bullets: [
      "The heading shows `course.name`",
      "The paragraph shows `course.description`",
    ],
    code: `        <div className="p-4">
          <h5 className={
            "wd-dashboard-course-title m-0 mb-2 truncate " +
            "text-lg font-semibold whitespace-nowrap"
          }>
            {course.name}
          </h5>
          <p className={
            "wd-dashboard-course-description m-0 mb-3 h-[100px] " +
            "overflow-hidden text-sm text-neutral-600"
          }>
            {course.description}
          </p>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 59,
    codeHighlightLines: [6, 12],
  },
  {
    id: "card-go",
    title: "Go button",
    kind: "demo",
    bullets: [
      "Go sits inside the `Link`, so it opens the course",
    ],
    code: `          <button
            type="button"
            className={
              "inline-flex items-center justify-center rounded " +
              "bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
            }
          >
            Go
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 72,
  },
  {
    id: "card-edit",
    title: "Edit button",
    kind: "demo",
    bullets: [
      "`preventDefault` keeps the click off the course link",
      "`onEdit` fills the form with this course",
    ],
    code: `          <button
            type="button"
            id="wd-edit-course-click"
            className={
              "ms-2 inline-flex items-center justify-center rounded " +
              "bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            }
            onClick={(event) => {
              event.preventDefault();
              onEdit();
            }}
          >
            Edit
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 81,
    codeHighlightLines: [[9, 10]],
  },
  {
    id: "card-delete",
    title: "Delete button",
    kind: "demo",
    bullets: [
      "`onDelete` calls `onDeleteCourse` for this course",
    ],
    code: `          <button
            type="button"
            id="wd-delete-course-click"
            className={
              "ms-2 inline-flex items-center justify-center rounded " +
              "bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            }
            onClick={(event) => {
              event.preventDefault();
              onDelete();
            }}
          >
            Delete
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 95,
    codeHighlightLines: [[9, 10]],
  },
  {
    id: "card-enroll",
    title: "Enrollment button colors",
    kind: "demo",
    bullets: [
      "`enrolled` picks `bg-red-600` or `bg-green-600`",
    ],
    code: `          {enrolled !== null && (
            <button
              type="button"
              id="wd-enrollment-click"
              className={
                "ms-2 inline-flex items-center justify-center rounded " +
                "px-3 py-1.5 text-sm font-medium text-white " +
                (enrolled ? "bg-red-600" : "bg-green-600")
              }`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 109,
    codeHighlightLines: [8],
  },
  {
    id: "card-click",
    title: "Enrollment button handler",
    kind: "demo",
    bullets: [
      "`preventDefault` stays on the button",
      "`onUnenroll` runs when `enrolled` is true",
      "`onEnroll` runs when `enrolled` is false",
    ],
    code: `              onClick={(event) => {
                event.preventDefault();
                if (enrolled) {
                  onUnenroll();
                } else {
                  onEnroll();
                }
              }}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 118,
    codeHighlightLines: [[2, 7]],
  },
  {
    id: "card-close",
    title: "Enrollment button label",
    kind: "demo",
    bullets: [
      "The label is Unenroll when `enrolled` is true, and Enroll when it is false",
    ],
    code: `            >
              {enrolled ? "Unenroll" : "Enroll"}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 126,
    codeHighlightLines: [2],
  },
  {
    id: "enroll-result",
    title: "Button says Unenroll",
    kind: "demo",
    bullets: [
      "The button says Unenroll because the `POST` inserted an enrollment for this user and course.",
    ],
    diagram: "enroll-create-result",
  },
  {
    id: "unenroll-result",
    title: "Button says Enroll again",
    kind: "demo",
    bullets: [
      "The button says Enroll again because that enrollment document was deleted.",
    ],
    diagram: "enroll-unenroll-result",
  },
  sectionSlide("section-people", "Listing People"),
  {
    id: "people-path",
    title: "Listing people in a course",
    kind: "demo",
    bullets: [
      "People asks `GET /api/courses/:cid/users` for this course only.",
      "The list is the users enrolled in the course, not every user in the collection.",
    ],
    diagram: "enroll-people",
  },
  {
    id: "people-dao",
    title: "Enrollments DAO finds a course's users",
    kind: "demo",
    bullets: [
      "Same shape as `findCoursesForUser`, with `populate(\"user\")`",
      "Export `findUsersForCourse`",
    ],
    code: `async function findUsersForCourse(courseId) {
  const enrollments = await model
    .find({ course: courseId })
    .populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}
return {
  findCoursesForUser, findUsersForCourse,
  unenrollAllUsersFromCourse, enrollUserInCourse,
  unenrollUserFromCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 6], 8],
    diagram: "enroll-people",
    diagramFocus: "dao",
  },
  {
    id: "people",
    links: ["http://localhost:4000/api/courses/RS101/users"],
    title: "`GET` enrolled users route",
    kind: "demo",
    code: `const findUsersForCourse = async (req, res) => {
  const { cid } = req.params;
  const users = await enrollmentsDao.findUsersForCourse(cid);
  res.json(users);
};
app.get("/api/courses/:cid/users", findUsersForCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 6]],
    diagram: "enroll-people",
    diagramFocus: "routes",
  },
  {
    id: "people-client",
    title: "Fetching Enrolled Users",
    kind: "demo",
    code: `export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(\`\${COURSES_API}/\${courseId}/users\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
    diagram: "enroll-people",
    diagramFocus: "client",
  },
  {
    id: "people-load",
    title: "People page loads that list",
    kind: "demo",
    code: `import * as client from "../../../client";
...
const [users, setUsers] = useState<User[]>([]);
...
const fetchUsers = async () => {
  setUsers(await client.findUsersForCourse(cid));
};
useEffect(() => {
  fetchUsers();
}, [cid]);
...
return <PeopleTable users={users} fetchUsers={fetchUsers} />;`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
    codeHighlightLines: [1, 3, [5, 10], 12],
    diagram: "enroll-people",
    diagramFocus: "ui",
  },
  {
    id: "people-live",
    title: "Course People lists members",
    kind: "demo",
    bullets: [
      "Open People and the names are the users enrolled in the course",
      "A student who is not enrolled does not appear",
    ],
    embed: "kambaz-styled-people",
  },
  {
    id: "assignments",
    title: "Assignments are 1:N too",
    kind: "content",
    bullets: [
      "On your own — schema, model, DAO, then `await` the Chapter 5 routes",
      "Own collection plus a `course` id, or embed the assignments on the course",
      "`findAssignmentsForCourse`, create, update, delete — the modules shape",
    ],
  },
  {
    id: "recap",
    title: "Enrollments recap",
    kind: "content",
    bullets: [
      "Mapping collection with `ref: \"UserModel\"` and `CourseModel`",
      "`populate`, `deleteMany` on course delete, enroll / unenroll URLs",
      "Course People lists enrolled users. Assignments follow modules",
    ],
  },
  {
    id: "next-up",
    title: "Next: YouTube API",
    kind: "title",
    bullets: [
      "Google Cloud project, then a YouTube Data API v3 key",
      "Store the key in env. Never commit a live key",
    ],
  },
];
