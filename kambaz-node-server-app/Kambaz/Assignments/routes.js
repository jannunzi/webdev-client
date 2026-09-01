import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.get("/api/courses/:courseId/assignments", (req, res) => {
    res.json(dao.findAssignmentsForCourse(req.params.courseId));
  });
  app.get("/api/assignments/:assignmentId", (req, res) => {
    const assignment = dao.findAssignmentById(req.params.assignmentId);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    res.json(assignment);
  });
  app.post("/api/courses/:courseId/assignments", (req, res) => {
    res
      .status(201)
      .json(
        dao.createAssignment({ ...req.body, course: req.params.courseId }),
      );
  });
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const updated = dao.updateAssignment(req.params.assignmentId, req.body);
    if (!updated) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    res.json(updated);
  });
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(200);
  });
}
