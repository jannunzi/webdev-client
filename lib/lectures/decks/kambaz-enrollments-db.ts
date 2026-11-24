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
    bullets: ["People, client, routes, DAO, then the enrollments collection"],
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
    id: "read-path",
    title: "GET enrolled courses",
    kind: "demo",
    bullets: ["populate turns the course id into the course document"],
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
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeHighlightLines: [12],
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
    bullets: ["Point at the cards. Each one was a populated course"],
    diagram: "enroll-read-result",
  },
  {
    id: "joins-path",
    title: "DELETE a course and its joins",
    kind: "demo",
    bullets: ["`deleteMany({ course })` removes every enrollment for that course"],
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
    bullets: ["Point at the crossed-out rows. Those enrollments pointed at the deleted course"],
    diagram: "enroll-joins-result",
  },
  {
    id: "enroll-create-path",
    title: "POST enrolls the user",
    kind: "demo",
    bullets: ["`POST /api/users/:uid/courses/:cid` inserts one enrollment"],
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
    id: "enroll-ui",
    title: "Enroll button calls the client",
    kind: "demo",
    code: `const toggleEnrollment = () => {
  if (!currentUser) return;
  if (enrolled) {
    unenrollFromCourse(currentUser._id, course._id);
  } else {
    enrollIntoCourse(currentUser._id, course._id);
  }
};`,
    codeLanguage: "tsx",
    codeFile: "app/slides/_components/embeds/enrollments/dashboard/CourseCard.tsx",
    codeHighlightLines: [6],
  },
  {
    id: "enroll-result",
    title: "Button says Unenroll",
    kind: "demo",
    bullets: ["Point at Unenroll. One enrollment row was inserted"],
    diagram: "enroll-create-result",
  },
  {
    id: "enroll-unenroll-path",
    title: "DELETE unenrolls the user",
    kind: "demo",
    bullets: ["`DELETE /api/users/:uid/courses/:cid` removes that one row"],
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
    id: "unenroll-result",
    title: "Button says Enroll again",
    kind: "demo",
    bullets: ["Point at Enroll. The same button now inserts, because the row is gone"],
    diagram: "enroll-unenroll-result",
  },
  {
    id: "people-path",
    title: "GET /api/courses/:cid/users",
    kind: "demo",
    bullets: ["People lists the users enrolled in this course, not every user"],
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
];
