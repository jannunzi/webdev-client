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
    id: "enroll-picture",
    title: "Enrollments from People to Mongo",
    kind: "demo",
    bullets: ["People, client, routes, DAO, then the enrollments collection"],
    diagram: "enroll-stack",
  },
  {
    id: "purpose",
    title: "Implementing Enrollments in MongoDB",
    kind: "content",
    bullets: [
      "UML asterisks on both ends — keeping two arrays in sync is error-prone",
      "A failed second write leaves the relationship half-applied",
      "`enrollments` is a **mapping collection**: `user` + `course` refs",
      "Users and courses no longer need to know about each other",
    ],
  },
  {
    id: "schema-intro",
    title: "ref names, not copies",
    kind: "demo",
    bullets: [
      "`ref` stores the identifier and tells `populate` which model to load",
      "`EnrollmentModel` + `collection: \"enrollments\"`",
      "DAO `_id` of `userId-courseId` keeps the pair unique",
    ],
  },
  {
    id: "schema",
    title: "ref names, not copies (code)",
    kind: "demo",
    code: `import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, ref: "CourseModel" },
  user: { type: String, ref: "UserModel" },
  grade: Number,
  letterGrade: String,
  enrollmentDate: Date,
  status: {
    type: String,
    enum: ["ENROLLED", "DROPPED", "COMPLETED"],
    default: "ENROLLED",
  },
},
{ collection: "enrollments" });
export default enrollmentSchema;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/schema.ts",
    codeHighlightLines: [[4, 5], [9, 12], 15],
  },
  {
    id: "read-path",
    title: "GET enrolled courses",
    kind: "demo",
    bullets: ["populate turns the course ref into the course document"],
    diagram: "enroll-read",
  },
  {
    id: "populate",
    title: "populate unwraps the course",
    kind: "demo",
    bullets: [
      "`populate(\"course\")` replaces the id with the course document",
      "`map` returns the shape Dashboard already expects",
    ],
    code: `async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeHighlightLines: [2, 3],
  },
  {
    id: "joins-path",
    title: "DELETE a course and its joins",
    kind: "demo",
    bullets: ["`deleteMany({ course })` removes every enrollment for the deleted course"],
    diagram: "enroll-joins",
  },
  {
    id: "delete-course",
    title: "Delete a course, then its joins",
    kind: "demo",
    bullets: [
      "`deleteMany` removes every enrollment for that course",
      "Otherwise Dashboard populates a missing course id",
    ],
    code: `function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeAddedLines: [[1, 3]],
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
    id: "enroll-create-path",
    title: "POST enrolls the user",
    kind: "demo",
    bullets: ["`POST /api/users/:uid/courses/:cid` inserts one enrollment for the session user"],
    diagram: "enroll-create",
  },
  {
    id: "enroll-dao",
    title: "enrollUserInCourse inserts one row",
    kind: "demo",
    bullets: [
      "`enrollUserInCourse` inserts `{ user, course }`",
      "`_id` is `userId-courseId`",
    ],
    code: `function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: \`\${userId}-\${courseId}\`,
  });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
  },
  {
    id: "enroll-route",
    title: "POST enrolls the session user",
    kind: "demo",
    bullets: [
      "In `Courses/routes.ts`, add `enrollUserInCourse` as shown below",
      "`uid === \"current\"` reads the session",
    ],
    code: `const enrollUserInCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao
    .enrollUserInCourse(uid, cid);
  res.send(status);
};
app.post(
  "/api/users/:uid/courses/:cid",
  enrollUserInCourse,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
  },
  {
    id: "enroll-client",
    title: "Enrolling from the Client",
    kind: "demo",
    bullets: [
      "In `courses/client.ts`, add `enrollIntoCourse` as shown below",
    ],
    code: `export const enrollIntoCourse = async (
  userId: string,
  courseId: string,
) => {
  const response =
    await axiosWithCredentials.post(
      \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
    );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
  },
  {
    id: "enroll-live",
    title: "Enroll Live Demo",
    kind: "demo",
    bullets: [
      "On a course you are not in, click Enroll",
      "The card switches to show you are enrolled",
    ],
    embed: "kambaz-enrollments",
  },
  {
    id: "enroll-unenroll-path",
    title: "DELETE unenrolls the user",
    kind: "demo",
    bullets: ["`DELETE /api/users/:uid/courses/:cid` removes that user's enrollment in `:cid`"],
    diagram: "enroll-unenroll",
  },
  {
    id: "unenroll-dao",
    title: "unenrollUserFromCourse deletes one row",
    kind: "demo",
    bullets: ["`unenrollUserFromCourse` runs `deleteOne({ user, course })`"],
    code: `function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
  },
  {
    id: "unenroll-route",
    title: "DELETE unenrolls the session user",
    kind: "demo",
    bullets: [
      "In `Courses/routes.ts`, add `unenrollUserFromCourse` as shown below",
      "`uid === \"current\"` reads the session",
    ],
    code: `const unenrollUserFromCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao
    .unenrollUserFromCourse(uid, cid);
  res.send(status);
};
app.delete(
  "/api/users/:uid/courses/:cid",
  unenrollUserFromCourse,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
  },
  {
    id: "unenroll-client",
    title: "Unenrolling from the Client",
    kind: "demo",
    bullets: [
      "In `courses/client.ts`, add `unenrollFromCourse` as shown below",
    ],
    code: `export const unenrollFromCourse = async (
  userId: string,
  courseId: string,
) => {
  const response =
    await axiosWithCredentials.delete(
      \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
    );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
  },
  {
    id: "unenroll-live",
    title: "Unenroll Live Demo",
    kind: "demo",
    bullets: [
      "On a course you are in, click Unenroll",
      "The card no longer treats you as enrolled",
    ],
    embed: "kambaz-enrollments",
  },
  {
    id: "people-path",
    title: "GET /api/courses/:cid/users",
    kind: "demo",
    bullets: ["`GET /api/courses/:cid/users` lists users enrolled in `:cid`"],
    diagram: "enroll-people",
  },
  {
    id: "people",
    links: ["http://localhost:4000/api/courses/RS101/users"],
    title: "Course People is enrolled users",
    kind: "demo",
    bullets: [
      "Mirror `findCoursesForUser`: find, `populate(\"user\")`, map",
    ],
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
    title: "People Page Loads Enrolled Users",
    kind: "demo",
    bullets: [
      "Pass the array from `GET /api/courses/:cid/users` to `PeopleTable`",
    ],
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
    title: "Course People Live Demo",
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
      "On your own — schema, model, DAO, `await` the Chapter 5 routes",
      "Own collection + `course` FK, or embed on the course",
      "`findAssignmentsForCourse`, create, update, delete — mirror modules",
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
    title: "Next: A6 deliverables",
    kind: "title",
    bullets: [
      "Branch `a6` in both repos. New Render. Canvas gets the Vercel URL",
      "Checklist — Labs TOC, Atlas, then sign in remotely",
    ],
  },
];
