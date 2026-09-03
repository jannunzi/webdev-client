import mongoose from "mongoose";
import schema from "./schema.js";

const model =
  mongoose.models.EnrollmentModel ||
  mongoose.model("EnrollmentModel", schema);

export default model;
