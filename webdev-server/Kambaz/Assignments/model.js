import mongoose from "mongoose";
import schema from "./schema.js";

const model =
  mongoose.models.AssignmentModel ||
  mongoose.model("AssignmentModel", schema);

export default model;
