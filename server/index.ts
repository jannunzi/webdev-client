import cors from "cors";
import express from "express";
import {
  addCourse,
  addModule,
  deleteCourse,
  deleteModule,
  getCourse,
  getCourses,
  getModule,
  getModules,
  updateCourse,
  updateModule,
  type Course,
  type CourseModule,
} from "./kambazStore.ts";
import {
  addTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "./todosStore.ts";

const app = express();
const port = Number(process.env.PORT) || 4000;

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    service: "kambaz-node-server",
    message: "Separate HTTP API — not Next.js Route Handlers",
  });
});

app.get("/api/lab5/hello", (_req, res) => {
  res.json({ message: "Hello World from the Express server" });
});

app.get("/api/lab5/welcome", (req, res) => {
  const name = String(req.query.name ?? "World");
  res.json({ message: `Welcome, ${name}` });
});

app.get("/api/lab5/add/:a/:b", (req, res) => {
  const left = Number(req.params.a);
  const right = Number(req.params.b);
  res.json({ a: left, b: right, sum: left + right });
});

app.get("/api/lab5/todos", (_req, res) => {
  res.json(getTodos());
});

app.post("/api/lab5/todos", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  res.status(201).json(addTodo(title));
});

app.get("/api/lab5/todos/:id", (req, res) => {
  const todo = getTodo(req.params.id);
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(todo);
});

app.put("/api/lab5/todos/:id", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const updated = updateTodo(req.params.id, title);
  if (!updated) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/lab5/todos/:id", (req, res) => {
  const deleted = deleteTodo(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(deleted);
});

app.get("/api/courses", (_req, res) => {
  res.json(getCourses());
});

app.post("/api/courses", (req, res) => {
  res.status(201).json(addCourse(req.body ?? {}));
});

app.get("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

app.put("/api/courses/:id", (req, res) => {
  const updated = updateCourse({ ...(req.body as Course), _id: req.params.id });
  if (!updated) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/courses/:id", (req, res) => {
  const deleted = deleteCourse(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(deleted);
});

app.get("/api/modules", (req, res) => {
  const course = req.query.course ? String(req.query.course) : undefined;
  res.json(getModules(course));
});

app.post("/api/modules", (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const course = String(req.body?.course ?? "");
  if (!name || !course) {
    res.status(400).json({ error: "name and course are required" });
    return;
  }
  res.status(201).json(addModule({ name, course }));
});

app.get("/api/modules/:id", (req, res) => {
  const module = getModule(req.params.id);
  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(module);
});

app.put("/api/modules/:id", (req, res) => {
  const updated = updateModule({
    ...(req.body as CourseModule),
    _id: req.params.id,
  });
  if (!updated) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/modules/:id", (req, res) => {
  const deleted = deleteModule(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(deleted);
});

app.listen(port, () => {
  console.log(`kambaz-node-server listening on http://localhost:${port}`);
});
