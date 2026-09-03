import ModulesDao from "./dao.js";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    res.json(await dao.findModulesForCourse(req.params.courseId));
  };
  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const newModule = await dao.createModule({
      ...req.body,
      course: courseId,
    });
    res.json(newModule);
  };
  const deleteModule = async (req, res) => {
    await dao.deleteModule(req.params.moduleId);
    res.sendStatus(200);
  };
  const updateModule = async (req, res) => {
    const status = await dao.updateModule(req.params.moduleId, req.body);
    res.json(status);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}
