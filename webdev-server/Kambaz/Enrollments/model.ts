import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.EnrollmentModel ||
  mongoose.model("EnrollmentModel", schema)) as mongoose.Model<any>;

export default model;
