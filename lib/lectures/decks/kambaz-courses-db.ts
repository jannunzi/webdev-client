import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
      icon: "database",
      headline: "Courses in Mongo",
    },
    bullets: [
      "Chapter 6 · Kambaz Courses DB",
      "CRUD courses in Mongo",
    ],
  },
  {
    id: "purpose",
    title: "Courses disappear on restart",
    kind: "content",
    bullets: [
      "Add a course on the Dashboard and it lives in a JSON array on the server",
      "Restart Node and that course is gone",
      "The same `/api/courses` routes should read and write MongoDB documents",
    ],
  },
  {
    id: "courses-picture",
    title: "Courses from the Dashboard to Mongo",
    kind: "demo",
    bullets: ["Page, client, routes, DAO, then the courses collection"],
    diagram: "courses-stack",
  },
  {
    id: "schema",
    title: "Course schema keeps string ids",
    kind: "demo",
    bullets: [
      "`_id` stays a string so an enrollment can store the course id",
      "`name`, `number`, and `description` are strings. `credits` is a number",
    ],
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
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("CourseModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/model.ts",
    codeHighlightLines: [3],
  },
  {
    id: "read-all-path",
    title: "GET /api/courses",
    kind: "demo",
    bullets: ["Dashboard calls fetchAllCourses, then setCourses"],
    diagram: "courses-read-all",
  },
  {
    id: "find",
    title: "findAllCourses in the DAO",
    kind: "demo",
    bullets: [
      "Comment out the array return so there is one source of truth",
      "`model.find()` with no filter returns every course document",
      "Export `findAllCourses` on the object the DAO returns",
    ],
    code: `import model from "./model";

function findAllCourses() {
  // return Database.courses;
  return model.find();
}
return { findAllCourses };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "routes-wire",
    title: "Routes call CoursesDao",
    kind: "demo",
    bullets: [
      "Drop the `db` argument. Mongo is the only source",
      "The handlers on the next slides use this `dao`",
    ],
    code: `import CoursesDao from "./dao";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "async-routes",
    title: "GET /api/courses awaits find",
    kind: "demo",
    bullets: [
      "`model.find()` is a promise, so the route is `async` and `await`s the DAO",
    ],
    code: `const findAllCourses = async (req, res) => {
  const courses = await dao.findAllCourses();
  res.send(courses);
};
app.get("/api/courses", findAllCourses);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeHighlightLines: [1, 2, 4],
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
    id: "dashboard-live",
    title: "Dashboard lists every course",
    kind: "demo",
    bullets: ["The cards are the documents `GET /api/courses` returned"],
    embed: "kambaz-styled-dashboard",
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
    title: "findCourseById in the DAO",
    kind: "demo",
    bullets: ["Export it next to `findAllCourses`"],
    code: `function findCourseById(courseId) {
  return model.findById(courseId);
}
return {
  findAllCourses, findCourseById,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 3], 6],
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
    id: "read-one-ui",
    title: "Layout loads that course",
    kind: "demo",
    code: `useEffect(() => {
  if (!courseId) return;
  client
    .findCourseById(courseId)
    .then(setCourse)
    .catch(() => setCourse(undefined));
}, [courseId]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "read-one-result",
    title: "One course fills the header",
    kind: "demo",
    bullets: ["Point at the name. It is the document for that id"],
    diagram: "courses-one-result",
  },
  {
    id: "create-path",
    title: "POST /api/courses",
    kind: "demo",
    bullets: ["The store appends the course `POST /api/courses` returned"],
    diagram: "courses-create",
  },
  {
    id: "create",
    title: "createCourse assigns a uuid",
    kind: "demo",
    bullets: [
      "Spread the course, set `_id: uuidv4()`, then `model.create`",
      "Export `createCourse` on the DAO",
    ],
    code: `import { v4 as uuidv4 } from "uuid";

function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}
return {
  findAllCourses, findCourseById, createCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 6], 8],
  },
  {
    id: "create-route",
    title: "POST course route",
    kind: "demo",
    code: `const createCourse = async (req, res) => {
  const newCourse = await dao.createCourse(req.body);
  res.json(newCourse);
};
app.post("/api/courses", createCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "create-client",
    title: "Posting a Course from the Client",
    kind: "demo",
    code: `export const createCourse = async (course: unknown) => {
  const { data } = await axiosWithCredentials.post(
    COURSES_API,
    course,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 7]],
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
    id: "create-result",
    title: "New course appears on the list",
    kind: "demo",
    bullets: ["Point at the new card. That name is the inserted document"],
    diagram: "courses-create-result",
  },
  {
    id: "delete-path",
    title: "DELETE /api/courses/:courseId",
    kind: "demo",
    bullets: ["Delete the document, then drop that course from the cache"],
    diagram: "courses-delete",
  },
  {
    id: "delete-server",
    title: "deleteOne by course id",
    kind: "demo",
    bullets: ["Export `deleteCourse` on the DAO"],
    code: `function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}
return {
  findAllCourses, findCourseById,
  createCourse, deleteCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 3], 6],
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
    id: "delete-result",
    title: "Deleted course leaves the list",
    kind: "demo",
    bullets: ["Point at the gap. That document is no longer in the collection"],
    diagram: "courses-delete-result",
  },
  {
    id: "update-path",
    title: "PUT /api/courses/:courseId",
    kind: "demo",
    bullets: ["`$set` the fields the editor sent, then cache the result"],
    diagram: "courses-update",
  },
  {
    id: "update-server",
    title: "updateOne with $set",
    kind: "demo",
    bullets: ["Fields you omit stay as they were. Export `updateCourse`"],
    code: `function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
return {
  findAllCourses, findCourseById,
  createCourse, deleteCourse, updateCourse,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Courses/dao.ts",
    codeAddedLines: [[1, 3], 6],
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
    id: "update-result",
    title: "Saved name is on the card",
    kind: "demo",
    bullets: ["Point at the new name. `$set` wrote it before the next refresh"],
    diagram: "courses-update-result",
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
    title: "Next: Modules 1:N",
    kind: "title",
    bullets: [
      "A course has many modules — foreign key, id array, or embed",
      "Keep a `modules` collection with `course`",
    ],
  },
];
