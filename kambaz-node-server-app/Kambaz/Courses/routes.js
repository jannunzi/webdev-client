import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = async (req, res) => {
    res.json(await dao.findAllCourses());
  };

  const findCourseById = async (req, res) => {
    const course = await dao.findCourseById(req.params.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const createCoursePublic = async (req, res) => {
    res.status(201).json(await dao.createCourse(req.body ?? {}));
  };

  const updateCourse = async (req, res) => {
    const status = await dao.updateCourse(req.params.courseId, req.body);
    if (!status) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(status);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    res.json(await enrollmentsDao.findUsersForCourse(cid));
  };

  app.get("/api/courses", findAllCourses);
  app.post("/api/courses", createCoursePublic);
  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.get("/api/courses/:courseId", findCourseById);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
}
