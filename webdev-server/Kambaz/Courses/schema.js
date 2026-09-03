import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    startDate: Date,
    endDate: Date,
    department: String,
    image: String,
    // PDF 6.4.2.1 — embed modules on the course (one-to-many alternative)
    modules: [moduleSchema],
  },
  { collection: "courses" },
);

export default courseSchema;
