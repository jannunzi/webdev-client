import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.CourseModel ||
  mongoose.model("CourseModel", schema)) as mongoose.Model<any>;

export default model;
