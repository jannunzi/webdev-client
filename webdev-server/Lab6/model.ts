import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.Lab6TodoModel ||
  mongoose.model("Lab6TodoModel", schema)) as mongoose.Model<any>;

export default model;
