import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#C8102E",
      icon: "database",
      headline: "Modules 1:N",
    },
    bullets: [
      "Chapter 6 · Modules 1:N",
      "One course, many modules",
    ],
  },
  {
    id: "modules-picture",
    title: "Modules from the Page to Mongo",
    kind: "demo",
    bullets: ["Page, client, nested routes, DAO, then the modules collection"],
    diagram: "modules-stack",
  },
  {
    id: "purpose",
    title: "Implementing Modules in MongoDB",
    kind: "content",
    bullets: [
      "UML: `1` on the course end, `*` on the modules end",
      "Parent / child, or ownership — courses have many modules",
      "Chapter 5 already stored `course` on each module JSON object",
    ],
  },
  {
    id: "shapes",
    title: "Three ways to model 1:N",
    kind: "content",
    bullets: [
      "Foreign key on the child — `module.course === course._id`",
      "Array of child ids on the parent — `course.moduleIds`",
      "Embed children in the parent — a `modules` array, no second collection",
      "Pick one per project. Do not insert the same module in two places",
    ],
  },
  {
    id: "schema",
    title: "Collection plus a course field",
    kind: "demo",
    bullets: [
      "The running server keeps modules in their own collection",
      "You can also embed modules inside the course document",
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
    title: "GET a course's modules",
    kind: "demo",
    bullets: ["The page calls findModulesForCourse, then setModules"],
    diagram: "modules-read",
  },
  {
    id: "find-intro",
    title: "Find modules by course id",
    kind: "demo",
    bullets: [
      "Collection: `model.find({ course: courseId })`",
      "Embed would `findById` the course and return `course.modules`",
      "Same nested URL Chapter 5 already used",
    ],
  },
  {
    id: "find",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "Find modules by course id (code)",
    kind: "demo",
    code: `function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 3]],
  },
  {
    id: "find-route",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "GET modules route",
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
    code: `export const findModulesForCourse = async (
  courseId: string,
) => {
  const { data } = await axios.get(
    \`\${COURSES_API}/\${courseId}/modules\`,
  );
  return data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 8]],
  },
  {
    id: "find-ui",
    title: "Modules Page Loads the Course",
    kind: "demo",
    code: `const setModules = useModulesStore(
  (state) => state.setModules,
);
useEffect(() => {
  const load = async () => {
    setModules(
      await client.findModulesForCourse(courseId),
    );
  };
  load();
}, [courseId]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[1, 12]],
  },
  {
    id: "delete-path",
    title: "DELETE /api/modules/:moduleId",
    kind: "demo",
    bullets: ["deleteOne by module id, then drop it from the store"],
    diagram: "modules-delete",
  },
  {
    id: "delete",
    title: "deleteOne by module id",
    kind: "demo",
    code: `function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 3]],
  },
  {
    id: "delete-route",
    title: "DELETE module route",
    kind: "demo",
    code: `const deleteModule = async (req, res) => {
  const status = await dao.deleteModule(
    req.params.moduleId,
  );
  res.send(status);
};
app.delete("/api/modules/:moduleId", deleteModule);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "delete-client",
    title: "Deleting a Module from the Client",
    kind: "demo",
    code: `export const deleteModule = async (
  moduleId: string,
) => {
  const response = await axios.delete(
    \`\${MODULES_API}/\${moduleId}\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/courses/client.ts",
    codeAddedLines: [[1, 8]],
  },
  {
    id: "delete-ui",
    title: "Remove Drops the Module",
    kind: "demo",
    code: `const deleteModule = useModulesStore(
  (state) => state.deleteModule,
);
const onRemoveModule = async (moduleId: string) => {
  await client.deleteModule(moduleId);
  deleteModule(moduleId);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[4, 7]],
  },
  {
    id: "update-path",
    title: "PUT /api/modules/:moduleId",
    kind: "demo",
    bullets: ["$set the fields the editor sent"],
    diagram: "modules-update",
  },
  {
    id: "update",
    title: "updateOne with $set",
    kind: "demo",
    code: `function updateModule(moduleId, moduleUpdates) {
  return model.updateOne(
    { _id: moduleId },
    { $set: moduleUpdates },
  );
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "update-route",
    title: "PUT module route",
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
    code: `const updateModule = useModulesStore(
  (state) => state.updateModule,
);
const onUpdateModule = async (module) => {
  const saved = await client.updateModule(module);
  updateModule(saved);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[4, 7]],
  },
  {
    id: "create-path",
    title: "POST a module under the course",
    kind: "demo",
    bullets: ["The store appends the module the server returned"],
    diagram: "modules-create",
  },
  {
    id: "create",
    title: "Create includes the course id",
    kind: "demo",
    code: `function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "create-route",
    title: "POST module route",
    kind: "demo",
    code: `const createModuleForCourse = async (req, res) => {
  const { courseId } = req.params;
  const created = await dao.createModule({
    ...req.body,
    course: courseId,
  });
  res.json(created);
};
app.post(
  "/api/courses/:courseId/modules",
  createModuleForCourse,
);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/routes.ts",
    codeAddedLines: [[1, 12]],
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
    code: `const addModule = useModulesStore(
  (state) => state.addModule,
);
const onAddModule = async () => {
  const created = await client.createModuleForCourse(
    courseId,
    { name: moduleName },
  );
  addModule(created);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeHighlightLines: [[4, 10]],
  },
  {
    id: "modules-live",
    title: "Modules Writes Documents",
    kind: "demo",
    bullets: ["Add, rename, and delete a module, then confirm Compass"],
    embed: "kambaz-styled-modules",
  },
  {
    id: "recap",
    title: "Modules 1:N recap",
    kind: "content",
    bullets: [
      "`modules` collection + `course` foreign key",
      "`find({ course })`, create with uuid, `deleteOne`, `$set`",
      "Create and rename a module, then confirm Compass updates",
    ],
  },
  {
    id: "next-up",
    title: "Next: enrollments are M:N",
    kind: "title",
    bullets: [
      "A mapping collection turns many-to-many into two 1:N links",
      "`ref`, `populate(\"course\")`, then enroll / unenroll",
    ],
  },
];
