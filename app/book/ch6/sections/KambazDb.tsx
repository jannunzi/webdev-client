import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";

export default function KambazDb() {
  return (
    <Section
      id="sec-6-4"
      title="6.4 Integrating the Kambaz Web Application with a Database"
    >
      <p>
        Courses, modules, and assignments started as JSON in the React
        app, then as JS arrays on Express. They belong in MongoDB.
        Create schemas, models, and DAOs, then <code>async</code> /{" "}
        <code>await</code> the routes you already wrote in{" "}
        <ChapterLink to={5} />. The URLs stay the same; the source of
        the documents changes.
      </p>

      <Section
        level={3}
        id="sec-6-4-1"
        title="6.4.1 Storing Courses in a Database"
      >
        <p>
          CRUD on the <code>courses</code> collection replaces{" "}
          <code>Database.courses</code>.
        </p>

        <Section
          level={3}
          id="sec-6-4-1-1"
          title="6.4.1.1 Retrieving Courses from a Database"
        >
          <CodeBlock
            language="js"
            name="courseSchema"
            file="webdev-server/Kambaz/Courses/schema.js"
          >{`import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
  credits: Number,
  description: String,
},
{ collection: "courses" });
export default courseSchema;`}</CodeBlock>
          <CodeBlock
            language="js"
            name="CourseModel"
            file="webdev-server/Kambaz/Courses/model.js"
          >{`import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("CourseModel", schema);
export default model;`}</CodeBlock>
          <p>
            <code>findAllCourses</code> becomes{" "}
            <code>model.find()</code>. Routes that used to return{" "}
            <code>dao.findAllCourses()</code> synchronously now{" "}
            <code>await</code> it.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-2"
          title="6.4.1.2 Inserting Courses into a Database"
        >
          <CodeBlock
            language="js"
            name="createCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}`}</CodeBlock>
          <p>
            The create route still enrolls the current user after
            insert. Add a course from Dashboard and confirm the
            document in Compass.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-3"
          title="6.4.1.3 Deleting Courses from the Database"
        >
          <CodeBlock
            language="js"
            name="deleteCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}`}</CodeBlock>
          <p>
            Enrollments for that course are removed in{" "}
            <SectionLink to="6.4.3.3" />. Until then, filter them out
            of the in-memory copy if Mongo is off.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-1-4"
          title="6.4.1.4 Updating Courses in the Database"
        >
          <CodeBlock
            language="js"
            name="updateCourse"
            file="webdev-server/Kambaz/Courses/dao.js"
          >{`function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}`}</CodeBlock>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-2"
        title="6.4.2 Persisting Modules in a Database as One to Many Relations with Courses"
      >
        <p>
          Each course has many modules — a{" "}
          <strong>one-to-many</strong> relationship. The parent is the
          course; the children are modules. Three ways to store that
          in MongoDB:
        </p>
        <ul>
          <li>
            A foreign key on the child: each module has{" "}
            <code>course</code> equal to the course{" "}
            <code>_id</code> (what Chapter 5 already did in JSON).
          </li>
          <li>
            An array of child ids on the parent.
          </li>
          <li>
            Embed the child documents in the parent — a{" "}
            <code>modules</code> array on the course. No separate
            collection.
          </li>
        </ul>
        <p>
          Because modules are not fetched outside a course, the PDF
          embeds them on the course schema. This book also keeps a
          <code>modules</code> collection with a{" "}
          <code>course</code> field so the existing{" "}
          <code>/api/courses/:courseId/modules</code> routes stay
          stable. Both shapes are valid; pick one per project and
          stick to it.
        </p>

        <Section
          level={3}
          id="sec-6-4-2-1"
          title="6.4.2.1 Declaring One to Many Relationships"
        >
          <CodeBlock
            language="js"
            name="moduleSchema"
            file="webdev-server/Kambaz/Modules/schema.js"
          >{`import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
});
export default schema;`}</CodeBlock>
          <p>
            On the course schema, add{" "}
            <code>modules: [moduleSchema]</code> if you embed. The
            model name <code>CourseModel</code> is what enrollments
            will <code>ref</code>.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-2"
          title="6.4.2.2 Retrieving Modules for a Course"
        >
          <CodeBlock
            language="js"
            name="findModulesForCourse"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-3"
          title="6.4.2.3 Creating Modules for a Course"
        >
          <CodeBlock
            language="js"
            name="createModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-4"
          title="6.4.2.4 Deleting Modules"
        >
          <CodeBlock
            language="js"
            name="deleteModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-2-5"
          title="6.4.2.5 Updating Modules"
        >
          <CodeBlock
            language="js"
            name="updateModule"
            file="webdev-server/Kambaz/Modules/dao.js"
          >{`function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}`}</CodeBlock>
          <p>
            Dashboard still talks to the same client functions from{" "}
            <ChapterLink to={5} />. After the DAO swap, create and
            rename a module and confirm Compass updates.
          </p>
          <LiveDemo
            name="Dashboard"
            file="app/(kambaz)/dashboard/page.tsx"
            mode="styled"
          >
            <Dashboard />
          </LiveDemo>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-3"
        title="6.4.3 Persisting Enrollments in a Database as Many to Many Relations"
      >
        <p>
          A user enrolls in many courses; a course has many users. That
          is <strong>many-to-many</strong>. Putting arrays of course
          ids on every user (and user ids on every course) is awkward
          to keep in sync. The usual fix is a mapping collection:{" "}
          <code>enrollments</code> holds <code>user</code> and{" "}
          <code>course</code> — two one-to-many relationships instead
          of one many-to-many.
        </p>

        <Section
          level={3}
          id="sec-6-4-3-1"
          title="6.4.3.1 Declaring Enrollments as a Many to Many Relationship"
        >
          <CodeBlock
            language="js"
            name="enrollmentSchema"
            file="webdev-server/Kambaz/Enrollments/schema.js"
          >{`import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, ref: "CourseModel" },
  user: { type: String, ref: "UserModel" },
  grade: Number,
  letterGrade: String,
  enrollmentDate: Date,
  status: {
    type: String,
    enum: ["ENROLLED", "DROPPED", "COMPLETED"],
    default: "ENROLLED",
  },
},
{ collection: "enrollments" });
export default enrollmentSchema;`}</CodeBlock>
          <p>
            <code>ref</code> names the model Mongoose should load when
            you <code>populate</code>. The DAO creates enrollments with
            an <code>_id</code> of <code>userId-courseId</code> so the
            pair is unique.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-2"
          title="6.4.3.2 Retrieving Courses for Enrolled Users"
        >
          <p>
            <code>populate(&quot;course&quot;)</code> replaces the
            stored course id with the course document. Mapping the
            result unwraps the enrollment:
          </p>
          <CodeBlock
            language="js"
            name="findCoursesForUser"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-3"
          title="6.4.3.3 Deleting Courses"
        >
          <p>
            When a course goes away, delete its enrollments first:
          </p>
          <CodeBlock
            language="js"
            name="unenrollAllUsersFromCourse"
            file="webdev-server/Kambaz/Enrollments/dao.js"
          >{`function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-4"
          title="6.4.3.4 Enrolling / Unenrolling (On Your Own)"
        >
          <p>
            Wire Dashboard enroll / unenroll to{" "}
            <code>POST</code> and <code>DELETE</code>{" "}
            <code>/api/users/:uid/courses/:cid</code>. The client
            functions:
          </p>
          <CodeBlock
            language="ts"
            name="enroll"
            file="app/(kambaz)/courses/client.ts"
          >{`export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    \`\${USERS_API}/\${userId}/courses/\${courseId}\`,
  );
  return response.data;
};`}</CodeBlock>
          <OnYourOwn>
            Refactor the Chapter 4/5 enroll buttons so they call these
            two functions and then refetch the dashboard courses.
          </OnYourOwn>
          <WithAI
            prompt={`In the Kambaz dashboard enroll/unenroll handlers, call enrollIntoCourse and unenrollFromCourse from app/(kambaz)/courses/client.ts with the current user id and course id, then refetch courses. Keep any extra UI I added.`}
          >
            Ask the assistant to swap array edits for HTTP:
          </WithAI>
        </Section>

        <Section
          level={3}
          id="sec-6-4-3-5"
          title="6.4.3.5 Retrieving Students Enrolled in a Course (On Your Own)"
        >
          <p>
            Course People should list users enrolled in that course,
            not the whole <code>users</code> collection.{" "}
            <code>GET /api/courses/:cid/users</code> uses{" "}
            <code>findUsersForCourse</code> and{" "}
            <code>populate(&quot;user&quot;)</code>.
          </p>
          <CodeBlock
            language="ts"
            name="findUsersForCourse"
            file="app/(kambaz)/courses/client.ts"
          >{`export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(\`\${COURSES_API}/\${courseId}/users\`);
  return response.data;
};`}</CodeBlock>
          <OnYourOwn>
            Point the course People page at{" "}
            <code>findUsersForCourse(cid)</code> and confirm a student
            who is not enrolled does not appear.
          </OnYourOwn>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-4-4"
        title="6.4.4 Assignments (On Your Own)"
      >
        <p>
          Schema, model, DAO, routes, and client so Assignments and the
          Assignment Editor read and write the{" "}
          <code>assignments</code> collection. Users should list,
          create, update, and delete assignments for a course and see
          the change in Compass.
        </p>
        <OnYourOwn>
          Mirror the modules DAO:{" "}
          <code>findAssignmentsForCourse</code>,{" "}
          <code>createAssignment</code>,{" "}
          <code>updateAssignment</code>,{" "}
          <code>deleteAssignment</code>. The routes already exist from{" "}
          <ChapterLink to={5} /> — make them <code>await</code> the
          model.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
