import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: String,
    description: String,
    points: Number,
    due: String,
    available: String,
  },
  { collection: "assignments" },
);

export default assignmentSchema;
