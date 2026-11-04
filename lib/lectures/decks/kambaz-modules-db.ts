import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_DB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "database",
      headline: "Kambaz Modules: One-to-Many",
    },
    bullets: [
      "Chapter 6 · Modules One-to-Many",
      "One course, many modules",
    ],
  },
  {
    id: "purpose",
    title: "Linking Many Modules to One Course",
    kind: "content",
    bullets: [
      "One course has many modules — a **one-to-many** relationship",
      "Course `RS101` might own Week 1, Week 2, and Week 3",
      "Chapter 5 already stored `course` on each module JSON object",
      "This deck moves modules into their own MongoDB collection",
    ],
  },
  {
    id: "shapes",
    title: "Three Ways to Store One-to-Many",
    kind: "content",
    bullets: [
      "Parent id on each child, a foreign key: `{ name: \"Week 1\", course: \"RS101\" }`",
      "Child ids on the parent: `{ _id: \"RS101\", moduleIds: [\"M101\", \"M102\"] }`",
      "Children inside the parent: a `modules` array, no second collection",
      "Pick one per project. Do not insert the same module in two places",
    ],
  },
  {
    id: "schema",
    title: "Creating the Module Schema",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Modules/schema.ts` file, create the schema as shown below",
      "`course` holds the parent course id — the foreign key",
      "Add `Kambaz/Modules/model.ts` the same way as the course model",
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
    id: "find-intro",
    title: "Finding Modules for a Course",
    kind: "demo",
    bullets: [
      "In `Kambaz/Modules/dao.ts`, add the finder and its route as shown below",
      "`model.find({ course: courseId })` matches each module's `course` field",
      "Same nested URL Chapter 5 already used",
    ],
  },
  {
    id: "find",
    links: ["http://localhost:4000/api/courses/RS101/modules"],
    title: "Serving a Course's Modules",
    kind: "demo",
    code: `function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

const findModulesForCourse = async (req, res) => {
  const { courseId } = req.params;
  const modules = await dao.findModulesForCourse(courseId);
  res.json(modules);
};
app.get("/api/courses/:courseId/modules", findModulesForCourse);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[5, 10]],
  },
  {
    id: "create",
    title: "Creating a Module for a Course",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add `createModule` as shown below",
      "Collection: uuid + `model.create`, including `course`",
      "Embed: `$push: { modules: newModule }` on the parent course",
    ],
    code: `function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete-update",
    title: "Deleting and Updating Modules",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add delete and update as shown below",
      "Client keeps `DELETE /api/modules/:moduleId` — the course id is on the document",
      "Embed would `$pull` / `course.modules.id(moduleId)` and `save()` the parent",
    ],
    code: `function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}
function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Modules/dao.ts",
    codeAddedLines: [[1, 6]],
    embed: "kambaz-styled-modules",
  },
  {
    id: "recap",
    title: "Modules recap",
    kind: "content",
    bullets: [
      "`modules` collection + `course` foreign key",
      "`find({ course })`, create with uuid, `deleteOne`, `$set`",
      "Create and rename a module, then confirm Compass updates",
    ],
  },
  {
    id: "next-up",
    title: "Next: Kambaz Enrollments: Many-to-Many",
    kind: "title",
    bullets: [
      "A mapping collection turns many-to-many into two one-to-many links",
      "`ref`, `populate(\"course\")`, then enroll / unenroll",
    ],
  },
];
