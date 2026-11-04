import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "database",
      headline: "Kambaz Courses in MongoDB",
    },
    bullets: [
      "Chapter 6 · Kambaz Courses DB",
      "CRUD courses in Mongo",
    ],
  },
  {
    id: "purpose",
    title: "Storing Courses in MongoDB",
    kind: "content",
    bullets: [
      "Courses still live in a server array, so new courses vanish on restart",
      "`/api/courses` keeps its URLs. Only where the documents come from changes",
      "Account Context and Zustand cache what the routes return",
      "Confirm each verb in Compass before you move on",
    ],
  },
  {
    id: "schema-intro",
    title: "Creating the Course Schema",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Courses/schema.ts` file, create the schema as shown below",
      "`_id` stays `String` — enrollments and modules already store those ids",
      "`CourseModel` is the name enrollments will `ref` later",
    ],
  },
  {
    id: "schema",
    title: "Defining Course Fields",
    kind: "demo",
    code: `import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  credits: Number,
  description: String,
},
{ collection: "courses" });
export default courseSchema;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/schema.ts",
    codeHighlightLines: [3, 9],
  },
  {
    id: "model",
    title: "Creating the Course Model",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Courses/model.ts` file, create the model as shown below",
      "Same pattern as `UserModel` — one compiled model per process",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("CourseModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/model.ts",
    codeAddedLines: [3],
  },
  {
    id: "find-intro",
    title: "Reading Courses from MongoDB",
    kind: "demo",
    bullets: [
      "In `Kambaz/Courses/dao.ts`, replace the array reads as shown below",
      "Comment out the array return so you do not keep two sources of truth",
      "Enrolled-user helper can still filter against in-memory enrollments for now",
    ],
  },
  {
    id: "find",
    title: "Replacing Array Reads with find()",
    kind: "demo",
    code: `import model from "./model";

function findAllCourses() {
  // return Database.courses;
  return model.find();
}

async function findCoursesForEnrolledUser(userId) {
  const { enrollments } = db;
  const courses = await model.find();
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id,
    ),
  );
  return enrolledCourses;
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [5, [8, 18]],
  },
  {
    id: "async-routes-intro",
    title: "Awaiting Course Lookups in Routes",
    kind: "demo",
    bullets: [
      "In `Kambaz/Courses/routes.ts`, make both lookups `async` as shown below",
      "`userId === \"current\"` still reads the session — 401 if anonymous",
      "Only the lookup behind it is now a promise",
    ],
  },
  {
    id: "async-routes",
    links: ["http://localhost:4000/api/courses", "http://localhost:4000/api/users/123/courses"],
    title: "Waiting for Courses Before Replying",
    kind: "demo",
    code: `const findAllCourses = async (req, res) => {
  const courses = await dao.findAllCourses();
  res.send(courses);
};

const findCoursesForEnrolledUser = async (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await dao.findCoursesForEnrolledUser(userId);
  res.json(courses);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeHighlightLines: [1, 2, 6, 16],
  },
  {
    id: "create-intro",
    title: "Creating a Course with a New ID",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add `createCourse`, then `await` it in the route, as shown below",
      "Spread, `_id: uuidv4()`, `model.create`",
      "Route still enrolls the current user — that write becomes Mongo later",
    ],
  },
  {
    id: "create",
    title: "Saving New Courses to MongoDB",
    kind: "demo",
    code: `function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  const currentUser = req.session["currentUser"];
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);
};
app.post("/api/courses", createCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[6, 12]],
  },
  {
    id: "delete-update",
    title: "Deleting and Updating Courses",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add delete and update as shown below",
      "Dashboard Delete — refresh Compass; the document is gone",
      "Edit a name, save, reopen in Compass before you refresh the browser again",
    ],
    code: `function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}
function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-dashboard",
  },
  {
    id: "recap",
    title: "Courses DB recap",
    kind: "content",
    bullets: [
      "`CourseModel` + `collection: \"courses\"`",
      "`find`, `create` + uuid, `deleteOne`, `updateOne` + `$set`",
      "Routes are `async`. Dashboard buttons write documents",
    ],
  },
  {
    id: "next-up",
    title: "Next: Kambaz Modules: One-to-Many",
    kind: "title",
    bullets: [
      "A course has many modules — foreign key, id array, or embed",
      "Keep a `modules` collection with `course`",
    ],
  },
];
