import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (req, res) => {
    res.json(dao.findAllCourses());
  };
  const findCourseById = (req, res) => {
    const course = dao.findCourseById(req.params.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  };
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const updateCourse = (req, res) => {
    const updated = dao.updateCourse(req.params.courseId, req.body);
    if (!updated) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(updated);
  };
  const deleteCourse = (req, res) => {
    dao.deleteCourse(req.params.courseId);
    res.sendStatus(200);
  };

  const createCoursePublic = (req, res) => {
    res.status(201).json(dao.createCourse(req.body ?? {}));
  };

  app.get("/api/courses", findAllCourses);
  app.post("/api/courses", createCoursePublic);
  app.get("/api/courses/:courseId", findCourseById);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
}
