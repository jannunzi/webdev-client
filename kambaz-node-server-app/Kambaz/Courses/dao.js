import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoEnabled } from "../Database/mongo.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    if (isMongoEnabled()) return model.find();
    return db.courses;
  }

  async function findCourseById(courseId) {
    if (isMongoEnabled()) return model.findById(courseId);
    return db.courses.find((course) => course._id === courseId);
  }

  async function findCoursesForEnrolledUser(userId) {
    const courses = isMongoEnabled() ? await model.find() : db.courses;
    return courses.filter((course) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: course?._id ?? uuidv4() };
    if (isMongoEnabled()) return model.create(newCourse);
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  async function updateCourse(courseId, courseUpdates) {
    if (isMongoEnabled()) {
      await model.updateOne({ _id: courseId }, { $set: courseUpdates });
      return model.findById(courseId);
    }
    db.courses = db.courses.map((c) =>
      c._id === courseId ? { ...c, ...courseUpdates } : c,
    );
    return db.courses.find((c) => c._id === courseId);
  }

  async function deleteCourse(courseId) {
    if (isMongoEnabled()) {
      return model.deleteOne({ _id: courseId });
    }
    db.courses = db.courses.filter((c) => c._id !== courseId);
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
    return { deletedCount: 1 };
  }

  return {
    findAllCourses,
    findCourseById,
    findCoursesForEnrolledUser,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
