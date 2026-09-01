export type Course = {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  image: string;
};

export type Lesson = {
  _id: string;
  name: string;
  description: string;
  module: string;
};

export type CourseModule = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
};

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  department: "D123",
  credits: 4,
  description: "New Description",
  image: "/images/reactjs.jpg",
};

let courses: Course[] = [
  {
    _id: "RS101",
    name: "Rocket Propulsion",
    number: "RS4550",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 4,
    description:
      "This course provides an in-depth study of the fundamentals of rocket propulsion, including thermodynamics of the combustion chamber and nozzle.",
    image: "/images/reactjs.jpg",
  },
  {
    _id: "RS102",
    name: "Aerodynamics",
    number: "RS4560",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 3,
    description:
      "This course explores the principles of aerodynamics and how airflow interacts with wings, airfoils, and other flying bodies.",
    image: "/images/nodejs.jpg",
  },
  {
    _id: "RS103",
    name: "Spacecraft Design",
    number: "RS4570",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 4,
    description:
      "This course covers the principles of spacecraft design, including structures, propulsion, thermal control, and power systems.",
    image: "/images/mongodb.jpg",
  },
];

let modules: CourseModule[] = [
  {
    _id: "M101",
    name: "Introduction to Rocket Propulsion",
    description: "Basic principles of rocket propulsion and rocket engines.",
    course: "RS101",
    lessons: [],
  },
  {
    _id: "M102",
    name: "Fuel and Combustion",
    description: "Understanding rocket fuel, combustion processes, and efficiency.",
    course: "RS101",
    lessons: [],
  },
];

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
  if (!getCourse(course._id)) return undefined;
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
  if (!getModule(module._id)) return undefined;
  const updated = { ...getModule(module._id), ...module };
  modules = modules.map((m) => (m._id === module._id ? updated : m));
  return updated;
}

export function deleteModule(id: string): CourseModule | undefined {
  const existing = getModule(id);
  if (!existing) return undefined;
  modules = modules.filter((module) => module._id !== id);
  return existing;
}
