import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.AssignmentModel ||
  mongoose.model("AssignmentModel", schema)) as mongoose.Model<any>;

export default model;
