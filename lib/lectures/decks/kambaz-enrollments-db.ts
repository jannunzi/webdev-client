import type { LectureSlide } from "../types";

export const KAMBAZ_ENROLLMENTS_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "database",
      headline: "Kambaz Enrollments: Many-to-Many",
    },
    bullets: [
      "Chapter 6 · Enrollments Many-to-Many",
      "A mapping collection",
    ],
  },
  {
    id: "purpose",
    title: "Linking Users and Courses",
    kind: "content",
    bullets: [
      "A user takes many courses, and a course has many users — **many-to-many**",
      "Course lists on users plus user lists on courses means two writes that can disagree",
      "A **mapping collection** stores one document per pair: `{ user: \"123\", course: \"RS101\" }`",
      "Users and courses no longer need to know about each other",
    ],
  },
  {
    id: "schema-intro",
    title: "Creating the Enrollment Schema",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Enrollments/schema.ts` file, create the schema as shown below",
      "`ref` says which model an id points to: `course` → `CourseModel`",
      "`EnrollmentModel` + `collection: \"enrollments\"`",
      "DAO `_id` of `userId-courseId` keeps the pair unique",
    ],
  },
  {
    id: "schema",
    title: "Referencing Users and Courses",
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
    id: "populate-how",
    title: "How populate Replaces IDs",
    kind: "content",
    bullets: [
      "Stored enrollment: `{ user: \"123\", course: \"RS101\" }`",
      "`populate(\"course\")` looks up `RS101` in `CourseModel` because of the `ref`",
      "Result: `{ user: \"123\", course: { _id: \"RS101\", name: \"Rocket Propulsion\" } }`",
      "One query returns the full courses, not just their ids",
    ],
  },
  {
    id: "populate",
    title: "Finding a User's Courses",
    kind: "demo",
    bullets: [
      "In `Kambaz/Enrollments/dao.ts`, add `findCoursesForUser` as shown below",
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
    id: "delete-course-intro",
    title: "Removing Enrollments with a Course",
    kind: "demo",
    bullets: [
      "In `Courses/routes.ts`, unenroll everyone before deleting, as shown below",
      "`deleteMany` is the many-document cousin of `deleteOne`",
      "Otherwise Dashboard populates a course id that no longer exists",
    ],
  },
  {
    id: "delete-course",
    title: "Deleting a Course and Its Enrollments",
    kind: "demo",
    code: `function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "enroll-intro",
    title: "Enrolling and Unenrolling Users",
    kind: "demo",
    bullets: [
      "In `Kambaz/Enrollments/dao.ts`, add both functions on your own",
      "`enrollUserInCourse` inserts `{ user, course, _id: userId-courseId }`",
      "`unenrollUserFromCourse` deletes the matching pair",
    ],
  },
  {
    id: "enroll",
    title: "Writing Enroll and Unenroll Functions",
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
  },
  {
    id: "enroll-routes-intro",
    title: "Enrolling Through the Users Routes",
    kind: "demo",
    bullets: [
      "In `Users/routes.ts`, add both handlers as shown below",
      "When `uid` is `\"current\"`, use the session user. No session → 401",
      "Then call the Enrollments DAO and send the result",
    ],
  },
  {
    id: "enroll-routes",
    title: "Writing Enroll and Unenroll Routes",
    kind: "demo",
    code: `const enrollUserInCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    uid = currentUser._id;
  }
  const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
  res.send(status);
};
const unenrollUserFromCourse = async (req, res) => {
  let { uid, cid } = req.params;
  if (uid === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    uid = currentUser._id;
  }
  const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
  res.send(status);
};
app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [[3, 10], [27, 28]],
  },
  {
    id: "people",
    links: ["http://localhost:4000/api/courses/RS101/users"],
    title: "Listing a Course's Enrolled Users",
    kind: "demo",
    bullets: [
      "In `Courses/routes.ts`, add the route as shown below",
      "Mirror `findCoursesForUser`: find, `populate(\"user\")`, map",
      "Same PeopleTable — only the fetch changes",
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
    embed: "kambaz-styled-people",
  },
  {
    id: "assignments",
    title: "Storing Assignments One-to-Many",
    kind: "content",
    bullets: [
      "On your own — schema, model, DAO, `await` the Chapter 5 routes",
      "Own collection with a `course` field, or embed on the course",
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
      "Checklist — Labs TOC, Atlas, then sign in remotely",
    ],
  },
];
