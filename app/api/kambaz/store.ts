import coursesJson from "@/app/(kambaz)/database/courses.json";
import modulesJson from "@/app/(kambaz)/database/modules.json";
import {
  emptyCourse,
  type Course,
  type CourseModule,
} from "./types";

export type { Course, CourseModule, Lesson } from "./types";
export { emptyCourse } from "./types";

let courses: Course[] = structuredClone(coursesJson);
let modules: CourseModule[] = structuredClone(
  modulesJson as CourseModule[],
);

export function getCourses(): Course[] {
  return courses;
}

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course._id === id);
}

export function addCourse(course: Partial<Course>): Course {
  const created: Course = {
    ...emptyCourse,
    ...course,
    _id: crypto.randomUUID(),
  };
  courses = [...courses, created];
  return created;
}

export function updateCourse(course: Course): Course | undefined {
  const existing = getCourse(course._id);
  if (!existing) return undefined;
  courses = courses.map((c) => (c._id === course._id ? course : c));
  return course;
}

export function deleteCourse(id: string): Course | undefined {
  const existing = getCourse(id);
  if (!existing) return undefined;
  courses = courses.filter((course) => course._id !== id);
  return existing;
}

export function getModules(courseId?: string): CourseModule[] {
  if (!courseId) return modules;
  return modules.filter((module) => module.course === courseId);
}

export function getModule(id: string): CourseModule | undefined {
  return modules.find((module) => module._id === id);
}

export function addModule(module: {
  name: string;
  course: string;
}): CourseModule {
  const created: CourseModule = {
    _id: crypto.randomUUID(),
    name: module.name,
    description: "",
    course: module.course,
    lessons: [],
  };
  modules = [...modules, created];
  return created;
}

export function updateModule(
  module: CourseModule,
): CourseModule | undefined {
  const existing = getModule(module._id);
  if (!existing) return undefined;
  const updated = { ...existing, ...module };
  modules = modules.map((m) => (m._id === module._id ? updated : m));
  return updated;
}

export function deleteModule(id: string): CourseModule | undefined {
  const existing = getModule(id);
  if (!existing) return undefined;
  modules = modules.filter((module) => module._id !== id);
  return existing;
}
