import mongoose from "mongoose";
import schema from "./schema";

const model = (mongoose.models.UserModel ||
  mongoose.model("UserModel", schema)) as mongoose.Model<any>;

export default model;
