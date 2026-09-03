import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    description: String,
  },
  { collection: "lab6_todos" },
);

export default todoSchema;
