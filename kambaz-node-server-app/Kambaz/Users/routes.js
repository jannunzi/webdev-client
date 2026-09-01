import UsersDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const coursesDao = CoursesDao(db);

  const signup = (req, res) => {
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const update = (req, res) => {
    const { userId } = req.params;
    const currentUser = dao.updateUser(userId, req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    res.json(coursesDao.findCoursesForEnrolledUser(userId));
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/profile", profile);
  app.post("/api/users/signout", signout);
  app.put("/api/users/:userId", update);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}
