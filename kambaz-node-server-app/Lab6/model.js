import mongoose from "mongoose";
import schema from "./schema.js";

const model =
  mongoose.models.Lab6TodoModel || mongoose.model("Lab6TodoModel", schema);

export default model;
