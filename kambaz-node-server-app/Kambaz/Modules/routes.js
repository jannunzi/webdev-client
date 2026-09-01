import ModulesDao from "./dao.js";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req, res) => {
    res.json(dao.findModulesForCourse(req.params.courseId));
  };
  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const newModule = dao.createModule({ ...req.body, course: courseId });
    res.json(newModule);
  };
  const deleteModule = (req, res) => {
    dao.deleteModule(req.params.moduleId);
    res.sendStatus(200);
  };
  const updateModule = (req, res) => {
    const status = dao.updateModule(req.params.moduleId, req.body);
    res.json(status);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}
