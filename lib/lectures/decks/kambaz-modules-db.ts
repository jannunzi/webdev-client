import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
      icon: "database",
      headline: "Modules 1:N",
    },
    bullets: [
      "Chapter 6 · Modules 1:N",
      "One course, many modules",
    ],
  },
  {
    id: "purpose",
    title: "One course, many modules",
    kind: "content",
    bullets: [
      "A course has many modules, and each module belongs to one course",
      "The link is already a course id on each module in the JSON file",
      "That id has to live on a document, or the Modules page cannot find them",
    ],
  },
  {
    id: "shapes",
    title: "Three ways to model 1:N",
    kind: "content",
    bullets: [
      "Foreign key on the child — `module.course` equals `course._id`",
      "Array of child ids on the parent — `course.moduleIds`",
      "Embed the children in the parent — a `modules` array, no second collection",
      "Pick one per project. Do not insert the same module in two places",
    ],
  },
  {
    id: "modules-picture",
    title: "Modules from the Page to Mongo",
    kind: "demo",
    bullets: [
      "The Modules page asks the courses client, and the client calls the nested course routes.",
      "Each route calls the Modules DAO, which reads and writes the modules collection.",
    ],
    diagram: "modules-stack",
  },
  {
    id: "schema",
    title: "Collection plus a course field",
    kind: "demo",
    bullets: [
      "Keep modules in their own collection",
      "`course` is the id of the parent course",
      "`CourseModel` is still what enrollments `ref`",
    ],
    code: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
});
export default schema;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/schema.ts",
    codeHighlightLines: [6],
  },
  {
    id: "read-path",
    title: "`GET` a course's modules",
    kind: "demo",
    bullets: [
      "The page calls `findModulesForCourse` with the course id from the URL.",
      "The route finds documents whose course field is that id, and `setModules` shows them.",
    ],
    diagram: "modules-read",
  },
  {
    id: "find",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "Find modules by course id",
    kind: "demo",
    bullets: [
      "`find({ course: courseId })` returns that course's modules",
      "Export `findModulesForCourse` on the DAO",
    ],
    code: `function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}
return { findModulesForCourse };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "find-route",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "`GET` modules route",
    kind: "demo",
    code: `const findModulesForCourse = async (req, res) => {
  const { courseId } = req.params;
  const modules = await dao.findModulesForCourse(courseId);
  res.json(modules);
};
app.get("/api/courses/:courseId/modules", findModulesForCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "find-client",
    title: "Fetching Modules for a Course",
    kind: "demo",
    code: `export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(\`\${COURSES_API}/\${courseId}/modules\`);
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "find-ui",
    title: "Modules Page Loads the Course",
    kind: "demo",
    code: `const setModules = useModulesStore((state) => state.setModules);
...
useEffect(() => {
  const load = async () => {
    setModules(await client.findModulesForCourse(courseId));
  };
  load();
}, [courseId]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[1, 8]],
  },
  {
    id: "modules-live",
    title: "Modules list the course",
    kind: "demo",
    bullets: ["These rows are the documents whose `course` is this course id"],
    embed: "kambaz-styled-modules",
  },
  {
    id: "create-path",
    title: "`POST` a module under the course",
    kind: "demo",
    bullets: [
      "Add sends `POST /api/courses/:courseId/modules` with the new module.",
      "The store appends the document the route returns, so the new row appears.",
    ],
    diagram: "modules-create",
  },
  {
    id: "create",
    title: "Create includes the course id",
    kind: "demo",
    bullets: [
      "The route puts `course` on the body before `model.create`",
      "Export `createModule` next to the finder",
    ],
    code: `function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}
return { findModulesForCourse, createModule };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 4], 5],
  },
  {
    id: "create-route",
    title: "`POST` module route",
    kind: "demo",
    code: `const createModuleForCourse = async (req, res) => {
  const { courseId } = req.params;
  const created = await dao.createModule({
    ...req.body,
    course: courseId,
  });
  res.json(created);
};
app.post("/api/courses/:courseId/modules", createModuleForCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 9]],
  },
  {
    id: "create-client",
    title: "Creating a Module from the Client",
    kind: "demo",
    code: `export const createModuleForCourse = async (
  courseId: string,
  module: unknown,
) => {
  const response = await axios.post(
    \`\${COURSES_API}/\${courseId}/modules\`,
    module,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 10]],
  },
  {
    id: "create-ui",
    title: "Add Appends the New Module",
    kind: "demo",
    code: `const addModule = useModulesStore((state) => state.addModule);
...
const onAddModule = async () => {
  const created = await client.createModuleForCourse(courseId, {
    name: moduleName,
  });
  addModule(created);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[3, 8]],
  },
  {
    id: "create-result",
    title: "New module is on the list",
    kind: "demo",
    bullets: [
      "The new row is the module document that was inserted, and its course field is this course's id.",
    ],
    diagram: "modules-create-result",
  },
  {
    id: "delete-path",
    title: "`DELETE /api/modules/:moduleId`",
    kind: "demo",
    bullets: [
      "Delete sends `DELETE /api/modules/:moduleId`, and the DAO removes that document.",
      "The store then drops the same module from the cached list.",
    ],
    diagram: "modules-delete",
  },
  {
    id: "delete",
    title: "`deleteOne` by module id",
    kind: "demo",
    bullets: ["Export `deleteModule` on the DAO"],
    code: `function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}
return { findModulesForCourse, createModule, deleteModule };`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 3], 4],
  },
  {
    id: "delete-route",
    title: "`DELETE` module route",
    kind: "demo",
    code: `const deleteModule = async (req, res) => {
  const status = await dao.deleteModule(req.params.moduleId);
  res.send(status);
};
app.delete("/api/modules/:moduleId", deleteModule);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "delete-client",
    title: "Deleting a Module from the Client",
    kind: "demo",
    code: `export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(
    \`\${MODULES_API}/\${moduleId}\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "delete-ui",
    title: "Remove Drops the Module",
    kind: "demo",
    code: `const deleteModule = useModulesStore((state) => state.deleteModule);
...
const onRemoveModule = async (moduleId: string) => {
  await client.deleteModule(moduleId);
  deleteModule(moduleId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "delete-result",
    title: "Deleted module leaves the list",
    kind: "demo",
    bullets: [
      "The shorter list is what remains after that module document was removed.",
    ],
    diagram: "modules-delete-result",
  },
  {
    id: "update-path",
    title: "`PUT /api/modules/:moduleId`",
    kind: "demo",
    bullets: [
      "Save sends `PUT /api/modules/:moduleId` with the fields the editor changed.",
      "`$set` writes those fields and leaves every field that was not sent as it was.",
    ],
    diagram: "modules-update",
  },
  {
    id: "update",
    title: "`updateOne` with `$set`",
    kind: "demo",
    bullets: ["Export `updateModule` on the DAO"],
    code: `function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}
return {
  findModulesForCourse, createModule,
  deleteModule, updateModule,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 3], 6],
  },
  {
    id: "update-route",
    title: "`PUT` module route",
    kind: "demo",
    code: `const updateModule = async (req, res) => {
  const status = await dao.updateModule(
    req.params.moduleId,
    req.body,
  );
  res.send(status);
};
app.put("/api/modules/:moduleId", updateModule);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 8]],
  },
  {
    id: "update-client",
    title: "Updating a Module from the Client",
    kind: "demo",
    code: `export const updateModule = async (
  module: { _id: string },
) => {
  const { data } = await axios.put(
    \`\${MODULES_API}/\${module._id}\`,
    module,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 9]],
  },
  {
    id: "update-ui",
    title: "Save Writes the Module",
    kind: "demo",
    code: `const updateModule = useModulesStore((state) => state.updateModule);
...
const onUpdateModule = async (module) => {
  const saved = await client.updateModule(module);
  updateModule(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "update-result",
    title: "Saved name is on the row",
    kind: "demo",
    bullets: [
      "The row shows the saved name because `$set` wrote it on that module document.",
    ],
    diagram: "modules-update-result",
  },
  {
    id: "recap",
    title: "Modules 1:N recap",
    kind: "content",
    bullets: [
      "`modules` collection + `course` foreign key",
      "`find({ course })`, create with uuid, `deleteOne`, `$set`",
      "Add, rename, and delete. The row shows the saved name",
    ],
  },
  {
    id: "next-up",
    title: "Next: Enrollments",
    kind: "title",
    bullets: [
      "A mapping collection turns many-to-many into two 1:N links",
      "`ref`, `populate(\"course\")`, then enroll / unenroll",
    ],
  },
];
