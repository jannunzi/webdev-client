import type { LectureSlide } from "../types";

export const KAMBAZ_ENROLLMENTS_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Enrollments M:N",
      "§6.4.3 · a mapping collection",
    ],
  },
  {
    id: "purpose",
    title: "Many users, many courses",
    kind: "content",
    bullets: [
      "UML asterisks on both ends — keeping two arrays in sync is error-prone",
      "A failed second write leaves the relationship half-applied",
      "`enrollments` is a **mapping collection**: `user` + `course` refs",
      "Users and courses no longer need to know about each other",
    ],
  },
  {
    id: "schema",
    title: "ref names, not copies",
    kind: "demo",
    bullets: [
      "`ref` stores the identifier and tells `populate` which model to load",
      "`EnrollmentModel` + `collection: \"enrollments\"`",
      "DAO `_id` of `userId-courseId` keeps the pair unique",
    ],
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
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Enrollments/schema.js",
    codeHighlightLines: [[4, 5], [9, 12], 15],
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
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.js",
    codeHighlightLines: [2, 3],
  },
  {
    id: "delete-course",
    title: "Delete a course, then its joins",
    kind: "demo",
    bullets: [
      "`deleteMany` is the many-document cousin of `deleteOne`",
      "Otherwise Dashboard populates a course id that no longer exists",
    ],
    code: `function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "enroll",
    title: "Enroll / unenroll on your own",
    kind: "demo",
    bullets: [
      "`enrollUserInCourse` inserts `{ user, course, _id: userId-courseId }`",
      "`uid === \"current\"` reads the session, same as enrolled-courses",
    ],
    code: `function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: \`\${userId}-\${courseId}\`,
  });
}
function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Enrollments/dao.js",
    codeHighlightLines: [[11, 12]],
  },
  {
    id: "people",
    title: "Course People is enrolled users",
    kind: "demo",
    bullets: [
      "Mirror `findCoursesForUser`: find, `populate(\"user\")`, map",
      "Same PeopleTable — only the fetch changes",
    ],
    code: `const findUsersForCourse = async (req, res) => {
  const { cid } = req.params;
  const users = await enrollmentsDao.findUsersForCourse(cid);
  res.json(users);
};
app.get("/api/courses/:cid/users", findUsersForCourse);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Courses/routes.js",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-people",
  },
  {
    id: "assignments",
    title: "Assignments are 1:N too",
    kind: "content",
    bullets: [
      "§6.4.4 On your own — schema, model, DAO, `await` the Chapter 5 routes",
      "Own collection + `course` FK, or embed on the course",
      "`findAssignmentsForCourse`, create, update, delete — mirror modules",
    ],
    embed: "kambaz-styled-assignments",
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
      "§6.5: checklist — Labs TOC, Atlas, then sign in remotely",
    ],
  },
];
