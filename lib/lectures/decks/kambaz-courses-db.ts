import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Kambaz Courses DB",
      "CRUD courses in Mongo",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Courses in MongoDB",
    kind: "content",
    bullets: [
      "Chapter 5 routes still own `/api/courses` — arrays become documents",
      "Account Context and Zustand cache what the routes return",
      "Confirm each verb in Compass before you move on",
    ],
  },
  {
    id: "courses-picture",
    title: "Courses from the Dashboard to Mongo",
    kind: "demo",
    bullets: [
      "Page, client, routes, DAO, then the courses collection",
    ],
    diagram: "courses-stack",
  },
  {
    id: "schema-intro",
    title: "Course schema keeps string ids",
    kind: "demo",
    bullets: [
      "`_id` stays `String` — enrollments and modules already store those ids",
      "`CourseModel` is the name enrollments will `ref` later",
    ],
  },
  {
    id: "schema",
    title: "Course schema keeps string ids (code)",
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
    title: "CourseModel from the schema",
    kind: "demo",
    bullets: [
      "Same pattern as `UserModel` — one compiled model per process",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.models.CourseModel ||
  mongoose.model("CourseModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/model.ts",
    codeAddedLines: [[3, 4]],
  },
  {
    id: "read-all-path",
    title: "GET /api/courses",
    kind: "demo",
    bullets: ["Dashboard calls fetchAllCourses, then setCourses"],
    diagram: "courses-read-all",
  },
  {
    id: "find-intro",
    title: "find() replaces Database.courses",
    kind: "demo",
    bullets: [
      "Comment out the array return so you do not keep two sources of truth",
      "Enrolled-user helper can still filter against in-memory enrollments for now",
    ],
  },
  {
    id: "find",
    title: "find() replaces Database.courses (code)",
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
    title: "Await every course lookup",
    kind: "demo",
    bullets: [
      "`userId === \"current\"` still reads the session — 401 if anonymous",
      "Only the lookup behind it is now a promise",
    ],
  },
  {
    id: "async-routes",
    title: "Await every course lookup (code)",
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
    id: "read-all-client",
    title: "Fetching Every Course",
    kind: "demo",
    code: `export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "read-all-ui",
    title: "Replacing the Course Cache",
    kind: "demo",
    code: `const setCourses = useCoursesStore((state) => state.setCourses);
...
useEffect(() => {
  const load = async () => {
    setCourses(await client.fetchAllCourses());
  };
  load();
}, []);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 8]],
  },
  {
    id: "read-one-path",
    title: "GET /api/courses/:courseId",
    kind: "demo",
    bullets: ["findById is the one-document lookup"],
    diagram: "courses-read-one",
  },
  {
    id: "read-one-server",
    title: "Finding One Course by Id",
    kind: "demo",
    code: `function findCourseById(courseId) {
  return model.findById(courseId);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
  },
  {
    id: "read-one-route",
    title: "GET one course route",
    kind: "demo",
    code: `const findCourseById = async (req, res) => {
  const course = await dao.findCourseById(req.params.courseId);
  res.json(course);
};
app.get("/api/courses/:courseId", findCourseById);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "read-one-client",
    title: "Fetching One Course",
    kind: "demo",
    code: `export const findCourseById = async (courseId: string) => {
  const { data } = await axios.get(\`\${COURSES_API}/\${courseId}\`);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete-path",
    title: "DELETE /api/courses/:courseId",
    kind: "demo",
    bullets: ["Delete the document, then drop it from the store"],
    diagram: "courses-delete",
  },
  {
    id: "delete-server",
    title: "deleteOne by course id",
    kind: "demo",
    code: `function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
  },
  {
    id: "delete-route",
    title: "DELETE course route",
    kind: "demo",
    code: `const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const status = await dao.deleteCourse(courseId);
  res.send(status);
};
app.delete("/api/courses/:courseId", deleteCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "delete-client",
    title: "Deleting a Course from the Client",
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
    title: "Removing the Deleted Course",
    kind: "demo",
    code: `const deleteCourse = useCoursesStore((state) => state.deleteCourse);
...
const onDeleteCourse = async (courseId: string) => {
  await client.deleteCourse(courseId);
  deleteCourse(courseId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "update-path",
    title: "PUT /api/courses/:courseId",
    kind: "demo",
    bullets: ["$set the fields the editor sent, then cache the result"],
    diagram: "courses-update",
  },
  {
    id: "update-server",
    title: "updateOne with $set",
    kind: "demo",
    code: `function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
  },
  {
    id: "update-route",
    title: "PUT course route",
    kind: "demo",
    code: `const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const courseUpdates = req.body;
  const status = await dao.updateCourse(courseId, courseUpdates);
  res.send(status);
};
app.put("/api/courses/:courseId", updateCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "update-client",
    title: "Updating a Course from the Client",
    kind: "demo",
    code: `export const updateCourse = async (course: { _id: string }) => {
  const { data } = await axios.put(
    \`\${COURSES_API}/\${course._id}\`,
    course,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "update-ui",
    title: "Updating the Cached Course",
    kind: "demo",
    code: `const updateCourse = useCoursesStore((state) => state.updateCourse);
...
const onUpdateCourse = async () => {
  const saved = await client.updateCourse(course);
  updateCourse(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "create-path",
    title: "POST /api/courses",
    kind: "demo",
    bullets: ["The store appends the course the server returned"],
    diagram: "courses-create",
  },
  {
    id: "create-intro",
    title: "createCourse assigns a uuid",
    kind: "demo",
    bullets: [
      "Spread, `_id: uuidv4()`, `model.create`",
      "Route still enrolls the current user — that write becomes Mongo later",
    ],
  },
  {
    id: "create",
    title: "createCourse assigns a uuid (code)",
    kind: "demo",
    code: `function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "create-route",
    title: "POST course route",
    kind: "demo",
    code: `const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  const currentUser = req.session["currentUser"];
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);
};
app.post("/api/courses", createCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "create-client",
    title: "Posting a Course from the Client",
    kind: "demo",
    code: `export const createCourse = async (course: unknown) => {
  const { data } = await axiosWithCredentials.post(COURSES_API, course);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "create-ui",
    title: "Adding the Server Course",
    kind: "demo",
    code: `const addCourse = useCoursesStore((state) => state.addCourse);
...
const onAddCourse = async () => {
  const newCourse = await client.createCourse(course);
  addCourse(newCourse);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [1, [3, 6]],
  },
  {
    id: "dashboard-live",
    title: "Dashboard Writes Documents",
    kind: "demo",
    bullets: [
      "Add, edit, and delete, then refresh Compass",
      "The list reloads from GET /api/courses",
    ],
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
    title: "Next: modules are 1:N",
    kind: "title",
    bullets: [
      "A course has many modules — foreign key, id array, or embed",
      "Keep a `modules` collection with `course`",
    ],
  },
];
