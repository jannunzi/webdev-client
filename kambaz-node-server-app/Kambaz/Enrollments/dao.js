import model from "./model.js";
import { isMongoEnabled } from "../Database/mongo.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    if (isMongoEnabled()) {
      const enrollments = await model.find({ user: userId }).populate("course");
      return enrollments.map((enrollment) => enrollment.course);
    }
    return db.courses.filter((course) =>
      db.enrollments.some(
        (e) => e.user === userId && e.course === course._id,
      ),
    );
  }

  async function findUsersForCourse(courseId) {
    if (isMongoEnabled()) {
      const enrollments = await model
        .find({ course: courseId })
        .populate("user");
      return enrollments.map((enrollment) => enrollment.user);
    }
    return db.users.filter((user) =>
      db.enrollments.some(
        (e) => e.course === courseId && e.user === user._id,
      ),
    );
  }

  async function enrollUserInCourse(userId, courseId) {
    const enrollment = {
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    };
    if (isMongoEnabled()) {
      return model.create(enrollment);
    }
    db.enrollments.push(enrollment);
    return enrollment;
  }

  async function unenrollUserFromCourse(user, course) {
    if (isMongoEnabled()) return model.deleteOne({ user, course });
    const before = db.enrollments.length;
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === user && e.course === course),
    );
    return { deletedCount: before - db.enrollments.length };
  }

  async function unenrollAllUsersFromCourse(courseId) {
    if (isMongoEnabled()) return model.deleteMany({ course: courseId });
    const before = db.enrollments.length;
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
    return { deletedCount: before - db.enrollments.length };
  }

  function findEnrollmentsForUser(userId) {
    if (isMongoEnabled()) return model.find({ user: userId });
    return db.enrollments.filter((e) => e.user === userId);
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsForUser,
  };
}
