import mongoose from "mongoose";
import schema from "./schema.js";

const model =
  mongoose.models.CourseModel || mongoose.model("CourseModel", schema);

export default model;
