import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./WorkingWithObjects";
import WorkingWithArrays from "./WorkingWithArrays";

export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
  WorkingWithArrays(app);
}
