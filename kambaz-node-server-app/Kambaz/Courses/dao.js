import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }
  function findCourseById(courseId) {
    return db.courses.find((course) => course._id === courseId);
  }
  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
  }
  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }
  function updateCourse(courseId, updates) {
    db.courses = db.courses.map((c) =>
      c._id === courseId ? { ...c, ...updates } : c,
    );
    return db.courses.find((c) => c._id === courseId);
  }
  function deleteCourse(courseId) {
    db.courses = db.courses.filter((c) => c._id !== courseId);
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
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
