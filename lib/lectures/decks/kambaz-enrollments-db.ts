import type { LectureSlide } from "../types";

export const KAMBAZ_ENROLLMENTS_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
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
    bullets: ["deleteMany removes every enrollment for that course"],
    diagram: "enroll-joins",
  },
  {
    id: "delete-course-intro",
    title: "Delete a course, then its joins",
    kind: "demo",
    bullets: [
      "`deleteMany` is the many-document cousin of `deleteOne`",
      "Otherwise Dashboard populates a course id that no longer exists",
    ],
  },
  {
    id: "delete-course",
    title: "Delete a course, then its joins (code)",
    kind: "demo",
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
    bullets: ["The route inserts one enrollment for the session user"],
    diagram: "enroll-create",
  },
  {
    id: "enroll-unenroll-path",
    title: "DELETE unenrolls the user",
    kind: "demo",
    bullets: ["The same URL with DELETE removes that one enrollment"],
    diagram: "enroll-unenroll",
  },
  {
    id: "enroll-intro",
    title: "Enroll / unenroll on your own",
    kind: "demo",
    bullets: [
      "`enrollUserInCourse` inserts `{ user, course, _id: userId-courseId }`",
      "`uid === \"current\"` reads the session, same as enrolled-courses",
    ],
  },
  {
    id: "enroll",
    title: "Enroll / unenroll on your own (code)",
    kind: "demo",
    code: `function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: \`\${userId}-\${courseId}\`,
  });
}
function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.ts",
    codeHighlightLines: [[1, 10]],
  },
  {
    id: "enroll-routes",
    title: "Enroll and Unenroll Routes",
    kind: "demo",
    code: `const enrollUserInCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao
    .enrollUserInCourse(uid, cid);
  res.send(status);
};
const unenrollUserFromCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    uid = req.session["currentUser"]._id;
  }
  const status = await enrollmentsDao
    .unenrollUserFromCourse(uid, cid);
  res.send(status);
};
app.post(
  "/api/users/:uid/courses/:cid",
  enrollUserInCourse,
);
app.delete(
  "/api/users/:uid/courses/:cid",
  unenrollUserFromCourse,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 26]],
  },
  {
    id: "enroll-client",
    title: "Enroll and Unenroll from the Client",
    kind: "demo",
    code: `export const enrollIntoCourse = async (
  userId: string,
  courseId: string,
) => {
  const response =
    await axiosWithCredentials.post(
      \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
    );
  return response.data;
};
export const unenrollFromCourse = async (
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
    codeAddedLines: [[1, 20]],
  },
  {
    id: "people-path",
    title: "GET /api/courses/:cid/users",
    kind: "demo",
    bullets: ["People lists users enrolled in this course"],
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
      "Pass that array to `PeopleTable`. The enrollment filter is gone",
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
