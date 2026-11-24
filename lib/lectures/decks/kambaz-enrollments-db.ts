import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

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
    title: "Enrollments DAO exports functions",
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
  {
    id: "read-path",
    title: "GET enrolled courses",
    kind: "demo",
    bullets: [
      "populate replaces the course id on each enrollment with the course document.",
      "The Dashboard can then show the course name instead of only an id.",
    ],
    diagram: "enroll-read",
  },
  {
    id: "populate",
    title: "populate unwraps the course",
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
  },
  {
    id: "read-route",
    title: "GET current user's courses",
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
  {
    id: "joins-path",
    title: "DELETE a course and its joins",
    kind: "demo",
    bullets: [
      "Deleting a course also deletes its enrollments, or those rows would point at a missing course.",
      "`deleteMany({ course })` removes every enrollment whose course field is that course id.",
    ],
    diagram: "enroll-joins",
  },
  {
    id: "delete-course",
    title: "deleteMany by course id",
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
  },
  {
    id: "delete-course-route",
    title: "DELETE course drops the joins",
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
  {
    id: "enroll-create-path",
    title: "POST enrolls the user",
    kind: "demo",
    bullets: [
      "Enroll sends POST /api/users/:uid/courses/:cid.",
      "The DAO inserts one enrollment document with that user id and that course id.",
    ],
    diagram: "enroll-create",
  },
  {
    id: "enroll-dao",
    title: "enrollUserInCourse inserts one",
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
  },
  {
    id: "create-enroll",
    title: "Create also enrolls you",
    kind: "demo",
    bullets: [
      "The courses deck inserted the document. This line writes the join",
      "`enrollUserInCourse` already exists, so the route can call it",
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
  },
  {
    id: "enroll-route",
    title: "POST enrolls the session user",
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
  },
  {
    id: "enroll-refresh",
    title: "Dashboard reloads from the server",
    kind: "demo",
    bullets: [
      "`enrolledIds` comes from `findMyCourses`, not a local array",
      "Both buttons call `reload` after the write",
    ],
    code: `const reload = async () => {
  setCourses(await client.fetchAllCourses());
  const mine = await client.findMyCourses();
  setEnrolledIds(mine.map((item) => item._id));
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "enroll-enrolled",
    title: "Card reads enrolled ids",
    kind: "demo",
    bullets: [
      "Import the courses client. Do not read an enrollments store",
      "`enrolled` is whether this id came back from the server",
    ],
    code: `import * as coursesClient from "../courses/client";
import { useAccountContext } from "../account/AccountContext";

const { currentUser } = useAccountContext();
const enrolled = currentUser
  ? enrolledIds.includes(course._id)
  : null;`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [1, [5, 7]],
  },
  {
    id: "enroll-ui",
    title: "Enroll writes, then reloads",
    kind: "demo",
    bullets: ["`onChange` is the dashboard `reload`"],
    code: `const onEnroll = async () => {
  if (!currentUser || enrolled) return;
  await coursesClient.enrollIntoCourse(
    currentUser._id,
    course._id,
  );
  await onChange();
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [[3, 7]],
  },
  {
    id: "enroll-result",
    title: "Button says Unenroll",
    kind: "demo",
    bullets: [
      "The button says Unenroll because the POST inserted an enrollment for this user and course.",
    ],
    diagram: "enroll-create-result",
  },
  {
    id: "enroll-unenroll-path",
    title: "DELETE unenrolls the user",
    kind: "demo",
    bullets: [
      "Unenroll sends DELETE /api/users/:uid/courses/:cid.",
      "The DAO deletes the one enrollment that pairs this user with this course.",
    ],
    diagram: "enroll-unenroll",
  },
  {
    id: "unenroll-dao",
    title: "unenroll deletes one row",
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
  },
  {
    id: "unenroll-route",
    title: "DELETE unenrolls the session",
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
  },
  {
    id: "unenroll-ui",
    title: "Unenroll deletes, then reloads",
    kind: "demo",
    bullets: ["Same `onChange`. The id leaves `enrolledIds` on the next paint"],
    code: `const onUnenroll = async () => {
  if (!currentUser || !enrolled) return;
  await coursesClient.unenrollFromCourse(
    currentUser._id,
    course._id,
  );
  await onChange();
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [[3, 7]],
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
  {
    id: "people-path",
    title: "GET /api/courses/:cid/users",
    kind: "demo",
    bullets: [
      "People asks GET /api/courses/:cid/users for this course only.",
      "The list is the users enrolled in the course, not every user in the collection.",
    ],
    diagram: "enroll-people",
  },
  {
    id: "people-dao",
    title: "populate unwraps the user",
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
  },
  {
    id: "people",
    links: ["http://localhost:4000/api/courses/RS101/users"],
    title: "GET enrolled users route",
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
