import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.ModuleModel ||
  mongoose.model("ModuleModel", schema)) as mongoose.Model<any>;

export default model;
