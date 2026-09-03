import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    res.json(await dao.findAssignmentsForCourse(req.params.courseId));
  });
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const assignment = await dao.findAssignmentById(req.params.assignmentId);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    res.json(assignment);
  });
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    res.status(201).json(
      await dao.createAssignment({
        ...req.body,
        course: req.params.courseId,
      }),
    );
  });
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const updated = await dao.updateAssignment(
      req.params.assignmentId,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    res.json(updated);
  });
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    await dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(200);
  });
}
