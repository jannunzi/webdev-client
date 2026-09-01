import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((a) => a.course === courseId);
  }
  function findAssignmentById(assignmentId) {
    return db.assignments.find((a) => a._id === assignmentId);
  }
  function createAssignment(assignment) {
    const created = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, created];
    return created;
  }
  function updateAssignment(assignmentId, updates) {
    db.assignments = db.assignments.map((a) =>
      a._id === assignmentId ? { ...a, ...updates } : a,
    );
    return db.assignments.find((a) => a._id === assignmentId);
  }
  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
  }
  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
