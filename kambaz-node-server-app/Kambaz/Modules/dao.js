import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { isMongoEnabled } from "../Database/mongo.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    if (isMongoEnabled()) return model.find({ course: courseId });
    return db.modules.filter((module) => module.course === courseId);
  }

  async function createModule(module) {
    const newModule = { ...module, _id: module?._id ?? uuidv4() };
    if (isMongoEnabled()) return model.create(newModule);
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  async function deleteModule(moduleId) {
    if (isMongoEnabled()) return model.deleteOne({ _id: moduleId });
    db.modules = db.modules.filter((module) => module._id !== moduleId);
    return { deletedCount: 1 };
  }

  async function updateModule(moduleId, moduleUpdates) {
    if (isMongoEnabled()) {
      await model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
      return model.findById(moduleId);
    }
    const module = db.modules.find((m) => m._id === moduleId);
    if (!module) return undefined;
    Object.assign(module, moduleUpdates);
    return module;
  }

  return { findModulesForCourse, createModule, deleteModule, updateModule };
}
